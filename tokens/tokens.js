/**
 * MSDS tokens — JS access layer.
 *
 * Values are NOT duplicated here. `token()` reads the live computed value
 * from tokens.css, so JS-land (charts, canvas, inline styles) can never
 * drift from CSS-land. That drift is the #1 way small design systems rot.
 *
 *   import { token } from "@msds/ui/tokens";
 *   const axisColor = token("--color-border");
 */

export function token(name, el = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/** Read several at once: tokens(["--color-text", "--color-border"]) */
export function tokens(names, el = document.documentElement) {
  const cs = getComputedStyle(el);
  return Object.fromEntries(
    names.map((n) => [n, cs.getPropertyValue(n).trim()])
  );
}

/**
 * Breakpoints must be duplicated — CSS custom properties do not work inside
 * @media queries. This is the one intentional exception. Keep in sync with
 * the comment at the bottom of TIER 1 in tokens.css.
 */
export const breakpoints = {
  sm: "40rem", // 640
  md: "48rem", // 768
  lg: "64rem", // 1024
  xl: "80rem", // 1280
};

/** Ramp steps, for generating chart series or iterating a scale. */
export const rampSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900];

/** Ramp names. Rename these when you rename the ramps in tokens.css. */
export const ramps = ["neutral", "brand", "accent", "hue4", "hue5", "hue6", "hue7"];

/** e.g. rampToken("brand", 500) -> "--brand-500" */
export const rampToken = (ramp, step) => `--${ramp}-${step}`;
