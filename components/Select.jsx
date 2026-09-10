import { forwardRef } from "react";
import { cx } from "./utils";
import "./Select.css";

/* Select
 * ---------------------------------------------------------------------
 * Extracted from the `inp`-styled <select> elements repeated across
 * FinTrack (Business, NetWorth, Taxes, Transactions, Review, Topbar,
 * SplitEditor) — every one a native <select> with the same
 * background/border/rounded/padding combo, no custom listbox anywhere.
 * Provendoire doesn't have a select yet, but its `.field-input` uses the
 * identical shape for text inputs — same control, generalized.
 *
 * Plain CSS (Select.css), not Tailwind — see components/README.md.
 * Deliberately a *styled native* <select>, not a Catalyst-style Listbox:
 * neither app needs multi-select or custom option markup, so a Listbox
 * would be solving a problem this design system doesn't have yet. Border
 * uses `--color-border-strong`, not FinTrack's plain `border-line` — see
 * docs/tokens.md on interactive-control contrast.
 *
 *   <Select value={x} onChange={(e) => setX(e.target.value)}>
 *     <option value="a">A</option>
 *   </Select>
 *   <Select size="sm">…</Select>
 * --------------------------------------------------------------------- */

export const Select = forwardRef(function Select(
  { size = "md", className, children, ...props },
  ref
) {
  return (
    <span className={cx("msds-select", size === "sm" && "msds-select--sm")}>
      <select ref={ref} className={cx("msds-select__control", className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="msds-select__icon"
      >
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
});
