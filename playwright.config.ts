import { defineConfig, devices } from "@playwright/test";
// Read the environment variable 'ENV' from the system. 
// If it’s not set, default to "test".
const ENV = process.env.ENV || "test";
// Making the ENV variable set to GLOBAL
process.env.ENV = ENV;

// This allows the framework to easily switch between test and dev environments.
const baseURLs: Record<string, string> = {
    test: "https://my.marathon-health.com/login",
    dev: "https://stage.my.marathon-health.com/login",
};
// Simple env-driven overrides (keep it minimal per request)
const retries = Number(process.env.RETRIES) || 0;
const workers = Number(process.env.WORKERS) || undefined;
export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries,
    workers,
    reporter: [["html", { open: "never" }], ["list"]],
    use: {
        baseURL: baseURLs[ENV],
        actionTimeout: 600000,
        headless: !!process.env.HEADLESS || false,
        acceptDownloads: true,
        trace: "on-first-retry",
},
timeout: 1200000,
projects:[
        { name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
]
}); 