#!/usr/bin/env node
/* icons-add-material
 * ---------------------------------------------------------------------
 * Pulls one icon from Material Symbols into icons/material/, rescaled
 * onto the same 0 0 24 24 grid custom icons are drawn on, then rebuilds.
 *
 *   npm run icons:add -- <material_name> [msds-name] [--style rounded|sharp] [--fill]
 *   npm run icons:add -- arrow_back arrow-left
 *
 * Browse names at https://fonts.google.com/icons. Default style is
 * Outlined, weight 400, grade 0, unfilled — the Google Fonts default.
 *
 * Why rescale: Material Symbols ship with viewBox="0 -960 960 960", not
 * 24×24. Their *design* grid is 24dp (960 = 24 × 40), so dividing every
 * coordinate by 40 and shifting y up by 960 lands the path exactly on
 * the 24×24 grid with nothing lost. After that a Material icon and a
 * hand-drawn one are the same kind of file.
 *
 * Provenance goes in icons/material/sources.json so any icon can be
 * re-fetched or switched to another style later.
 * --------------------------------------------------------------------- */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, "..", "icons", "material");
const SOURCES = join(DIR, "sources.json");

const args = process.argv.slice(2);
const flag = (f) => { const i = args.indexOf(f); return i === -1 ? undefined : args.splice(i, f === "--fill" ? 1 : 2)[1] ?? true; };
const style = flag("--style") ?? "outlined";
const fill = flag("--fill") !== undefined;
const [material, msdsName = material?.replaceAll("_", "-")] = args;

if (!material || !["outlined", "rounded", "sharp"].includes(style)) {
  console.error("usage: npm run icons:add -- <material_name> [msds-name] [--style outlined|rounded|sharp] [--fill]");
  process.exit(1);
}

const url = `https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/${material}/materialsymbols${style}/${material}${fill ? "_fill1" : ""}_24px.svg`;
const res = await fetch(url);
if (!res.ok) {
  console.error(`✗ ${res.status} fetching "${material}" (${style}${fill ? ", filled" : ""}) — check the name at https://fonts.google.com/icons`);
  process.exit(1);
}
const svg = await res.text();

if (!/viewBox="0 -960 960 960"/.test(svg)) {
  console.error(`✗ unexpected viewBox in ${url} — Material may have changed format; not guessing.`);
  process.exit(1);
}

const paths = [...svg.matchAll(/<path\b[^>]*\bd="([^"]*)"[^>]*\/>/g)].map((m) => m[1]);
if (!paths.length || /<(?!\/?svg\b|path\b)[a-z]/i.test(svg)) {
  console.error(`✗ ${url} contains something other than <path> elements; not guessing.`);
  process.exit(1);
}

/* Rescale path data from the 960 grid to the 24 grid.
 * Absolute coordinates: x/40, (y+960)/40. Relative: /40. Arc radii /40,
 * arc rotation and flags untouched. The first moveto of a path is always
 * absolute, even when written lowercase. */
function rescale(d) {
  const out = [];
  let i = 0;
  const ws = () => { while (i < d.length && /[\s,]/.test(d[i])) i++; };
  const num = () => {
    ws();
    const m = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(d.slice(i));
    if (!m) return null;
    i += m[0].length;
    return Number(m[0]);
  };
  const arcFlag = () => { ws(); const c = d[i]; if (c !== "0" && c !== "1") throw new Error(`bad arc flag at ${i} in ${d}`); i++; return Number(c); };
  const fmt = (n) => String(Math.round(n * 1e4) / 1e4);
  const X = (v) => fmt(v / 40);
  const Y = (v, rel) => fmt(rel ? v / 40 : (v + 960) / 40);

  let first = true;
  ws();
  while (i < d.length) {
    const cmd = d[i++];
    if (!/[MmLlHhVvCcSsQqTtAaZz]/.test(cmd)) throw new Error(`unexpected "${cmd}" at ${i - 1} in ${d}`);
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === "Z") { out.push(cmd); ws(); continue; }

    const groups = [];
    for (;;) {
      ws();
      if (i >= d.length || /[A-Za-z]/.test(d[i])) break;
      const firstAbs = first && C === "M" && groups.length === 0;
      const r = rel && !firstAbs;
      switch (C) {
        case "H": groups.push([X(num())]); break;
        case "V": groups.push([Y(num(), r)]); break;
        case "M": case "L": case "T": groups.push([X(num()), Y(num(), r)]); break;
        case "S": case "Q": groups.push([X(num()), Y(num(), r), X(num()), Y(num(), r)]); break;
        case "C": groups.push([X(num()), Y(num(), r), X(num()), Y(num(), r), X(num()), Y(num(), r)]); break;
        case "A": groups.push([fmt(num() / 40), fmt(num() / 40), fmt(num()), arcFlag(), arcFlag(), X(num()), Y(num(), r)]); break;
      }
      if (groups.at(-1).some((v) => v === "NaN")) throw new Error(`could not parse numbers for ${cmd} in ${d}`);
    }
    first = false;
    out.push(cmd + groups.map((g) => g.join(" ")).join(" "));
  }
  return out.join("");
}

const inner = paths.map((d) => `<path d="${rescale(d)}"/>`).join("");
const file = join(DIR, `${msdsName}.svg`);
const existed = existsSync(file);
writeFileSync(file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${inner}</svg>\n`);

const sources = existsSync(SOURCES) ? JSON.parse(readFileSync(SOURCES, "utf8")) : {};
sources[msdsName] = { material, style, fill, weight: 400, grade: 0 };
const sorted = Object.fromEntries(Object.entries(sources).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(SOURCES, JSON.stringify(sorted, null, 2) + "\n");

console.log(`${existed ? "replaced" : "added"} icons/material/${msdsName}.svg ← ${material} (${style}${fill ? ", filled" : ""})`);
execFileSync(process.execPath, [join(HERE, "icons-build.js")], { stdio: "inherit" });
