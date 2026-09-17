#!/usr/bin/env node
/* icons-build
 * ---------------------------------------------------------------------
 * Validates and normalizes every SVG in icons/material and icons/custom,
 * then regenerates icons/index.js and icons/preview.html.
 *
 *   npm run icons
 *
 * The .svg files are the source of truth, same as tokens.css is for
 * tokens. Everything this script writes is derived and gets overwritten.
 *
 * Normalizing matters mostly for icons/custom — a Figma/Illustrator
 * export arrives with width/height, a hardcoded black, sometimes a
 * clip-path. This rewrites the file in place to one shape:
 *
 *   <svg xmlns="…" viewBox="0 0 24 24" fill="currentColor">…</svg>
 *
 * and refuses (rather than guesses) on anything it can't make
 * single-color and currentColor-driven. See icons/README.md.
 * --------------------------------------------------------------------- */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "icons");
const SETS = ["material", "custom"];
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FORBIDDEN = ["style", "script", "image", "text", "foreignObject",
  "linearGradient", "radialGradient", "pattern", "filter", "mask", "use"];

class IconError extends Error {}

function normalize(src) {
  let s = src
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  const root = s.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!root) throw new IconError("not a single <svg> root element");
  const [, rootAttrs, body] = root;

  const viewBox = rootAttrs.match(/viewBox="([^"]*)"/)?.[1].trim().split(/[\s,]+/).join(" ");
  if (viewBox !== "0 0 24 24") {
    throw new IconError(`viewBox is "${viewBox ?? "missing"}", must be "0 0 24 24" — draw on a 24×24 frame`);
  }

  let inner = body
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<desc>[\s\S]*?<\/desc>/g, "");

  for (const tag of FORBIDDEN) {
    if (new RegExp(`<${tag}\\b`).test(inner)) {
      throw new IconError(`contains <${tag}> — icons must be plain single-color shapes`);
    }
  }
  if (/\sstyle="/.test(inner)) {
    throw new IconError(`uses style="" attributes — re-export with presentation attributes (Figma does this by default)`);
  }

  // Figma clip-path wrapper: only safe to drop when it clips to the frame.
  const clips = [...inner.matchAll(/<clipPath\b[^>]*>([\s\S]*?)<\/clipPath>/g)];
  for (const [, clipBody] of clips) {
    const fullFrame = /^\s*<rect\b(?=[^>]*\bwidth="24")(?=[^>]*\bheight="24")(?![^>]*\btransform=)[^>]*\/?>(\s*<\/rect>)?\s*$/.test(clipBody);
    if (!fullFrame) throw new IconError(`has a non-trivial clip-path — flatten the shape in Figma instead`);
  }
  inner = inner
    .replace(/<clipPath\b[\s\S]*?<\/clipPath>/g, "")
    .replace(/<defs>\s*<\/defs>|<defs\s*\/>/g, "")
    .replace(/\sclip-path="[^"]*"/g, "")
    .replace(/<g>\s*([\s\S]*?)\s*<\/g>/g, "$1");

  // Figma frame background: a full-bleed rect with a fill.
  if (/<rect\b(?=[^>]*\bwidth="24")(?=[^>]*\bheight="24")(?![^>]*\bfill="none")[^>]*\/?>/.test(inner)) {
    throw new IconError(`has a 24×24 filled <rect> — that's the frame's background. Remove the frame fill in Figma and re-export`);
  }

  // Figma puts fill="none" on the root of a stroke-only drawing. Keep that
  // for the shapes, or every unfilled outline would render as a solid blob.
  if (/\sfill="none"/.test(rootAttrs)) inner = `<g fill="none">${inner}</g>`;

  // Collapse every paint to currentColor. Two distinct real colors means
  // the icon can't be recolored by CSS, so refuse rather than flatten it.
  const paints = new Set();
  inner = inner.replace(/\s(fill|stroke)="([^"]*)"/g, (m, attr, value) => {
    if (value === "none") return m;
    if (value !== "currentColor") paints.add(value.toLowerCase());
    return ` ${attr}="currentColor"`;
  });
  if (paints.size > 1) {
    throw new IconError(`uses ${paints.size} colors (${[...paints].join(", ")}) — icons are single-color so CSS can recolor them`);
  }
  if (/\sfill-opacity="|\sopacity="/.test(inner)) {
    throw new IconError(`uses opacity — icons are single-color and fully opaque`);
  }

  inner = inner.replace(/>\s+</g, "><").trim();
  if (!inner) throw new IconError("is empty");

  return inner;
}

function build() {
  const icons = new Map();
  const errors = [];

  for (const set of SETS) {
    const dir = join(ROOT, set);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".svg")).sort()) {
      const name = file.slice(0, -4);
      const where = `icons/${set}/${file}`;
      try {
        if (!NAME.test(name)) throw new IconError(`name must be kebab-case (e.g. "arrow-left.svg")`);
        if (icons.has(name)) {
          throw new IconError(`name collides with icons/${icons.get(name).set}/${file} — names are shared across material and custom`);
        }
        const path = join(dir, file);
        const inner = normalize(readFileSync(path, "utf8"));
        const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${inner}</svg>\n`;
        if (readFileSync(path, "utf8") !== out) {
          writeFileSync(path, out);
          console.log(`normalized ${where}`);
        }
        icons.set(name, { set, inner });
      } catch (e) {
        if (!(e instanceof IconError)) throw e;
        errors.push(`${where}: ${e.message}`);
      }
    }
  }

  if (errors.length) {
    console.error(errors.map((e) => `✗ ${e}`).join("\n"));
    process.exit(1);
  }

  const names = [...icons.keys()].sort();
  const entries = names.map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(icons.get(n).inner)},`);

  writeFileSync(join(ROOT, "index.js"), `/* GENERATED by scripts/icons-build.js — do not edit.
 * Source of truth is icons/material/*.svg and icons/custom/*.svg.
 * Run \`npm run icons\` after adding or changing one. */

/** Every icon is drawn on this grid. */
export const viewBox = "0 0 24 24";

/** Inner SVG markup for each icon, keyed by kebab-case name. */
export const icons = {
${entries.join("\n")}
};

export const iconNames = Object.keys(icons);

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => \`&#\${c.charCodeAt(0)};\`);

/**
 * Full <svg> markup for an icon, as a string — for plain HTML, Drupal
 * templates, or innerHTML. Decorative (aria-hidden) unless given a label.
 *
 *   iconSvg("search")                     // decorative, next to visible text
 *   iconSvg("search", { label: "Search" }) // icon-only, announced
 */
export function iconSvg(name, { label, className = "" } = {}) {
  const inner = icons[name];
  if (inner === undefined) throw new Error(\`MSDS: no icon named "\${name}"\`);
  const a11y = label ? \`role="img" aria-label="\${escape(label)}"\` : \`aria-hidden="true"\`;
  const cls = ["msds-icon", className].filter(Boolean).join(" ");
  return \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${viewBox}" fill="currentColor" class="\${escape(cls)}" \${a11y} focusable="false">\${inner}</svg>\`;
}
`);

  const tiles = names.map((n) => `  <figure class="tile">
    <svg viewBox="0 0 24 24" fill="currentColor" class="msds-icon" aria-hidden="true">${icons.get(n).inner}</svg>
    <figcaption><code>${n}</code><span>${icons.get(n).set}</span></figcaption>
  </figure>`);

  writeFileSync(join(ROOT, "preview.html"), `<!doctype html>
<!-- GENERATED by scripts/icons-build.js — do not edit. -->
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MSDS icons</title>
<link rel="stylesheet" href="../tokens/tokens.css">
<link rel="stylesheet" href="../styles/reset.css">
<link rel="stylesheet" href="../styles/base.css">
<link rel="stylesheet" href="./icons.css">
<style>
  body { padding: var(--space-8); max-width: 78rem; margin-inline: auto; }
  header { display: flex; align-items: baseline; gap: var(--space-4); margin-bottom: var(--space-8); }
  header p { color: var(--color-text-muted); }
  header button { margin-left: auto; font: inherit; cursor: pointer; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr)); gap: var(--space-3); }
  .tile { display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
          padding: var(--space-5) var(--space-3); border: 1px solid var(--color-border);
          border-radius: var(--radius-md); background: var(--color-surface-raised); }
  .tile .msds-icon { font-size: var(--font-size-2xl); }
  figcaption { display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
               font-size: var(--font-size-xs); }
  figcaption span { color: var(--color-text-muted); }
</style>
</head>
<body>
<header>
  <h1>Icons</h1>
  <p>${names.length} icons · 24×24 · <code>currentColor</code></p>
  <button type="button" onclick="const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'">Toggle theme</button>
</header>
<div class="grid">
${tiles.join("\n")}
</div>
</body>
</html>
`);

  console.log(`✓ ${names.length} icons → icons/index.js, icons/preview.html`);
}

build();
