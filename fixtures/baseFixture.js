import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { TestDataReader } from "../utils/TestDataReader.js";

/**
 * @typedef {Object} BaseFixture
 * @property {LoginPage} loginPage
 * @property {import('@playwright/test').BrowserContext} authenticatedContext
 * @property {import('@playwright/test').Page} authenticatedPage
 * @property {Record<string, any>} testData
 */

export const baseBest = base.extend({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await page.goto('/');
    
    // Simple CAPTCHA bypass for test environment
    try {
      // Check if CAPTCHA is present
      const captchaSelectors = ['[data-testid="captcha"]', '.captcha', '#captcha', '.g-recaptcha', '.h-captcha'];
      let captchaFound = false;
      
      for (const selector of captchaSelectors) {
        try {
          if (await page.locator(selector).isVisible({ timeout: 2000 })) {
            captchaFound = true;
            console.log('CAPTCHA detected, attempting bypass...');
            break;
          }
        } catch (e) {
          // Continue checking
        }
      }
      
      if (captchaFound) {
        // Try to add test bypass cookie
        await page.context().addCookies([
          {
            name: 'bypass_captcha',
            value: 'automation',
            domain: new URL(page.url()).hostname,
            path: '/'
          }
        ]);
        
        // Reload page to apply bypass
        await page.reload({ waitUntil: 'networkidle' });
        console.log('✅ CAPTCHA bypass attempted');
      }
    } catch (error) {
      console.warn('CAPTCHA handling warning:', error.message);
    }
    
    await use(page); // provide the page to tests
  },

  testData: async ({ }, use, testInfo) => {
    const reader = new TestDataReader(testInfo.file, "data");
    await use(reader.testData);
  }
});