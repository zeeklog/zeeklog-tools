import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function expectNoA11yViolations(url: string, pageName: string, page: Page) {
  await page.goto(url, { waitUntil: 'networkidle' })

  const accessibilityScanResults = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze()

  expect(accessibilityScanResults.violations, `${pageName} has accessibility violations`).toEqual([])
}

test('home page should pass basic axe rules', async ({ page }) => {
  await expectNoA11yViolations('/', 'home page', page)
})

test('blog page should pass basic axe rules', async ({ page }) => {
  await expectNoA11yViolations('/blog', 'blog page', page)
})

test('search page should support keyboard flow', async ({ page }) => {
  await page.goto('/search?q=python&scope=all', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.type('react')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=react/)
})
