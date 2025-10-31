import { test as base, expect, type Page, type BrowserContext } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { TestDataReader } from "../utils/TestDataReader";

export interface BaseFixture {
  loginPage: LoginPage;
  authenticatedContext: BrowserContext;
  authenticatedPage: Page;
  testData: Record<string, any>;
}

export const baseBest = base.extend<BaseFixture>({
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await page.goto('/');
    await use(page); // provide the page to tests
  },


  testData: async ({ }, use, testInfo) => {
    const reader = new TestDataReader(testInfo.file, "data");
    await use(reader.testData as Record<string, any>);
  }
});
