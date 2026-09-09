# MSDS — Million Somethings Design System

Tokens and primitives shared across personal projects.

- **Architecture and rules:** [`CLAUDE.md`](./CLAUDE.md)
- **Token reference:** [`docs/tokens.md`](./docs/tokens.md)
- **Adding MSDS to a project:** [`docs/consuming-project.md`](./docs/consuming-project.md)

## Status: scaffolded, values are placeholders

Every placeholder is marked `TODO`:

```bash
grep -rn "TODO" tokens/tokens.css
```

To finish setup:

1. Rename the 7 ramps in `tokens/tokens.css` to your real hue names, then
   find/replace those prefixes in the TIER 2 block.
2. Drop in your real hex values (100 = lightest → 900 = darkest).
3. Replace `--leading-*` with your decided base line spacing.
4. Confirm the status colors.
5. Propagate the new ramp names to the three places that list them:
   `tokens/tokens.js` (`ramps`), `tokens/tailwind.preset.js` (`colors`),
   and `preview.html` (`RAMPS`).
6. `git init && git add -A && git commit && git tag v0.1.0`

## Preview

```bash
open preview.html
```
