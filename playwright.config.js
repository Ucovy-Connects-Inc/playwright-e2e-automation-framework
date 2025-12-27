import { defineConfig, devices } from '@playwright/test';
require('dotenv').config(); // Load environment variables from .env file

// Read the environment variable 'ENV' from the system or .env file
const ENV = process.env.ENV || "QA_BASE_URL";
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

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // For serial AI visual tests
  forbidOnly: !!process.env.CI,
  retries,
  workers: process.env.CI ? 1 : 2, // Reduced for visual consistency

  reporter: [
    ['html', {
      outputFolder: 'test-results/html-report',
      open: 'never'
    }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  // 🎯 AI Visual Testing Global Configuration
  expect: {
    // Global visual comparison settings
    toHaveScreenshot: {
      threshold: 0.1,
      maxDiffPixels: 1000,
      animations: 'disabled',
      mode: 'rgb',
      // Automatically create baseline images on first run
      createIfMissing: true
    },
    // Fix for long filename issue
    toMatchSnapshot: {
      pathTemplate: '{testFileDir}/{testFileName}-{projectName}-{testName}-{counter}{ext}'
    }
  },

  // Configure shorter snapshot names
  testNamePathSegment: (testName, testFile) => {
    return testName
      .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase()
      .substring(0, 50); // Limit to 50 characters
  },

  use: {
    baseURL: getBaseURL(),
    actionTimeout: actionTimeout,
    headless: headless,
    acceptDownloads: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 🎯 AI Visual Testing Browser Configuration
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor', // More consistent screenshots
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-background-timer-throttling',
        '--disable-background-networking',
        '--disable-background-media',
        '--disable-background-media-suspend',
        '--force-color-profile=srgb', // Consistent color rendering
      ]
    },

    // Consistent viewport for visual testing
    viewport: { width: 1280, height: 720 },

    // Disable animations globally for consistent screenshots
    bypassCSP: true
  },

  projects: [
    {
      name: 'chromium-ai-visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // Chromium-specific AI visual settings
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--force-color-profile=srgb',
            '--disable-background-timer-throttling'
          ]
        }
      },
    },

    {
      name: 'firefox-ai-visual',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
        // Firefox gets slightly different thresholds
        launchOptions: {
          firefoxUserPrefs: {
            'gfx.canvas.azure.backends': 'cairo',
            'layers.acceleration.disabled': true
          }
        }
      },
    },

    {
      name: 'webkit-ai-visual',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],

  // Global test setup for AI visual testing
  // globalSetup: require.resolve('./global-setup.js'),

  // Output directories for AI visual artifacts
  outputDir: 'test-results/artifacts',
});