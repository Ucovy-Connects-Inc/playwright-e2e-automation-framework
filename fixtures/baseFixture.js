// Overall: Base Playwright fixture setup shared across the test suite.
// - Creates an authenticated browser context and page, navigates using environment-driven base URLs.
// - Exposes pre-navigated LoginPage, authenticatedContext/authenticatedPage, and testData to tests.
// - Centralizes environment handling, navigation and logging so individual tests remain concise and environment-agnostic.
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

  // Clean page without automatic navigation - respects environment
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();

    // Get base URL from environment variables with fallback
    const baseUrl = process.env.BASE_URL ||
      process.env.PROD_BASE_URL ||
      process.env.QA_BASE_URL
      ;

    console.log(`[BaseFixture] Using base URL: ${baseUrl}`);
    console.log(`[BaseFixture] Environment: ${process.env.ENV || 'not set'}`);
    await page.goto(baseUrl);

    await use(page);
  },

  // Pre-navigated login page using environment URL
  loginPage: async ({ authenticatedPage }, use) => {
    const loginPage = new LoginPage(authenticatedPage);

    // Use environment-specific URL for navigation
    const baseUrl = process.env.BASE_URL ||
      process.env.PROD_BASE_URL ||
      process.env.QA_BASE_URL ||
      "https://my.qa.marathon-health.com";

    console.log(`[LoginPage] Navigating to: ${baseUrl}`);

    // Navigate using the environment URL instead of hardcoded URL
    await page.goto(baseUrl);
    await use(loginPage);
  },

  testData: async ({ }, use, testInfo) => {
    const reader = new TestDataReader(testInfo.file, "data");
    await use(reader.testData);
  }
});