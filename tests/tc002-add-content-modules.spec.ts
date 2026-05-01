import { test, expect } from '@playwright/test';
import { MessagesPage } from '../pages/MessagesPage';
import { authenticate, uniqueTitle } from '../utils/helpers';

/**
 * TC-002 – Add and configure multiple content modules (text + button)
 * Priority: HIGH
 *
 * Rationale: Content modules are the core building blocks of any Actimo message.
 * Verifies that multiple module types can be added to a single message and
 * that the editor correctly reflects each added module.
 */
test.describe('TC-002: Add content modules to a message', () => {
  let messagesPage: MessagesPage;

  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    messagesPage = new MessagesPage(page);
    await messagesPage.goto();
    await messagesPage.openCreateMessageForm();
    await messagesPage.setMessageTitle(uniqueTitle('TC02'));
  });

  test('should allow adding a text module and display its content', async ({ page }) => {
    const content = 'TC02 - Add Text Module!';
    await messagesPage.addTextModule(content);

    // Verify the text module is visible and contains the typed content
    await expect(messagesPage.textModulePreview).toBeVisible();
    await expect(messagesPage.insertStatus).toHaveText('saved')
    await expect(messagesPage.textModulePreview).toContainText(content);
  });

  test('Should allow adding a button module after a text module', async ({ page }) => {
    const content = 'TC02 - Insert multiple module';
    const buttonTitle = 'Best Day!'

    // Add a text module first
    await messagesPage.addTextModule(content);

    // Add a button module long
    await messagesPage.addButtonModuleButton.click();

    // The button module editor / config panel should appear
    const buttonModulePanel = page.locator('ao-card.ao-modal__wrapper');
    await expect(buttonModulePanel).toBeVisible({ timeout: 8_000 });
    await expect(messagesPage.insertStatus).toHaveText('saved',{ timeout: 8_000 })

    // The page should contain two distinct module blocks
    const moduleBlocks = page.locator('ao-content-card.admin-content-card');
    await expect(moduleBlocks).toHaveCount(2, { timeout: 5_000 });

    // Add button text then save
    await page.getByPlaceholder('Download this file').fill(buttonTitle);
    await messagesPage.saveButton.click()

    // Verify button insterted is visible
    const insertButton = messagesPage.buttonModulePreview
    await expect(insertButton).toBeVisible({timeout: 8_000})
    await expect(insertButton).toHaveText(buttonTitle)
    await expect(messagesPage.insertStatus).toHaveText('saved')
  
  });

  test(' Inserted modules content should persist after switching to the another tab and back', async ({page,}) => {
    const savedContent = 'This text should survive tab navigation.';
    const buttonMessage = 'Run'
    await messagesPage.addTextModule(savedContent);
    await messagesPage.insertButtonModule(buttonMessage)
    
    // Navigate to Publish Tab
    await messagesPage.publishTab.click();
    await page.waitForTimeout(1_000); // Allow any auto-save to complete

    // Navigate back to the Design Tab
    await messagesPage.designTab.click();

    // Content should still be present
    await expect(messagesPage.textModulePreview).toContainText(savedContent);
    await expect(messagesPage.buttonModulePreview).toHaveText(buttonMessage)
  });
});
