export class CommonUtils {

  static async waitForPageLoad(page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  }

  static async waitForVisible(page, selector) {
    if (typeof selector === 'string') {
      await page.waitForSelector(selector, { state: 'visible' });
    } else {
      // If selector is already a locator object, use its waitFor method
      await selector.waitFor({ state: 'visible' });
    }
  }

  static async waitForHidden(page, selector) {
    if (typeof selector === 'string') {
      await page.waitForSelector(selector, { state: 'hidden' });
    } else {
      // If selector is already a locator object, use its waitFor method
      await selector.waitFor({ state: 'hidden' });
    }
  }

  static async scrollToElement(page, selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  static async clickElement(page, selector) {
    await this.waitForVisible(page, selector);
    if (typeof selector === 'string') {
      await page.locator(selector).click();
    } else {
      await selector.click();
    }
  }

  static async typeText(page, selector, text) {
    await this.waitForVisible(page, selector);
    if (typeof selector === 'string') {
      await page.locator(selector).fill(text);
    } else {
      await selector.fill(text);
    }
  }

  static async waitForText(page, text) {
    await page.waitForSelector(`text=${text}`);
  }

  // Generate random string
  static generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate timestamp
  static generateTimestamp() {
    return Date.now().toString();
  }

  // Generate random date between 1980-2000
  static generateRandomDOB() {
    const startYear = 1980;
    const endYear = 2000;
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // Using 28 to avoid invalid dates
    
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  }

  // Generate random street address
  static generateRandomAddress() {
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const randomString = this.generateRandomString(5);
    return `${streetNumber} Test St ${randomString}`;
  }

  // Generate valid 10-digit phone number with strict requirements
  static generateValidPhoneNumber() {
    let phoneNumber;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loop
    
    do {
      attempts++;
      phoneNumber = this.generatePhoneNumberAttempt();
    } while (!this.isValidPhoneNumber(phoneNumber) && attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      throw new Error('Could not generate valid phone number after maximum attempts');
    }
    
    return phoneNumber;
  }

  // Helper method to generate a single phone number attempt
  static generatePhoneNumberAttempt() {
    let phoneNumber = '';
    
    // First 3 digits (area code): avoid 100-199, avoid starting with 1 or 11
    let areaCode;
    do {
      const firstDigit = Math.floor(Math.random() * 9) + 2; // 2-9, excludes 0,1
      const secondDigit = Math.floor(Math.random() * 10); // 0-9
      const thirdDigit = Math.floor(Math.random() * 10); // 0-9
      areaCode = `${firstDigit}${secondDigit}${thirdDigit}`;
    } while (
      parseInt(areaCode) >= 100 && parseInt(areaCode) <= 199 || // Not 100-199
      areaCode.startsWith('1') // Not starting with 1
    );
    
    phoneNumber += areaCode;
    
    // Next 3 digits (exchange): avoid 555 in positions 4-6 (3-5 in 0-indexed)
    let exchange;
    do {
      exchange = '';
      for (let i = 0; i < 3; i++) {
        exchange += Math.floor(Math.random() * 10);
      }
    } while (exchange === '555');
    
    phoneNumber += exchange;
    
    // Last 4 digits (subscriber number)
    for (let i = 0; i < 4; i++) {
      phoneNumber += Math.floor(Math.random() * 10);
    }
    
    return phoneNumber;
  }

  // Helper method to validate phone number against all requirements
  static isValidPhoneNumber(phoneNumber) {
    // Check length
    if (phoneNumber.length !== 10) return false;
    
    // Check if starts with 1 or 11
    if (phoneNumber.startsWith('1')) return false;
    
    // Check if area code is between 100-199
    const areaCode = parseInt(phoneNumber.substring(0, 3));
    if (areaCode >= 100 && areaCode <= 199) return false;
    
    // Check if positions 4-6 are 555 (3-5 in 0-indexed)
    if (phoneNumber.substring(3, 6) === '555') return false;
    
    // Check for sequence "4567890"
    if (phoneNumber.includes('4567890')) return false;
    
    // Check if any digit repeats 7 times in the last 7 digits
    const last7Digits = phoneNumber.substring(3); // Last 7 digits
    for (let digit = 0; digit <= 9; digit++) {
      const digitStr = digit.toString();
      const count = (last7Digits.match(new RegExp(digitStr, 'g')) || []).length;
      if (count >= 7) return false;
    }
    
    return true;
  }




  // Wait for element to contain given text
  static async waitForElementText(locator, expectedText) {
    await locator.waitFor();
    const actualText = await locator.textContent();
    if (!actualText?.includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}" not found. Got: "${actualText}"`);
    }
  }
}