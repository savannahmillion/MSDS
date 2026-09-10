/**
 * MSDS Tailwind preset — only needed for projects that use Tailwind.
 * Every entry points at a CSS variable, so tokens.css stays the source of
 * truth and dark mode works with zero Tailwind dark: variants.
 *
 *   // tailwind.config.js
 *   import msds from "@msds/ui/tailwind.preset.js";
 *   export default { presets: [msds], content: ["./src/**\/*.{ts,tsx}"] };
 */
import { breakpoints } from "./tokens.js";

const ramp = (name) =>
  Object.fromEntries(
    [100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => [
      s,
      `var(--${name}-${s})`,
    ])
  );

export default {
  theme: {
    screens: breakpoints,
    extend: {
      colors: {
        "neutral": ramp("neutral"),
        "lavender": ramp("lavender"),
        "rose": ramp("rose"),
        "vermillion": ramp("vermillion"),
        "marigold": ramp("marigold"),
        "smoke-blue": ramp("smoke-blue"),
        "moss-green": ramp("moss-green"),

        // Semantic — prefer these in components.
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
          inverse: "var(--color-text-inverse)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          sunken: "var(--color-surface-sunken)",
          hover: "var(--color-surface-hover)",
          accent: "var(--color-surface-accent)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        action: {
          DEFAULT: "var(--color-action)",
          hover: "var(--color-action-hover)",
          active: "var(--color-action-active)",
          text: "var(--color-action-text)",
        },
        "action-secondary": {
          DEFAULT: "var(--color-action-secondary)",
          hover: "var(--color-action-secondary-hover)",
          text: "var(--color-action-secondary-text)",
        },
        success: "var(--color-success)",
        info: "var(--color-info)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        ui: "var(--font-ui)",
        mono: "var(--font-mono)",
      },
      // [size, { lineHeight }] tuples — bare values would drop Tailwind's
      // paired line-heights and silently change spacing in existing apps.
      fontSize: {
        xs:    ["var(--font-size-xs)",   { lineHeight: "var(--leading-snug)" }],
        sm:    ["var(--font-size-sm)",   { lineHeight: "var(--leading-normal)" }],
        base:  ["var(--font-size-base)", { lineHeight: "var(--leading-normal)" }],
        lg:    ["var(--font-size-lg)",   { lineHeight: "var(--leading-snug)" }],
        xl:    ["var(--font-size-xl)",   { lineHeight: "var(--leading-snug)" }],
        "2xl": ["var(--font-size-2xl)",  { lineHeight: "var(--leading-tight)" }],
        "3xl": ["var(--font-size-3xl)",  { lineHeight: "var(--leading-tight)" }],
        "4xl": ["var(--font-size-4xl)",  { lineHeight: "var(--leading-tight)" }],
        "5xl": ["var(--font-size-5xl)",  { lineHeight: "var(--leading-none)" }],
      },
      lineHeight: {
        none: "var(--leading-none)",
        tight: "var(--leading-tight)",
        snug: "var(--leading-snug)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
      },
      spacing: Object.fromEntries(
        ["0", "px", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"].map(
          (s) => [s, `var(--space-${s})`]
        )
      ),
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
    },
  },
};
