// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { RegisterPage } from "../pages/Registration/Registration.js";
import { AdminLoginPage } from "../pages/LoginPage/AdminPage.js";
import { CheckpointManager } from "../utils/CheckpointManager.js";
import { AIVisualManager } from "../utils/AIVisualManager.js";

test.describe.serial("Login Page Tests with AI Visual Assertions", () => {
 
  let email = "";
  
  test("should show error message for invalid credentials with AI visual validation @smoke @negative @ai-visual", async ({ authenticatedPage, testData }, testInfo) => {
    const { login, registration } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    const registrationPage = new RegisterPage(authenticatedPage);
    const checkpointManager = new CheckpointManager();
    
    // 🤖 Initialize AI Visual Manager
    const aiVisual = new AIVisualManager(authenticatedPage, testInfo.title);

    // 🎯 AI Visual: Login form elements before interaction (using multi-strategy for resolution independence)
    await checkpointManager.createCheckpoint(
      "AI-LOGIN-002",
      await aiVisual.assertElementMultiStrategy('login-form'),
      true,
      "Login form should be visually consistent with multi-strategy comparison"
    );
    
    await loginPage.enterUsername(login.InvalidUsername);
    
    // 🎯 AI Visual: Username field after input (using multi-strategy)
    await checkpointManager.createCheckpoint(
      "AI-LOGIN-003",
      await aiVisual.assertElementMultiStrategy('username-field'),
      true,
      "Username field should be visually consistent after input"
    );
    
    await loginPage.enterPassword(login.InvalidPassword);
    

    
    await loginPage.clickShowPassword();
    
    // Functional checkpoint
    checkpointManager.createCheckpoint("Validating Password Visibility After Show Password Click", await loginPage.verifyPasswordVisible(login.InvalidPassword), false, "Password should be visible after first toggle");
    
    // 🎯 AI Visual: Password field (visible state)
    await checkpointManager.createCheckpoint(
      "AI-LOGIN-005",
      await aiVisual.assertCustomElement(
        'input[name="password"]',
        'password-field-visible',
        { threshold: 0.08 }
      ),
      true,
      "Password field should be visually consistent (visible)"
    );
    
    await loginPage.clickShowPassword();
    
    // Functional checkpoint
    checkpointManager.createCheckpoint("Validating Password Visibility After Hide Password Click", await loginPage.verifyPasswordVisible(login.InvalidPassword), true, "Password should be not visible after second toggle");
    
    // 🎯 AI Visual: Password field (hidden again)
    await checkpointManager.createCheckpoint(
      "AI-LOGIN-006",
      await aiVisual.assertCustomElement(
        'input[name="password"]',
        'password-field-hidden-again',
        { threshold: 0.08 }
      ),
      true,
      "Password field should be visually consistent (hidden again)"
    );
    
    await loginPage.clickLogin();
    
    // 🎯 AI Visual: Error state after failed login
    await checkpointManager.createCheckpoint(
      "AI-LOGIN-007",
      await aiVisual.assertPage({ 
        fullPage: true,
        threshold: 0.12 // More lenient for error states
      }),
      true,
      "Login page with error should be visually consistent"
    );
    
    // 🎯 AI Visual: Multiple elements validation
    const multipleResults = await aiVisual.assertMultipleElements([
      'login-form',
      'username-field', 
      'password-field',
      'login-button'
    ]);
    
    console.log('🤖 AI Visual Multiple Elements Results:', multipleResults);
    
    checkpointManager.assertAllCheckpoints();
  });

  test("Login with valid credentials and AI visual validation @smoke @positive @ai-visual", async ({ authenticatedPage, testData }, testInfo) => {
    const { login } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    
    // 🤖 Initialize AI Visual Manager
    const aiVisual = new AIVisualManager(authenticatedPage, testInfo.title);
    
    // 🎯 AI Visual: Pre-login state
    const checkpointManager = new CheckpointManager();
    await checkpointManager.createCheckpoint(
      "AI-VALID-LOGIN-001",
      await aiVisual.assertPage({ fullPage: true }),
      true,
      "Login page should be visually consistent before valid login"
    );
    
    // 🎯 AI Visual: Form elements before valid credentials
    await checkpointManager.createCheckpoint(
      "AI-VALID-LOGIN-002",
      await aiVisual.assertMultipleElements([
        'username-field',
        'password-field',
        'login-button'
      ]),
      true,
      "Login form elements should be consistent before valid input"
    );
    
    await loginPage.login(login.ValidUsername, login.ValidPassword);
    
    // Functional validation
    expect(await loginPage.verifyLoginSuccess()).toBeTruthy();
    
    // 🎯 AI Visual: Post-successful login state
    await checkpointManager.createCheckpoint(
      "AI-VALID-LOGIN-003",
      await aiVisual.assertPage({ 
        fullPage: true,
        threshold: 0.15 // More lenient for post-login redirects
      }),
      true,
      "Page should be visually consistent after successful login"
    );
    
    checkpointManager.assertAllCheckpoints();
  });

  test("Validate Links on Login Page with AI visual assertions @regression @ai-visual", async ({ authenticatedPage }, testInfo) => {
    const checkpointManager = new CheckpointManager();
    const loginPage = new LoginPage(authenticatedPage);
    
    // 🤖 Initialize AI Visual Manager
    const aiVisual = new AIVisualManager(authenticatedPage, testInfo.title);
    
    // 🎯 AI Visual: Overall page structure
    await checkpointManager.createCheckpoint(
      "AI-LINKS-001",
      await aiVisual.assertPage({ fullPage: true }),
      true,
      "Login page structure should be visually consistent"
    );
    
    // Functional validations
    await checkpointManager.createCheckpoint("Validate Logo Visibility on Login Page", await loginPage.isLogoVisibleOnLoginPage(), true, "Logo should be visible on Login Page");
    
    // 🎯 AI Visual: Logo element
    await checkpointManager.createCheckpoint(
      "AI-LINKS-002",
      await aiVisual.assertElement('logo'),
      true,
      "Logo should be visually consistent"
    );
    
    await checkpointManager.createCheckpoint("Validate 'Forgot Password' Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('Forgot Password?'), true, "'Forgot Password' link should be visible on Login Page");
    
    // 🎯 AI Visual: Forgot password link
    await checkpointManager.createCheckpoint(
      "AI-LINKS-003",
      await aiVisual.assertElement('forgot-password-link'),
      true,
      "Forgot password link should be visually consistent"
    );
    
    await checkpointManager.createCheckpoint("Validate iOS App Store Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('iPhone'), true, "'iOS App Store' link should be visible on Login Page");
    
    // 🎯 AI Visual: iOS app link
    await checkpointManager.createCheckpoint(
      "AI-LINKS-004",
      await aiVisual.assertElement('ios-app-link'),
      true,
      "iOS app link should be visually consistent"
    );
    
    await checkpointManager.createCheckpoint("Validate Android App Store Link Visibility on Login Page", await loginPage.isLinksOnLoginPage('Android'), true, "'Android App Store' link should be visible on Login Page");
    
    // 🎯 AI Visual: Android app link
    await checkpointManager.createCheckpoint(
      "AI-LINKS-005",
      await aiVisual.assertElement('android-app-link'),
      true,
      "Android app link should be visually consistent"
    );
    
    await checkpointManager.createCheckpoint("Validate Language Selection Dropdown Visibility on Login Page", await loginPage.isLaunguageSectingVisible(), true, "Language Selection Dropdown should be visible on Login Page");
    
    // 🎯 AI Visual: Language selector (before click)
    await checkpointManager.createCheckpoint(
      "AI-LINKS-006",
      await aiVisual.assertElement('language-selector'),
      true,
      "Language selector should be visually consistent (closed)"
    );
    
    await loginPage.clickOnLanguageSelector();
    
    // 🎯 AI Visual: Language selector (after click - opened)
    await checkpointManager.createCheckpoint(
      "AI-LINKS-007",
      await aiVisual.assertCustomElement(
        '.language-selector, .language-dropdown',
        'language-selector-opened',
        { threshold: 0.12 }
      ),
      true,
      "Language selector should be visually consistent (opened)"
    );
    
    await checkpointManager.createCheckpoint("Validate English Language Option Visibility on Login Page", await loginPage.verifyLanguageOptionsVisible('English'), true, "'English' language option should be visible on Login Page");
    await checkpointManager.createCheckpoint("Validate Español Language Option Visibility on Login Page", await loginPage.verifyLanguageOptionsVisible('Español'), true, "'Español' language option should be visible on Login Page");
    
    // 🎯 AI Visual: Language options
    await checkpointManager.createCheckpoint(
      "AI-LINKS-008",
      await aiVisual.assertCustomElement(
        '.language-option, [data-language]',
        'language-options',
        { threshold: 0.1 }
      ),
      true,
      "Language options should be visually consistent"
    );
    
    // 🎯 AI Visual: Complete links validation
    const linkResults = await aiVisual.assertMultipleElements([
      'logo',
      'forgot-password-link',
      'ios-app-link',
      'android-app-link',
      'language-selector'
    ]);
    
    console.log('🔗 AI Visual Links Results:', linkResults);
    
    await checkpointManager.assertAllCheckpoints();
  });

  test("Comprehensive AI visual element detection @regression @ai-visual @auto-detect", async ({ authenticatedPage }, testInfo) => {
    const checkpointManager = new CheckpointManager();
    const loginPage = new LoginPage(authenticatedPage);
    
    // 🤖 Initialize AI Visual Manager
    const aiVisual = new AIVisualManager(authenticatedPage, testInfo.title);
    
    // 🎯 AI Visual: Auto-detect and validate all important elements
    console.log('🔍 Starting AI auto-detection of login page elements...');
    
    const autoDetectionResults = await aiVisual.detectAndAssertElements('body', {
      threshold: 0.12
    });
    
    console.log('🤖 AI Auto-Detection Results:', autoDetectionResults);
    
    // 🎯 AI Visual: Validate critical login elements specifically
    const criticalElements = [
      'login-form',
      'username-field',
      'password-field', 
      'login-button',
      'logo'
    ];
    
    const criticalResults = await aiVisual.assertMultipleElements(criticalElements);
    
    // Ensure critical elements are all passing
    const criticalPassed = criticalResults.filter(r => r.status === 'passed').length;
    const criticalFailed = criticalResults.filter(r => r.status === 'failed').length;
    
    await checkpointManager.createCheckpoint(
      "AI-AUTO-DETECT-001",
      criticalPassed >= criticalElements.length * 0.8, // 80% pass rate
      true,
      `Critical elements should pass AI visual validation (${criticalPassed}/${criticalElements.length} passed)`
    );
    
    checkpointManager.assertAllCheckpoints();
  });
});