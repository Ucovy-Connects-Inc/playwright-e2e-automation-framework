export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('//input[@id="sign_in__username"]');
    this.passwordInput = page.locator('//input[@id="sign_in__password"]');
    this.loginButton = page.locator('//button[text()="Sign In"]');
    this.errorMessage = page.locator('//div[text()="Username or password is incorrect"]');
  }

  async navigate(url = '/') {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.page.waitForTimeout(10000); // 10-second delay
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}