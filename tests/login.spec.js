import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";
 
test.describe("Login Page Tests", () => {
 
  let email = "";
  test("should show error message for invalid credentials @smoke @negative", async ({ authenticatedPage, testData ,page}) => {
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
});