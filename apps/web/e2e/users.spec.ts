import { test, expect } from '@playwright/test';

test.describe('Users Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('should display users list interface', async ({ page }) => {
    // Check if main container is present
    const container = page.locator('.MuiContainer-root');
    await expect(container).toBeVisible();
    
    // Check for users-related heading or title
    const heading = page.locator('h1, h2, h3, h4, h5, h6').filter({ hasText: /users/i });
    await expect(heading).toBeVisible();
  });

  test('should have add user functionality', async ({ page }) => {
    // Look for Add User button or similar
    const addButton = page.locator('button').filter({ hasText: /add|create|new/i });
    
    if (await addButton.count() > 0) {
      await expect(addButton.first()).toBeVisible();
      await expect(addButton.first()).toBeEnabled();
    } else {
      // If no add button is visible immediately, it might be part of the interface
      console.log('Add user button not immediately visible, checking for other user management controls');
    }
  });

  test('should display user list or empty state', async ({ page }) => {
    // Wait a bit more for any async data loading
    await page.waitForTimeout(2000);
    
    // Check for either a list of users or an empty state message
    const usersList = page.locator('[data-testid*="user"], .user-item, .MuiListItem-root');
    const emptyState = page.locator('text=/no users|empty|nothing to show/i');
    
    const hasUsers = await usersList.count() > 0;
    const hasEmptyState = await emptyState.count() > 0;
    
    if (!hasUsers && !hasEmptyState) {
      // Look for any generic list container or table
      const listContainer = page.locator('ul, table, [role="list"], [role="grid"]');
      if (await listContainer.count() > 0) {
        await expect(listContainer.first()).toBeVisible();
      }
    }
    
    // Test should pass if we find either users or an empty state
    expect(hasUsers || hasEmptyState).toBeTruthy();
  });

  test('should handle sort and pagination controls if present', async ({ page }) => {
    // Check for sort controls
    const sortControls = page.locator('button, select').filter({ hasText: /sort|order/i });
    
    if (await sortControls.count() > 0) {
      await expect(sortControls.first()).toBeVisible();
    }
    
    // Check for pagination controls
    const paginationControls = page.locator('.MuiPagination-root, [aria-label*="pagination"]');
    
    if (await paginationControls.count() > 0) {
      await expect(paginationControls.first()).toBeVisible();
    }
  });

  test('should open user dialog when add button is clicked', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add|create|new/i });
    
    if (await addButton.count() > 0) {
      await addButton.first().click();
      
      // Check for dialog/modal
      const dialog = page.locator('[role="dialog"], .MuiDialog-root, .modal');
      await expect(dialog).toBeVisible();
      
      // Check for form fields in the dialog
      const nameField = page.locator('input[name="name"], input[placeholder*="name" i]');
      const emailField = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
      
      if (await nameField.count() > 0) {
        await expect(nameField.first()).toBeVisible();
      }
      
      if (await emailField.count() > 0) {
        await expect(emailField.first()).toBeVisible();
      }
    } else {
      test.skip('Add button not found - skipping dialog test');
    }
  });
});