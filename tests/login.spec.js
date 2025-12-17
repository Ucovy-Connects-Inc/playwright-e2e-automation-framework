import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";
 
test.describe("Login Page Tests", () => {
 
  test("should show error message for invalid credentials @smoke @negative", async ({ testData, loginPage }) => {
    const { login, registration } = testData;
    const checkpointManager = new CheckpointManager();
    
    // No need to navigate - already done by fixture with correct environment URL
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