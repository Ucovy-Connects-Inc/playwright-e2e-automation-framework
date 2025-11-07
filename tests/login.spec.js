// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js"; 
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";

test.describe("Login Page Tests", () => {
  
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
    const { registration } = testData;  
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
    registrationPage.submitRegistration();

    await authenticatedPage.waitForTimeout(10000);
  });

});