import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Actimo Login page.
 * Encapsulates all selectors and actions related to authentication.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#account-login-email');
    this.passwordInput = page.locator('#account-login-password');
    this.loginButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.locator('#account-login-failed');
  }

  async goto(): Promise<void> {
    await this.page.goto('admin/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Wait for navigation away from login page
    await this.page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 15_000 });
  }
}
