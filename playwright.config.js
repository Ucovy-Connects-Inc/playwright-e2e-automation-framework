const { defineConfig, devices } = require("@playwright/test");
 
// Read the environment variable 'ENV' from the system.
// If it's not set, default to "test".
const ENV = process.env.ENV || "test";
// Making the ENV variable set to GLOBAL
process.env.ENV = ENV;
 
// This allows the framework to easily switch between test and dev environments.
const baseURLs = {
    prod: "https://my.marathon-health.com/login",
    dev: "https://stage.my.marathon-health.com/login",
    qa: "https://my.qa.marathon.health/login", // QA env without CAPTCHA
};
// Simple env-driven overrides (keep it minimal per request)
const retries = Number(process.env.RETRIES) || 0;
const workers = Number(process.env.WORKERS) || undefined;
 
module.exports = defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries,
    workers,
    reporter: [
        ["html", { open: "always" }],
        ["list"],
        ["allure-playwright", {
            outputFolder: "allure-results",
            suiteTitle: "Playwright E2E Tests"
        }]
    ],
    use: {
        baseURL: baseURLs[ENV],
        actionTimeout: 600000,
        headless: !!process.env.HEADLESS || false,
        acceptDownloads: true,
        trace: "on-first-retry",
        // // Add user agent to potentially bypass some CAPTCHA systems
        // userAgent: process.env.USER_AGENT || undefined,
        // // Add extra HTTP headers for test environments
        // extraHTTPHeaders: {
        //     'X-Test-Mode': 'true',
        //     'X-Automation': 'playwright'
        // }
    },
    timeout: 10000, //milli seconds
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});