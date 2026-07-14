import { test, expect } from '@playwright/test'

// Tracer bullet: the highest-seam assertion that proves the scaffold boots.
// If this passes, the entire Vite + Vue 3 + dev-server toolchain is wired.
test('dev server serves the app shell at /', async ({ page }) => {
  await page.goto('/')
  // The minimal App renders this text; later slices replace it with the login page.
  await expect(page.locator('body')).toContainText('Vue Admin Template')
})
