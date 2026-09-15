import { cx } from "./utils";
import "./Chip.css";

/* Chip
 * ---------------------------------------------------------------------
 * Extracted from Provendoire's `TagPill.jsx` (recipe tags) and Seek's
 * `.chip`/`.chips` (card keywords, the "Reversed" flag on a log entry).
 * Provendoire's version has a border; Seek's doesn't — kept as the
 * `bordered` prop rather than dropping one app's look.
 *
 * `as` covers Seek's two shapes: a standalone `<span>` (the "Reversed"
 * flag) and an `<li>` inside a `<ul className="chips">` (keywords) —
 * that wrapping list/flex-wrap layout is left to the caller, same as
 * both source apps already do it themselves.
 *
 *   <Chip>{tag}</Chip>                 Seek's shape (no border)
 *   <Chip bordered>{tag}</Chip>        Provendoire's shape
 *   <Chip as="li">{keyword}</Chip>     inside a <ul>
 * --------------------------------------------------------------------- */

export function Chip({ as: As = "span", bordered = false, className, children, ...props }) {
  return (
    <As className={cx("msds-chip", bordered && "msds-chip--bordered", className)} {...props}>
      {children}
    </As>
  );
}
