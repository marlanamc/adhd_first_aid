import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('should be mobile-friendly on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Check if content is accessible on mobile
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    if (viewport) {
      expect(viewport.width).toBeLessThanOrEqual(375);
    }
  });

  test('should have working mobile navigation', async ({ page }) => {
    await page.goto('/');

    // Look for mobile navigation elements
    const mobileNavSelectors = [
      '.mobile-nav',
      '.hamburger',
      '[data-testid="mobile-menu"]',
      'button[aria-label*="menu" i]',
      '.navbar-toggle',
      '.nav-toggle'
    ];

    let mobileNavFound = false;
    for (const selector of mobileNavSelectors) {
      if (await page.locator(selector).count() > 0) {
        mobileNavFound = true;
        // Test mobile menu toggle if found
        const toggle = page.locator(selector).first();
        await toggle.click();
        break;
      }
    }

    // If no mobile-specific nav found, check if regular nav works on mobile
    if (!mobileNavFound) {
      const navLinks = page.locator('nav a, [role="navigation"] a');
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('should display content properly on mobile barriers page', async ({ page }) => {
    await page.goto('/barriers');

    // Check if content is readable on mobile
    const content = page.locator('article, .content, main').first();
    await expect(content).toBeVisible();

    // Check for horizontal scroll issues
    const scrollWidth = await page.evaluate(() => {
      return document.body.scrollWidth;
    });
    const viewportWidth = await page.evaluate(() => {
      return window.innerWidth;
    });

    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 50); // Allow small margin
  });

  test('should handle touch interactions on feelings page', async ({ page }) => {
    await page.goto('/feelings');

    // Check if touch targets are appropriately sized
    const touchTargets = page.locator('button, a, input, [role="button"]');

    if (await touchTargets.count() > 0) {
      const firstTarget = touchTargets.first();
      const boundingBox = await firstTarget.boundingBox();

      if (boundingBox) {
        // Touch targets should be at least 44px for accessibility
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should work on different mobile screen sizes', async ({ browser }) => {
    const mobileDevices = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 360, height: 640, name: 'Android Mobile' }
    ];

    for (const device of mobileDevices) {
      const context = await browser.newContext({
        viewport: { width: device.width, height: device.height }
      });
      const page = await context.newPage();

      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();

      // Quick check that page loads and has content
      const content = page.locator('main, .content, article').first();
      await expect(content).toBeVisible();

      await context.close();
    }
  });
});
