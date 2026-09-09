# MSDS token reference

Flat list — this is the file to read when picking a token name.
Values live in `tokens/tokens.css`.

## Tier 2 — semantic colors (USE THESE)

| Token | Use for |
|---|---|
| `--color-text` | Default body and heading text |
| `--color-text-muted` | Secondary text, captions, labels (passes AA on white and on `--color-surface-sunken`) |
| `--color-text-subtle` | Placeholder, timestamps, least-important text |
| `--color-text-inverse` | Text on a dark/inverse surface |
| `--color-text-accent` | Emphasized text in brand color |
| `--color-text-link` | Hyperlinks |
| `--color-text-disabled` | Disabled control labels |
| `--color-surface` | Page background |
| `--color-surface-raised` | Cards, popovers, modals |
| `--color-surface-sunken` | Wells, table stripes, code blocks |
| `--color-surface-hover` | Row/list hover background |
| `--color-surface-accent` | Tinted brand background |
| `--color-surface-inverse` | Dark panels, tooltips |
| `--color-border` | Default hairlines, dividers, input borders |
| `--color-border-strong` | Input borders, hovered controls — meets the 3:1 non-text contrast rule (WCAG 1.4.11). Use this, not `--color-border`, on anything interactive. |
| `--color-border-accent` | Brand-tinted border |
| `--color-focus-ring` | Focus outline (set globally, do not reuse) |
| `--color-action` | Primary button background |
| `--color-action-hover` / `--color-action-active` | Its hover / pressed state |
| `--color-action-text` | Text on a primary button |
| `--color-action-secondary` | Secondary button background |
| `--color-action-secondary-hover` | Its hover state |
| `--color-action-secondary-text` | Text on a secondary button |
| `--color-success` / `-surface` / `-text` | Confirmation, positive delta |
| `--color-warning` / `-surface` / `-text` | Caution, needs attention |
| `--color-danger` / `-surface` / `-text` | Errors, destructive actions |
| `--color-info` / `-surface` / `-text` | Neutral informational callouts |

## Tier 1 — primitives (tokens.css ONLY)

| Family | Tokens |
|---|---|
| Ramps | `--neutral-{100..900}`, `--brand-*`, `--accent-*`, `--hue4-*`, `--hue5-*`, `--hue6-*`, `--hue7-*` |
| Status | `--success-{100,300,500,700}`, `--warning-*`, `--error-*`, `--info-*` — 100 surface · 300 fill · 500 border/icon · 700 text |
| Absolutes | `--white`, `--black` |

Step meaning: `100` lightest · `500` base · `900` darkest.

### Hue map

| Ramp | Hue | Nearest neighbour |
|---|---|---|
| vermillion (crimson) | 18° | error, 24° |
| **error** | 42° | warning, 20° |
| **warning** | 62° | marigold, 28° |
| marigold (gold) | 90° | success, 39° |
| **success** | 129° | moss-green, 58° |
| moss-green | 187° | info, 22° |
| **info** | 209° | smoke-blue, 4.6° — split by chroma, not hue |
| smoke-blue | 214° | lavender, 52° |
| lavender (brand) | 266° | rose, 65° |
| rose | 331° | vermillion, 47° |

Status ramps are bold. The warm band (18–90°) is the crowded one: four ramps
in 72°. `error` and `warning` are both shifted off their supplied base hues to
keep it legible. `info` and `smoke-blue` deliberately share a hue and are told
apart by chroma — info is a saturated cyan, smoke-blue is a grey-blue.

Every ramp shares one L\* curve (97 92 86 74 59 45 33 22 11), so a step number
means the same lightness in every hue. **Marigold is the one exception** — its
400-600 run lighter (82/72/54) because a yellow at L\*59 is olive, not gold.

## Typography

| Token | Use for |
|---|---|
| `--font-sans` | Work Sans — default UI and prose |
| `--font-ui` | Inter — dashboards, tables, anything with tabular figures |
| `--font-mono` | IBM Plex Mono — code, IDs, fixed-width data |
| `--font-size-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl}` | 12 → 48px |
| `--leading-{none,tight,snug,normal,relaxed}` | Line height; `normal` is the base rhythm |
| `--tracking-{tight,normal,wide}` | Letter spacing |
| `--weight-{regular,medium,semibold,bold}` | 400 / 500 / 600 / 700 |

Use `.numeric` (or `[data-numeric]`) on any cell showing figures — it swaps to
`--font-ui` with tabular numerals so columns align.

## Spacing · radius · elevation · motion

| Token | Notes |
|---|---|
| `--space-{0,px,1,2,3,4,5,6,8,10,12,16,20,24}` | 4px base; `--space-4` = 16px |
| `--radius-{none,sm,md,lg,xl,full}` | 0 / 4 / 8 / 12 / 16 / pill |
| `--shadow-{sm,md,lg,xl}` | sm=hairline lift, xl=modal |
| `--duration-{fast,base,slow}` | 120 / 200 / 320ms |
| `--ease-{standard,out,in}` | `standard` for most UI motion |
| `--layer-{base,dropdown,sticky,overlay,modal,toast}` | 0–500; never hardcode a z-index |

## Breakpoints — NOT CSS variables

CSS custom properties do not work in `@media`. Import from `tokens/tokens.js`:
`sm 40rem · md 48rem · lg 64rem · xl 80rem`
