import { test, expect } from '@playwright/test'

// Tracer bullet retained from slice 2: proves the dev server boots and serves.
// With the router guard in place (slice 3), the root now redirects to /login.
test('dev server boots and serves the login page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.locator('.login-container')).toBeVisible()
})
