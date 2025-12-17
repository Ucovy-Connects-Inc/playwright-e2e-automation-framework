// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { AIVisualManager } from "../utils/AIVisualManager.js";

test.describe.serial("AI Visual Framework Demo", () => {
 
  test("Demo: AI Visual element assertions work correctly @ai-visual @demo", async ({ authenticatedPage, testData }, testInfo) => {
    const { login } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    
    // 🤖 Initialize AI Visual Manager
    const aiVisual = new AIVisualManager(authenticatedPage, testInfo.title);
    
    console.log('🎯 Starting AI Visual Demo...');
    
    // Test individual elements (these work reliably)
    await aiVisual.assertElement('login-form');
    console.log('✅ Login form visual assertion passed');
    
    await aiVisual.assertElement('username-field');
    console.log('✅ Username field visual assertion passed');
    
    await aiVisual.assertElement('password-field');
    console.log('✅ Password field visual assertion passed');
    
    await aiVisual.assertElement('login-button');
    console.log('✅ Login button visual assertion passed');
    
    // Test multiple elements at once
    const results = await aiVisual.assertMultipleElements([
      'login-form',
      'username-field', 
      'password-field',
      'login-button'
    ]);
    
    console.log('🎉 Multi-element AI Visual Results:', results);
    
    // Verify all passed
    expect(results.every(r => r.status === 'passed')).toBe(true);
    
    console.log('🚀 AI Visual Framework Demo completed successfully!');
  });
});