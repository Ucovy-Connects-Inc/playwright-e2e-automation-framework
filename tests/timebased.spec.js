// Tests for Login Page features.
// This file is the central location for all login-related E2E tests (not exhaustive).
// Current number of test cases (TC#) in this file: 1

import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { pageFixture } from "../fixtures/pageFixture.js";

test.describe("Time based Tests", () => {

  // TC#7 - Account inactivity logout - popup after 10 mins and logout after 15 mins
  // Steps:
  // 1) Navigate to login page.
  // 2) Login with valid credentials.
  // 3) Wait for 10 minutes.
  // 4) Verify inactivity popup appears.
  // 5) Wait for 5 more minutes.
  // 6) Verify user is logged out and redirected to login page.
  test("TC#7 Account inactivity logout @positive @login", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage } = pageFixtures;

    // Act: perform login with valid credentials
    await loginPage.login(login.ValidUsername, login.ValidPassword);

    // Assert: verify login success
    expect(await loginPage.verifyLoginSuccess()).toBeTruthy();

    // Act: wait for 10 minutes
    await authenticatedPage.waitForTimeout(10 * 60 * 1000);

    // Assert: verify inactivity popup appears
    // need to add code here to check for the inactivity popup

    // Act: wait for 5 more minutes
    await authenticatedPage.waitForTimeout(5 * 60 * 1000);

    // Assert: verify user is logged out and redirected to login page
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("You have been signed out due to inactivity.");
  });

});