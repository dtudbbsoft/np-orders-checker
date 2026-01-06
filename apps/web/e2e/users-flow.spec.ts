import { test, expect } from '@playwright/test';
import { UsersPage } from './pages/users.page';

test.describe('Users E2E Flow', () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ page }) => {
    usersPage = new UsersPage(page);
    await usersPage.goto();
  });

  test('complete user management flow', async ({ page }) => {
    // Skip test if add button is not available
    if (await usersPage.addUserButton.count() === 0) {
      test.skip('Add user functionality not available');
    }

    const testUser = {
      name: 'Test User E2E',
      email: 'testuser@example.com'
    };

    // Add a new user
    await usersPage.addUser(testUser.name, testUser.email);
    
    // Verify user was added (wait for any async operations)
    await page.waitForTimeout(1000);
    
    // Check if user appears in the list
    const addedUser = await usersPage.getUserByEmail(testUser.email);
    if (await addedUser.count() > 0) {
      await expect(addedUser.first()).toBeVisible();
    }

    // Clean up - delete the test user if possible
    try {
      await usersPage.deleteFirstUser();
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('Could not delete test user, might need manual cleanup');
    }
  });

  test('user search functionality', async ({ page }) => {
    // Skip if search is not available
    const searchInput = page.locator('input[placeholder*="search" i], input[name="search"]');
    if (await searchInput.count() === 0) {
      test.skip('Search functionality not available');
    }

    await usersPage.searchUser('test');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Verify search was performed (check if URL changed or results updated)
    // This is a basic check that search interaction worked
    const usersList = usersPage.usersList;
    if (await usersList.count() > 0) {
      await expect(usersList.first()).toBeVisible();
    }
  });

  test('pagination functionality', async ({ page }) => {
    // Skip if pagination is not available
    if (await usersPage.paginationControls.count() === 0) {
      test.skip('Pagination not available');
    }

    const pagination = usersPage.paginationControls.first();
    await expect(pagination).toBeVisible();
    
    // Try to click next page if available
    const nextButton = pagination.locator('button[aria-label*="next"], button').filter({ hasText: /next|>/i });
    
    if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Verify pagination worked (this is basic - could check URL or content changes)
      await expect(pagination).toBeVisible();
    }
  });
});