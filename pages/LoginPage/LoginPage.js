// LoginPage: encapsulates interactions and verifications for the application's login screen.
// Uses DOM healing utilities to make selectors resilient to UI changes.
// Exposes methods for navigating, performing login flows, checking visibility and retrieving error text.
import { CommonUtils } from "../../utils/CommonUtils.js";
import { captureDomSnapshot, findAlternativeSelector, findAlternativeSelectorInPage, healingFill, healingIsVisible } from '../../utils/DomHealingUtils.js';
import fs from 'fs';
import path from 'path';

export class LoginPage {
  constructor(page) {
    // Store Playwright page instance for use across methods
    this.page = page;
    // Intentionally wrong selector for email to demonstrate healing
    this.EmailSelector = '//input[@id="sign_in__username"]';
    this.passwordInput = '//input[@id="sign_in__password"]';
    this.loginButton = page.locator('//button[text()="Sign In"]');
    this.errorMessage = page.locator('.MuiAlert-message');
    this.loginSuccessIndicator = page.locator('//div[contains(@class,"MuiTabs-root _tabs__root_1m7qh_1 tabs")]');
    this.showpasswordToggle = page.locator('//button[@class="_password-field__toggle-visibility_qol9b_1"]');
  }

  // Navigate to the application's root (login) and wait for DOM content to load
  async navigate() {
    await this.page.goto("/");
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Perform full login flow using healingFill for both fields and then click Sign In
  async login(email, password) {
    await healingFill(this.page, this.EmailSelector, email, 'sign_in__username', 'login-healing');
    await this.page.waitForTimeout(1000); // reduced delay for testing
    await healingFill(this.page, this.passwordInput, password, 'sign_in__password', 'loginPass-healing');
    await this.loginButton.click();
  }

  // Enter username only (uses healingFill to tolerate selector changes)
  async enterUsername(username) {
    await healingFill(this.page, this.EmailSelector, username, 'sign_in__username', 'login-healing');
  }

  // Enter password only (uses healingFill to tolerate selector changes)
  async enterPassword(password) {
    await healingFill(this.page, this.passwordInput, password, 'sign_in__password', 'loginPass-healing');
  }

  // Click the Sign In button
  async clickLogin() {
    await this.loginButton.click();
  }

  // Return error message text content shown on the page
  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  // Wait for network to be idle and a short pause, then check whether the success indicator is visible
  async verifyLoginSuccess() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);
    return this.loginSuccessIndicator.isVisible();
  }

  // Click the show/hide password toggle button
  async clickShowPassword() {
    await this.showpasswordToggle.click();
  }

  // Verify whether the password field is visible as masked (returns visibility of password input of type password)
  async verifyPasswordVisible(expectedPassword) {
    const passwordValue = await this.page.locator('//input[@id="sign_in__password" and @type="password"]');
    return passwordValue.isVisible();
  }

  // Check if the logo element is visible on the login page using healingIsVisible
  async isLogoVisibleOnLoginPage() {
    await this.page.waitForLoadState('networkidle');
    // Using self-healing visibility check
    return await healingIsVisible(this.page, '//h1[@class="_login__logo-container_15juy_1"]', 'login__logo-container', 'logo-healing');
  }

  // Check visibility of a link by its visible text
  async isLinksOnLoginPage(linkName) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    const link = this.page.locator(`//a[text()="${linkName}"]`);
    return await link.isVisible();
  }

  // Check visibility of the language selection element (English shown by default)
  async isLaunguageSectingVisible() {
    const languageSelector = this.page.locator('//div[text()="English"]');
    return await languageSelector.isVisible();
  }

  // Click the language selector to open language options
  async clickOnLanguageSelector() {
    const languageSelector = this.page.locator('//div[text()="English"]');
    await languageSelector.click();
  }

  // Verify a specific language option is visible in the language list
  async verifyLanguageOptionsVisible(optionName) {
    const option = this.page.locator(`//p[text()="${optionName}"]`);
    return option.isVisible();
  }

  /**
   * Verify if button element is visible using XPath text selector
   * @param {string} buttonText - The exact text of the button
   * @returns {Promise<boolean>} - True if button is visible, false otherwise
   */
  async verifyButtonVisible(buttonText) {
    await CommonUtils.waitForPageLoad(this.page);

    const buttonSelector = `//button[text()="${buttonText}"]`;

    try {
      // Wait for element and check visibility
      await this.page.locator(buttonSelector).waitFor({ state: 'visible', timeout: 10000 });

      // Using self-healing visibility check
      return await healingIsVisible(
        this.page,
        buttonSelector,
        buttonText,
        `button - ${buttonText.replace(/\s+/g, '-').toLowerCase()} - visible - healing`
      );
    } catch (error) {
      console.log(`Button "${buttonText}" not visible:`, error.message);
      return false;
    }
  }

  /**
   * Verify if anchor/link element is visible using XPath text selector
   * @param {string} linkText - The exact text of the link
   * @returns {Promise<boolean>} - True if link is visible, false otherwise
   */
  async verifyLinkVisible(linkText) {
    await CommonUtils.waitForPageLoad(this.page);

    const linkSelector = `//a[text()="${linkText}"]`;

    try {
      // Wait for element and check visibility
      await this.page.locator(linkSelector).waitFor({ state: 'visible', timeout: 10000 });

      // Using self-healing visibility check
      return await healingIsVisible(
        this.page,
        linkSelector,
        linkText,
        `link - ${linkText.replace(/\s+/g, '-').toLowerCase()} - visible - healing`
      );
    } catch (error) {
      console.log(`Link "${linkText}" not visible:`, error.message);
      return false;
    }
  }

  /**
   * Verify if span element is visible using XPath text selector
   * @param {string} spanText - The exact text of the span
   * @returns {Promise<boolean>} - True if span is visible, false otherwise
   */
  async verifyElementVisible(spanText) {
    await CommonUtils.waitForPageLoad(this.page);

    const spanSelector = `//span[text()="${spanText}"]`;

    try {
      await this.page.locator(spanSelector).waitFor({ state: 'visible', timeout: 10000 });
      return await healingIsVisible(
        this.page,
        spanSelector,
        spanText,
        `span - ${spanText.replace(/\s+/g, '-').toLowerCase()} - visible - healing`
      );
    } catch (error) {
      console.log(`Span "${spanText}" not visible:`, error.message);
      return false;
    }
  }


}