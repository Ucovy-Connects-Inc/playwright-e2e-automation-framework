export class CommonUtils {

  static async waitForPageLoad(page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  }

  static async waitForVisible(page, selector) {
    await page.waitForSelector(selector, { state: 'visible' });
  }

  static async waitForHidden(page, selector) {
    await page.waitForSelector(selector, { state: 'hidden' });
  }

  static async scrollToElement(page, selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  static async clickElement(page, selector) {
    await this.waitForVisible(page, selector);
    await page.locator(selector).click();
  }

  static async typeText(page, selector, text) {
    await this.waitForVisible(page, selector);
    await page.locator(selector).fill(text);
  }

  static async waitForText(page, text) {
    await page.waitForSelector(`text=${text}`);
  }

  // Generate random string
  static generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Wait for element to contain given text
  static async waitForElementText(locator, expectedText) {
    await locator.waitFor();
    const actualText = await locator.textContent();
    if (!actualText?.includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}" not found. Got: "${actualText}"`);
    }
  }
}