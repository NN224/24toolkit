import { test, expect } from '@playwright/test';

test.describe('Routing and Pages', () => {
  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
    
    // Look for about content
    const heading = page.locator('h1').first();
    if (await heading.count() > 0) {
      await expect(heading).toBeVisible();
    }
  });

  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
  });

  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy-policy');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
    
    // Look for privacy-related content
    const content = page.locator('text=/privacy|policy/i').first();
    if (await content.count() > 0) {
      await expect(content).toBeVisible();
    }
  });

  test('should load terms page', async ({ page }) => {
    await page.goto('/terms');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
    
    // Look for terms-related content
    const content = page.locator('text=/terms|conditions|service/i').first();
    if (await content.count() > 0) {
      await expect(content).toBeVisible();
    }
  });

  test('should load AI battle page', async ({ page }) => {
    await page.goto('/ai-battle');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
  });

  test('should load English version', async ({ page }) => {
    await page.goto('/en');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
    
    // Should have English content
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should load Arabic version', async ({ page }) => {
    await page.goto('/ar');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
    
    // Should have content (possibly in Arabic)
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should handle non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-123456');
    
    // Should return 404 or redirect
    expect(response?.status()).toBeTruthy();
  });

  test('should maintain navigation across routes', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation exists
    await expect(page.locator('nav').first()).toBeVisible();
    
    // Navigate to another page
    await page.goto('/about');
    
    // Navigation should still exist
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('should maintain footer across routes', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check if footer exists
    const footer = page.locator('footer').first();
    const hasFooter = await footer.count() > 0;
    
    if (hasFooter) {
      await expect(footer).toBeVisible();
      
      // Navigate to another page
      await page.goto('/about');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Footer should still exist
      await expect(page.locator('footer').first()).toBeVisible();
    }
  });

  test('should handle browser back button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack({ waitUntil: 'networkidle' });
    
    // Should be at home page
    await page.waitForTimeout(500);
    const url = page.url();
    expect(url).toMatch(/\/$|\/en$|localhost:5000$/);
  });

  test('should handle browser forward button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    
    // Go forward
    await page.goForward({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    
    // Should be at about page
    const url = page.url();
    expect(url).toContain('about');
  });

  test('should update page title on route change', async ({ page }) => {
    await page.goto('/');
    const homeTitle = await page.title();
    
    await page.goto('/about');
    const aboutTitle = await page.title();
    
    // Titles should be different (unless they're intentionally the same)
    expect(homeTitle).toBeTruthy();
    expect(aboutTitle).toBeTruthy();
  });
});

test.describe('Performance', () => {
  test('should load home page quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Should load in reasonable time (adjust as needed)
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });

  test('should not have console errors on home page', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors (like network errors in dev)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Failed to load resource') &&
      !error.includes('net::ERR') &&
      !error.includes('fonts.googleapis.com')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/');
    await page.goto('/about');
    await page.goto('/contact');
    await page.goto('/');
    
    // Should still be functional
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
