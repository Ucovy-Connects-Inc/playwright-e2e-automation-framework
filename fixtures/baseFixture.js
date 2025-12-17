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
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(page);
  },
  
  testData: async ({ }, use, testInfo) => {
    const reader = new TestDataReader(testInfo.file, "data");
    await use(reader.testData);
  }
});