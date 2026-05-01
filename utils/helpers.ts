import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Authenticates into Actimo using credentials from environment variables.
 * Call this in a beforeEach or as part of a test setup fixture.
 */
export async function authenticate(page: Page): Promise<void> {
  const email = process.env.ACTIMO_EMAIL;
  const password = process.env.ACTIMO_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing credentials. Set ACTIMO_EMAIL and ACTIMO_PASSWORD in your .env file.'
    );
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await dismissCookies(page);
  await loginPage.login(email, password);
  
}

/**
 * Generates a unique message title to avoid collisions between test runs.
 */
export function uniqueTitle(prefix: string): string {
  return `[AUTO] ${prefix} ${Date.now()}`;
}

export async function dismissCookies(page: Page): Promise<void> {
  try {
    const acceptCookie = page.getByRole('button', {name:'Accept All Cookies'})
    await acceptCookie.waitFor({ state: 'visible', timeout: 5_000 });
    await acceptCookie.click();
  } catch {
    // Cookie popup didn't appear, continue normally
  }
}
