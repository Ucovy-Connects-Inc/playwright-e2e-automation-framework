# 🎭 Simple Test Execution for Management

## � **For Management - How to Run Tests & View Reports**

### **� Run Tests (Takes 15-30 minutes):**

1. **Go to GitHub Actions:**
   - Visit: https://github.com/Ucovy-Connects-Inc/playwright-e2e-automation-framework/actions
   - Click on **"Run Tests for Management"**

2. **Click "Run workflow" and Select:**
   - **Environment:** qa / dev / prod
   - **Browser:** all / chromium / firefox / webkit
   - **Click "Run workflow"**

3. **Wait for completion** (green checkmark ✅)

4. **Download Reports:**
   - Click on the completed workflow
   - Scroll down to **"Artifacts"**
   - Download **"📊-MANAGEMENT-REPORT"**
   - Extract and open `index.html` for beautiful dashboard

### **📊 What You Get:**

✅ **Interactive Allure Dashboard** - Pass/fail percentages, trends, detailed reports  
✅ **Screenshots & Videos** - See exactly what failed  
✅ **Cross-browser Results** - Chrome, Firefox, Safari compatibility  
✅ **Executive Summary** - Quick overview for management  
✅ **Test Coverage** - What features were tested  

### **🌐 Live Report (if GitHub Pages enabled):**
https://ucovy-connects-inc.github.io/playwright-e2e-automation-framework/latest-test-report/

## 🔧 **One-Time Setup (DevOps)**

### **1. Add Secret (if CAPTCHA bypass needed):**
Repository → Settings → Secrets → Add:
```
AUTOMATION_SECRET = "get_from_dev_team"
```

### **2. Enable GitHub Pages (for live reports):**
Repository → Settings → Pages → Source: "GitHub Actions"

## 📋 **Test Commands (for QA team)**

```bash
# Local testing
npm install
npx playwright install
npm run test

# Generate local reports
npm run test:allure
npm run allure:open
```

## 🎉 **That's It!**

**Management can now:**
- ✅ Run tests whenever needed (no automatic runs)
- ✅ Get beautiful reports with pass/fail percentages  
- ✅ See detailed failure analysis with screenshots
- ✅ Track quality across different environments
- ✅ Download professional reports for meetings

**Simple, clean, and exactly what you need!** 🚀

------------------------------------------------------------

# 🎭 Simple Test Execution

## 📋 **Test Commands (for QA team)**

```bash
# Local testing
npm install
npx playwright install
npm install @dotenvx/dotenvx --save-dev
npm run test

# Generate local reports
npm run test:allure
npm run allure:open

# Command to run
$env:ENV="qa"; npx playwright test --project=chromium-ai-visual --grep "@test" 

# Give tag here in place of @test

# For AI Visual assertion tests
# This creates images:
$env:ENV="qa"; npx playwright test tests/AILogin.spec.js --update-snapshots --project=chromium-ai-visual --grep "Login with invalid credentials with AI visual validation"
# This compares the new images seen with existing images previously created:
$env:ENV="qa"; npx playwright test tests/AILogin.spec.js --headed --project=chromium-ai-visual --grep "Login with invalid credentials with AI visual validation"
```
