// @ts-nocheck
import { CommonUtils } from "../../utils/CommonUtils.js";
import { healingClick } from "../../utils/DomHealingUtils.js";

export class AdminLoginPage {
    constructor(page) {
        this.page = page;

        // Alternative selectors in case the above don't work
        this.username = page.locator('input[id="user_session_login"], input[type="text"]');
        this.password = page.locator('input[type="password"]');
        this.submit = page.locator('//input[@value="Submit Legacy Credentials"]');

        //admin page locators
        this.potentials = page.locator('//a[span[text()="Potentials"]]');
        this.convertToUserButton = page.locator('//button[@id="convert-to-user"]');

    }
    async navigateToAdminPortal() {
        const adminUrl = 'https://admin.qa.marathon-health.net/sign_in';
        await this.page.goto(adminUrl, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('text=Admin Portal Legacy Credentials', { timeout: 10000 });
    }

    async fillUsername(username) {
        await this.username.fill(username);
    }

    async fillPassword(password) {
        await this.password.fill(password);
    }

    // Click submit button
    async clickSubmit() {
        await this.submit.click();
    }

    /**
     * Complete admin login process
     * @param {string} username - Username or email
     * @param {string} password - Password
     */
    async adminLogin(username, password) {
        console.log('🔐 Starting admin login process...');

        await this.navigateToAdminPortal();
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickSubmit();

        // Wait for login to process
        await this.page.waitForLoadState('networkidle');
    }
    async clickPotentials(email) {
        if (email) {
            await this.potentials.click();
            const potentialUserLocator = this.page.locator(`//a[contains(text(), "${email}")]`);
            await potentialUserLocator.click();
        } else {
            await this.potentials.click();
        }
    }

    async clickConvertUser() {
        await this.convertToUserButton.click();
    }
}