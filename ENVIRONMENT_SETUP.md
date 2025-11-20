# 🌐 Environment Configuration Guide

## 📁 **Files Created:**

✅ **`.env`** - Your local environment configuration  
✅ **`.env.example`** - Template for team members  
✅ **Updated `playwright.config.js`** - Now reads from environment variables  

## 🚀 **How to Set Environment & Run Tests:**

### **1. Quick Environment Switching:**

#### **For QA Environment:**
```bash
# Option 1: Set in .env file
ENV=qa

# Option 2: Set in command line (Windows)
$env:ENV="qa"; npm test

# Option 3: Set in command line (Linux/Mac)
ENV=qa npm test
```

#### **For Dev Environment:**
```bash
# Option 1: Set in .env file
ENV=dev

# Option 2: Set in command line (Windows)
$env:ENV="dev"; npm test

# Option 3: Set in command line (Linux/Mac)  
ENV=dev npm test
```

#### **For Production Environment:**
```bash
# Option 1: Set in .env file
ENV=prod

# Option 2: Set in command line (Windows)
$env:ENV="prod"; npm test

# Option 3: Set in command line (Linux/Mac)
ENV=prod npm test
```

### **2. Configure Your URLs:**

Edit your `.env` file:
```bash
# Environment Selection
ENV=qa

# Your Environment URLs
QA_BASE_URL=https://my.qa.marathon.health/login
DEV_BASE_URL=https://stage.my.marathon-health.com/login  
PROD_BASE_URL=https://my.marathon-health.com/login

# CAPTCHA Bypass (when you get secret from dev team)
AUTOMATION_SECRET=your_secret_key_here
```

### **3. Test Configuration Options:**

```bash
# Browser Settings
HEADLESS=true          # true for headless, false for headed
RETRIES=1              # Number of retries on failure
WORKERS=2              # Parallel workers

# Timeouts (milliseconds)
ACTION_TIMEOUT=30000   # 30 seconds for actions
TEST_TIMEOUT=60000     # 60 seconds per test
```

## 💻 **Command Examples:**

### **Run Tests in Different Environments:**
```bash
# QA Environment (default)
npm test

# Dev Environment  
$env:ENV="dev"; npm test

# Production Environment
$env:ENV="prod"; npm test

# Specific browser in specific environment
$env:ENV="qa"; npm run test:chrome

# Headed mode in QA
$env:ENV="qa"; $env:HEADLESS="false"; npm test
```

### **GitHub Actions Environment:**
The workflow will automatically use:
- `ENV` from the dropdown selection
- URLs from repository secrets or fallback to defaults
- `AUTOMATION_SECRET` from repository secrets

## 🔧 **PowerShell Commands (Windows):**

### **Set Multiple Variables:**
```powershell
$env:ENV="qa"
$env:HEADLESS="false" 
$env:RETRIES="2"
npm test
```

### **Create Environment-Specific Scripts:**
Add to your `package.json`:
```json
{
  "scripts": {
    "test:qa": "cross-env ENV=qa npm test",
    "test:dev": "cross-env ENV=dev npm test", 
    "test:prod": "cross-env ENV=prod npm test",
    "test:qa:headed": "cross-env ENV=qa HEADLESS=false npm test"
  }
}
```

## 📋 **Environment Variables Reference:**

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ENV` | Environment to test | `qa` | `qa`, `dev`, `prod` |
| `QA_BASE_URL` | QA environment URL | Marathon QA URL | `https://qa.example.com` |
| `DEV_BASE_URL` | Dev environment URL | Marathon Dev URL | `https://dev.example.com` |
| `PROD_BASE_URL` | Prod environment URL | Marathon Prod URL | `https://example.com` |
| `AUTOMATION_SECRET` | CAPTCHA bypass key | None | `secret_from_dev_team` |
| `HEADLESS` | Run browser headless | `true` | `true`, `false` |
| `RETRIES` | Test retry count | `1` | `0`, `1`, `2` |
| `WORKERS` | Parallel workers | `2` | `1`, `2`, `4` |
| `ACTION_TIMEOUT` | Action timeout (ms) | `30000` | `60000` |
| `TEST_TIMEOUT` | Test timeout (ms) | `60000` | `120000` |

## 🔒 **Security Best Practices:**

### **✅ DO:**
- Keep `.env` file local (never commit to Git)
- Use `.env.example` as template for team
- Store secrets in GitHub repository secrets for CI/CD
- Use different URLs for each environment

### **❌ DON'T:**
- Commit `.env` file to Git (it's in `.gitignore`)
- Share AUTOMATION_SECRET in plain text
- Hard-code URLs in config files

## 🎉 **Benefits:**

✅ **Easy Environment Switching** - One command to switch environments  
✅ **Secure Configuration** - Secrets in environment variables  
✅ **Team Collaboration** - `.env.example` template for consistent setup  
✅ **CI/CD Ready** - Works seamlessly with GitHub Actions  
✅ **Flexible Testing** - Override any setting per test run  

Your configuration is now **clean, secure, and easy to manage**! 🚀