import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";
import { AppointmentPage } from "../pages/Appointment/Appointment.js";
 
test.describe("Appointment Tests", () => {
 
  let email = "";
  test("should validate appointment dropdown options @smoke @negative @appointment", async ({ authenticatedPage, testData }) => {
    const { login, registration } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    const registrationPage = new RegisterPage(authenticatedPage);
    const checkpointManager = new CheckpointManager();
    const appointmentPage = new AppointmentPage(authenticatedPage);
    
    // Login first
    await loginPage.enterUsername(login.ValidUsername);
    await loginPage.enterPassword(login.ValidPassword);
    await loginPage.clickLogin();
    
    // Navigate to appointments section
    await appointmentPage.navigateToAppointments();
    
    // Validate appointment dropdown options
    await checkpointManager.createCheckpoint("CP001", await appointmentPage.verifyAppointmentDropdownOptionVisible('Schedule an Appointment'), true, "'Schedule an Appointment' option should be visible in appointment dropdown");
    await checkpointManager.createCheckpoint("CP002", await appointmentPage.verifyAppointmentDropdownOptionVisible('View and Manage Appointments'), true, "'View and Manage Appointments' option should be visible in appointment dropdown");
    await checkpointManager.createCheckpoint("CP003", await appointmentPage.verifyAppointmentDropdownOptionVisible('Health Center Locations'), true, "'Health Center Locations' option should be visible in appointment dropdown");
    await checkpointManager.createCheckpoint("CP004", await appointmentPage.verifyAppointmentDropdownOptionVisible('Our Providers'), true, "'Our Providers' option should be visible in appointment dropdown");
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    
    // Validate Schedule an Appointment header
    await checkpointManager.createCheckpoint("CP005", await appointmentPage.validateScheduleAppointmentHeader(), true, "'Schedule an Appointment' header should be visible after clicking the option");
    
    // Validate reason for visit section elements
    await checkpointManager.createCheckpoint("CP006", await appointmentPage.validateReasonForVisitSection(), true, "'Reason for Visit' section should be visible on Schedule an Appointment page");
    await checkpointManager.createCheckpoint("CP007", await appointmentPage.validateEmergencyReasonsLink(), true, "'Emergency Reasons' link should be visible on Schedule an Appointment page");
    await checkpointManager.createCheckpoint("CP008", await appointmentPage.validatePhoneNumberLink(), true, "'Phone Number' link should be visible on Schedule an Appointment page");
    
    // Validate all new appointment page sections
    await checkpointManager.createCheckpoint("CP009", await appointmentPage.validateCompleteListLink(), true, "'Complete List' link should be visible on appointment page");
    await checkpointManager.createCheckpoint("CP010", await appointmentPage.validateSearchAvailabilityEnabled(), false, "'Search Availability' section should be disabled on appointment page");
    await checkpointManager.createCheckpoint("CP011", await appointmentPage.validateLookingForScheduledAppointmentSection(), true, "'View and Manage Appointments' section should be visible on appointment page");
    await checkpointManager.createCheckpoint("CP012", await appointmentPage.validateNeedHelpSection(), true, "'Need Help' section should be visible on appointment page");
    await checkpointManager.createCheckpoint("CP013", await appointmentPage.validateQuickLinksSection(), true, "'Quick Links' section should be visible on appointment page");
await appointmentPage.clickSearchInput();
await appointmentPage.selectSearchResult("Acne");
    await checkpointManager.createCheckpoint("CP014", await appointmentPage.validateLocationRadioChecked("home"), true, "'Home' location radio button should be checked after clicking");
    await checkpointManager.createCheckpoint("CP015", await appointmentPage.validateDistanceRadioChecked("50"), true, "'25 miles' distance radio button should be checked after clicking");

    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.clickSearchInput();
await appointmentPage.selectCommonVisitReason("Health Coaching");
const state = await appointmentPage.getState();
console.log("Selected state is:", state);
await checkpointManager.createCheckpoint("CP015", await appointmentPage.validateStateSelectedByDefault(state), true, "State should be CA after selecting Health Coaching");
    checkpointManager.assertAllCheckpoints();
  })
});