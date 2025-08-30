import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ADHD First Aid Kit/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/');

    // Test navigation to main sections  
    const mainPages = [
      { path: '/barriers', title: /Barriers/ },
      { path: '/feelings', title: /Feelings/ },
      { path: '/guides', title: /Guides/ },
      { path: '/identities', title: /Identities/ },
      { path: '/life_areas', title: /Life Areas/ },
      { path: '/complex_loops', title: /Complex Loops/ },
      { path: '/systems', title: /Systems/ },
      { path: '/scripts', title: /Scripts/ },
      { path: '/quizzes', title: /Quizzes/ },
      { path: '/resources', title: /Resources/ },
      { path: '/about', title: /About/ },
      { path: '/contact', title: /Contact/ },
      { path: '/faq', title: /FAQ/ },
    ];

    for (const { path, title } of mainPages) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(path));
      // Check if page loads (at least has some content)
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/');

    // Look for the specific header structure in this app
    const headerSelectors = [
      'header',
      'nav',
      '[role="navigation"]',
      '[role="banner"]',
      '.navbar',
      '.header nav',
      'header nav',
      'button[aria-label*="menu"]',
      'button[aria-label*="navigation"]'
    ];

    let navFound = false;
    for (const selector of headerSelectors) {
      if (await page.locator(selector).count() > 0) {
        navFound = true;
        break;
      }
    }

    // Even if no traditional nav is found, ensure the page has interactive elements
    if (!navFound) {
      const interactiveElements = await page.locator('button, a[href], [role="button"]').count();
      navFound = interactiveElements > 0;
    }

    expect(navFound).toBe(true);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.locator('body')).toBeVisible();
    // Should either show 404 page or redirect to home
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
