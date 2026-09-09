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
        neutral: ramp("neutral"),
        brand: ramp("brand"),
        accent: ramp("accent"),

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
          accent: "var(--color-surface-accent)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        action: {
          DEFAULT: "var(--color-action)",
          hover: "var(--color-action-hover)",
          text: "var(--color-action-text)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        ui: "var(--font-ui)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
        "5xl": "var(--font-size-5xl)",
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
