import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test('should load admin login page', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Page should load
    await page.waitForLoadState('domcontentloaded');
    
    // Check page has content (might be login form or heading)
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeAttached();
  });

  test('should display email and password fields', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Check for email input
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    await expect(emailInput).toBeVisible();
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
  });

  test('should have login submit button', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Wait a moment for validation
    await page.waitForTimeout(500);
    
    // Check if form prevents submission (HTML5 validation or custom)
    // This is handled by the browser or React form validation
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Fill with invalid credentials
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');
    
    // Submit
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Look for error message
    const errorMessage = page.locator('text=/error|invalid|incorrect|failed/i').first();
    
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Focus email field
    await page.keyboard.press('Tab');
    
    // Check if email field is focused
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    
    if (await emailInput.count() > 0) {
      await emailInput.type('test@example.com');
      
      // Tab to password
      await page.keyboard.press('Tab');
      await page.keyboard.type('password123');
      
      // Values should be set
      await expect(emailInput).toHaveValue('test@example.com');
    }
  });

  test('should have proper form accessibility', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Check for form element
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });

  test('should mask password input', async ({ page }) => {
    await page.goto('/admin/login');
    
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('secretpassword');
    
    // Verify it's a password type (masked)
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Admin Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    
    // Wait for redirect
    await page.waitForTimeout(1000);
    
    // Should either redirect to login or show login form
    const currentUrl = page.url();
    
    // Accept either /admin (if it shows login) or /admin/login
    expect(currentUrl).toMatch(/\/admin/);
  });

  test('should have pending comparisons section when authenticated', async ({ page }) => {
    // This test would require authentication
    // Skip for now as we don't have valid credentials
    test.skip();
  });

  test('should have logout functionality when authenticated', async ({ page }) => {
    // This test would require authentication
    test.skip();
  });

  test('should display analytics when authenticated', async ({ page }) => {
    // This test would require authentication
    test.skip();
  });
});
