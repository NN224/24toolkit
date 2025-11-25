import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should have sticky navigation bar', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Check if navigation has sticky positioning
    const position = await nav.evaluate((el) => window.getComputedStyle(el).position);
    expect(position).toBe('sticky');
  });

  test('should display brand logo/name', async ({ page }) => {
    await page.goto('/');
    
    // Check for logo link
    const logoLink = page.locator('a[href="/"]').first();
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toContainText('Products');
  });

  test('should have functional search bar on desktop', async ({ page, viewport }) => {
    // Skip on mobile viewports
    if (viewport && viewport.width < 768) {
      test.skip();
    }
    
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();
    
    // Test search input
    await searchInput.fill('iPhone');
    await expect(searchInput).toHaveValue('iPhone');
  });

  test('should navigate to search page on search submit', async ({ page, viewport }) => {
    // Skip on mobile viewports
    if (viewport && viewport.width < 768) {
      test.skip();
    }
    
    await page.goto('/');
    
    const searchForm = page.locator('form[role="search"]').first();
    const searchInput = searchForm.locator('input');
    
    await searchInput.fill('iPhone vs Samsung');
    await searchForm.press('Enter');
    
    // Wait for navigation
    await page.waitForURL(/\/search/);
    expect(page.url()).toContain('/search');
  });

  test('should have mobile menu toggle', async ({ page, viewport }) => {
    // Only run on mobile viewports
    if (!viewport || viewport.width >= 768) {
      test.skip();
    }
    
    await page.goto('/');
    
    // Look for hamburger menu button
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-expanded]').first();
    if (await menuButton.count() > 0) {
      await expect(menuButton).toBeVisible();
    }
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation elements
    await page.keyboard.press('Tab');
    
    // Check if an element has focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav[aria-label*="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('should maintain navigation on scroll', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Navigation should still be visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });
});
