import { test, expect } from '@playwright/test'

test.describe('Editor', () => {
  test('renders editor with live preview', async ({ page }) => {
    // Navigate to editor (requires auth in real app — may need to mock)
    await page.goto('/editor/test-doc')

    // Toolbar visible
    await expect(page.getByText('演示')).toBeVisible()
    await expect(page.getByText('预览')).toBeVisible()
    await expect(page.getByText('侧栏')).toBeVisible()

    // Editor pane visible (Milkdown creates a contenteditable)
    const editor = page.locator('.milkdown-editor [contenteditable="true"]')
    await expect(editor).toBeVisible()
  })

  test('slash command menu appears on /', async ({ page }) => {
    await page.goto('/editor/test-doc')

    const editor = page.locator('.milkdown-editor [contenteditable="true"]')
    await editor.click()
    await editor.fill('/battle')

    // Slash menu should appear
    await expect(page.getByText('战斗流程')).toBeVisible()
  })

  test('toggle focus mode', async ({ page }) => {
    await page.goto('/editor/test-doc')

    const focusBtn = page.getByLabel(/专注模式/)
    await focusBtn.click()

    // Editor container should have focus-mode class
    const container = page.locator('.focus-mode')
    await expect(container).toBeVisible()
  })

  test('presentation mode opens and closes', async ({ page }) => {
    await page.goto('/editor/test-doc')

    // Click present button
    await page.getByRole('button', { name: '演示' }).click()

    // Presentation overlay visible
    await expect(page.getByText('演示模式')).toBeVisible()

    // Exit with Escape
    await page.keyboard.press('Escape')

    // Should return to editor
    await expect(page.getByRole('button', { name: '演示' })).toBeVisible()
  })
})
