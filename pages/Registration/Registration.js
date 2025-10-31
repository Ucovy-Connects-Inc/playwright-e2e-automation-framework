// @ts-nocheck
import { CommonUtils } from '../../utils/CommonUtils.js';

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.registerLink = page.getByRole('link', { name: 'Register My Account' });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.emailAddress = page.getByRole('textbox', { name: 'Email Address' });
    this.ssn = page.getByRole('textbox', { name: 'Social Security Number / ITIN' });
    this.dob = page.getByRole('textbox', { name: 'Date of Birth' });
    this.street1 = page.getByRole('textbox', { name: 'Street Address 1' });
    this.street2 = page.getByRole('textbox', { name: 'Street Address 2' });
    this.city = page.getByRole('textbox', { name: 'City' });
    this.stateButton = page.getByRole('button', { name: 'State' });
    this.stateOption = page.getByText('Hawaii');
    this.zipCode = page.getByRole('textbox', { name: 'ZIP code' });
    this.mobilePhone = page.getByRole('textbox', { name: 'Mobile Phone Number' });
    this.homePhone = page.getByRole('textbox', { name: 'Home Phone Number' });
    this.relationDropdown = page.getByTestId('select').nth(1);
    this.relationOptionChild = page.getByText('Child');
    this.registerAsChildButton = page.getByRole('button', { name: 'Register as Child' });
    this.employeeOption = page.getByText('Employee', { exact: true });
    this.employerInput = page.getByRole('textbox', { name: "Employee's Employer or Union" });
    this.submitButton = page.getByRole('button', { name: 'submit' });
  }

  async clickOnRegisterAccount() {
    await this.registerLink.click();
  }

  async fillRegistrationForm(firstName, lastName, email, ssn, dob, street1, street2, city, zip, mobile, home, employer) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailAddress.fill(email);
    await this.ssn.fill(ssn);
    await this.dob.fill(dob);
    await this.street1.fill(street1);
    await this.street2.fill(street2);
    await this.city.fill(city);
    await this.stateButton.click();
    await this.stateOption.click();
    await this.zipCode.fill(zip);
    await this.mobilePhone.fill(mobile);
    await this.homePhone.fill(home);
    await this.relationDropdown.click();
    await this.relationOptionChild.click();
    await this.registerAsChildButton.click();
    await this.employeeOption.click();
    await this.employerInput.fill(employer);
  }

  async submitRegistration() {
    await CommonUtils.scrollToElement(this.page, 'button[name="submit"]');
    await this.submitButton.click();
  }
}