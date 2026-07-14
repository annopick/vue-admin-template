import { test, expect } from '@playwright/test'

// End-to-end login flow: the tracer bullet for slice 3. Proves the full
// path — mock backend → axios → Pinia user store → token cookie → router
// guard → login page UI → dashboard — works together.
test.describe('login flow', () => {
  test('admin can log in and reach the dashboard', async ({ page }) => {
    await page.goto('/')

    // Should land on the login page (no token → guard redirects)
    await expect(page).toHaveURL(/#\/login/)
    await expect(page.locator('.title')).toContainText('系统登录')

    // Fill credentials and submit
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()

    // Should be redirected away from login to the dashboard
    await expect(page).toHaveURL(/#\/dashboard/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('logged-in user visiting /login is bounced to dashboard', async ({ page }) => {
    // Log in first
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)

    // Now visit /login — should bounce back
    await page.goto('/#/login')
    await expect(page).toHaveURL(/#\/dashboard/)
  })
})
