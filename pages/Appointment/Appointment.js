import { CommonUtils } from "../../utils/CommonUtils.js";
import { healingIsVisible, healingClick } from "../../utils/DomHealingUtils.js";

export class AppointmentPage {
  constructor(page) {
    this.page = page;
    this.appointmentLink = page.getByRole('tab', { name: 'Appointments' });
    this.searchInput = page.locator('//input[@placeholder="Search by symptom, condition, or illness"]');
    this.inPersonVisitButton = page.locator('//button[text()="In-person Visit"]');
    this.virtualVisitButton = page.locator('//button[@id="scheduling-virtual-visit-button"]');
  }

  /**
   * Get state dropdown selector dynamically
   * @param {string} stateValue - The state value (e.g., "IN", "CA", "NY", etc.)
   * @returns {Locator} - The locator for the state dropdown option
   */
  getStateDropdownSelector(stateValue) {
    return this.page.locator(`//input[@id="input_state-select-id" and @value="${stateValue}"]`);
  }

  /**
   * Get the current value of the state dropdown
   * @returns {Promise<string>} - The current value of the state dropdown
   */
  async getState() {
    await CommonUtils.waitForPageLoad(this.page);
    
    try {
      // Get the state dropdown element and return its value
      const stateDropdown = this.page.locator(`//input[@id="input_state-select-id"]`);
      const stateValue = await stateDropdown.getAttribute('value');
      console.log(`Current state dropdown value: ${stateValue}`);
      return stateValue || '';
    } catch (error) {
      console.error('Error getting state dropdown value:', error);
      return '';
    }
  }

  /**
   * Get location radio button selector dynamically
   * @param {string} value - The value of the location radio button (e.g., "home", "office")
   * @returns {Locator} - The locator for the location radio button
   */
  getLocationRadioSelector(value) {
    return this.page.locator(`//input[@name="location-radio-group" and @value="${value}"]`);
  }

  /**
   * Get distance radio button selector dynamically
   * @param {string} value - The value of the distance radio button (e.g., "25", "50", "100")
   * @returns {Locator} - The locator for the distance radio button
   */
  getDistanceRadioSelector(value) {
    return this.page.locator(`//input[@name="distance-radio-group" and @value="${value}"]`);
  }

    async navigateToAppointments() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.appointmentLink.click();
    }
    
    /**
     * Verify if appointment dropdown option is visible
     * @param {string} optionName - Name of the appointment option to verify
     * @returns {Promise<boolean>} - True if option is visible, false otherwise
     */
    async verifyAppointmentDropdownOptionVisible(optionName) {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using getByRole selector as provided
        const optionSelector = `role=menuitem[name="${optionName}"]`;
        
        // Using self-healing visibility check
        return await healingIsVisible(
            this.page, 
            optionSelector, 
            optionName, 
            `appointment-dropdown-${optionName.replace(/\s+/g, '-').toLowerCase()}-healing`
        );
    }

    /**
     * Click on appointment dropdown option with self-healing
     * @param {string} optionName - Name of the appointment option to click
     * @returns {Promise<void>}
     */
    async clickAppointmentDropdownOption(optionName) {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using getByRole selector as provided
        const optionSelector = `//span[text()="${optionName}"]`;
        
        // Using self-healing click
        await healingClick(
            this.page, 
            optionSelector, 
            optionName, 
            `appointment-click-${optionName.replace(/\s+/g, '-').toLowerCase()}-healing`
        );
    }

    /**
     * Validate Schedule an Appointment header is visible
     * @returns {Promise<boolean>} - True if header is visible, false otherwise
     */
    async validateScheduleAppointmentHeader() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.waitForTimeout(1000);
        // Using getByRole selector as provided for heading
        const headerSelector = `//h1[text()="Schedule an Appointment"]`;
        
        // Using self-healing visibility check for header
        return await healingIsVisible(
            this.page, 
            headerSelector, 
            'Schedule an Appointment', 
            'schedule-appointment-header-healing'
        );
    }

    /**
     * Validate reason for visit section text is visible
     * @returns {Promise<boolean>} - True if reason section is visible, false otherwise
     */
    async validateReasonForVisitSection() {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using the provided selector for reason select
        const reasonSelectorElement = `//div[@id="reason-select-id"]`;
        
        // Using self-healing visibility check
        return await healingIsVisible(
            this.page, 
            reasonSelectorElement, 
            'reason-select-id', 
            'reason-for-visit-section-healing'
        );
    }

    /**
     * Validate emergency reasons link is visible
     * @returns {Promise<boolean>} - True if emergency link is visible, false otherwise
     */
    async validateEmergencyReasonsLink() {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using the provided selector for emergency reasons link
        const emergencyLinkSelector = `//button[contains(@class,"_emergency-reasons-link_jp0c5_13")]`;
        
        // Using self-healing visibility check
        return await healingIsVisible(
            this.page, 
            emergencyLinkSelector, 
            'emergency-reasons-link', 
            'emergency-reasons-link-healing'
        );
    }

    /**
     * Validate phone number link is visible
     * @returns {Promise<boolean>} - True if phone number link is visible, false otherwise
     */
    async validatePhoneNumberLink() {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using the provided selector for phone number link
        const phoneNumberSelector = `//a[text()="888-830-6538"]`;
        
        // Using self-healing visibility check
        return await healingIsVisible(
            this.page, 
            phoneNumberSelector, 
            '888-830-6538', 
            'phone-number-link-healing'
        );
    }

    /**
     * Click on emergency reasons link
     * @returns {Promise<void>}
     */
    async clickEmergencyReasonsLink() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const emergencyLinkSelector = `//button[contains(@class,"_emergency-reasons-link_jp0c5_13")]`;
        
        // Using self-healing click
        await healingClick(
            this.page, 
            emergencyLinkSelector, 
            'emergency-reasons-link', 
            'emergency-reasons-click-healing'
        );
    }

    /**
     * Click on phone number link
     * @returns {Promise<void>}
     */
    async clickPhoneNumberLink() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const phoneNumberSelector = `//a[text()="888-830-6538"]`;
        
        // Using self-healing click
        await healingClick(
            this.page, 
            phoneNumberSelector, 
            '888-830-6538', 
            'phone-number-click-healing'
        );
    }

    /**
     * Validate complete list link is visible
     * @returns {Promise<boolean>} - True if complete list link is visible, false otherwise
     */
    async validateCompleteListLink() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const completeListSelector = `//a[text()="complete list"]`;
        
        return await healingIsVisible(
            this.page, 
            completeListSelector, 
            'complete list', 
            'complete-list-link-healing'
        );
    }

    /**
     * Validate search availability section is enabled
     * @returns {Promise<boolean>} - True if search availability is enabled, false otherwise
     */
    async validateSearchAvailabilityEnabled() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.waitForTimeout(1000);
        const searchAvailabilitySelector = `//button[contains(@class,"_submit-button_agx3b_25")]`;
        
        try {
            // Check if element is enabled (not disabled)
            const element = this.page.locator(searchAvailabilitySelector);
            const isEnabled = await element.isEnabled();
            
            console.log(`[SearchAvailability] Element enabled: ${isEnabled}`);
            return isEnabled;
            
        } catch (error) {
            console.log(`[SearchAvailability] Error checking enabled state: ${error.message}`);
            return false;
        }
    }

    /**
     * Validate looking for scheduled appointment section is visible
     * @returns {Promise<boolean>} - True if scheduled appointment section is visible, false otherwise
     */
    async validateLookingForScheduledAppointmentSection() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const scheduledAppointmentSelector = `//a[text()="View and Manage Appointments"]`;
        
        return await healingIsVisible(
            this.page, 
            scheduledAppointmentSelector, 
            'View and Manage Appointments', 
            'scheduled-appointment-section-healing'
        );
    }

    /**
     * Validate need help section is visible
     * @returns {Promise<boolean>} - True if need help section is visible, false otherwise
     */
    async validateNeedHelpSection() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const needHelpSelector = `//button[contains(@class,"_request-callback__button_w45e5_1")]`;
        
        return await healingIsVisible(
            this.page, 
            needHelpSelector, 
            'request-callback__button', 
            'need-help-section-healing'
        );
    }

    /**
     * Validate quick links section is visible
     * @returns {Promise<boolean>} - True if quick links section is visible, false otherwise
     */
    async validateQuickLinksSection() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const quickLinksSelector = `//ul[contains(@class,"MuiList-padding _quick-links__list_1tnmt_1")]`;
        
        return await healingIsVisible(
            this.page, 
            quickLinksSelector, 
            'quick-links__list', 
            'quick-links-section-healing'
        );
    }

    /**
     * Click on complete list link
     * @returns {Promise<void>}
     */
    async clickCompleteListLink() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const completeListSelector = `//a[text()="complete list"]`;
        
        await healingClick(
            this.page, 
            completeListSelector, 
            'complete list', 
            'complete-list-click-healing'
        );
    }

    /**
     * Click on search availability section
     * @returns {Promise<void>}
     */
    async clickSearchAvailability() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const searchAvailabilitySelector = `//div[@title="Search Availability"]`;
        
        await healingClick(
            this.page, 
            searchAvailabilitySelector, 
            'Search Availability', 
            'search-availability-click-healing'
        );
    }

    /**
     * Click on View and Manage Appointments link
     * @returns {Promise<void>}
     */
    async clickViewAndManageAppointments() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const scheduledAppointmentSelector = `//a[text()="View and Manage Appointments"]`;
        
        await healingClick(
            this.page, 
            scheduledAppointmentSelector, 
            'View and Manage Appointments', 
            'view-manage-appointments-click-healing'
        );
    }

    /**
     * Click on need help button
     * @returns {Promise<void>}
     */
    async clickNeedHelpButton() {
        await CommonUtils.waitForPageLoad(this.page);
        
        const needHelpSelector = `//button[contains(@class,"_request-callback__button_w45e5_1")]`;
        
        await healingClick(
            this.page, 
            needHelpSelector, 
            'request-callback__button', 
            'need-help-click-healing'
        );
    }

    /**
     * Click on search input field (Search by symptom, condition, or illness)
     * @returns {Promise<void>}
     */
    async clickSearchInput() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.waitForTimeout(1000);
        // Using constructor locator with self-healing click
        await healingClick(
            this.page, 
            this.searchInput._selector, 
            'Search by symptom, condition, or illness', 
            'search-input-click-healing'
        );
    }

    /**
     * Validate search input field is visible
     * @returns {Promise<boolean>} - True if search input is visible, false otherwise
     */
    async validateSearchInputVisible() {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using constructor locator with self-healing visibility check
        return await healingIsVisible(
            this.page, 
            this.searchInput, 
            'Search by symptom, condition, or illness', 
            'search-input-visible-healing'
        );
    }

    async selectSearchResult(resultText) {
        await CommonUtils.waitForPageLoad(this.page);
       await this.page.locator('div').filter({ hasText: new RegExp(`^${resultText}$`) }).nth(4).click();
    }

    /**
     * Click location radio button with self-healing
     * @param {string} value - The value of the location radio button (e.g., "home", "office")
     * @returns {Promise<void>}
     */
    async clickLocationRadio(value) {
        await CommonUtils.waitForPageLoad(this.page);
        
        const locationRadioSelector = `//input[@name="location-radio-group" and @value="${value}"]`;
        
        // Using dynamic selector with self-healing click
        await healingClick(
            this.page,
            locationRadioSelector,
            `Location radio button with value: ${value}`,
            `location-${value}-radio-healing`
        );
    }

    /**
     * Validate if location radio button is checked
     * @param {string} value - The value of the location radio button (e.g., "home", "office")
     * @returns {Promise<boolean>} - True if location radio is checked, false otherwise
     */
    async validateLocationRadioChecked(value) {
        await CommonUtils.waitForPageLoad(this.page);
        
        try {
            // Get dynamic locator and check if it's checked
            const locationRadio = this.getLocationRadioSelector(value);
            const isChecked = await locationRadio.isChecked();
            console.log(`Location radio button (${value}) checked status: ${isChecked}`);
            return isChecked;
        } catch (error) {
            console.error(`Error checking location radio button (${value}) status:`, error);
            return false;
        }
    }

    /**
     * Click distance radio button with self-healing
     * @param {string} value - The value of the distance radio button (e.g., "25", "50", "100")
     * @returns {Promise<void>}
     */
    async clickDistanceRadio(value) {
        await CommonUtils.waitForPageLoad(this.page);
        
        const distanceRadioSelector = `//input[@name="distance-radio-group" and @value="${value}"]`;
        
        // Using dynamic selector with self-healing click
        await healingClick(
            this.page,
            distanceRadioSelector,
            `Distance radio button with value: ${value} miles`,
            `distance-${value}-radio-healing`
        );
    }

    /**
     * Validate if distance radio button is checked
     * @param {string} value - The value of the distance radio button (e.g., "25", "50", "100")
     * @returns {Promise<boolean>} - True if distance radio is checked, false otherwise
     */
    async validateDistanceRadioChecked(value) {
        await CommonUtils.waitForPageLoad(this.page);
        
        try {
            // Get dynamic locator and check if it's checked
            const distanceRadio = this.getDistanceRadioSelector(value);
            const isChecked = await distanceRadio.isChecked();
            console.log(`Distance radio button (${value} miles) checked status: ${isChecked}`);
            return isChecked;
        } catch (error) {
            console.error(`Error checking distance radio button (${value}) status:`, error);
            return false;
        }
    }

    /**
     * Click virtual visit button with self-healing
     * @returns {Promise<void>}
     */
    async clickVirtualVisitButton() {
        await CommonUtils.waitForPageLoad(this.page);
        
        // Using constructor locator with self-healing click
        await healingClick(
            this.page,
            this.virtualVisitButton._selector,
            'Virtual Visit button',
            'virtual-visit-button-healing'
        );
    }

    /**
     * Validate if state is visible by default in the dropdown
     * @param {string} stateValue - The state value to validate (e.g., "IN", "CA", "NY")
     * @returns {Promise<boolean>} - True if state is visible by default, false otherwise
     */
    async validateStateSelectedByDefault(stateValue) {
        await CommonUtils.waitForPageLoad(this.page);
        
        try {
            // Get dynamic state dropdown locator and check if it's visible
            const stateDropdown = this.getStateDropdownSelector(stateValue);
            const isVisible = await stateDropdown.isVisible();
            console.log(`State (${stateValue}) visible by default status: ${isVisible}`);
            return isVisible;
        } catch (error) {
            console.error(`Error checking state (${stateValue}) default visibility:`, error);
            return false;
        }
    }

    /**
     * Select common visit reason dynamically
     * @param {string} reasonText - The text of the visit reason to select (e.g., "Health Coaching", "Annual Physical", etc.)
     * @returns {Promise<void>}
     */
    async selectCommonVisitReason(reasonText) {
        await CommonUtils.waitForPageLoad(this.page);
        
        const visitReasonSelector = `//div[text()="${reasonText}"]`;
        
        // Using dynamic selector with self-healing click
        await healingClick(
            this.page,
            visitReasonSelector,
            `Common visit reason: ${reasonText}`,
            `visit-reason-${reasonText.replace(/\s+/g, '-').toLowerCase()}-healing`
        );
    }

    /**
     * Validate if common visit reason is visible
     * @param {string} reasonText - The text of the visit reason to validate (e.g., "Health Coaching", "Annual Physical", etc.)
     * @returns {Promise<boolean>} - True if visit reason is visible, false otherwise
     */
    async validateCommonVisitReasonVisible(reasonText) {
        await CommonUtils.waitForPageLoad(this.page);
        
        const visitReasonSelector = `//div[text()="${reasonText}"]`;
        
        // Using self-healing visibility check
        return await healingIsVisible(
            this.page,
            visitReasonSelector,
            `Common visit reason: ${reasonText}`,
            `visit-reason-${reasonText.replace(/\s+/g, '-').toLowerCase()}-visible-healing`
        );
    }

}