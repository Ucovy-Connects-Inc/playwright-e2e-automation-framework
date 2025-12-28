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
   // Use the configured baseURL from playwright.config.js instead of hardcoded paths
   await page.goto('/');
   await use(page); // provide the page to tests
 },
 loginPage: async ({ page }, use) => {
   const loginPage = new LoginPage(page);
   await use(loginPage);
 },
 testData: async ({ }, use, testInfo) => {
   const reader = new TestDataReader(testInfo.file, "data");
   await use(reader.testData);
 }
});