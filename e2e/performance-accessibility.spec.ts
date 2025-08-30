import { test, expect } from '@playwright/test';

test.describe('Performance and Accessibility', () => {
  test('should load pages within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check if page has loaded essential content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();

    // Should have exactly one h1
    expect(h1Count).toBe(1);

    // Should have some h2s for structure
    if (h2Count > 0) {
      // Check that h2s come after h1 in the DOM
      const h1Position = await page.locator('h1').first().evaluate(el => {
        return Array.from(el.parentElement?.children || []).indexOf(el);
      });

      const firstH2 = await page.locator('h2').first();
      if (await firstH2.count() > 0) {
        const h2Position = await firstH2.evaluate(el => {
          return Array.from(el.parentElement?.children || []).indexOf(el);
        });

        expect(h2Position).toBeGreaterThan(h1Position);
      }
    }
  });

  test('should have accessible images', async ({ page }) => {
    await page.goto('/');

    // Check images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy(); // Alt should exist and not be empty
      }
    }
  });

  test('should have accessible links', async ({ page }) => {
    await page.goto('/');

    // Check links have proper text or aria-labels
    const links = page.locator('a');
    const linkCount = await links.count();

    if (linkCount > 0) {
      for (let i = 0; i < Math.min(linkCount, 10); i++) { // Check first 10 links
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');

        // Link should have either text content or aria-label
        expect(text?.trim() || ariaLabel?.trim()).toBeTruthy();
      }
    }
  });

  test('should have proper form accessibility', async ({ page }) => {
    await page.goto('/');

    // Check for forms and their accessibility
    const forms = page.locator('form');
    const formCount = await forms.count();

    if (formCount > 0) {
      for (let i = 0; i < formCount; i++) {
        const form = forms.nth(i);

        // Check for proper labels
        const inputs = form.locator('input, select, textarea');
        const inputCount = await inputs.count();

        for (let j = 0; j < inputCount; j++) {
          const input = inputs.nth(j);
          const inputId = await input.getAttribute('id');
          const inputName = await input.getAttribute('name');
          const inputType = await input.getAttribute('type');

          if (inputType !== 'submit' && inputType !== 'button' && inputType !== 'hidden') {
            // Should have either label, aria-label, or aria-labelledby
            const label = form.locator(`label[for="${inputId}"], label[for="${inputName}"]`);
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledBy = await input.getAttribute('aria-labelledby');

            const hasLabel = (await label.count() > 0) || ariaLabel || ariaLabelledBy;
            expect(hasLabel).toBe(true);
          }
        }
      }
    }
  });

  test('should handle JavaScript disabled gracefully', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false
    });
    const page = await context.newPage();

    await page.goto('/');

    // Should still load basic content
    await expect(page.locator('body')).toBeVisible();

    // Should have some text content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(100);

    await context.close();
  });

  test('should have reasonable page size', async ({ page }) => {
    const requests: string[] = [];

    page.on('request', request => {
      requests.push(request.url());
    });

    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check total requests (shouldn't be excessive)
    expect(requests.length).toBeLessThan(50); // Reasonable limit

    // Check for large resources
    const responses = await Promise.all(
      requests.map(async url => {
        try {
          const response = await page.request.get(url);
          const headers = response.headers();
          return {
            url,
            size: parseInt(headers['content-length'] || '0')
          };
        } catch {
          return { url, size: 0 };
        }
      })
    );

    // Warn about very large resources (> 2MB)
    const largeResources = responses.filter(r => r.size > 2 * 1024 * 1024);
    if (largeResources.length > 0) {
      console.warn('Large resources found:', largeResources);
    }
  });
});
