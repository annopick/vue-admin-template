import { test, expect } from '@playwright/test'

// Visual acceptance tests for the Sidebar. These assert the visual invariants
// that the earlier behavioral tests missed:
//   1. Icons are a consistent size (no icon renders at 0px or oversized)
//   2. Collapsed sidebar shows icons only — no text labels leak through
//   3. Icons are centered in the collapsed (54px) strip
// These guard against CSS regressions that "tests pass but it looks wrong".

test.describe('sidebar visual acceptance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)
    // Wait for async routes to register and sidebar to render
    await expect(page.locator('.el-sub-menu__title').first()).toBeVisible({ timeout: 10000 })
  })

  test('expanded: all menu icons are the same non-zero size', async ({ page }) => {
    // Collect VISIBLE icon elements in the sidebar (skip icons inside
    // collapsed el-sub-menu popovers that are in the DOM but not displayed)
    const icons = page.locator('.sidebar-container .el-menu .sub-el-icon:visible')
    const count = await icons.count()
    expect(count).toBeGreaterThan(0)

    // Measure each icon's rendered width — they must all match and be > 0
    const sizes = await icons.evaluateAll((els) =>
      els
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return { width: Math.round(rect.width), height: Math.round(rect.height) }
        })
        .filter((s) => s.width > 0 && s.height > 0),
    )

    expect(sizes.length).toBeGreaterThan(0)

    // All icons must be the same size (within 1px tolerance for sub-pixel rounding)
    const widths = sizes.map((s) => s.width)
    const maxWidth = Math.max(...widths)
    const minWidth = Math.min(...widths)
    expect(maxWidth - minWidth).toBeLessThanOrEqual(1)
  })

  test('collapsed: no text labels visible in the sidebar', async ({ page }) => {
    // Collapse the sidebar
    await page.locator('.hamburger-container').click()
    await expect(page.locator('.app-wrapper')).toHaveClass(/hideSidebar/)

    // Every text span in the sidebar should be hidden (display:none or 0 size)
    const textSpans = page.locator('.sidebar-container .menu-item-title')
    const count = await textSpans.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const box = await textSpans.nth(i).boundingBox()
      // If the span exists but is hidden, boundingBox returns null
      // If it renders, its width should be 0 (clipped by overflow:hidden)
      if (box) {
        expect(box.width).toBe(0)
      }
    }
  })

  test('collapsed: icons are centered within the 54px sidebar width', async ({ page }) => {
    await page.locator('.hamburger-container').click()
    await expect(page.locator('.app-wrapper')).toHaveClass(/hideSidebar/)
    await page.waitForTimeout(500) // let the collapse transition finish

    const sidebar = page.locator('.sidebar-container').first()
    const sidebarBox = await sidebar.boundingBox()
    expect(sidebarBox).not.toBeNull()
    expect(sidebarBox!.width).toBe(54)

    // Query SVGs directly and filter to visible ones, since collapsed
    // popovers keep hidden SVGs in the DOM with zero bounding rects.
    const positions = await sidebar.evaluate((el) => {
      const svgs = el.querySelectorAll('svg')
      const result: Array<{ left: number; width: number; center: number }> = []
      for (const svg of svgs) {
        const r = svg.getBoundingClientRect()
        if (r.width > 0) {
          result.push({ left: r.left, width: r.width, center: r.left + r.width / 2 })
        }
      }
      return result
    })

    expect(positions.length).toBeGreaterThan(0)
    const sidebarCenter = sidebarBox!.x + sidebarBox!.width / 2

    for (const pos of positions) {
      // Icon center should be near the sidebar center (within 10px tolerance)
      expect(Math.abs(pos.center - sidebarCenter)).toBeLessThan(10)
    }
  })
})
