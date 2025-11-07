// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
 
test.describe("Login Page Tests", () => {
 
  let email = "";
  test("should show error message for invalid credentials @smoke @negative", async ({ authenticatedPage, testData }) => {
    const { login } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    const registrationPage = new RegisterPage(authenticatedPage);
 
    await loginPage.login(login.username, login.password);
 
    const errorText = await loginPage.getErrorMessage();
    console.log("Error Message Displayed:", errorText);
    expect(errorText).toContain("Username or password is incorrect");
 
    await registrationPage.clickOnRegisterAccount();
 
    await authenticatedPage.waitForTimeout(10000);
  });
 
  test("register new user with valid data @registration @positive", async ({ authenticatedPage, testData }) => {
    const registrationPage = new RegisterPage(authenticatedPage);
    const adminLoginPage = new AdminLoginPage(authenticatedPage);
    const { registration, admin } = testData;
    await registrationPage.clickOnRegisterAccount();
    await registrationPage.fillRegistrationForm(
      registration.firstName,
      registration.lastName,
      registration.email,
      registration.ssn,
      registration.dob,
      registration.streetAddress,
      registration.streetAddress2,
      registration.city,
      registration.zipCode,
      registration.phoneNumber,
      registration.homePhone,
      registration.employer
    );
 
    const email = registration.email;
    console.log("Registered Email:", email);
 
    await registrationPage.submitRegistration();
    // await authenticatedPage.waitForTimeout(10000);
 
    // Admin login to verify new user registration
    // await adminLoginPage.navigateToAdminPortal();
    // await adminLoginPage.adminLogin(admin.username, admin.password);
 
    // Navigate to Potentials and verify the new user is listed
    // await adminLoginPage.clickPotentials();
    // const isUserPresent = await adminLoginPage.potentialUser.isVisible();
    // expect(isUserPresent).toBeTruthy();
 
    // Convert potential user to active user
    // await adminLoginPage.clickConvertUser();
 
    // await authenticatedPage.waitForTimeout(10000);
  });
 
});