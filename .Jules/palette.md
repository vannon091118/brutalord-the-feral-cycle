## 2026-10-13 - Dynamic Title and ARIA Labels on Disabled Buttons
**Learning:** Adding dynamic `aria-label` attributes to buttons might break end-to-end tests (like Playwright) if the tests rely on exact name matches for locators (e.g., `getByRole('button', { name: '+ Dungling' })`).
**Action:** When modifying `aria-label` or `role` attributes for accessibility, always search the testing directories (like `scripts/browser`) for locators that depend on them, and update the selectors (e.g., using `locator('button:has-text("+ Dungling")')`) to maintain robust tests.
