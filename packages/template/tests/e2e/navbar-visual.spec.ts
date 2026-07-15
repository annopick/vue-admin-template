import { test, expect } from '@playwright/test'

// Visual acceptance: the navbar avatar must be vertically centered within
// the navbar bar. Catches the regression where line-height:50px on the
// container pushes the avatar to the top edge.

test.describe('navbar visual acceptance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', '111111')
    await page.getByRole('button', { name: '登录' }).click()
    await expect(page).toHaveURL(/#\/dashboard/)
    await expect(page.locator('.avatar-wrapper')).toBeVisible({ timeout: 10000 })
  })

  test('avatar is vertically centered in the navbar', async ({ page }) => {
    const navbar = page.locator('.navbar')
    const avatar = page.locator('.avatar-wrapper')

    const navbarBox = await navbar.boundingBox()
    const avatarBox = await avatar.boundingBox()

    expect(navbarBox).not.toBeNull()
    expect(avatarBox).not.toBeNull()

    const topGap = avatarBox!.y - navbarBox!.y
    const bottomGap = navbarBox!.y + navbarBox!.height - (avatarBox!.y + avatarBox!.height)

    // The avatar should have roughly equal space above and below it.
    // Allow 3px tolerance for sub-pixel rounding.
    expect(Math.abs(topGap - bottomGap)).toBeLessThanOrEqual(3)
  })
})
