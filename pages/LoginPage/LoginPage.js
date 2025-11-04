import { captureDomSnapshot, findAlternativeSelector, findAlternativeSelectorInPage } from '../../utils/DomHealingUtils.js';
import fs from 'fs';
import path from 'path';

export class LoginPage {
  constructor(page) {
    this.page = page;
    // Intentionally wrong selector for email to demonstrate healing
    this.wrongEmailSelector = '//input[@id="wrong_email_id"]';
    this.passwordInput = page.locator('//input[@id="sign_in__password"]');
    this.loginButton = page.locator('//button[text()="Sign In"]');
    this.errorMessage = page.locator('//div[text()="Username or password is incorrect"]');
  }

  async navigate(url = '/') {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email, password) {
    const wrongLocator = this.page.locator(this.wrongEmailSelector);
    const count = await wrongLocator.count();
    if (count > 0) {
      // wrong selector exists on the page — use it
      await wrongLocator.fill(email);
    } else {
      // wrong selector not found — attempt healing
      console.log('Original selector not found, attempting to heal...');

      // Capture current DOM and get the snapshot path
      const snapshotPath = await captureDomSnapshot(this.page, 'login-healing');

      // Ensure DOM is stable (best-effort) before reading the file
      await this.page.waitForLoadState('networkidle').catch(() => {});

      // Read the captured DOM
      const domHtml = fs.readFileSync(snapshotPath, 'utf8');
      console.log('Saved DOM snapshot:', snapshotPath, ' (size:', domHtml.length, 'bytes)');

      // Try to find alternative selector using the original id as hint (offline parse)
      let healedSelector = findAlternativeSelector(domHtml, 'sign_in__username');
      if (!healedSelector) {
        console.log('No selector found in snapshot; attempting in-page heuristic...');
        healedSelector = await findAlternativeSelectorInPage(this.page, 'sign_in__username');
        console.log('In-page heuristic returned:', healedSelector);
      }

      if (healedSelector) {
        console.log('Found healed selector:', healedSelector);
        // Use the healed selector
        await this.page.locator(healedSelector).fill(email);
      } else {
        throw new Error('Could not find alternative selector for email input');
      }
    }

    await this.page.waitForTimeout(1000); // reduced delay for testing
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}