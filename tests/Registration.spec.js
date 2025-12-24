import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";

test.describe(" Registration Page Tests", () => {

  let email = "";
  test("should show error message for invalid credentials @smoke @registration", async ({ authenticatedPage, testData }) => {
    const { login, registration } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    const registrationPage = new RegisterPage(authenticatedPage);
    const checkpointManager = new CheckpointManager();
    await registrationPage.clickOnRegisterAccount();
    await registrationPage.fillRegistrationForm(
      registration.firstName,
      registration.lastName,
      registration.email,
      "",
      registration.dateOfBirth,
      registration.streetAddress,
      registration.city,
      registration.state,
      registration.zipCode,
      registration.phoneNumber,
      "",
      "Test Employer Inc."
    );



  });
});