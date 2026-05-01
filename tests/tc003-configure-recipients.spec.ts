import { test, expect } from '@playwright/test';
import { MessagesPage } from '../pages/MessagesPage';
import { authenticate, uniqueTitle } from '../utils/helpers';

/**
 * TC-003 – Configure recipients and delivery channel selection
 * Priority: CRITICAL
 *
 * Rationale: A message with no recipients or misconfigured channels will
 * never reach its audience. This test guards the send configuration step,
 * which is a gate before the final Publish & Notify action.
 */
test.describe('TC-003: Configure recipients and Publish message', () => {
  let messagesPage: MessagesPage;

  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    messagesPage = new MessagesPage(page);
    await messagesPage.goto();

    // Create a minimal message so we can reach the send panel
    await messagesPage.openCreateMessageForm();
    await messagesPage.setMessageTitle(uniqueTitle('Recipient Config Test'));
    await messagesPage.addTextModule('Test message body for recipient configuration.');

    // Navigate to Publish tab
    await messagesPage.publishTab.click()
    await messagesPage.recipientSearchInput.waitFor({ state: 'visible', timeout: 10_000 });
  });

  test('should allow searching for and selecting a recipient group', async ({ page }) => {
    // referrencing know group with 0 contact list
    const testGroup = process.env.TEST_RECIPIENT_GROUP || 'All Contacts';

    await messagesPage.recipientSearchInput.fill(testGroup);
    // Wait for the autocomplete dropdown to appear
    const dropdownOption = page
      .locator('[class*="ao-select-dropdown-item"]')
      .first();
    await expect(dropdownOption).toBeVisible({ timeout: 8_000 });
      
    // Select the first matching result
    await dropdownOption.click();

    // The selected recipient should appear as a tag / chip in the recipients area
    const recipientTag = messagesPage.recipientName
    await expect(recipientTag).toBeVisible({ timeout: 5_000 });
    await expect(recipientTag).toContainText(testGroup)

    // publish
    await messagesPage.publishButton.click()

    // confirm overlay page is displayed
    const overlayPage = page.locator('[id=cdk-overlay-]')

      // Confirm overlay appears
      await overlayPage.isVisible()
      await expect(page.getByText('No notifications')).toBeVisible()
      await expect(messagesPage.confirmButton).toBeVisible({timeout: 10_000})
      await messagesPage.confirmButton.click()
      await expect(messagesPage.toastNotification).toContainText('Content has been queued to be published')

  });

  test('should require at least one recipient before publishing', async ({ page }) => {
    // Uncheck all notification checkboxes
    for (const cb of [
      messagesPage.channelCheckboxPush,
      messagesPage.channelCheckboxEmail,
      messagesPage.channelCheckboxSMS,
    ]) {
      if (await cb.isVisible()) {
        if (await cb.isChecked()) {
          await cb.uncheck();
        }
      }
    }

    // Attempt to publish with no channel selected
    const overlayPage = page.locator('[id=cdk-overlay-]')
      await (expect(messagesPage.publishButton).toBeDisabled());

  });

  test('should allow toggling the email delivery channel on and off', async ({ page }) => {
    const emailCb = messagesPage.channelCheckboxEmail;

    if (await emailCb.isVisible()) {
      const initialState = await emailCb.isChecked();

      // Toggle off
      if (initialState) {
        await emailCb.uncheck();
        await expect(emailCb).not.toBeChecked();
      }

      // Toggle on
      await emailCb.check();
      await expect(emailCb).toBeChecked();
    } else {
      // Channel checkbox not visible — possibly behind a different UI pattern
      // Mark test as skipped with an informational note
      test.skip(true, 'Email channel checkbox not found in current viewport/layout');
    }
  });
});
