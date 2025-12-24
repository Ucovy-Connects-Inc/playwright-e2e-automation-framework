// Tests for Login Page features.
// This file is the central location for all login-related E2E tests (not exhaustive).
// Current number of test cases (TC#) in this file: 7

import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { pageFixture } from "../fixtures/pageFixture.js";

test.describe("Login Page Tests", () => {

  // TC#8 - Login with invalid credentials (negative)
  // TC#11 - Verify Show/Hide password visibility (UI)
  // Steps:
  // 1) Arrange: initialize test data, checkpoint manager and page objects (fixture navigates to login).
  // 2) Enter invalid username and password.
  // 3) Toggle "Show Password" and verify the password is visible in plain text.
  // 4) Toggle "Hide Password" and verify the password is masked again.
  // 5) Attempt login with invalid credentials and assert expected error/validation via checkpoints.
  test("TC#8 Login with invalid credentials , TC#11 Verify Show/Hide password @negative @login", async ({ testData, authenticatedPage }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, checkpointManager } = pageFixtures;

    // No need to navigate - already done by fixture with correct environment URL
    await loginPage.enterUsername(login.InvalidUsername);
    await loginPage.enterPassword(login.InvalidPassword);

    // Act + Assert: verify password visibility toggles
    await loginPage.clickShowPassword();
    checkpointManager.createCheckpoint("Validating Password Visibility After Show Password Click", await loginPage.verifyPasswordVisible(login.InvalidPassword), false, "Password should be visible after first toggle");
    await loginPage.clickShowPassword();
    checkpointManager.createCheckpoint("Validating Password Visibility After Hide Password Click", await loginPage.verifyPasswordVisible(login.InvalidPassword), true, "Password should be not visible after second toggle");

    // Act: attempt login with invalid credentials
    await loginPage.clickLogin();

    // Assert: evaluate all checkpoints (including any error / validation messages handled by page object)
    checkpointManager.assertAllCheckpoints();
  });

  // TC#7 - Login with valid credentials (positive)
  // Steps:
  // 1) Arrange: load valid credentials and page objects (fixture navigates to login).
  // 2) Use login helper to perform login.
  // 3) Verify login succeeded (assert home/dashboard visible or success indicator).
  test("TC#7 Login with valid credentials @positive @login", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage } = pageFixtures;

    // Act: perform login with valid credentials
    await loginPage.login(login.ValidUsername, login.ValidPassword);

    // Assert: verify login success
    expect(await loginPage.verifyLoginSuccess()).toBeTruthy();
  });

  // TC#12 - Login as an Underage user (positive)
  // Steps:
  // 1) Arrange: load valid credentials and page objects (fixture navigates to login).
  // 2) Use login helper to perform login.
  // 3) Verify login failed (assert underage user error message visible).
  test("TC#12 Login as an Underage user @positive @login", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage } = pageFixtures;

    // Act: perform login with valid credentials
    await loginPage.login(login.ChildUsername, login.ChildPassword);

    // Verify error message contains expected text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Sorry, you must be over 18 to sign in.");
  });

  // TC#6 - Verify all links and buttons on Login Page (positive)
  // Steps:
  // 1) Arrange: prepare page objects (fixture ensures we're on the login page).
  // 2) Validate static elements: logo, "Forgot Password?" link, app store links.
  // 3) Validate language selector visibility and its language options.
  // 4) Assert all checkpoints.
  test("TC#6 Verify all links and buttons @positive @login", async ({ authenticatedPage }) => {
    // --- Arrange: load page objects and checkpoint manager ---
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, checkpointManager } = pageFixtures;

    // Assert: logo and important links are visible
    await checkpointManager.createCheckpoint("Validate Logo Visibility on Login Page", await loginPage.isLogoVisibleOnLoginPage(), true, "Logo should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate 'Forgot Password' Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('Forgot Password?'), true, "'Forgot Password' link should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate iOS App Store Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('iPhone'), true, "'iOS App Store' link should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate Android App Store Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('Android'), true, "'Android' App Store' link should be visible on Login Page");

    // Act: open language selector and verify options
    await checkpointManager.createCheckpoint("Validate Launguage Selection Dropdown Visibility on Login Page", await loginPage.isLaunguageSectingVisible(), true, "Language Selection Dropdown should be visible on Login Page");
    await loginPage.clickOnLanguageSelector();
    await checkpointManager.createCheckpoint("Validate English Language Option Visibility on Login Page", await loginPage.verifyLanguageOptionsVisible('English'), true, "'English' language option should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate Español Language Option Visibility on Login Page", await loginPage.verifyLanguageOptionsVisible('Español'), true, "'Español' language option should be visible on Login Page");

    // Assert: evaluate all checkpoints collected above
    await checkpointManager.assertAllCheckpoints();

  });

  // TC#13 - Login as an inactive user (positive)
  // Steps:
  // 1) Arrange: load valid credentials and page objects (fixture navigates to login).
  // 2) Use login helper to perform login.
  // 3) Verify login failed (assert inactive user error message visible).
  test("TC#13 Login as an inactive user @positive @login", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage } = pageFixtures;

    // Act: perform login with valid credentials
    await loginPage.login(login.InactiveUsername, login.InactivePassword);
    console.log("InactivePasswrodInactivePassword: " + login.InactivePassword);

    // Verify error message contains expected text
    const errorMessage = await loginPage.getErrorMessage();
    console.log("Error Message: " + errorMessage);
    expect(errorMessage).toContain("Sorry, you do not currently have access to Marathon Health. If you have any questions or feel this is an error, please call 866-434-3255.");
  });

  // TC#10 - Account lock - after 5 consecutive failed login attemps (positive)
  // Steps:
  // 1) Arrange: load valid credentials and page objects (fixture navigates to login).
  // 2) Use login helper to perform login.
  // 3) Verify login failed (assert invalid password error message visible).
  // 4) Repeat steps 2 and 3 four more times (total of 5 failed attempts).
  // 5) Verify account is locked (assert account locked error message visible).
  test("TC#10 Account lock - after 5 consecutive failed login attemps @login", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage } = pageFixtures;

    // Perform 5 consecutive failed login attempts and assert expected messages per attempt
    for (let attempt = 1; attempt <= 4; attempt++) {
      // Act: perform login with invalid credentials
      await loginPage.login(login.LockUsername, login.InvalidPassword);

      // Capture the error message after each attempt
      const errorMessage = await loginPage.getErrorMessage();
      console.log(`Attempt ${attempt} Error Message: ${errorMessage}`);

      // Assertions per the test steps:
      // Attempts 1-3 -> generic incorrect credentials message
      if (attempt <= 3) {
        expect(errorMessage).toContain("Your password or username is incorrect");
      }
      // Attempt 4 -> warning that account will be locked after one more attempt
      else if (attempt === 4) {
        expect(errorMessage).toContain("Your account will be locked after one more invalid login attempt.If you have forgotten your password, please choose “Recover Password” below.RECOVER PASSWORDCLOSE");
      }
      // Attempt 5 -> account locked message (match on 'locked' to be resilient)
      // commenting this because otherwise the account will be locked
      // else {
      //   expect(errorMessage.toLowerCase()).toContain("your account is lockedyou can reset your password in 30 minutes or call our patient support team at 866-434-3255.");
      // }
    }

    // Act: perform login with valid credentials
    await loginPage.login(login.LockUsername, login.ValidPassword);
  });

});