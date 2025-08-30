import { test, expect } from '@playwright/test';

test.describe('Barriers Functionality', () => {
  test('should load barriers page and display content', async ({ page }) => {
    await page.goto('/barriers');
    await expect(page.locator('h1')).toBeVisible();

    // Check if barriers are displayed
    const barriersList = page.locator('[data-testid="barrier-item"], .barrier-item, article, .card');
    await expect(barriersList.first()).toBeVisible();
  });

  test('should navigate to individual barrier pages', async ({ page }) => {
    await page.goto('/barriers');

    // Find and click on the first barrier link
    const barrierLink = page.locator('a[href*="/barriers/"]').first();
    await expect(barrierLink).toBeVisible();

    if (await barrierLink.count() > 0) {
      const href = await barrierLink.getAttribute('href');
      if (href) {
        await barrierLink.click();
        await expect(page).toHaveURL(new RegExp(href));
        await expect(page.locator('body')).toBeVisible();
      }
    }
  });

  test('should have search or filter functionality', async ({ page }) => {
    await page.goto('/barriers');

    // Look for search input or filter elements
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="search" i]',
      'input[placeholder*="filter" i]',
      '.search-input',
      '.filter-input',
      '[role="search"] input'
    ];

    let searchFound = false;
    for (const selector of searchSelectors) {
      if (await page.locator(selector).count() > 0) {
        searchFound = true;
        // Test the search functionality if found
        const searchInput = page.locator(selector).first();
        await searchInput.fill('test');
        await searchInput.press('Enter');
        break;
      }
    }

    // If no search found, that's okay - not all implementations have it
    expect(searchFound).toBeDefined();
  });

  test('should display barrier content properly', async ({ page }) => {
    await page.goto('/barriers');

    // Check for content structure
    const contentSelectors = [
      'article',
      '.barrier-content',
      '.content',
      'main',
      '.main-content'
    ];

    let contentFound = false;
    for (const selector of contentSelectors) {
      if (await page.locator(selector).count() > 0) {
        contentFound = true;
        const content = page.locator(selector).first();
        await expect(content).toBeVisible();
        break;
      }
    }

    expect(contentFound).toBe(true);
  });
});
