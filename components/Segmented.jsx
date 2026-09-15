import { cx } from "./utils";
import "./Segmented.css";

/* Segmented
 * ---------------------------------------------------------------------
 * Extracted from FinTrack's `Segmented` (src/components/ui.jsx — My
 * Share/Full Amount, Personal/All/Business on Topbar) and Seek's
 * `.segmented` (src/routes/Cards.jsx — the arcana filter, hand-rolled
 * markup rather than a component). Same control, two different looks —
 * kept as both instead of picking one:
 *
 *   - `bordered` (default, Seek's shape): a divided box, active option
 *     tinted with `--color-surface-accent`/`--color-text-accent`.
 *   - `pill`: FinTrack's shape — a tinted track with the active option
 *     raised on `--color-surface` with a hairline shadow.
 *
 * `aria-pressed` + `role="group"` come from Seek's version, which had
 * them; FinTrack's didn't.
 *
 *   <Segmented options={[{ value: 'all', label: 'All' }, ...]}
 *              value={filter} onChange={setFilter} ariaLabel="Filter" />
 *   <Segmented variant="pill" size="sm" ... />
 * --------------------------------------------------------------------- */

export function Segmented({
  options,
  value,
  onChange,
  variant = "bordered",
  size = "md",
  ariaLabel,
  className,
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cx(
        "msds-segmented",
        `msds-segmented--${variant}`,
        size === "sm" && "msds-segmented--sm",
        className
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
