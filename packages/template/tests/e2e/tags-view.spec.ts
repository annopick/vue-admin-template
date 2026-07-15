import { test, expect } from '@playwright/test'

// TagsView acceptance: the tag bar appears below the navbar, tracks the
// current route, and supports close/close-others/close-all.

test.describe('tags view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)
    await expect(page.locator('.tags-view-container')).toBeVisible({ timeout: 10000 })
  })

  test('tags bar is visible below the navbar', async ({ page }) => {
    const navbarBox = await page.locator('.navbar').boundingBox()
    const tagsBox = await page.locator('.tags-view-container').boundingBox()
    expect(navbarBox).not.toBeNull()
    expect(tagsBox).not.toBeNull()
    // Tags bar top edge should be at or below navbar bottom edge
    expect(tagsBox!.y).toBeGreaterThanOrEqual(navbarBox!.y + navbarBox!.height - 1)
  })

  test('current route has an active tag', async ({ page }) => {
    // Dashboard should have an active tag
    const activeTag = page.locator('.tags-view-item.active')
    await expect(activeTag).toBeVisible()
    await expect(activeTag).toContainText(/dashboard/i)
  })

  test('navigating adds a new tag', async ({ page }) => {
    await page.goto('/#/example/table')
    await page.waitForTimeout(1000)
    // Both Dashboard and Table tags should exist
    const tags = page.locator('.tags-view-item')
    const texts = await tags.allInnerTexts()
    expect(texts.some((t) => /dashboard/i.test(t))).toBe(true)
    expect(texts.some((t) => /表格|table/i.test(t))).toBe(true)
  })

  test('closing a tag navigates to the last remaining view', async ({ page }) => {
    await page.goto('/#/example/table')
    await page.waitForTimeout(1000)
    // Close the Table tag via its close icon
    const tableTag = page.locator('.tags-view-item', { hasText: /表格|table/i })
    await tableTag.locator('.el-icon-close').click()
    await page.waitForTimeout(500)
    // Should navigate away from /example/table (back to dashboard)
    await expect(page).toHaveURL(/#\/dashboard/)
    // Table tag should be gone
    const remaining = await page.locator('.tags-view-item').allInnerTexts()
    expect(remaining.some((t) => /表格|table/i.test(t))).toBe(false)
  })
})
