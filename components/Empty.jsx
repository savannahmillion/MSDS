import { cx } from "./utils";
import "./Empty.css";

/* Empty
 * ---------------------------------------------------------------------
 * Extracted from Seek's `.empty` (an inline muted line — "No spreads
 * yet.") and FinTrack's `Empty` in ui.jsx (the same message, but
 * centered with generous vertical padding as a full-width table/panel
 * placeholder). Both real shapes, not a guess — `padded` switches
 * between them.
 *
 *   <Empty>No spreads yet.</Empty>
 *   <Empty padded>No transactions match these filters.</Empty>
 * --------------------------------------------------------------------- */

export function Empty({ padded = false, className, children, ...props }) {
  return (
    <p className={cx("msds-empty", padded && "msds-empty--padded", className)} {...props}>
      {children}
    </p>
  );
}
