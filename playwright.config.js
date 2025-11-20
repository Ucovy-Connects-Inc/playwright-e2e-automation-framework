const { defineConfig, devices } = require("@playwright/test");
require('dotenv').config(); // Load environment variables from .env file

// Read the environment variable 'ENV' from the system or .env file
const ENV = process.env.ENV || "qa";
// Making the ENV variable set to GLOBAL
process.env.ENV = ENV;

// Get base URL from environment variables
const getBaseURL = () => {
    return process.env[`${ENV.toUpperCase()}_BASE_URL`];
};
// Environment-driven overrides from .env file
const retries = Number(process.env.RETRIES) || 0;
const workers = Number(process.env.WORKERS) || undefined;
const headless = process.env.HEADLESS === 'true' || !!process.env.CI;
const actionTimeout = Number(process.env.ACTION_TIMEOUT) || 30000;
const testTimeout = Number(process.env.TEST_TIMEOUT) || 60000;
 
module.exports = defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries,
    workers,
    reporter: [
        ["list"],
        ["allure-playwright", {
            outputFolder: "allure-results",
            suiteTitle: "Playwright E2E Tests"
        }]
    ],
    use: {
        baseURL: getBaseURL(),
        actionTimeout: actionTimeout,
        headless: headless,
        acceptDownloads: true,
        trace: "on",                    // Always collect trace
        screenshot: "on",               // Always take screenshots
        video: "on",                   // Always record video
        
        // Add extra HTTP headers for automation if secret is configured
        extraHTTPHeaders: process.env.AUTOMATION_SECRET ? {
            'X-Automation-Key': process.env.AUTOMATION_SECRET,
            'X-Test-Framework': 'Playwright'
        } : {}
    },
    timeout: testTimeout,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit", 
            use: { ...devices["Desktop Safari"] },
        },
    ],
});