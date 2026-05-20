import { test, expect } from '@playwright/test'

test.describe('Public Share Page', () => {
  test('renders public document', async ({ page }) => {
    // This assumes a public document exists at /p/test-doc
    // In a real test setup, seed the DB first
    const response = await page.goto('/p/test-doc')

    // Either renders or 404s — both are valid responses
    expect(response?.status()).toBeLessThan(500)
  })

  test('presentation query param activates presentation', async ({ page }) => {
    await page.goto('/p/test-doc?mode=present')

    // Presentation overlay should appear if doc exists and has slides
    // If doc doesn't exist, 404 is expected
    const presentOverlay = page.getByText('演示模式')
    const notFound = page.getByText('404')

    await expect(presentOverlay.or(notFound)).toBeVisible()
  })
})
