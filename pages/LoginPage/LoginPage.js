import { captureDomSnapshot, findAlternativeSelector, findAlternativeSelectorInPage, healingFill, healingIsVisible } from '../../utils/DomHealingUtils.js';
import fs from 'fs';
import path from 'path';
 
export class LoginPage {
  constructor(page) {
    this.page = page;
    // Intentionally wrong selector for email to demonstrate healing
    this.EmailSelector = '//input[@id="sign_in__username"]';
    this.passwordInput = '//input[@id="sign_in__password"]';
    this.loginButton = page.locator('//button[text()="Sign In"]');
    this.errorMessage = page.locator('.MuiAlert-message');
    this.loginSuccessIndicator = page.locator('//div[contains(@class,"MuiTabs-root _tabs__root_1m7qh_1 tabs")]');
    this.showpasswordToggle = page.locator('//button[@class="_password-field__toggle-visibility_qol9b_1"]');
  }
 
  async navigate(url = '/') {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }
 
  async login(email, password) {
 
    await healingFill(this.page, this.EmailSelector, email, 'sign_in__username', 'login-healing');
    await this.page.waitForTimeout(1000); // reduced delay for testing
    await healingFill(this.page, this.passwordInput, password, 'sign_in__password', 'loginPass-healing');
    await this.loginButton.click();
  }

  async enterUsername(username) {
    await healingFill(this.page, this.EmailSelector, username, 'sign_in__username', 'login-healing');
  }

  async enterPassword(password) {
    await healingFill(this.page, this.passwordInput, password, 'sign_in__password', 'loginPass-healing');
  }
  async clickLogin() {
    await this.loginButton.click();
  }
 
  async getErrorMessage()  {
    return this.errorMessage.textContent();
  }

  async verifyLoginSuccess() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); 
    
    return this.loginSuccessIndicator.isVisible();
    
  }

  async clickShowPassword() {
    await this.showpasswordToggle.click();
  }

  async verifyPasswordVisible(expectedPassword) {
    const passwordValue = await this.page.locator('//input[@id="sign_in__password" and @type="password"]');
    return passwordValue.isVisible();
  }

  async isLogoVisibleOnLoginPage() {
    await this.page.waitForLoadState('networkidle');
    // Using self-healing visibility check
    return await healingIsVisible(this.page, '//h1[@class="_login__logo-container_15juy_1"]', 'login__logo-container', 'logo-healing');
  }

  async isLinksOnLoginPage(linkName) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    const link = this.page.locator(`//a[text()="${linkName}"]`);
    return await link.isVisible();
  }

  async isLaunguageSectingVisible() {
    const languageSelector =  this.page.locator('//div[text()="English"]');
    return await languageSelector.isVisible();
  }

  async clickOnLanguageSelector() {
    const languageSelector = this.page.locator('//div[text()="English"]');
    await languageSelector.click();
  }

  async verifyLanguageOptionsVisible(optionName) {
    const option = this.page.locator(`//p[text()="${optionName}"]`);
    return option.isVisible();
  }


}