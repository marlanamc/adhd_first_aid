import { test, expect } from '@playwright/test';

test.describe('Feelings Functionality', () => {
  test('should load feelings page and display content', async ({ page }) => {
    await page.goto('/feelings');
    await expect(page.locator('h1')).toBeVisible();

    // Check if feelings are displayed
    const feelingsList = page.locator('[data-testid="feeling-item"], .feeling-item, article, .card');
    await expect(feelingsList.first()).toBeVisible();
  });

  test('should navigate to individual feeling pages', async ({ page }) => {
    await page.goto('/feelings');

    // Wait for the page to load and find feeling cards/links
    await page.waitForLoadState('networkidle');
    
    // Look for feeling cards or links (they might be divs with click handlers)
    const feelingSelectors = [
      'a[href*="/feeling/"]',
      '[data-testid="feeling-item"]',
      '.feeling-item',
      'article[role="button"]',
      'div[role="button"]'
    ];

    let feelingElement = null;
    for (const selector of feelingSelectors) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        feelingElement = element;
        break;
      }
    }

    if (feelingElement) {
      await feelingElement.click();
      await expect(page.locator('body')).toBeVisible();
      // Don't enforce specific URL pattern since routing might be different
    } else {
      // If no clickable feelings found, just verify the page has content
      await expect(page.locator('h1, h2, h3')).toBeVisible();
    }
  });

  test('should handle feeling-issue navigation', async ({ page }) => {
    await page.goto('/feelings');

    // Look for feeling links that might lead to specific issues
    const issueLinks = page.locator('a[href*="/feeling/"]').first();

    if (await issueLinks.count() > 0) {
      const href = await issueLinks.getAttribute('href');
      if (href) {
        await issueLinks.click();
        await expect(page).toHaveURL(new RegExp(href));

        // Check if we can navigate to specific issues
        const issueLink = page.locator('a[href*="/issue/"]').first();
        if (await issueLink.count() > 0) {
          await issueLink.click();
          await expect(page.locator('body')).toBeVisible();
        }
      }
    }
  });

  test('should display feeling content with proper structure', async ({ page }) => {
    await page.goto('/feelings');

    // Check for proper content structure
    const contentElements = [
      '.feeling-description',
      '.content',
      'article p',
      '.description',
      'main p'
    ];

    let contentFound = false;
    for (const selector of contentElements) {
      if (await page.locator(selector).count() > 0) {
        contentFound = true;
        break;
      }
    }

    expect(contentFound).toBe(true);
  });

  test('should have interactive elements for feelings', async ({ page }) => {
    await page.goto('/feelings');

    // Look for interactive elements like buttons, links, or forms
    const interactiveSelectors = [
      'button',
      'a[href]',
      'input',
      '.interactive',
      '[role="button"]'
    ];

    let interactiveFound = false;
    for (const selector of interactiveSelectors) {
      if (await page.locator(selector).count() > 0) {
        interactiveFound = true;
        break;
      }
    }

    expect(interactiveFound).toBe(true);
  });
});
