import { forwardRef } from "react";
import { cx } from "./utils";
import "./Button.css";

/* Button
 * ---------------------------------------------------------------------
 * Extracted from the "Save" / "Cancel" / ghost-action buttons in
 * Provendoire (RecipeEdit, RecipeMetaPanel) and FinTrack (ui.jsx callers
 * across Business/NetWorth/Taxes/Transactions/Review). Both apps hand-roll
 * the same three shapes — solid, outline, and plain/text — so this makes
 * that explicit instead of leaving it copy-pasted per button.
 *
 * Plain CSS (Button.css), not Tailwind — see components/README.md. Where
 * this diverges from the apps it was extracted from: both use `bg-ink` /
 * `bg-text` (a *text* token) as a button background, and pad with values
 * that aren't on the MSDS space scale. `solid` here uses `--color-action` /
 * `--color-action-secondary` instead — the tokens tokens.css already names
 * for exactly this job — and sizes snap to real `--space-*` steps.
 *
 *   <Button>Save</Button>                       solid action (primary)
 *   <Button color="secondary">Cancel</Button>    solid secondary
 *   <Button outline>Cancel</Button>              bordered, fills on hover
 *   <Button plain>Skip</Button>                  text-only
 *   <Button plain color="danger">Delete</Button> text-only, red on hover
 *   <Button size="sm">Add split</Button>         compact, for dense rows
 * --------------------------------------------------------------------- */

export const Button = forwardRef(function Button(
  {
    color = "action",
    outline = false,
    plain = false,
    size = "md",
    className,
    children,
    ...props
  },
  ref
) {
  const shape = plain ? "plain" : outline ? "outline" : "solid";

  return (
    <button
      ref={ref}
      className={cx(
        "msds-button",
        `msds-button--${shape}`,
        size === "sm" && "msds-button--sm",
        color !== "action" && `msds-button--${color}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
