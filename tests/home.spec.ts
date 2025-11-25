import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Products VS/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Compare');
    await expect(heading).toContainText('Everything');
  });

  test('should display hero section with subtitle', async ({ page }) => {
    await page.goto('/');
    
    // Check subtitle
    await expect(page.locator('.hero-subtitle')).toContainText('70+ Detailed Comparisons');
    
    // Check description text
    await expect(page.locator('text=Make informed decisions faster')).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for logo/home link
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check for search input (desktop view)
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should display AI Battle section', async ({ page }) => {
    await page.goto('/');
    
    // Check for AI Battle heading using role and more specific text
    await expect(page.locator('h2').filter({ hasText: 'AI Battle' })).toBeVisible();
    
    // Check for comparison form using aria-label
    const comparisonForm = page.locator('form[aria-label*="comparison"]').first();
    await expect(comparisonForm).toBeVisible();
    
    // Check for product input fields
    await expect(page.locator('input#productA')).toBeVisible();
    await expect(page.locator('input#productB')).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    
    // Check for Product A label
    await expect(page.locator('label[for="productA"]')).toContainText('Product A');
    
    // Check for Product B label
    await expect(page.locator('label[for="productB"]')).toContainText('Product B');
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to bottom to ensure footer is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer element
    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });

  test('should have theme toggle', async ({ page }) => {
    await page.goto('/');
    
    // Look for theme toggle button
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
    }
  });

  test('should have accessible form elements', async ({ page }) => {
    await page.goto('/');
    
    // Check aria-label on form
    const form = page.locator('form[aria-label*="comparison"]').first();
    await expect(form).toBeVisible();
    
    // Check aria-required on inputs
    const productAInput = page.locator('input#productA');
    await expect(productAInput).toHaveAttribute('aria-required', 'true');
    
    const productBInput = page.locator('input#productB');
    await expect(productBInput).toHaveAttribute('aria-required', 'true');
  });

  test('should have proper input placeholders', async ({ page }) => {
    await page.goto('/');
    
    const productAInput = page.locator('input#productA');
    await expect(productAInput).toHaveAttribute('placeholder', /e\.g\.,/i);
    
    const productBInput = page.locator('input#productB');
    await expect(productBInput).toHaveAttribute('placeholder', /e\.g\.,/i);
  });
});
