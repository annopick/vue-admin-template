import { test, expect } from '@playwright/test'

// Dynamic permission tracer bullet: admin sees all menus, editor sees only
// the authorized subset.
test.describe('dynamic permission', () => {
  test('admin sees Form and Tree (admin-only routes)', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)

    // Wait for async routes to register and sidebar to render
    await expect(page.locator('.el-menu-item').filter({ hasText: '表单' })).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.el-sub-menu__title').filter({ hasText: '示例' })).toBeVisible()

    // Admin can navigate to /form/index (admin-only)
    await page.goto('/#/form/index')
    await expect(page.getByRole('heading', { name: 'Form 示例' })).toBeVisible()

    // Admin can navigate to /example/tree (admin-only)
    await page.goto('/#/example/tree')
    await expect(page.getByRole('heading', { name: 'Tree 示例' })).toBeVisible()
  })

  test('editor does NOT see Form or Tree (admin-only routes filtered out)', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'editor')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)

    // Wait for async routes to register — Table (editor-allowed) is visible
    await expect(page.locator('.el-menu-item').filter({ hasText: '表格' })).toBeVisible({ timeout: 10000 })

    // Editor should NOT see Form (admin-only)
    await expect(page.locator('.el-menu-item').filter({ hasText: '表单' })).toHaveCount(0)

    // Editor should NOT see Tree (admin-only)
    await expect(page.locator('.el-menu-item').filter({ hasText: '树形' })).toHaveCount(0)
    await expect(page.locator('.el-sub-menu__title').filter({ hasText: '示例' })).toHaveCount(0)

    // Editor accessing /form/index directly → 404 (route not registered)
    await page.goto('/#/form/index')
    await expect(page.locator('.error-code')).toContainText('404')
  })

  test('refreshing a deep async-route URL while logged in keeps the user on that page', async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)

    // Navigate to a deep async route
    await page.goto('/#/nested/menu1/menu1-2/menu1-2-1')
    await expect(page.getByRole('heading', { name: 'Menu 1-2-1' })).toBeVisible()

    // Reload — guard re-registers routes and we stay on the page
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Menu 1-2-1' })).toBeVisible({ timeout: 15000 })
  })
})
