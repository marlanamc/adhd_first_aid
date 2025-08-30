import { test, expect } from '@playwright/test';

test.describe('Guides Functionality', () => {
  test('should load guides page and display content', async ({ page }) => {
    await page.goto('/guides');
    await expect(page.locator('h1')).toBeVisible();

    // Check if guides are displayed
    const guidesList = page.locator('[data-testid="guide-item"], .guide-item, article, .card');
    await expect(guidesList.first()).toBeVisible();
  });

  test('should navigate to individual guide pages', async ({ page }) => {
    await page.goto('/guides');

    // Find and click on the first guide link
    const guideLink = page.locator('a[href*="/guides/"]').first();
    await expect(guideLink).toBeVisible();

    if (await guideLink.count() > 0) {
      const href = await guideLink.getAttribute('href');
      if (href) {
        await guideLink.click();
        await expect(page).toHaveURL(new RegExp(href));

        // Check if guide content loads
        const content = page.locator('article, .content, .guide-content').first();
        await expect(content).toBeVisible();
      }
    }
  });

  test('should display guide content with proper formatting', async ({ page }) => {
    await page.goto('/guides');

    // Look for markdown content or rich text formatting
    const contentSelectors = [
      '.prose',
      '.markdown-content',
      'article p',
      '.guide-body',
      '[class*="markdown"]'
    ];

    let formattedContentFound = false;
    for (const selector of contentSelectors) {
      if (await page.locator(selector).count() > 0) {
        formattedContentFound = true;
        const content = page.locator(selector).first();
        await expect(content).toBeVisible();
        break;
      }
    }

    // If no specific formatting found, check for any text content
    if (!formattedContentFound) {
      const textContent = page.locator('article, main').first();
      await expect(textContent).toContainText(/\w+/); // Should have some text
    }
  });

  test('should have proper guide structure', async ({ page }) => {
    await page.goto('/guides');

    // Check for guide structure elements
    const structureElements = [
      'h1, h2, h3', // Headings
      'p, li', // Content elements
      'img, .image', // Media elements
      '.guide-section, .section' // Section dividers
    ];

    let structureFound = false;
    for (const selector of structureElements) {
      if (await page.locator(selector).count() > 0) {
        structureFound = true;
        break;
      }
    }

    expect(structureFound).toBe(true);
  });

  test('should handle guide navigation and back buttons', async ({ page }) => {
    await page.goto('/guides');

    // Find and click on a guide link
    const guideLink = page.locator('a[href*="/guides/"]').first();

    if (await guideLink.count() > 0) {
      await guideLink.click();

      // Look for navigation elements
      const navSelectors = [
        'a[href*="/guides"]', // Back to guides
        '.back-button',
        '[aria-label*="back" i]',
        'button[title*="back" i]'
      ];

      let navFound = false;
      for (const selector of navSelectors) {
        if (await page.locator(selector).count() > 0) {
          navFound = true;
          // Test navigation back if found
          const backLink = page.locator(selector).first();
          await backLink.click();
          await expect(page).toHaveURL(/guides/);
          break;
        }
      }

      if (!navFound) {
        // Test browser back button
        await page.goBack();
        await expect(page).toHaveURL(/guides/);
      }
    }
  });
});
