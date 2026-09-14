import { useEffect, useState } from "react";
import "./ThemeToggle.css";

/* ThemeToggle
 * ---------------------------------------------------------------------
 * Extracted from Seek (src/components/ThemeToggle.jsx), the only one of
 * the three consuming apps that actually wired up the dark mode every
 * app's tokens.css already supports. MSDS handles the *token* side of
 * dark mode entirely via `[data-theme]` on `<html>` — this component is
 * the other half: the boot script (see docs/consuming-project.md step 3)
 * sets the initial value before first paint, this is what lets a person
 * change it afterward.
 *
 * Plain CSS (ThemeToggle.css), like Button/Checkbox/Select — see
 * components/README.md.
 *
 *   <ThemeToggle />
 * --------------------------------------------------------------------- */

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme ?? "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  return (
    <button
      type="button"
      className="msds-theme-toggle"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
