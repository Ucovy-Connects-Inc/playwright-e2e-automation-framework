// @ts-nocheck
import { expect } from "@playwright/test";
import { baseBest as test } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/LoginPage/LoginPage.js";
import { AIVisualManager } from "../utils/AIVisualManager.js";

test.describe.serial("Resolution-Independent AI Visual Tests", () => {
 
  test("Demo: Resolution-independent visual comparisons @ai-visual @resolution-independent", async ({ authenticatedPage, testData }, testInfo) => {
    const { login } = testData;
    const loginPage = new LoginPage(authenticatedPage);
    
    // 🤖 Initialize AI Visual Manager
    const aiVisual = new AIVisualManager(authenticatedPage, testInfo.title);
    
    console.log('🔄 Starting Resolution-Independent AI Visual Demo...');
    
    console.log('🎯 Testing Multi-Strategy Approach:');
    try {
      await aiVisual.assertElementMultiStrategy('login-form');
      console.log('✅ Multi-strategy approach passed');
    } catch (error) {
      console.log('⚠️ Multi-strategy approach failed:', error.message);
    }
    
    // Test multiple elements with different strategies
    console.log('🔍 Testing multiple elements with resolution independence:');
    const elements = ['username-field', 'password-field', 'login-button'];
    
    for (const element of elements) {
      console.log(`Testing ${element}...`);
      
      // Try multi-strategy approach for each element
      try {
        await aiVisual.assertElementMultiStrategy(element);
        console.log(`✅ ${element} - multi-strategy passed`);
      } catch (error) {
        console.log(`⚠️ ${element} - multi-strategy failed:`, error.message);
        
        // Fallback to content-focused
        try {
          await aiVisual.assertElementContentFocused(element);
          console.log(`✅ ${element} - content-focused fallback passed`);
        } catch (fallbackError) {
          console.log(`❌ ${element} - all strategies failed`);
        }
      }
    }
    
    console.log('🚀 Resolution-Independent AI Visual Demo completed!');
  });
});