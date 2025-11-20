// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";
 
test.describe("Login Page Tests", () => {
 
  let email = "";
  test("should show error message for invalid credentials @smoke @negative", async ({ authenticatedPage, testData }) => {
    const { login, registration } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    const registrationPage = new RegisterPage(authenticatedPage);
    const checkpointManager = new CheckpointManager();
 
    await loginPage.enterUsername(login.InvalidUsername);
    await loginPage.enterPassword(login.InvalidPassword);
    await loginPage.clickShowPassword();
    checkpointManager.createCheckpoint("Validating Password Visibility After Show Password Click", await loginPage.verifyPasswordVisible(login.InvalidPassword), false, "Password should be visible after first toggle");
    await loginPage.clickShowPassword();
    checkpointManager.createCheckpoint("Validating Password Visibility After Hide Password Click", await loginPage.verifyPasswordVisible(login.InvalidPassword), true, "Password should be not visible after second toggle");
    await loginPage.clickLogin();
    checkpointManager.assertAllCheckpoints();
  });

  test("Login with valid credentials @smoke @positive", async ({ authenticatedPage, testData }) => {
    const { login } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    await loginPage.login(login.ValidUsername, login.ValidPassword);
    expect(await loginPage.verifyLoginSuccess()).toBeTruthy();

  });

  test("Validate Links on Login Page @regression", async ({ authenticatedPage }) => {
    const checkpointManager = new CheckpointManager();
    const loginPage = new LoginPage(authenticatedPage);
    await checkpointManager.createCheckpoint("Validate Logo Visibility on Login Page", await loginPage.isLogoVisibleOnLoginPage(), true, "Logo should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate 'Forgot Password' Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('Forgot Password?'), true, "'Forgot Password' link should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate iOS App Store Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('iOS'), true, "'iOS App Store' link should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate Android App Store Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('Android'), true, "'Android App Store' link should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate Launguage Selection Dropdown Visibility on Login Page", await loginPage.isLaunguageSectingVisible(), true, "Language Selection Dropdown should be visible on Login Page");
    await loginPage.clickOnLanguageSelector();
    await checkpointManager.createCheckpoint("Validate English Language Option Visibility on Login Page", await loginPage.verifyLanguageOptionsVisible('English'), true, "'English' language option should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate Español Language Option Visibility on Login Page", await loginPage.verifyLanguageOptionsVisible('Español'), true, "'Español' language option should be visible on Login Page");
    await checkpointManager.assertAllCheckpoints();
  
  });
 
});