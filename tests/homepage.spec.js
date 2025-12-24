// Tests for Home Page features.
// This file is the central location for all homepage-related E2E tests (not exhaustive).
// Current number of test cases (TC#) in this file: 1

import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { pageFixture } from "../fixtures/pageFixture.js";
test.describe("Home Page Tests", () => {

    test("TC#14 Verify all links and tiles @smoke @positive @test", async ({ authenticatedPage, testData }) => {
        const { login } = testData;
        const pageFixtures = pageFixture(authenticatedPage);
        const { loginPage, checkpointManager } = pageFixtures;

        await loginPage.login(login.ValidUsername, login.ValidPassword);
        expect(await loginPage.verifyLoginSuccess()).toBeTruthy();
        await checkpointManager.createCheckpoint(
            "Validate 'Connect Your Device' Button Visibility on Login Page",
            await loginPage.verifyButtonVisible("Connect Your Device"),
            true,
            "'Connect Your Device' button should be visible on Login Page"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Biometric screening scheduling link' Button Visibility on Login Page",
            await loginPage.verifyButtonVisible("Biometric screening scheduling link"),
            true,
            "'Biometric screening scheduling link' button should be visible on Login Page"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Take a tour of the Marathon Health Portal' Button Visibility on Login Page",
            await loginPage.verifyButtonVisible("Take a tour of the Marathon Health Portal"),
            true,
            "'Take a tour of the Marathon Health Portal' button should be visible on Login Page"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Accessibility Statement' Button Visibility on Login Page",
            await loginPage.verifyButtonVisible("Accessibility Statement"),
            true,
            "'Accessibility Statement' button should be visible on Login Page"
        );

        // Link visibility checkpoints
        await checkpointManager.createCheckpoint(
            "Validate 'Get in Touch' Link Visibility on Login Page",
            await loginPage.verifyLinkVisible("Get in Touch"),
            true,
            "'Get in touch' link should be visible on Login Page"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Visit our Frequently Asked Questions' Link Visibility on Login Page",
            await loginPage.verifyLinkVisible("Visit our Frequently Asked Questions"),
            true,
            "'Visit our Frequently Asked Questions' link should be visible on Login Page"
        );
        await checkpointManager.createCheckpoint(
            "Validate 'Home' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("Home"),
            true,
            "'Home' tab should be visible in navigation"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Appointments' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("Appointments"),
            true,
            "'Appointments' tab should be visible in navigation"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Medication Refills' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("Medication Refills"),
            true,
            "'Medication Refills' tab should be visible in navigation"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'MyHealth' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("MyHealth"),
            true,
            "'MyHealth' tab should be visible in navigation"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Incentives & Wellness' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("Incentives & Wellness"),
            true,
            "'Incentives & Wellness' tab should be visible in navigation"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Resources' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("Resources"),
            true,
            "'Resources' tab should be visible in navigation"
        );

        await checkpointManager.createCheckpoint(
            "Validate 'Help' Tab Visibility on Portal",
            await loginPage.verifyElementVisible("Help"),
            true,
            "'Help' tab should be visible in navigation"
        );

    });

});