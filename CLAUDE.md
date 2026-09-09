# MSDS — Million Somethings Design System

Shared tokens and primitives for personal projects (FinTrack, personal site,
Provendoire, Captain's Log, awayyy.club, SNAP screener).

## Source of truth

`tokens/tokens.css` is the single source of truth for every design value.
Code is truth; **Figma mirrors code**. If a value changes, it changes here
first, then gets re-keyed into Figma Variables. Never the reverse.

## The two tiers — this is the rule that matters

| Tier | Example | Who may use it |
|---|---|---|
| 1 · Primitive | `--brand-500`, `--neutral-200`, `--space-4` | tokens.css only |
| 2 · Semantic | `--color-action`, `--color-text-muted`, `--color-border` | everything else |

**Components reference tier 2 only.** A component that reaches for
`--neutral-900` instead of `--color-text` is a bug — it will not flip in dark
mode and it will break when a ramp is retuned.

Non-color tokens (`--space-*`, `--font-size-*`, `--radius-*`, `--leading-*`,
`--shadow-*`, `--duration-*`) are used directly. There is no semantic layer
for those and there does not need to be one.

## Hard rules when writing code in or against this system

1. Never write a raw color — no hex, `rgb()`, `hsl()`, or named color.
   Use `var(--color-*)`.
2. Never write a raw `px` / `rem` for spacing, type size, radius, or leading.
   Use the matching token.
3. Semantic tokens only in components. Primitives only inside `tokens.css`.
4. Dark mode is handled entirely by the `[data-theme="dark"]` block in
   `tokens.css`. Do not add per-component dark styles.
5. Focus styles come from the global `:focus-visible` rule in `base.css`.
   Do not set `outline: none` anywhere.
6. If a value you need does not exist as a token, **stop and say so** rather
   than hardcoding it. Adding a token is a deliberate decision.
7. Custom properties do not work inside `@media` queries. Breakpoints live in
   `tokens/tokens.js` and `tokens/tailwind.preset.js` only.

## Naming ↔ Figma

Figma Variable names map to CSS custom properties by replacing `/` with `-`:

```
color/text/muted   ->  --color-text-muted
space/4            ->  --space-4
brand/500          ->  --brand-500
```

Keep this exact. It means a Figma MCP response can be translated to correct
CSS by string transform, with no mapping table.

## Layout

```
tokens/
  tokens.css          tier 1 + tier 2. THE source of truth.
  tokens.js           token() reader for JS-land + breakpoints
  tailwind.preset.js  optional, for Tailwind projects
styles/
  reset.css           token-free reset
  base.css            element defaults from semantic tokens
  index.css           entry point: tokens + reset + base
components/           React primitives, copy-paste (shadcn pattern)
docs/
  tokens.md           flat token reference — read this to pick token names
  consuming-project.md  what to paste into a project that uses MSDS
```

## Components

Empty on purpose. **Do not create a component until two real projects need
the same one.** Extract from working code, never design in the abstract.
When one is added, it is copied into consuming projects, not imported — they
are expected to diverge.

## Versioning

Tag every change to `tokens.css`: `git tag v0.2.0 && git push --tags`.
Projects pin a tag. Untagged changes silently break projects you have not
opened in months.
