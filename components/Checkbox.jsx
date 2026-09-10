import { forwardRef } from "react";
import { cx } from "./utils";
import "./Checkbox.css";

/* Checkbox
 * ---------------------------------------------------------------------
 * Extracted from the labeled-checkbox rows in Provendoire (RecipeEdit —
 * "On rotation") and FinTrack (Transactions/Review — "Shared cost",
 * "Always use for this merchant"). Both wrap a native
 * <input type="checkbox"> directly in a <label> with the same
 * flex/gap/muted-text shape — this names that pattern.
 *
 * Plain CSS (Checkbox.css), not Tailwind — see components/README.md.
 * Provendoire already had a border (`border-border`); this uses
 * `--color-border-strong` instead — docs/tokens.md calls for the strong
 * variant on interactive controls, a rule neither source app was
 * following. The `accent-color` checked color is also new — neither app
 * set one, so checkboxes rendered browser-default blue.
 *
 *   <Checkbox label="On rotation" checked={x} onChange={e => ...} />
 *   <Checkbox label="Shared cost" size="sm" checked={x} onChange={...} />
 * --------------------------------------------------------------------- */

export const Checkbox = forwardRef(function Checkbox(
  { label, size = "md", className, ...props },
  ref
) {
  return (
    <label
      className={cx("msds-checkbox", size === "sm" && "msds-checkbox--sm", className)}
    >
      <input ref={ref} type="checkbox" className="msds-checkbox__input" {...props} />
      {label}
    </label>
  );
});
