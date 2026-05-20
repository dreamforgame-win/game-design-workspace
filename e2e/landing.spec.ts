import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('loads with correct title and CTA', async ({ page }) => {
    await page.goto('/')

    // Page loads without errors
    await expect(page).toHaveTitle(/游戏设计/)

    // Hero section visible
    await expect(page.getByText('游戏设计可视化引擎')).toBeVisible()

    // CTA button links to login
    const cta = page.getByRole('link', { name: /开始创建|Start Creating/ })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/login')
  })

  test('is responsive at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // No horizontal scroll
    const body = page.locator('body')
    const scrollWidth = await body.evaluate((el) => el.scrollWidth)
    const clientWidth = await body.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // allow 1px rounding
  })
})
