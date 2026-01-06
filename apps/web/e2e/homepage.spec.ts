import { test, expect } from '@playwright/test';

test.describe('Homepage Authentication Flow', () => {
  test('should redirect to login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('should display login page content', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login page elements
    await expect(page.locator('h1')).toContainText('Welcome');
    await expect(page.locator('button')).toContainText(/sign in with google/i);
  });

  test('should redirect to Google OAuth when sign in clicked', async ({ page }) => {
    await page.goto('/login');
    
    const signInButton = page.locator('button').filter({ hasText: /sign in with google/i });
    await expect(signInButton).toBeVisible();
    
    // Listen for navigation to Google (in a popup)
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      signInButton.click()
    ]);
    
    // Should redirect to Google OAuth
    await expect(popup.url()).toContain('accounts.google.com');
    await popup.close();
  });

  test('should show loading state appropriately', async ({ page }) => {
    await page.goto('/');
    
    // Check that loading states are handled properly
    // The page should either show loading or redirect to login
    const loadingElement = page.locator('[role="status"]');
    const hasLoading = await loadingElement.count() > 0;
    
    if (hasLoading) {
      await expect(loadingElement.first()).toBeVisible();
    }
    
    // Eventually should end up on login page
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });
});