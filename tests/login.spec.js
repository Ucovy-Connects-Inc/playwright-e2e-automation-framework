// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
 
test.describe("Login Page Tests", () => {
 
  let email = "";
  test("should show error message for invalid credentials @smoke @negative", async ({ authenticatedPage, testData }) => {
    const { login, registration } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    const registrationPage = new RegisterPage(authenticatedPage);
 
    await loginPage.enterUsername(login.InvalidUsername);
    await loginPage.enterPassword(login.InvalidPassword);
    await loginPage.clickShowPassword();
    expect(await loginPage.verifyPasswordVisible(login.InvalidPassword)).toBeFalsy() ;
    await loginPage.clickShowPassword();
    expect(await loginPage.verifyPasswordVisible(login.InvalidPassword)).toBeTruthy();
    await loginPage.clickLogin();
  });

  test("Login with valid credentials @smoke @positive", async ({ authenticatedPage, testData }) => {
    const { login } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    await loginPage.login(login.ValidUsername, login.ValidPassword);
    expect(await loginPage.verifyLoginSuccess()).toBeTruthy();

  });
 
});