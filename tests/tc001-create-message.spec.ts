import { test, expect } from '@playwright/test';
import { MessagesPage } from '../pages/MessagesPage';
import { authenticate, uniqueTitle } from '../utils/helpers';

/**
 * TC-001 – Create a new message with a title and text module
 * Priority: CRITICAL
 *
 * Rationale: Core creation flow; if a user cannot create and save a message,
 * all downstream features (sending, analytics) are unreachable.
 */
test.describe('TC-001: Create a new message', () => {
  let messagesPage: MessagesPage;

  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    messagesPage = new MessagesPage(page);
    await messagesPage.goto();
  });

  test('should allow a user to create a message with a title and text module', async ({ page }) => {
    const title = uniqueTitle('Test Message');
    const content = 'This is an automated test message. Please Ignore!';

    // Step 1: Open the create message form
    await messagesPage.openCreateMessageForm();

    // Step 2: Enter a message title
    await messagesPage.setMessageTitle(title);
    await expect(messagesPage.messageTitleInput).toContainText(title);

    // Step 3: Add a text content module
    await messagesPage.addTextModule(content);
    await expect(messagesPage.insertStatus).toHaveText('saved')
    await expect(messagesPage.textModulePreview).toContainText(content);

  });

  test('should not allow publishing a message with default title - BUG', async ({ page }) => {
  await messagesPage.openCreateMessageForm();

  // Clear the default title
  await messagesPage.messageTitleInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');

  // EXPECTED: validation error preventing null message name
  // ACTUAL: message is created with blank/null title - potential bug
  const validationError = page.locator('[class*="error"], [role="alert"]');
  await expect(validationError).toBeVisible({ timeout: 5_000 });
  })

});
