// pageFixture: simple factory that instantiates and returns page object instances and test utilities bound to a Playwright Page.
// Exposes: appointmentPage, loginPage, adminLoginPage, registerPage, checkpointManager, commonUtils.
// Purpose: centralize page object creation so tests can reuse consistent, pre-wired instances and keep test setup concise.
import { Page } from "@playwright/test";
import { AppointmentPage } from "../pages/Appointment/Appointment";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage";
import { CommonUtils } from "../utils/CommonUtils.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";

export const pageFixture = (page) => ({
    appointmentPage: new AppointmentPage(page),
    loginPage: new LoginPage(page),
    adminLoginPage: new AdminLoginPage(page),
    registerPage: new RegisterPage(page),
    checkpointManager: new CheckpointManager(),
    commonUtils: new CommonUtils()
})