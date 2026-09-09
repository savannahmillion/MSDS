# Using MSDS in a project

## 1. Install

```bash
npm i "@msds/ui@github:savannahmillion/MSDS#v0.1.0"
```

Pin the tag. Bump deliberately: change the tag, `npm i` again.

**Vanilla / Drupal / anything without a bundler** — link the built file
instead, same versioning:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/savannahmillion/MSDS@v0.1.0/tokens/tokens.css">
```

## 2. Import once, at the app entry

```js
// main.jsx / main.ts
import "@msds/ui/styles";   // tokens + reset + base, correct order
```

## 3. Set the theme at boot

```html
<script>
  const t = localStorage.getItem("theme")
    ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = t;
</script>
```

## 4. Fonts

MSDS declares font *stacks*, not font *files*. Load Work Sans / Inter /
IBM Plex Mono in each project — one variable font file per family, not six
static weights.

## 5. Paste this into the project's CLAUDE.md

```md
## Design system — MSDS

Tokens: `node_modules/@msds/ui/tokens/tokens.css` (imported via `@msds/ui/styles`)
Token reference: `node_modules/@msds/ui/docs/tokens.md` — read this to pick names.

Rules:
- Never write a raw color (hex/rgb/hsl/named). Use `var(--color-*)`.
- Never write a raw px/rem for spacing, type, radius, or leading. Use the token.
- Use semantic tokens (`--color-text`), never primitives (`--neutral-900`).
- Dark mode is handled by `[data-theme="dark"]` in tokens.css. No per-component
  dark styles.
- Focus styles are global. Never `outline: none`.
- Breakpoints are not CSS vars — import from `@msds/ui/tokens`.
- If the token you need does not exist, say so instead of hardcoding a value.
```

Once this block is in three projects, turn it into a Claude Code skill so it
stops drifting between copies.
