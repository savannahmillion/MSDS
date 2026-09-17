# Icons

One set, one grid: every icon is a single-color SVG on a `0 0 24 24`
viewBox, painted with `currentColor`. Two sources feed it:

| Folder | What | License |
|---|---|---|
| `material/` | Pulled from [Material Symbols](https://fonts.google.com/icons) — Outlined, weight 400, unfilled unless noted in `sources.json` | Apache 2.0, see `material/LICENSE` |
| `custom/` | Hand-drawn | Yours |

Names are kebab-case and shared across both folders — `search` is
`search` whether it came from Google or from you, so an app never cares
which. Material names are renamed where the MSDS name is clearer
(`arrow_back` → `arrow-left`); `sources.json` records the mapping.

Add icons **as an app actually needs them**, same as components. The set
is a record of what's in use, not a mirror of Material.

The `.svg` files are the source of truth. `index.js` and `preview.html`
are generated — never edit them by hand.

## Adding a Material icon

Find the name at [fonts.google.com/icons](https://fonts.google.com/icons)
(the snake_case name under the icon), then:

```bash
npm run icons:add -- arrow_back arrow-left
```

The second argument is the MSDS name; leave it off to use the Material
name with `_` → `-`. Optional `--style rounded|sharp` and `--fill`.

Material Symbols ship on a `0 -960 960 960` viewBox. The script rescales
the path onto `0 0 24 24` exactly (their design grid is 24dp × 40), so a
Material icon ends up the same kind of file as a hand-drawn one.

## Adding a hand-drawn icon

1. **Draw on a 24×24 frame.** Keep the drawing inside the central 20×20
   (2px padding) so it sits at the same visual size as Material icons.
   Match their weight: 2px strokes, square-ish joins.
2. **One color.** Anything — black is fine. It gets replaced with
   `currentColor`.
3. **No frame fill.** Remove the frame's white background before
   exporting, or it exports as a solid square.
4. **Strokes are OK**; outlining them (Figma: *Outline stroke*) is safer
   if the icon will ever be scaled far from 24px.
5. Export as SVG, save as `custom/<kebab-name>.svg`, run:

```bash
npm run icons
```

The build rewrites the file in place into the normalized shape (drops
`width`/`height`, Figma's frame `clip-path`, `<title>`; turns the color
into `currentColor`) and **refuses** anything it can't make safely
recolorable: wrong viewBox, more than one color, opacity, gradients,
images, `<style>`, embedded text, a filled frame rect. The error says
what to fix in the drawing.

Open `preview.html` (it needs a local server for the CSS, e.g.
`npx serve`) to see the whole set in both themes.

## Using icons in a project

Import `icons.css` once, next to the other MSDS styles:

```js
import "@msds/ui/icons.css";
```

**Plain HTML, Drupal, anything string-based:**

```js
import { iconSvg } from "@msds/ui/icons";

button.innerHTML = `${iconSvg("search")} Search`;          // decorative
iconButton.innerHTML = iconSvg("search", { label: "Search" }); // icon-only
```

**React:** there is no `<Icon>` component yet — per the components rule,
it gets extracted once two apps are actually rendering icons. Until then:

```jsx
import { icons, viewBox } from "@msds/ui/icons";

<svg viewBox={viewBox} fill="currentColor" className="msds-icon"
     aria-hidden="true" dangerouslySetInnerHTML={{ __html: icons.search }} />
```

**Raw file** (bundler `?raw`/`?react` imports, Figma, a CMS media
library): `@msds/ui/icons/material/search.svg`.

Size comes from `font-size`, color from `color` — both via tokens:

```css
.search-field .msds-icon {
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
}
```

Icon-only buttons need an accessible name — pass `label`, or put
`aria-label` on the button and leave the icon decorative.
