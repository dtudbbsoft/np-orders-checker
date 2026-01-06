import { Page } from '@playwright/test';

/**
 * Page Object Model for Users page
 */
export class UsersPage {
  constructor(private page: Page) {}

  // Locators
  get addUserButton() {
    return this.page.locator('button').filter({ hasText: /add|create|new/i });
  }

  get userDialog() {
    return this.page.locator('[role="dialog"], .MuiDialog-root');
  }

  get usersList() {
    return this.page.locator('[data-testid*="user"], .user-item, .MuiListItem-root');
  }

  get sortControls() {
    return this.page.locator('button, select').filter({ hasText: /sort|order/i });
  }

  get paginationControls() {
    return this.page.locator('.MuiPagination-root, [aria-label*="pagination"]');
  }

  get deleteConfirmDialog() {
    return this.page.locator('[role="dialog"]').filter({ hasText: /delete|confirm|remove/i });
  }

  // Form fields
  get nameInput() {
    return this.page.locator('input[name="name"], input[placeholder*="name" i]');
  }

  get emailInput() {
    return this.page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
  }

  get saveButton() {
    return this.page.locator('button').filter({ hasText: /save|create|add|submit/i });
  }

  get cancelButton() {
    return this.page.locator('button').filter({ hasText: /cancel|close/i });
  }

  // Actions
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async addUser(name: string, email: string) {
    await this.addUserButton.first().click();
    await this.nameInput.first().fill(name);
    await this.emailInput.first().fill(email);
    await this.saveButton.first().click();
  }

  async deleteFirstUser() {
    const firstUser = this.usersList.first();
    const deleteButton = firstUser.locator('button').filter({ hasText: /delete|remove/i });
    
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      
      // Confirm deletion if dialog appears
      if (await this.deleteConfirmDialog.count() > 0) {
        const confirmButton = this.deleteConfirmDialog.locator('button').filter({ hasText: /delete|confirm|yes/i });
        await confirmButton.click();
      }
    }
  }

  async searchUser(query: string) {
    const searchInput = this.page.locator('input[placeholder*="search" i], input[name="search"]');
    if (await searchInput.count() > 0) {
      await searchInput.first().fill(query);
    }
  }

  async getUserByEmail(email: string) {
    return this.page.locator('[data-testid*="user"], .user-item').filter({ hasText: email });
  }
}