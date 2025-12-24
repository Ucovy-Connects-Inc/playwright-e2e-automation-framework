// Current number of test cases (TC#) in this file: 24
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { pageFixture } from "../fixtures/pageFixture.js";

test.describe.serial("Appointment Tests", () => {

  let email = "";

  test("Validate Appointments dropdown @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage, checkpointManager } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login.ValidUsername);
    await loginPage.enterPassword(login.ValidPassword);
    await loginPage.clickLogin();

    // --- Navigate to appointments section ---
    await appointmentPage.navigateToAppointments();

    // --- Validate all appointment dropdown options are visible ---
    await checkpointManager.createCheckpoint("CP001", await appointmentPage.verifyAppointmentDropdownOptionVisible('Schedule an Appointment'), true, "'Schedule an Appointment' option should be visible in appointment dropdown");
    await checkpointManager.createCheckpoint("CP002", await appointmentPage.verifyAppointmentDropdownOptionVisible('View and Manage Appointments'), true, "'View and Manage Appointments' option should be visible in appointment dropdown");
    await checkpointManager.createCheckpoint("CP003", await appointmentPage.verifyAppointmentDropdownOptionVisible('Health Center Locations'), true, "'Health Center Locations' option should be visible in appointment dropdown");
    await checkpointManager.createCheckpoint("CP004", await appointmentPage.verifyAppointmentDropdownOptionVisible('Our Providers'), true, "'Our Providers' option should be visible in appointment dropdown");
  })

  test("Verify all links on Schedule Appointment page @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage, checkpointManager } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login.ValidUsername);
    await loginPage.enterPassword(login.ValidPassword);
    await loginPage.clickLogin();

    // --- Navigate to appointments section ---
    await appointmentPage.navigateToAppointments();

    // --- Open Schedule an Appointment page ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');

    // --- Validate Schedule an Appointment header is visible ---
    await checkpointManager.createCheckpoint("CP005", await appointmentPage.validateScheduleAppointmentHeader(), true, "'Schedule an Appointment' header should be visible after clicking the option");

    // --- Validate reason for visit section elements are visible ---
    await checkpointManager.createCheckpoint("CP006", await appointmentPage.validateReasonForVisitSection(), true, "'Reason for Visit' section should be visible on Schedule an Appointment page");
    await checkpointManager.createCheckpoint("CP007", await appointmentPage.validateEmergencyReasonsLink(), true, "'Emergency Reasons' link should be visible on Schedule an Appointment page");
    await checkpointManager.createCheckpoint("CP008", await appointmentPage.validatePhoneNumberLink(), true, "'Phone Number' link should be visible on Schedule an Appointment page");

    // --- Validate all page sections and elements ---
    await checkpointManager.createCheckpoint("CP009", await appointmentPage.validateCompleteListLink(), true, "'Complete List' link should be visible on appointment page");
    await checkpointManager.createCheckpoint("CP010", await appointmentPage.validateSearchAvailabilityEnabled(), false, "'Search Availability' section should be disabled on appointment page");
    await checkpointManager.createCheckpoint("CP011", await appointmentPage.validateLookingForScheduledAppointmentSection(), true, "'View and Manage Appointments' section should be visible on appointment page");
    await checkpointManager.createCheckpoint("CP012", await appointmentPage.validateNeedHelpSection(), true, "'Need Help' section should be visible on appointment page");
    await checkpointManager.createCheckpoint("CP013", await appointmentPage.validateQuickLinksSection(), true, "'Quick Links' section should be visible on appointment page");

    // --- Search for condition and validate location/distance defaults ---
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await checkpointManager.createCheckpoint("CP014", await appointmentPage.validateLocationRadioChecked("home"), true, "'Home' location radio button should be checked after clicking");
    await checkpointManager.createCheckpoint("CP015", await appointmentPage.validateDistanceRadioChecked("10"), true, "'10 miles' distance radio button should be checked after clicking");

    // --- Assert all checkpoints passed ---
    checkpointManager.assertAllCheckpoints();
  });

  test("Schedule appointment alone - In person Home , In person Other , Virtual Video , Virtual Phone @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login.ValidUsername);
    await loginPage.enterPassword(login.ValidPassword);
    await loginPage.clickLogin();

    // --- Ensure a clean slate: cancel any existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- In-person (Home): search, pick doctor/time, confirm ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName1 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot1 = await appointmentPage.getRandomTimeSlot(selectedDoctorName1);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName1, selectedtimeSlot1);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- In-person (Other): schedule with explicit address ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickLocationRadio("Other");
    await appointmentPage.enterOtherLocationAddress("100 Main St, Indianapolis, IN 46204");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName2 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot2 = await appointmentPage.getRandomTimeSlot(selectedDoctorName2);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName2, selectedtimeSlot2);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Video): schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName3 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot3 = await appointmentPage.getRandomTimeSlot(selectedDoctorName3);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName3, selectedtimeSlot3);
    await appointmentPage.selectVisitTypeAndSameAsContact('Video Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Phone): schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName4 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot4 = await appointmentPage.getRandomTimeSlot(selectedDoctorName4);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName4, selectedtimeSlot4);
    await appointmentPage.selectVisitTypeAndSameAsContact('Phone Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Final cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });

  test("Schedule appointment from Complete list page @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login.ValidUsername);
    await loginPage.enterPassword(login.ValidPassword);
    await loginPage.clickLogin();

    // --- Ensure a clean slate: cancel any existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- Open Schedule an Appointment page ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');

    // --- Open the complete list of reasons/conditions ---
    await appointmentPage.clickCompleteListLink();

    // --- Select the specific visit reason ---
    await appointmentPage.clickVisitReason("Acne");

    // --- Choose availability and a provider/time ---
    await appointmentPage.clickOnSearchAvailability();
    const doctorName = await appointmentPage.getRandomDoctorName();
    const timeSlot = await appointmentPage.getRandomTimeSlot(doctorName);
    await appointmentPage.clickOnTimeSlot(doctorName, timeSlot);

    // --- Confirm appointment ---
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Verify & cleanup: go to manage appointments and cancel the created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });

  test("Schedule appointment Employee - In person Home , In person Other , Virtual Video , Virtual Phone @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login_family } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login_family.ValidUsername);
    await loginPage.enterPassword(login_family.ValidPassword);
    await loginPage.clickLogin();

    // --- Ensure a clean slate: cancel existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- In-person (Home) appointment: search, pick doctor/time, confirm ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Employee1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName1 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot1 = await appointmentPage.getRandomTimeSlot(selectedDoctorName1);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName1, selectedtimeSlot1);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- In-person (Other) appointment: schedule with explicit address ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Employee1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickLocationRadio("Other");
    await appointmentPage.enterOtherLocationAddress("100 Main St, Indianapolis, IN 46204");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName2 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot2 = await appointmentPage.getRandomTimeSlot(selectedDoctorName2);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName2, selectedtimeSlot2);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Video) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Employee1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName3 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot3 = await appointmentPage.getRandomTimeSlot(selectedDoctorName3);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName3, selectedtimeSlot3);
    await appointmentPage.selectVisitTypeAndSameAsContact('Video Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Phone) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Employee1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName4 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot4 = await appointmentPage.getRandomTimeSlot(selectedDoctorName4);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName4, selectedtimeSlot4);
    await appointmentPage.selectVisitTypeAndSameAsContact('Phone Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Final cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });

  test("Schedule appointment Spouse - In person Home , In person Other , Virtual Video , Virtual Phone @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login_family } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login_family.ValidUsername);
    await loginPage.enterPassword(login_family.ValidPassword);
    await loginPage.clickLogin();
    // --- Ensure a clean slate: cancel existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- In-person (Home) appointment: search, pick doctor/time, confirm ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('spouse1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName1 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot1 = await appointmentPage.getRandomTimeSlot(selectedDoctorName1);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName1, selectedtimeSlot1);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- In-person (Other) appointment: schedule with explicit address ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('spouse1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickLocationRadio("Other");
    await appointmentPage.enterOtherLocationAddress("100 Main St, Indianapolis, IN 46204");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName2 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot2 = await appointmentPage.getRandomTimeSlot(selectedDoctorName2);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName2, selectedtimeSlot2);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Video) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('spouse1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName3 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot3 = await appointmentPage.getRandomTimeSlot(selectedDoctorName3);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName3, selectedtimeSlot3);
    await appointmentPage.selectVisitTypeAndSameAsContact('Video Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Phone) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('spouse1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName4 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot4 = await appointmentPage.getRandomTimeSlot(selectedDoctorName4);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName4, selectedtimeSlot4);
    await appointmentPage.selectVisitTypeAndSameAsContact('Phone Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Final cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });

  test("Schedule appointment Dependent - In person Home , In person Other , Virtual Video , Virtual Phone @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login_family } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login_family.ValidUsername);
    await loginPage.enterPassword(login_family.ValidPassword);
    await loginPage.clickLogin();

    // --- Ensure a clean slate: cancel existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- In-person (Home) appointment: search, pick doctor/time, confirm ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Dependent1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName1 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot1 = await appointmentPage.getRandomTimeSlot(selectedDoctorName1);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName1, selectedtimeSlot1);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- In-person (Other) appointment: schedule with explicit address ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Dependent1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickLocationRadio("Other");
    await appointmentPage.enterOtherLocationAddress("100 Main St, Indianapolis, IN 46204");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName2 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot2 = await appointmentPage.getRandomTimeSlot(selectedDoctorName2);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName2, selectedtimeSlot2);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Video) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Dependent1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName3 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot3 = await appointmentPage.getRandomTimeSlot(selectedDoctorName3);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName3, selectedtimeSlot3);
    await appointmentPage.selectVisitTypeAndSameAsContact('Video Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Phone) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Dependent1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName4 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot4 = await appointmentPage.getRandomTimeSlot(selectedDoctorName4);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName4, selectedtimeSlot4);
    await appointmentPage.selectVisitTypeAndSameAsContact('Phone Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Final cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });

  test("Schedule appointment Child - In person Home , In person Other , Virtual Video , Virtual Phone @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login_family } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login_family.ValidUsername);
    await loginPage.enterPassword(login_family.ValidPassword);
    await loginPage.clickLogin();

    // --- Ensure a clean slate: cancel existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- In-person (Home) appointment: search, pick doctor/time, confirm ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Child1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName1 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot1 = await appointmentPage.getRandomTimeSlot(selectedDoctorName1);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName1, selectedtimeSlot1);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- In-person (Other) appointment: schedule with explicit address ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Child1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickLocationRadio("Other");
    await appointmentPage.enterOtherLocationAddress("100 Main St, Indianapolis, IN 46204");
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName2 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot2 = await appointmentPage.getRandomTimeSlot(selectedDoctorName2);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName2, selectedtimeSlot2);
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Video) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Child1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName3 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot3 = await appointmentPage.getRandomTimeSlot(selectedDoctorName3);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName3, selectedtimeSlot3);
    await appointmentPage.selectVisitTypeAndSameAsContact('Video Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');

    // --- Virtual (Phone) appointment: schedule and confirm ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.selectVisitForPerson('Child1');
    await appointmentPage.clickSearchInput();
    await appointmentPage.selectSearchResult("Acne");
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    const selectedDoctorName4 = await appointmentPage.getRandomDoctorName();
    const selectedtimeSlot4 = await appointmentPage.getRandomTimeSlot(selectedDoctorName4);
    await appointmentPage.clickOnTimeSlot(selectedDoctorName4, selectedtimeSlot4);
    await appointmentPage.selectVisitTypeAndSameAsContact('Phone Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Final cleanup: cancel created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });

  test("Schedule Virtual Video appointment - Mental Health @positive @appointment", async ({ authenticatedPage, testData }) => {
    // --- Arrange: load test data and page objects ---
    const { login } = testData;
    const pageFixtures = pageFixture(authenticatedPage);
    const { loginPage, appointmentPage } = pageFixtures;

    // --- Login ---
    await loginPage.enterUsername(login.ValidUsername);
    await loginPage.enterPassword(login.ValidPassword);
    await loginPage.clickLogin();

    // --- Ensure a clean slate: cancel existing appointments ---
    await appointmentPage.cancelAllAppointments('I feel better now');
    await appointmentPage.navigateToAppointments();

    // --- Open Schedule an Appointment page and search for "Mental Health" ---
    await appointmentPage.clickAppointmentDropdownOption('Schedule an Appointment');
    await appointmentPage.enterSearchInputValue("Mental Health");

    // --- Handle emergency popup if shown ---
    await appointmentPage.handleEmergencyPopupAndContinue();

    // --- Choose virtual visit and find an available slot ---
    await appointmentPage.clickVirtualVisitButton();
    await appointmentPage.clickOnSearchAvailability();
    console.info(await appointmentPage.getAllAvailableDoctorNames());
    const doctorName = await appointmentPage.getRandomDoctorName();
    console.info(await appointmentPage.getNumberOfSlotsAvailableForDoctor(doctorName));
    const timeSlot = await appointmentPage.getRandomTimeSlot(doctorName);
    console.info(timeSlot);
    await appointmentPage.clickOnTimeSlot(doctorName, timeSlot);

    // --- Select mental health focus and continue ---
    await appointmentPage.selectMentalHealthFocusAndContinue('Anxiety');

    // --- Select visit type, confirm and schedule appointment ---
    await appointmentPage.selectVisitTypeAndSameAsContact('Video Visit');
    await appointmentPage.clickConfirmAndScheduleAppointment();

    // --- Verify & cleanup: go to manage appointments and cancel the created appointment ---
    await appointmentPage.navigateToAppointments();
    await appointmentPage.clickAppointmentDropdownOption('View and Manage Appointments');
    await appointmentPage.clickCancelButton();
    await appointmentPage.cancelAppointmentWithReason('I feel better now');
  });
});
