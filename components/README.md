# Components

Deliberately empty.

Do not add a component until **two real projects need the same one**. Extract
it from working code; do not design it in the abstract — you will guess the
props wrong.

When you do add one:

- It may reference **tier 2 semantic tokens only** (see `../CLAUDE.md`).
- It is **copied** into consuming projects, not imported. Components diverge
  per project and that is fine; tokens are what must never diverge.
- Keep it dependency-free where possible so it drops into Vite, Astro, or a
  plain HTML page without dragging a runtime along.

Likely first three, based on what FinTrack and the personal site both need:
`Button`, `Card`, `Input`.
