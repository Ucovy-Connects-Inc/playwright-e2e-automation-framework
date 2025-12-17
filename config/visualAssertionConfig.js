export const VisualAssertionConfig = {
    // Global baseline settings
    global: {
        threshold: 0.1,
        maxDiffPixels: 1000,
        animations: 'disabled',
        mode: 'rgb',
        maxRetries: 3,
        stabilityChecks: true
    },

    // Test-specific configurations
    testConfigs: {
        login: {
            threshold: 0.3, // Very lenient for element variations
            maxDiffPixels: 250000, // Allow significant pixel differences
            stabilityChecks: true,
            maxDiffPixelRatio: 0.2, // Allow up to 20% pixel difference for height variations
            resolutionIndependent: true, // Enable resolution-independent comparison
            scaleToFit: true, // Scale images to match before comparison
            focusOnContent: true, // Compare content structure rather than exact pixels
            elements: {
                // Login page elements configuration
                'login-form': 'form, .login-form, [data-testid="login-form"], .form-container, #login-form',
                'username-field': 'input[name="username"], input[type="email"], #username, [data-testid="username"], [placeholder*="username"], [placeholder*="email"]',
                'password-field': 'input[name="password"], input[type="password"], #password, [data-testid="password"], [placeholder*="password"]',
                'login-button': 'button[type="submit"], .login-button, [data-testid="login-button"], button:has-text("Sign in"), button:has-text("Login"), .btn-login',
                'show-password-button': 'button[aria-label="Show password"], .show-password, [data-testid="show-password"], .password-toggle',
                'forgot-password-link': 'a[href*="forgot"], .forgot-password, [data-testid="forgot-password"], a:has-text("Forgot")',
                'language-selector': '.language-selector, [data-testid="language-selector"], select[name="language"], .language-dropdown',
                'logo': '.logo, [alt*="logo"], .brand, [data-testid="logo"], .header-logo',
                'ios-app-link': 'a[href*="apple"], a[href*="ios"], [data-testid="ios-app"], .ios-download',
                'android-app-link': 'a[href*="google"], a[href*="android"], [data-testid="android-app"], .android-download',
                'error-message': '.error-message, [role="alert"], .alert-error, [data-testid="error-message"], .error, .invalid-feedback',
                'success-message': '.success-message, .alert-success, [data-testid="success-message"], .success, .valid-feedback'
            }
        },
        
        appointment: {
            threshold: 0.1,
            maxDiffPixels: 1200,
            elements: {
                'appointment-header': '//h1[text()="Schedule an Appointment"]',
                'reason-section': '//div[@id="reason-select-id"]',
                'search-availability': '//button[contains(@class,"_submit-button_agx3b_25")]'
            }
        },

        navigation: {
            threshold: 0.12,
            maxDiffPixels: 1500,
            elements: {
                'main-nav': 'nav[role="navigation"]',
                'user-menu': '.user-menu',
                'breadcrumbs': '.breadcrumbs'
            }
        }
    },

    // Browser-specific adjustments
    browserConfigs: {
        chromium: { 
            threshold: 0.08,
            maxDiffPixels: 800
        },
        firefox: { 
            threshold: 0.12, // More lenient for Firefox rendering
            maxDiffPixels: 1200
        },
        webkit: { 
            threshold: 0.15, // More lenient for Safari
            maxDiffPixels: 1500
        }
    },

    // Environment-specific settings
    environmentConfigs: {
        development: { 
            threshold: 0.2,
            maxRetries: 2
        },
        staging: { 
            threshold: 0.1,
            maxRetries: 3
        },
        production: { 
            threshold: 0.05,
            maxRetries: 5
        },
        ci: {
            threshold: 0.15,
            maxRetries: 3,
            stabilityChecks: true
        }
    }
};