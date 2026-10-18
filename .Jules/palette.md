## 2024-05-10 - Add aria-label to Assign Dungling button
**Learning:** Icon-like or shorthand buttons (+ / -) need descriptive aria-labels for screen reader users. The BuildingPanel had an aria-label for the minus button ("Dungling abziehen") but was missing one for the plus button ("+ Dungling" could be confusing out of context, or when the layout changes).
**Action:** Add `aria-label="Dungling zuweisen" title="Dungling zuweisen"` to the "+ Dungling" button in `src/ui/BuildingPanel.jsx`.
