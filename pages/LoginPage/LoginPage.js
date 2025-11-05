import { captureDomSnapshot, findAlternativeSelector, findAlternativeSelectorInPage, healingFill } from '../../utils/DomHealingUtils.js';
import fs from 'fs';
import path from 'path';

export class LoginPage {
  constructor(page) {
    this.page = page;
    // Intentionally wrong selector for email to demonstrate healing
    this.wrongEmailSelector = '//input[@id="wrong_email_id"]';
    this.passwordInput = '//input[@id="sign_in__password"]';
    this.loginButton = page.locator('//button[text()="Sign In"]');
    this.errorMessage = page.locator('//div[text()="Username or password is incorrect"]');
  }

  async navigate(url = '/') {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email, password) {

    await healingFill(this.page, this.wrongEmailSelector, email, 'sign_in__username', 'login-healing');
    await this.page.waitForTimeout(1000); // reduced delay for testing
    await healingFill(this.page, this.passwordInput, password, 'sign_in__password', 'loginPass-healing');
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}