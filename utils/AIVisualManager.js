// AIVisualManager: high-level orchestration for AI-driven visual assertions.
// - Wraps AIVisualAssertion to provide test-name sanitization, short test-id generation, and environment-aware configuration.
// - Resolves selectors (config keys, direct selectors, or sensible fallbacks) and offers multi-strategy visual checks:
//   standard, resolution-independent, and content-focused comparisons with retries and stability checks.
// - Provides helpers to assert single elements, custom selectors, full pages, multiple elements, and auto-detection of important elements.
// Public surface: ~18 helper methods (sanitizeTestName, generateShortTestId, simpleHash, extractTestCategory, buildConfiguration,
// resolveSelector, isValidSelector, assertElement, assertCustomElement, assertPage, assertMultipleElements,
// detectAndAssertElements, isImportantElement, buildSelectorForElement, assertElementResolutionIndependent,
// assertElementContentFocused, assertElementMultiStrategy, generateFallbackSelector).
// Intended use: import into tests to perform robust, resolution-tolerant visual checks and collect concise pass/fail results.
import { AIVisualAssertion } from './AIVisualAssertion.js';
import { VisualAssertionConfig } from '../config/visualAssertionConfig.js';

export class AIVisualManager {
    constructor(page, testName, options = {}) {
        this.page = page;
        this.testName = this.sanitizeTestName(testName);
        this.testCategory = this.extractTestCategory(testName);
        this.config = this.buildConfiguration(options);
        this.visualAssertion = new AIVisualAssertion(page, this.config);
    }

    /**
     * Sanitize test name for file system compatibility
     */
    sanitizeTestName(testName) {
        return testName
            .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase();
    }

    /**
     * Generate short test ID to prevent long filename issues
     */
    generateShortTestId(elementKey) {
        // Create a hash-based short ID to ensure uniqueness while keeping length manageable
        const baseTestName = this.testName.substring(0, 20); // Max 20 chars from test name
        const elementName = elementKey.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10); // Max 10 chars from element
        const hash = this.simpleHash(`${this.testName}-${elementKey}`).toString().substring(0, 6); // 6 char hash

        return `${baseTestName}-${elementName}-${hash}`;
    }

    /**
     * Simple hash function for generating consistent short IDs
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Enhanced test category detection
     */
    extractTestCategory(testName) {
        const name = testName.toLowerCase();

        if (name.includes('login') || name.includes('authentication') || name.includes('signin') ||
            name.includes('credentials') || name.includes('username') || name.includes('password')) return 'login';
        if (name.includes('appointment') || name.includes('schedule') || name.includes('booking')) return 'appointment';
        if (name.includes('navigation') || name.includes('menu') || name.includes('nav')) return 'navigation';
        if (name.includes('registration') || name.includes('signup') || name.includes('register')) return 'registration';

        // Check file path or spec name as fallback
        if (name.includes('ailogin') || name.includes('ai-login') || name.includes('login.spec')) return 'login';

        return 'login'; // Default to login for now since this is a login test framework
    }

    /**
     * Smart configuration builder with environment detection
     */
    buildConfiguration(options) {
        const globalConfig = VisualAssertionConfig.global;
        const testConfig = VisualAssertionConfig.testConfigs[this.testCategory] || {};
        const browserConfig = VisualAssertionConfig.browserConfigs[process.env.BROWSER] || {};
        const envConfig = VisualAssertionConfig.environmentConfigs[process.env.NODE_ENV || 'development'] || {};

        // CI environment detection
        const isCI = process.env.CI || process.env.GITHUB_ACTIONS || process.env.JENKINS_URL;
        const ciConfig = isCI ? VisualAssertionConfig.environmentConfigs.ci || {} : {};

        return {
            ...globalConfig,
            ...testConfig,
            ...browserConfig,
            ...envConfig,
            ...ciConfig,
            ...options,
            // Explicitly include elements from test config
            elements: testConfig.elements || {}
        };
    }

    /**
     * Enhanced selector resolution with fallback and validation
     */
    resolveSelector(elementKey) {
        // 1️ Check if it's a config key
        if (this.config.elements && this.config.elements[elementKey]) {
            const configSelector = this.config.elements[elementKey];
            console.log(`Using config selector for '${elementKey}': ${configSelector}`);
            return configSelector;
        }

        // 2️ Treat as direct selector
        if (this.isValidSelector(elementKey)) {
            console.log(`Using direct selector: ${elementKey}`);
            return elementKey;
        }

        // 3️ Generate fallback selector for common element types
        const fallbackSelector = this.generateFallbackSelector(elementKey);
        if (fallbackSelector) {
            console.log(`Using fallback selector for '${elementKey}': ${fallbackSelector}`);
            return fallbackSelector;
        }

        // 4️ Final fallback - use as is with warning
        console.warn(`WARNING: Using '${elementKey}' as selector without validation. This might fail.`);
        return elementKey;
    }

    /**
     * Enhanced selector validation
     */
    isValidSelector(selector) {
        // Basic validation for CSS selectors, XPath, or Playwright selectors
        return (
            selector.startsWith('.') || // CSS class
            selector.startsWith('#') || // CSS ID
            selector.includes('[') ||   // CSS attribute
            selector.startsWith('//') || // XPath
            selector.startsWith('text=') || // Playwright text
            selector.startsWith('role=') || // Playwright role
            /^[a-zA-Z][a-zA-Z0-9]*$/.test(selector) || // HTML tag
            selector.includes('::') || // CSS pseudo-elements
            selector.includes(',') || // Multiple selectors
            selector.includes(':has') || // Playwright has selector
            selector.includes(':text') || // Playwright text selector
            selector.length > 2 // Any selector longer than 2 chars is likely valid
        );
    }

    /**
     * Enhanced element assertion with smart retry
     */
    async assertElement(elementKey, options = {}) {
        const selector = this.resolveSelector(elementKey);
        const testId = this.generateShortTestId(elementKey);

        console.log(`AI Visual asserting element: ${elementKey} (${selector})`);

        return await this.visualAssertion.smartVisualAssert(selector, testId, {
            ...this.config,
            ...options
        });
    }

    /**
     * Custom element assertion with naming
     */
    async assertCustomElement(selector, elementName, options = {}) {
        const testId = this.generateShortTestId(elementName);

        console.log(`AI Visual custom assert: ${elementName} (${selector})`);

        return await this.visualAssertion.smartVisualAssert(selector, testId, {
            ...this.config,
            ...options
        });
    }

    /**
     * Enhanced page assertion
     */
    async assertPage(options = {}) {
        const pageTestId = this.generateShortTestId('page');
        console.log(`AI Visual asserting entire page: ${pageTestId}`);

        return await this.visualAssertion.comparePage(pageTestId, {
            ...this.config,
            ...options
        });
    }

    /**
     * Multi-element assertion with detailed results
     */
    async assertMultipleElements(elementKeys, options = {}) {
        const results = [];
        console.log(`AI Visual asserting ${elementKeys.length} elements...`);

        for (const key of elementKeys) {
            const startTime = Date.now();
            try {
                await this.assertElement(key, options);
                const duration = Date.now() - startTime;
                results.push({
                    element: key,
                    status: 'passed',
                    duration: `${duration}ms`
                });
                console.log(`${key} - passed (${duration}ms)`);
            } catch (error) {
                const duration = Date.now() - startTime;
                results.push({
                    element: key,
                    status: 'failed',
                    error: error.message,
                    duration: `${duration}ms`
                });
                console.log(`${key} - failed (${duration}ms): ${error.message}`);
            }
        }

        const passed = results.filter(r => r.status === 'passed').length;
        const failed = results.filter(r => r.status === 'failed').length;

        console.log(`AI Visual Results: ${passed} passed, ${failed} failed out of ${elementKeys.length} elements`);

        return results;
    }

    /**
     * Smart element detection and assertion
     */
    async detectAndAssertElements(containerSelector = 'body', options = {}) {
        console.log(`AI Visual auto-detecting elements in: ${containerSelector}`);

        const elements = await this.page.locator(containerSelector).locator('*').all();
        const detectedElements = [];

        for (const element of elements) {
            try {
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());
                const className = await element.getAttribute('class');
                const id = await element.getAttribute('id');

                if (this.isImportantElement(tagName, className, id)) {
                    const selector = this.buildSelectorForElement(tagName, className, id);
                    const elementName = `auto-${tagName}${id ? `-${id}` : ''}${className ? `-${className.split(' ')[0]}` : ''}`;

                    detectedElements.push({ selector, elementName });
                }
            } catch (error) {
                // Skip elements that can't be processed
            }
        }

        return await this.assertMultipleElements(detectedElements.map(e => e.selector), options);
    }

    /**
     * Determine if element is important for visual testing
     */
    isImportantElement(tagName, className, id) {
        const importantTags = ['button', 'input', 'form', 'nav', 'header', 'main', 'aside', 'footer'];
        const importantClasses = ['btn', 'form', 'nav', 'header', 'footer', 'modal', 'dropdown'];

        return (
            importantTags.includes(tagName) ||
            (className && importantClasses.some(cls => className.includes(cls))) ||
            !!id
        );
    }

    /**
     * Build optimal selector for detected element
     */
    buildSelectorForElement(tagName, className, id) {
        if (id) return `#${id}`;
        if (className) return `.${className.split(' ')[0]}`;
        return tagName;
    }

    /**
     * Resolution-independent element assertion
     */
    async assertElementResolutionIndependent(elementKey, options = {}) {
        const selector = this.resolveSelector(elementKey);
        const testId = this.generateShortTestId(elementKey);

        console.log(`AI Visual (resolution-independent) asserting element: ${elementKey} (${selector})`);

        const resolutionIndependentOptions = {
            ...this.config,
            ...options,
            resolutionIndependent: true,
            scaleToFit: true
        };

        return await this.visualAssertion.smartVisualAssert(selector, testId, resolutionIndependentOptions);
    }

    /**
     * Content-focused element assertion (most lenient)
     */
    async assertElementContentFocused(elementKey, options = {}) {
        const selector = this.resolveSelector(elementKey);
        const testId = this.generateShortTestId(elementKey);

        console.log(`AI Visual (content-focused) asserting element: ${elementKey} (${selector})`);

        const contentFocusedOptions = {
            ...this.config,
            ...options,
            focusOnContent: true,
            threshold: 0.5,
            maxDiffPixelRatio: 0.4
        };

        return await this.visualAssertion.smartVisualAssert(selector, testId, contentFocusedOptions);
    }

    /**
     * Multi-strategy element assertion (tries multiple approaches)
     */
    async assertElementMultiStrategy(elementKey, options = {}) {
        const selector = this.resolveSelector(elementKey);
        const testId = this.generateShortTestId(elementKey);

        console.log(`AI Visual (multi-strategy) asserting element: ${elementKey} (${selector})`);

        const multiStrategyOptions = {
            ...this.config,
            ...options,
            resolutionIndependent: true,
            focusOnContent: true,
            scaleToFit: true
        };

        return await this.visualAssertion.smartVisualAssert(selector, testId, multiStrategyOptions);
    }
    generateFallbackSelector(elementKey) {
        const commonSelectors = {
            'login-form': 'form, .login-form, [data-testid="login-form"], .form-container',
            'username-field': 'input[name="username"], input[type="email"], #username, .username-input',
            'password-field': 'input[name="password"], input[type="password"], #password, .password-input',
            'login-button': 'button[type="submit"], .login-button, button:has-text("Sign in"), button:has-text("Login")',
            'submit-button': 'button[type="submit"], .submit-button, .btn-submit',
            'error-message': '.error-message, [role="alert"], .alert-error, .error',
            'success-message': '.success-message, .alert-success, .success',
            'logo': '.logo, [alt*="logo"], .brand, .header-logo',
            'nav': 'nav, .navigation, .nav, [role="navigation"]',
            'header': 'header, .header, .page-header',
            'footer': 'footer, .footer, .page-footer',
            'main': 'main, .main-content, .content, #main'
        };

        return commonSelectors[elementKey] || null;
    }
}