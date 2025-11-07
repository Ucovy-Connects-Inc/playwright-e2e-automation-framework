# Allure Reporting

Simple Allure integration for better test reports.

## Quick Start

```bash
# Run tests with Allure reporting
npm run test:allure

# Generate and open Allure report
npm run allure:generate
npm run allure:open

# Or serve report directly
npm run allure:serve
```

## What You Get

- **HTML Reports**: Clean, interactive test reports
- **Test Results**: Pass/fail status with execution details
- **Screenshots**: Automatic capture on test failures
- **Test History**: Track test execution over time
- **Categories**: Organized view of test results

## Available Commands

- `npm test` - Run tests (generates allure-results)
- `npm run allure:generate` - Generate HTML report
- `npm run allure:open` - Open generated report
- `npm run allure:serve` - Generate and serve report
- `npm run test:allure` - Run tests + generate + open report

The Allure reporter will automatically collect test results without requiring any code changes to your existing tests.