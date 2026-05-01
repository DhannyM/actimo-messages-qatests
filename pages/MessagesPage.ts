import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Actimo Messages section.
 * Covers: listing, creation, module addition, recipient config, and publish flow.
 */
export class MessagesPage {
  readonly page: Page;

  // Messages Navigation
  readonly messagesNavLink: Locator;

  // Message list / header actions
  readonly createMessageButton: Locator;

  // Message editor – title
  readonly designTab: Locator;
  readonly publishTab: Locator;
  readonly analyticsTab: Locator;
  readonly messageTitleInput: Locator;

  // Module Element Preview
  readonly textModulePreview: Locator;
  readonly buttonModulePreview: Locator;
  readonly insertStatus: Locator

  // Content modules toolbar
  readonly addTextModuleButton: Locator;
  readonly addImageModuleButton: Locator;
  readonly addButtonModuleButton: Locator;

  // Text module
  readonly textModuleEditor: Locator;

  // publish / recipient panel
  readonly sendTestButton: Locator;
  readonly recipientSearchInput: Locator;
  readonly recipientName: Locator;
  readonly channelCheckboxPush: Locator;
  readonly channelCheckboxEmail: Locator;
  readonly channelCheckboxSMS: Locator;
  readonly publishButton: Locator;

  // Analytics / delivery
  readonly analyticsOpenedCount: Locator;
  readonly analyticsDeliveredCount: Locator;

  // Misc
  // readonly saveIndicator: Locator;
  readonly saveButton: Locator;
  readonly toastNotification: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.designTab = page
      . getByRole('link', { name: 'Design' });
    this.publishTab = page
      . getByRole('link', { name: 'Publish' });
    this.analyticsTab = page
      . getByRole('link', { name: 'Analytics' });

    this.messagesNavLink = page
      .getByRole('link', { name: /messages/i })
      .or(page.locator('a[href*="messages"]'))
      .first();

    this.createMessageButton = page
      .getByRole('button', { name: /create message/i });

    this.messageTitleInput = page
      .locator('ao-editable-label div')
      .first();

    this.insertStatus = page
      .locator('div.ao-admin-header__save-state')

    this.textModulePreview = page
      .locator('ao-module-text-composer-preview.ng-star-inserted')

    this.buttonModulePreview = page
      .locator('ao-module-buttongroup-composer-preview.ng-star-inserted')
    this.textModuleEditor = page
      .locator('#module-scroll-id-0 ao-module-text-composer-preview p')
      .first();

    // Module add buttons – Actimo uses a toolbar or a "+" panel
    this.addTextModuleButton = page
      .getByRole('button', { name: /text/i })
      .first();

    this.addImageModuleButton = page
      .getByRole('button', { name: /image/i })
      .first();

    this.addButtonModuleButton = page
      .getByRole('button', { name: /^button$/i })
      .first();

    this.textModuleEditor = page.frameLocator('iframe.tox-edit-area__iframe')
      .locator('body#tinymce');

    this.recipientSearchInput = page
      .getByPlaceholder(/search for groups|contacts/i)
      .first();
    
    this.recipientName = page
      .locator('div.ao-recipient__recipient-name');

    this.channelCheckboxPush = page.getByText(/Via push notification/);
    this.channelCheckboxSMS = page.getByText(/Via SMS/);
    this.channelCheckboxEmail = page.getByText(/Via email/);

    this.sendTestButton = page
      .getByRole('button', { name: /send a test/i })
      .first();

    this.publishButton = page.getByRole('button', {
      name: /publish/i,
    });

    this.analyticsOpenedCount = page
      .locator('[data-testid="analytics-opened"], [class*="opened-count"]')
      .first();

    this.analyticsDeliveredCount = page
      .locator('[data-testid="analytics-delivered"], [class*="delivered-count"]')
      .first();

    this.saveButton = page
    // .getByRole('button', {name: /save/})
      .locator('ao-modal button[type="submit"]')
      .first();

    this.toastNotification = page
      .locator('ao-admin-toast')
      .first();

    this.confirmButton = page
    .getByRole('button', {name: /confirm/i})
  }

  async goto(): Promise<void> {
    await this.messagesNavLink.click();
    await this.page.waitForURL(/messages/, { timeout: 10_000 });
  }

  async goToPublish(): Promise<void> {
  await this.publishTab.click();
  await this.page.waitForURL(/publish/, { timeout: 10_000 });
}

  async openCreateMessageForm(): Promise<void> {
    await this.createMessageButton.click();
    // Wait for the editor to be visible
    await this.page.waitForURL(/.*editor\/messages/)

  }

  async setMessageTitle(title: string): Promise<void> {
    await this.messageTitleInput.click({clickCount: 3})
    await this.page.keyboard.type(title);
    await this.page.keyboard.press('Tab')
  }

  /**
   * Adds a text module and types content into it.
   */
  async addTextModule(content: string): Promise<void> {
    await this.addTextModuleButton.click();
    const editor = this.page.frameLocator('iframe.tox-edit-area__iframe').locator('body#tinymce');
    await editor.waitFor({ state: 'visible' });
    await editor.click();
    await editor.fill(content);
    await this.saveButton.click();
  }

  async insertButtonModule(content:string): Promise<void>{
    await this.addButtonModuleButton.click()
    const buttonModulePanel = this.page.locator('ao-card.ao-modal__wrapper');
    await expect(buttonModulePanel).toBeVisible();
    await this.page.getByPlaceholder('Download this file').fill(content);
    await this.saveButton.click();
  }

  /**
   * Selects a notification options checkbox if not already checked.
   */
  async selectChannel(channel: 'push' | 'email' | 'sms'): Promise<void> {
    const checkboxMap = {
      push: this.channelCheckboxPush,
      email: this.channelCheckboxEmail,
      sms: this.channelCheckboxSMS,
    };
    const cb = checkboxMap[channel];
    if (!(await cb.isChecked())) {
      await cb.check();
    }
  }

  async publishMessage(): Promise<void> {
    await this.publishButton.click();
    // Wait for redirect to analytics page
    await this.page.waitForURL(/analytics|messages/, { timeout: 15_000 });
  }
}
