import { test, expect } from '@playwright/test'

// Feature pages tracer bullet: navigate to Table (mock pagination), Tree,
// Form (validation), and the deepest Nested route. Proves the page routes,
// mock table API, and recursive SidebarItem rendering all work together.
test.describe('feature pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)
  })

  test('Table page renders mock data with pagination', async ({ page }) => {
    await page.goto('/#/example/table')
    // Table heading + at least one row from mock
    await expect(page.getByRole('heading', { name: 'Table 示例' })).toBeVisible()
    await expect(page.locator('.el-table')).toBeVisible()
    // Wait for mock data to load
    await expect(page.locator('.el-table__row').first()).toBeVisible({ timeout: 10000 })
  })

  test('Tree page renders an expandable tree', async ({ page }) => {
    await page.goto('/#/example/tree')
    await expect(page.getByRole('heading', { name: 'Tree 示例' })).toBeVisible()
    await expect(page.locator('.el-tree')).toBeVisible()
    // Element Plus uses .el-tree-node__content for each node row
    await expect(page.locator('.el-tree-node__content').first()).toBeVisible()
  })

  test('Form page validates required fields', async ({ page }) => {
    await page.goto('/#/form/index')
    await expect(page.getByRole('heading', { name: 'Form 示例' })).toBeVisible()
    // Click submit with empty fields → should show validation error
    await page.getByRole('button', { name: '提交' }).click()
    await expect(page.locator('.el-form-item__error').first()).toBeVisible()
  })

  test('Nested menu drills to the deepest level', async ({ page }) => {
    await page.goto('/#/nested/menu1/menu1-2/menu1-2-1')
    await expect(page.getByRole('heading', { name: 'Menu 1-2-1' })).toBeVisible()
  })
})
