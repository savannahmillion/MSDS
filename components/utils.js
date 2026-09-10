// Tiny className combiner shared by MSDS components.
//
// Not clsx/tailwind-merge — no dependency, no conflict resolution. Pass
// non-overlapping utility classes (the way FinTrack and Provendoire already
// do) and this just drops falsy values and joins the rest.
export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
