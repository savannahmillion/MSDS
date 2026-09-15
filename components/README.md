# Components

Prop shape follows [Catalyst](https://catalyst.tailwindui.com/docs) loosely
— `forwardRef`, a small set of boolean/enum props (`color`, `outline`,
`plain`, `size`) instead of a style prop. The *implementation* does not:
these are plain CSS, not Tailwind utility classes, because MSDS is moving
personal projects off Tailwind over time. Catalyst itself is Tailwind
through and through — composing utility strings is the format — so only
its component API carries over here, not its styling mechanism.

Do not add a component until **two real projects need the same one**.
Extract it from working code; do not design it in the abstract — you will
guess the props wrong. Every component below was pulled from a real app's
actual markup, not invented ahead of need — Button, Checkbox and Select
from Provendoire and FinTrack, ThemeToggle from Seek (the only one of the
three that had wired up dark mode before the others adopted it too),
Segmented/Chip/Empty from whichever two of the three actually had a
matching real implementation (see the table — it's not always the same
two). Radio was skipped for that reason — no real project has one yet.
So was Card: FinTrack has a real one (title/action header over a bordered
surface, used everywhere), but Provendoire only has one-off `p-4 bg-canvas
rounded-xl border` divs, not the same reusable shape — one project, not
two. Revisit if Seek or Provendoire grow an equivalent.

- It may reference **tier 2 semantic tokens only** (see `../CLAUDE.md`),
  as CSS custom properties (`var(--color-action)`), never Tailwind classes.
- It is **copied** into consuming projects, not imported. Components
  diverge per project and that is fine; tokens are what must never diverge.
  Copy the `.jsx` and its matching `.css` together.
- Each component's CSS is a same-name `.css` file imported at the top of
  the `.jsx` (`import "./Button.css"`) — works with any bundler (Vite,
  webpack, Astro); for a bundler-free/plain-HTML page, link the `.css`
  file manually alongside `tokens.css`.
- Classes are namespaced `msds-<component>`, with `__element` /
  `--modifier` suffixes (loose BEM) so copying one into a project's own
  stylesheet doesn't collide with existing class names.
- Dependency-free: no Tailwind, no Headless UI, no runtime beyond React.

## What's here

| Component | Extracted from | Notes |
|---|---|---|
| `Button.jsx` / `.css` | Provendoire `RecipeEdit`/`RecipeMetaPanel`, FinTrack save/cancel/ghost buttons everywhere | `solid` (default) / `outline` / `plain`, `color="action"` \| `"secondary"` \| `"danger"`. Both source apps used `bg-ink`/`bg-text` (a text token, misused as a background) — this uses `--color-action` / `--color-action-secondary` instead, the tokens named for the job. |
| `Checkbox.jsx` / `.css` | Provendoire "On rotation", FinTrack "Shared cost" / "Always use for this merchant" | Native `<input type="checkbox">` wrapped in a `<label>`, unchanged from both apps. Adds `accent-color: var(--color-action)` for the checked state — neither app set one. |
| `Select.jsx` / `.css` | FinTrack's `inp`-styled `<select>` (Business, NetWorth, Taxes, Transactions, Review, Topbar, SplitEditor) | Styled **native** `<select>`, not a Listbox — neither app has custom option markup or multi-select, so Headless UI isn't earning its dependency yet. `appearance: none` + a drawn chevron. |
| `ThemeToggle.jsx` / `.css` | Seek's `src/components/ThemeToggle.jsx` | Reads/writes `document.documentElement.dataset.theme` and persists to `localStorage`. The other half of dark mode from the boot script in `docs/consuming-project.md` step 3 — that script sets the value before first paint, this is what changes it afterward. No props; a project wanting different states than "Dark"/"Light" text should treat this as a starting point to copy and edit, same as any other component here. |
| `Segmented.jsx` / `.css` | FinTrack's `Segmented` (Topbar's My Share/Full Amount, Personal/All/Business), Seek's `.segmented` (Cards' arcana filter, hand-rolled markup) | Two real looks, kept as both: `bordered` (default, Seek — divided box, active option tinted) and `pill` (FinTrack — tinted track, active option raised with a shadow). `role="group"` + `aria-pressed` came from Seek's version; FinTrack's had neither. |
| `Chip.jsx` / `.css` | Provendoire's `TagPill.jsx` (recipe tags), Seek's `.chip`/`.chips` (card keywords, the "Reversed" flag) | Provendoire's has a border, Seek's doesn't — the `bordered` prop, not a pick-one. `as` covers Seek's two shapes (`<span>` standalone, `<li>` in a `<ul>`); the flex-wrap list layout itself stays the caller's problem, as it already was in both apps. |
| `Empty.jsx` / `.css` | Seek's `.empty` (inline, e.g. "No spreads yet."), FinTrack's `Empty` in ui.jsx (the same idea, centered with padding as a table/panel placeholder) | `padded` switches between the two real shapes. |

All three padding scales were normalized from the apps' actual Tailwind
values (`px-2.5`, `py-1.5`, etc.) onto real `--space-*` steps, and borders
moved from `--color-border` to `--color-border-strong` per
`docs/tokens.md`'s interactive-control contrast rule — a rule neither
source app was actually following. Both are intentional corrections, not
extraction bugs; see the header comment in each `.jsx` file for the
specific reasoning.

`tokens/tailwind.preset.js` also picked up three missing utility mappings
(`action.active`, the whole `action-secondary` group, `surface.hover`)
while building these — unrelated to the CSS-vs-Tailwind question, just a
real gap between the preset and `tokens.css`/`docs/tokens.md`. It stays
useful for FinTrack and Provendoire's *other* Tailwind-styled markup for
as long as they're still on Tailwind.

## Still open

- **Radio** — no working code to extract from in either project. Add it
  once one exists.
- **Dropdown/Menu (Listbox)** — same story: if a project ends up needing
  rich option content, multi-select, or a combobox, that's when a
  hand-rolled or Headless-UI-backed listbox earns its place here, not
  before.
- **Card** — FinTrack has one, no second project does yet (see above).
- **Input** — the other component the original scaffolding note flagged as
  likely-needed; not touched in this pass.
- **Migrating Provendoire/FinTrack's existing Tailwind markup** off
  Tailwind entirely is a separate, larger effort from adding new
  plain-CSS components here — this pass only covers new components, not
  the apps' current pages.
