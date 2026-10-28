## 2026-10-28 - Added explicit focus rings for form elements
**Learning:** For inputs and buttons that are heavily styled, standard `focus:` pseudo-classes don't always provide a clear visual indicator. You have to explicitly use `focus-visible:` and `ring` styling to ensure proper visibility.
**Action:** Always check the element with Tab key to verify that the `focus-visible` state generates a distinct focus ring. Use Tailwind `focus-visible:ring-2` to add accessible focus indicators.
