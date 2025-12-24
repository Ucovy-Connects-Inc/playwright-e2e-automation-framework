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
            // Wait for state dropdown to be visible
            const stateDropdown = this.page.locator(`//input[@id="input_state-select-id"]`);
            await stateDropdown.waitFor({ state: 'visible', timeout: 50000 });

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
        await this.appointmentLink.waitFor({ state: 'visible', timeout: 50000 });
        await this.appointmentLink.click();
    }

    /**
     * Verify if appointment dropdown option is visible
     * @param {string} optionName - Name of the appointment option to verify
     * @returns {Promise<boolean>} - True if option is visible, false otherwise
     */
    async verifyAppointmentDropdownOptionVisible(optionName) {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.locator(`role=menuitem[name="${optionName}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//span[text()="${optionName}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//h1[text()="Schedule an Appointment"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//div[@id="reason-select-id"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//button[contains(@class,"_emergency-reasons-link_jp0c5_13")]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//a[text()="866-434-3255"]`).waitFor({ state: 'visible', timeout: 50000 });

        // Using the provided selector for phone number link
        const phoneNumberSelector = `//a[text()="866-434-3255"]`;

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
        await this.page.locator(`//button[contains(@class,"_emergency-reasons-link_jp0c5_13")]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//a[text()="888-830-6538"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//a[text()="complete list"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//button[contains(@class,"_submit-button_agx3b_25")]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//a[text()="View and Manage Appointments"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//button[contains(@class,"_request-callback__button_w45e5_1")]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//ul[contains(@class,"MuiList-padding _quick-links__list_1tnmt_1")]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//a[text()="complete list"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//div[@title="Search Availability"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//a[text()="View and Manage Appointments"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//button[contains(@class,"_request-callback__button_w45e5_1")]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.searchInput.waitFor({ state: 'visible', timeout: 50000 });

        // Using constructor locator with self-healing click
        await healingClick(
            this.page,
            this.searchInput._selector,
            'Search by symptom, condition, or illness',
            'search-input-click-healing'
        );
    }

    /**
     * Click on search input field (Search all visit reasons)
     * @returns {Promise<void>}
     */
    async clickSearchAllVisitReasonsInput() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.searchInput.waitFor({ state: 'visible', timeout: 50000 });

        // Using constructor locator with self-healing click
        await healingClick(
            this.page,
            this.searchInput._selector,
            'Search all visit reasons',
            'search-input-click-healing'
        );
    }

    /**
     * Validate search input field is visible
     * @returns {Promise<boolean>} - True if search input is visible, false otherwise
     */
    async validateSearchInputVisible() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.searchInput.waitFor({ state: 'visible', timeout: 50000 });

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
        const searchResult = this.page.locator('div').filter({ hasText: new RegExp(`^${resultText}$`) }).nth(4);
        await searchResult.waitFor({ state: 'visible', timeout: 50000 });
        await searchResult.click();
    }

    /**
     * Click location radio button with self-healing
     * @param {string} value - The value of the location radio button (e.g., "home", "office")
     * @returns {Promise<void>}
     */
    async clickLocationRadio(value) {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.locator(`//input[@name="location-radio-group" and @value="${value.toLowerCase()}"]`).waitFor({ state: 'visible', timeout: 50000 });

        const locationRadioSelector = `//input[@name="location-radio-group" and @value="${value.toLowerCase()}"]`;

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
        await this.page.locator(`//input[@name="location-radio-group" and @value="${value}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//input[@name="distance-radio-group" and @value="${value}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//input[@name="distance-radio-group" and @value="${value}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.virtualVisitButton.waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//input[@id="input_state-select-id" and @value="${stateValue}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//div[text()="${reasonText}"]`).waitFor({ state: 'visible', timeout: 50000 });

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
        await this.page.locator(`//div[text()="${reasonText}"]`).waitFor({ state: 'visible', timeout: 50000 });

        const visitReasonSelector = `//div[text()="${reasonText}"]`;

        // Using self-healing visibility check
        return await healingIsVisible(
            this.page,
            visitReasonSelector,
            `Common visit reason: ${reasonText}`,
            `visit-reason-${reasonText.replace(/\s+/g, '-').toLowerCase()}-visible-healing`
        );
    }

    /**
     * Select reason from dropdown dynamically
     * @param {string} optionText - The text of the option to select
     * @returns {Promise<void>}
     */
    async selectReasonDropdown(optionText) {
        await CommonUtils.waitForPageLoad(this.page);

        try {
            // Try getByText first (most common)
            const exactTextElement = this.page.getByText(optionText, { exact: true });
            await exactTextElement.waitFor({ state: 'visible', timeout: 50000 });
            if (await exactTextElement.isVisible()) {
                await exactTextElement.click();
                return;
            }

            // Try filter approach (for cases like "Acid Reflux")
            const filterElement = this.page.locator('div').filter({ hasText: optionText });
            for (let i = 0; i < 6; i++) {
                await filterElement.nth(i).waitFor({ state: 'visible', timeout: 50000 });
                if (await filterElement.nth(i).isVisible()) {
                    await filterElement.nth(i).click();
                    return;
                }
            }

            // Try with getByLabel (for "Biometric Wellness Screen" case)
            const labelElement = this.page.getByLabel('Search by symptom, condition').getByText(optionText, { exact: true });
            await labelElement.waitFor({ state: 'visible', timeout: 50000 });
            if (await labelElement.isVisible()) {
                await labelElement.click();
                return;
            }

            throw new Error(`Option "${optionText}" not found`);

        } catch (error) {
            console.error(`Error selecting "${optionText}":`, error);
            throw error;
        }
    }

    /**
 * Click on Search Availability button
 * @returns {Promise<void>}
 */
    async clickOnSearchAvailability() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.locator(`//button[text()="Search Availability"]`).waitFor({ state: 'visible', timeout: 50000 });

        const searchAvailabilityButtonSelector = `//button[text()="Search Availability"]`;

        // Using self-healing click
        await healingClick(
            this.page,
            searchAvailabilityButtonSelector,
            'Search Availability',
            'search-availability-button-click-healing'
        );
        await this.clickSearchNextAvailableDayIfNoAppointments();
    }

    async validateAppointmentOptionsPageVisible() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.locator(`//h1[text()="Choose a Time & Provider"]`).waitFor({ state: 'visible', timeout: 50000 });

        const appointmentOptionsHeaderSelector = `//h1[text()="Choose a Time & Provider"]`;

        // Using self-healing visibility check
        return await healingIsVisible(
            this.page,
            appointmentOptionsHeaderSelector,
            'Choose a Time & Provider',
            'appointment-options-page-healing'
        );
    }


    async getAllAvailableDoctorNames() {
        await CommonUtils.waitForPageLoad(this.page);
        await this.page.locator(`//div[@class="MuiTypography-root MuiTypography-h4 typography provider-name _typography--h4_k18jo_1 css-1xvinid"]`).first().waitFor({ state: 'visible', timeout: 50000 });
        try {
            const doctorNameSelector = `//div[@class="MuiTypography-root MuiTypography-h4 typography provider-name _typography--h4_k18jo_1 css-1xvinid"]`;
            // Get all doctor name elements
            const doctorElements = this.page.locator(doctorNameSelector);
            // Wait for at least one doctor to be visible
            await doctorElements.first().waitFor({ state: 'visible', timeout: 50000 });
            // Get count of doctor elements
            const doctorCount = await doctorElements.count();
            console.log(`Found ${doctorCount} available doctors`);
            // Extract text from all doctor elements
            const doctorNames = [];
            for (let i = 0; i < doctorCount; i++) {
                const doctorName = await doctorElements.nth(i).textContent();
                if (doctorName && doctorName.trim()) {
                    doctorNames.push(doctorName.trim());
                }
            }
            console.log(`Available doctor names:`, doctorNames);
            return doctorNames;
        } catch (error) {
            console.error('Error getting doctor names:', error);
            return [];
        }
    }

    async getCountOfDoctorsAvailable() {
        await CommonUtils.waitForPageLoad(this.page);

        try {
            const doctorNameSelector = `//div[@class="MuiTypography-root MuiTypography-h4 typography provider-name _typography--h4_k18jo_1 css-1xvinid"]`;

            // Wait for at least one doctor to be visible
            await this.page.locator(doctorNameSelector).first().waitFor({ state: 'visible', timeout: 50000 });

            // Get count of doctor elements
            const doctorElements = this.page.locator(doctorNameSelector);
            const doctorCount = await doctorElements.count();

            console.log(`Total available doctors count: ${doctorCount}`);
            return doctorCount;

        } catch (error) {
            console.error('Error getting doctors count:', error);
            return 0;
        }
    }

    async getNumberOfSlotsAvailableForDoctor(doctorName) {
        await CommonUtils.waitForPageLoad(this.page);

        try {
            // Construct the selector for the specific doctor's time slots
            const timeSlotsSelector = `//div[text()="${doctorName}"]/parent::div/parent::div/parent::div/parent::div/parent::div//div[@class="provider__appointments-section"]//button`;

            // Wait for at least one time slot button to be visible
            await this.page.locator(timeSlotsSelector).first().waitFor({ state: 'visible', timeout: 50000 });

            // Get all time slot elements
            const timeSlotElements = this.page.locator(timeSlotsSelector);
            const totalSlotsCount = await timeSlotElements.count();

            // Limit to first 12 visible slots only (excluding "View More" section)
            const visibleSlotsCount = Math.min(totalSlotsCount, 12);

            console.log(`Total time slots available for ${doctorName}: ${totalSlotsCount}, Visible slots count (max 12): ${visibleSlotsCount}`);
            return visibleSlotsCount;

        } catch (error) {
            console.error(`Error getting time slots for ${doctorName}:`, error);
            return 0;
        }
    }

    async getFirst12VisibleTimeSlots(doctorName) {
        await CommonUtils.waitForPageLoad(this.page);

        try {
            // Construct the selector for the specific doctor's time slots
            const timeSlotsSelector = `//div[text()="${doctorName}"]/parent::div/parent::div/parent::div/parent::div/parent::div//div[@class="provider__appointments-section"]//button`;

            // Wait for at least one time slot button to be visible
            await this.page.locator(timeSlotsSelector).first().waitFor({ state: 'visible', timeout: 50000 });

            // Get all time slot button elements
            const timeSlotElements = this.page.locator(timeSlotsSelector);
            const totalSlotsCount = await timeSlotElements.count();

            // Get only first 12 slots
            const visibleSlotsCount = Math.min(totalSlotsCount, 12);

            // Extract text from first 12 time slot buttons only
            const timeSlots = [];
            for (let i = 0; i < visibleSlotsCount; i++) {
                const timeSlotText = await timeSlotElements.nth(i).textContent();
                if (timeSlotText && timeSlotText.trim()) {
                    timeSlots.push(timeSlotText.trim());
                }
            }

            console.log(`First ${visibleSlotsCount} visible time slots for ${doctorName}:`, timeSlots);
            return timeSlots;

        } catch (error) {
            console.error(`Error getting time slots for ${doctorName}:`, error);
            return [];
        }
    }

    async getRandomDoctorName() {
        try {
            // Get all available doctor names
            const doctorNames = await this.getAllAvailableDoctorNames();
            const doctorCount = doctorNames.length;

            if (doctorCount === 0) {
                throw new Error('No doctors available');
            }

            // Generate random index (less than count)
            const randomIndex = Math.floor(Math.random() * doctorCount);
            const randomDoctor = doctorNames[randomIndex];

            console.log(`Selected random doctor: ${randomDoctor} (index: ${randomIndex}/${doctorCount})`);
            return randomDoctor;

        } catch (error) {
            console.error('Error getting random doctor:', error);
            throw error;
        }
    }

    async getRandomTimeSlot(doctorName) {
        try {
            // Get all available time slots for the doctor
            const timeSlots = await this.getFirst12VisibleTimeSlots(doctorName);
            const slotsCount = timeSlots.length;

            console.log(`Total time slots available for ${doctorName}: ${slotsCount}`);
            if (slotsCount === 0) {
                throw new Error(`No time slots available for ${doctorName}`);
            }

            // Generate random index (less than count)
            const randomIndex = Math.floor(Math.random() * slotsCount);
            const randomTimeSlot = timeSlots[randomIndex];

            console.log(`Selected random time slot: ${randomTimeSlot} (index: ${randomIndex}/${slotsCount}) for ${doctorName}`);
            return randomTimeSlot;

        } catch (error) {
            console.error(`Error getting random time slot for ${doctorName}:`, error);
            throw error;
        }
    }
    async clickOnTimeSlot(doctorName, time) {
        await CommonUtils.waitForPageLoad(this.page);

        try {
            // Scope selector to the specific doctor's appointments section and match button text exactly
            const timeSlotSelector = `//div[text()="${doctorName}"]/parent::div/parent::div/parent::div/parent::div/parent::div//div[@class=\"provider__appointments-section\"]//button[normalize-space(.)="${time}"]`;

            // Wait for at least one matching time slot button to be present
            const timeSlotElements = this.page.locator(timeSlotSelector);
            await timeSlotElements.first().waitFor({ state: 'visible', timeout: 50000 });

            // If multiple matching buttons exist, click the first visible and enabled one
            const count = await timeSlotElements.count();
            let clicked = false;
            for (let i = 0; i < count; i++) {
                const el = timeSlotElements.nth(i);
                if (await el.isVisible() && await el.isEnabled()) {
                    await el.click();
                    clicked = true;
                    break;
                }
            }

            if (!clicked) {
                throw new Error(`No visible/enabled time slot button found for ${time} with ${doctorName}`);
            }

            console.log(`Successfully clicked time slot: ${time} with ${doctorName}`);

        } catch (error) {
            console.error(`Error clicking time slot ${time} with ${doctorName}:`, error);
            throw error;
        }
    }
    /**
     * Click "Confirm and Schedule Appointment" button
     * @returns {Promise<void>}
     */
    async clickConfirmAndScheduleAppointment() {
        await CommonUtils.waitForPageLoad(this.page);

        const selector = `//button[text()="Confirm and Schedule Appointment"]`;

        // Wait for the button to be visible (and not stale)
        await this.page.locator(selector).first().waitFor({ state: 'visible', timeout: 50000 });

        // Use healingClick for self-healing behavior consistent with the repo
        await healingClick(
            this.page,
            selector,
            'Confirm and Schedule Appointment',
            'confirm-schedule-appointment-click-healing'
        );

        // Optional: wait a short moment for navigation/modal to settle
        await this.page.waitForTimeout(250);
    }

    /**
     * If "There are no more appointments for this day." is shown,
     * quickly click the "Search Next Available Day" button.
     * Returns true if the button was clicked, false otherwise.
     *
     * Uses short timeouts so the check is fast and non-blocking.
     */
    async clickSearchNextAvailableDayIfNoAppointments() {
        // lightweight selectors
        const noAppointmentsSelector = this.page.locator(`//p[text()="There are no more appointments for this day."]`);
        const nextDayButtonSelector = `//button[text()="Search Next Available Day"]`;

        await noAppointmentsSelector.waitFor({ state: 'visible', timeout: 5000 });
        if (noAppointmentsSelector.isVisible()) {
            await CommonUtils.waitForPageLoad(this.page);
            await this.page.locator(nextDayButtonSelector).waitFor({ state: 'visible', timeout: 50000 });
            await healingClick(
                this.page,
                nextDayButtonSelector, "Search Next Available Day",
                'search-next-available-day-click-healing'
            );
        }

    }

    /**
     * Click the "Cancel" button
     * @returns {Promise<void>}
     */
    async clickCancelButton() {
        await CommonUtils.waitForPageLoad(this.page);
        const selector = `//button[text()="Cancel"]`;

        try {
            // Wait for the Cancel button to be visible (avoid passing Locator into healingClick)
            await this.page.locator(selector).first().waitFor({ state: 'visible', timeout: 50000 });

            // Use healingClick (expects a selector string)
            await healingClick(
                this.page,
                selector,
                'Cancel',
                'cancel-button-click-healing'
            );

            // small pause for modal/flow to settle
            await this.page.waitForTimeout(150);
            console.log('Clicked "Cancel" button');
        } catch (error) {
            console.error('Error clicking "Cancel" button:', error);
            throw error;
        }
    }

    /**
     * Cancel an appointment by selecting a reason and confirming.
     * Waits until the cancellation confirmation page is visible.
     * @param {string} reason - The cancellation reason text to select (e.g. "I feel better now")
     * @returns {Promise<boolean>} - true on success, throws on failure
     */
    async cancelAppointmentWithReason(reason) {
        await CommonUtils.waitForPageLoad(this.page);

        const popupSelector = `//div[text()="Reason For Cancellation"]`;
        const dropdownSelector = `//div[@id='select-id_select_cancel_appointment_reason']`;
        const reasonOptionSelector = `//div[text()="${reason}"]`;
        const confirmButtonSelector = `//button[text()="Yes, Cancel Appointment"]`;
        const successHeaderSelector = `//h1[text()="Your appointment has been canceled."]`;

        try {
            // Wait for popup
            await this.page.locator(popupSelector).first().waitFor({ state: 'visible', timeout: 50000 });

            // Open dropdown
            await this.page.locator(dropdownSelector).first().waitFor({ state: 'visible', timeout: 50000 });
            await healingClick(this.page, dropdownSelector, 'Cancel reason dropdown', 'cancel-reason-dropdown-healing');

            // Select reason
            await this.page.locator(reasonOptionSelector).first().waitFor({ state: 'visible', timeout: 50000 });
            await healingClick(this.page, reasonOptionSelector, `Cancel reason: ${reason}`, 'cancel-reason-option-healing');

            // Confirm cancellation
            await this.page.locator(confirmButtonSelector).first().waitFor({ state: 'visible', timeout: 50000 });
            await healingClick(this.page, confirmButtonSelector, 'Yes, Cancel Appointment', 'confirm-cancel-appointment-healing');

            // Wait for success page
            await this.page.locator(successHeaderSelector).first().waitFor({ state: 'visible', timeout: 50000 });

            console.log(`Appointment cancelled with reason: "${reason}"`);
            return true;
        } catch (error) {
            console.error(`Failed to cancel appointment with reason "${reason}":`, error);
            throw error;
        }
    }

    /**
     * Cancel all appointments using a loop
     * @param {string} reason - The cancellation reason (e.g. "I feel better now")
     * @param {number} maxAttempts - Maximum number of appointments to cancel (default 100)
     * @returns {Promise<number>} - Number of appointments cancelled
     */
    async cancelAllAppointments(reason, maxAttempts = 100) {
        const upcomingAppointsmentsSelector = this.page.locator(`//span[text()="Upcoming Appointments"]`);
        await this.navigateToAppointments();
        await this.clickAppointmentDropdownOption('View and Manage Appointments');
        await upcomingAppointsmentsSelector.waitFor({ state: 'visible', timeout: 50000 });

        const cancelXPath = `//button[text()="Cancel"]`;
        let total = await this.page.locator(cancelXPath).count();
        console.log(`Found ${total} appointments to cancel`);

        let cancelled = 0;
        for (let attempt = 0; attempt < Math.min(total, maxAttempts); attempt++) {
            const available = await this.page.locator(cancelXPath).count();
            if (available === 0) break;

            // click the first visible Cancel button (keeps index stable)
            const cancelButton = this.page.locator(cancelXPath).first();
            await cancelButton.waitFor({ state: 'visible', timeout: 5000 });
            await cancelButton.click();

            // complete cancellation flow
            await this.cancelAppointmentWithReason(reason);
            cancelled++;

            // return to the manage list if the link appears
            const viewUpcomingAppointmentsSelector = this.page.locator(`//a[text()="View Upcoming Appointments"]`);
            if ((await viewUpcomingAppointmentsSelector.count()) > 0) {
                await viewUpcomingAppointmentsSelector.first().waitFor({ state: 'visible', timeout: 50000 });
                await viewUpcomingAppointmentsSelector.first().click();
                await upcomingAppointsmentsSelector.waitFor({ state: 'visible', timeout: 50000 });
            } else {
                // ensure we are on the manage appointments view
                await this.navigateToAppointments();
                await this.clickAppointmentDropdownOption('View and Manage Appointments');
                await upcomingAppointsmentsSelector.waitFor({ state: 'visible', timeout: 50000 });
            }

            console.log(`Cancelled ${cancelled}. Remaining (approx): ${Math.max(0, available - 1)}`);
        }

        console.log(`Successfully cancelled ${cancelled} appointment(s)`);
        await upcomingAppointsmentsSelector.waitFor({ state: 'visible', timeout: 50000 });
        await this.page.waitForTimeout(10000);
        await this.page.locator(`//span[text()="Home"]`).waitFor({ state: 'visible', timeout: 50000 });
        await this.page.locator(`//span[text()="Home"]`).click();
        return cancelled;

    }

    /**
     * On "Please Review & Confirm" page select visit type and click "Same as contact information"
     * @param {string} visitType - "Video Visit" or "Phone Visit"
     * @returns {Promise<boolean>} - true on success
     */
    async selectVisitTypeAndSameAsContact(visitType) {
        await CommonUtils.waitForPageLoad(this.page);

        const header = `//h1[text()="Please Review & Confirm"]`;
        const allowed = ['Video Visit', 'Phone Visit'];
        if (!allowed.includes(visitType)) throw new Error(`Invalid visitType "${visitType}". Use "Video Visit" or "Phone Visit".`);

        const visitButton = `//button[text()="${visitType}"]`;
        const sameAsSelector = `//span[text()="Same as contact information"]`;

        try {
            await this.page.locator(header).first().waitFor({ state: 'visible', timeout: 50000 });

            await this.page.locator(visitButton).first().waitFor({ state: 'visible', timeout: 10000 });
            await healingClick(this.page, visitButton, visitType, `select-${visitType.replace(/\s+/g, '-').toLowerCase()}-healing`);

            await this.page.locator(sameAsSelector).first().waitFor({ state: 'visible', timeout: 5000 });
            await healingClick(this.page, sameAsSelector, 'Same as contact information', 'same-as-contact-click-healing');

            return true;
        } catch (error) {
            console.error(`selectVisitTypeAndSameAsContact failed for "${visitType}":`, error);
            throw error;
        }
    }

    /**
     * Click a visit reason button by visible text (e.g. "Acne")
     * @param {string} reason - visible reason text to click
     * @returns {Promise<boolean>} - true if clicked, throws on failure
     */
    async clickVisitReason(reason) {
        await CommonUtils.waitForPageLoad(this.page);
        const buttonSelector = `//button[normalize-space(.)="${reason}"]`;
        const fallbackSelector = `//div[normalize-space(.)="${reason}"]`;

        try {
            // Try button first (most common)
            await this.page.locator(buttonSelector).first().waitFor({ state: 'visible', timeout: 5000 })
                .catch(() => null);

            // If button visible, use it; otherwise try fallback div selector
            const selectorToUse = (await this.page.locator(buttonSelector).count()) > 0
                ? buttonSelector
                : fallbackSelector;

            // Ensure selected locator is visible before click
            await this.page.locator(selectorToUse).first().waitFor({ state: 'visible', timeout: 50000 });

            // Use healingClick (expects a selector string)
            await healingClick(
                this.page,
                selectorToUse,
                `Visit reason: ${reason}`,
                `visit-reason-${reason.replace(/\s+/g, '-').toLowerCase()}-healing`
            );

            console.log(`Clicked visit reason "${reason}"`);
            return true;
        } catch (error) {
            console.error(`Failed to click visit reason "${reason}":`, error);
            throw error;
        }
    }

    /**
     * Validate "Who is the visit for?" and select a person from the user dropdown.
     * @param {string} personName - visible name to select (e.g. "Employee1", "Spouse1")
     * @returns {Promise<boolean>} - true on success, throws on failure
     */
    async selectVisitForPerson(personName) {
        await CommonUtils.waitForPageLoad(this.page);

        const headerSelector = `//div[text()="Who is the visit for?"]`;
        const dropdownSelector = `//div[text()='Link to Family Members']`;
        const optionSelector = `//span[text()="${personName}"]`;

        try {
            // Ensure the section is present
            await this.page.locator(headerSelector).first().waitFor({ state: 'visible', timeout: 10000 });

            // Open the dropdown
            await this.page.locator(dropdownSelector).first().waitFor({ state: 'visible', timeout: 5000 });
            await healingClick(this.page, dropdownSelector, 'User select dropdown', 'user-select-dropdown-healing');

            // Select the requested person
            await this.page.locator(optionSelector).first().waitFor({ state: 'visible', timeout: 10000 });
            await healingClick(this.page, optionSelector, `Select user: ${personName}`, `user-select-${personName.replace(/\s+/g, '-').toLowerCase()}-healing`);

            console.log(`Selected visit for: ${personName}`);
            return true;
        } catch (error) {
            console.error(`selectVisitForPerson failed for "${personName}":`, error);
            throw error;
        }
    }

    /**
     * Handle emergency popup by clicking "Continue Scheduling"
     * Waits for the popup with emergency message, then clicks continue button
     * @returns {Promise<boolean>} - true on success, throws on failure
     */
    async handleEmergencyPopupAndContinue() {
        await CommonUtils.waitForPageLoad(this.page);

        const popupSelector = `//p[text()="If you are having an emergency please call 911"]`;
        const continueButtonSelector = `//button[text()="Continue Scheduling"]`;

        try {
            // Wait for popup to appear
            await this.page.locator(popupSelector).first().waitFor({ state: 'visible', timeout: 10000 });

            // Click continue button
            await this.page.locator(continueButtonSelector).first().waitFor({ state: 'visible', timeout: 5000 });
            await healingClick(this.page, continueButtonSelector, 'Continue Scheduling', 'emergency-popup-continue-healing');

            console.log('Handled emergency popup and continued scheduling');
            return true;
        } catch (error) {
            console.error('Error handling emergency popup:', error);
            throw error;
        }
    }

    /**
     * Enter address in the "Other" location input field
     * @param {string} address - The address text to enter (e.g. "123 Main St, Springfield, IL")
     * @returns {Promise<boolean>} - true on success, throws on failure
     */
    async enterOtherLocationAddress(address) {
        await CommonUtils.waitForPageLoad(this.page);

        const inputSelector = `#other-location-input`;

        try {
            // Wait for input to be visible
            await this.page.locator(inputSelector).first().waitFor({ state: 'visible', timeout: 5000 });

            // Clear and fill the input
            await this.page.locator(inputSelector).first().fill(address);

            await this.page.waitForTimeout(500); // short pause to ensure input is processed
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');

        } catch (error) {
            console.error(`Error entering address "${address}":`, error);
            throw error;
        }
    }

    /**
     * Handle mental-health focus popup and continue to review.
     * @param {string} focusValue - radio value to select (e.g. "Depression", "Anxiety", "Other")
     * @param {string} [otherText] - text to enter when `focusValue` is "Other"
     * @returns {Promise<boolean>} - true on success
     */
    async selectMentalHealthFocusAndContinue(focusValue, otherText = '') {
        await CommonUtils.waitForPageLoad(this.page);

        const popupSelector = `//p[text()="What would you like to focus on during your visit?"]`;
        const radioSelector = `//input[@type='radio' and @value='${focusValue}']`;
        const otherTextareaSelector = `//textarea[@name='additional_note']`;
        const continueBtnSelector = `//button[text()="Continue to Review & Confirm"]`;
        const reviewHeader = `//h1[text()="Please Review & Confirm"]`;

        try {
            await this.page.locator(popupSelector).first().waitFor({ state: 'visible', timeout: 10000 });

            if (focusValue === 'Other' && !otherText) {
                throw new Error('otherText is required when focusValue is "Other"');
            }

            await this.page.locator(radioSelector).first().waitFor({ state: 'visible', timeout: 5000 });
            await healingClick(this.page, radioSelector, `Select focus: ${focusValue}`, `mh-focus-${focusValue.replace(/\s+/g, '-').toLowerCase()}-healing`);

            if (focusValue === 'Other') {
                await this.page.locator(otherTextareaSelector).first().waitFor({ state: 'visible', timeout: 5000 });
                await this.page.locator(otherTextareaSelector).first().fill(otherText);
            }

            await this.page.locator(continueBtnSelector).first().waitFor({ state: 'visible', timeout: 5000 });
            await healingClick(this.page, continueBtnSelector, 'Continue to Review & Confirm', 'mh-continue-healing');

            await this.page.locator(reviewHeader).first().waitFor({ state: 'visible', timeout: 50000 });

            return true;
        } catch (error) {
            console.error(`selectMentalHealthFocusAndContinue("${focusValue}") failed:`, error);
            throw error;
        }
    }

    /**
     * Enter text into the search input (Search by symptom, condition, or illness)
     * @param {string} query - text to enter into the search field
     * @returns {Promise<void>}
     */
    async enterSearchInputValue(query) {
        await CommonUtils.waitForPageLoad(this.page);
        await this.searchInput.waitFor({ state: 'visible', timeout: 50000 });

        // Focus using healingClick (keeps behavior consistent), then fill the value
        await healingClick(
            this.page,
            this.searchInput._selector,
            'Search by symptom, condition, or illness (focus)',
            'search-input-focus-healing'
        );

        await this.searchInput.fill(query);
        // short wait for suggestions/autocomplete to appear
        await this.page.waitForTimeout(300);

        // safely build exact-match regex to find suggestion text
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const suggestionRegex = new RegExp(`^${escaped}$`, 'i');

        // try to click the exact matching suggestion; fallback to first visible match
        const suggestion = this.page.locator('div').filter({ hasText: suggestionRegex }).first();
        try {
            await suggestion.waitFor({ state: 'visible', timeout: 5000 });
            await suggestion.click();
        } catch (err) {
            const fallback = this.page.locator('div').filter({ hasText: query }).first();
            if ((await fallback.count()) > 0) {
                await fallback.click();
            }
        }
    }
}