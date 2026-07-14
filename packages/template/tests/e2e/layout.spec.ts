import { test, expect } from '@playwright/test'

// Layout shell tracer bullet: after login the dashboard renders inside the
// full admin chrome — Sidebar (icon+label menu), Navbar (breadcrumb +
// collapse toggle + avatar dropdown), AppMain. Proves the composable
// migration (ResizeHandler, FixiOSBug) and the EP-icon-only sidebar work.
test.describe('layout shell', () => {
  test.beforeEach(async ({ page }) => {
    // Log in once per test
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)
  })

  test('dashboard renders inside the Layout with Sidebar + Navbar', async ({ page }) => {
    // Sidebar is present with the dashboard menu item
    await expect(page.locator('.sidebar-container')).toBeVisible()
    // Dashboard is the first (and only non-collapsed) top-level menu item
    await expect(page.locator('.el-menu-item').filter({ hasText: 'Dashboard' })).toBeVisible()

    // Navbar with breadcrumb
    await expect(page.locator('.navbar')).toBeVisible()
    await expect(page.locator('.app-breadcrumb')).toBeVisible()

    // Dashboard heading in the main content area
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('clicking the collapse toggle folds the sidebar', async ({ page }) => {
    // Initially expanded (sidebar-container width = $sideBarWidth = 210px)
    await expect(page.locator('.app-wrapper')).not.toHaveClass(/hideSidebar/)

    // Click the hamburger
    await page.locator('.hamburger-container').click()

    // Now collapsed
    await expect(page.locator('.app-wrapper')).toHaveClass(/hideSidebar/)
  })

  test('unknown route shows the 404 page', async ({ page }) => {
    await page.goto('/#/nonexistent-page-xyz')
    await expect(page.locator('.error-code')).toContainText('404')
  })
})
