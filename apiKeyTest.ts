// test-api-key.ts
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testAPIKey() {
  console.log("=== Testing Google Gemini API Key ===\n");

  // Check if API key is loaded
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("❌ ERROR: GOOGLE_API_KEY not found in .env file");
    return;
  }

  console.log(`✅ API Key loaded: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  // Test 1: List available models
  console.log("📋 Fetching available models...");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`❌ API Request Failed: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return;
    }

    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      console.log(`✅ Found ${data.models.length} available models:\n`);
      data.models.forEach((model: any) => {
        console.log(`  - ${model.name}`);
      });
    } else {
      console.log("⚠️  No models found");
    }
  } catch (err) {
    console.error("❌ Error fetching models:", err);
    return;
  }

  // Test 2: Try generating content with the SDK
  console.log("\n🧪 Testing content generation with SDK...");
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Say hello in 3 words");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Content generation successful!");
    console.log(`Response: "${text}"\n`);
  } catch (err: any) {
    console.error("❌ Content generation failed:", err.message);
    
    // Try alternative model names
    console.log("\n🔄 Trying alternative model names...");
    const modelsToTry = [
      "models/gemini-pro",
      "gemini-1.5-flash",
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro"
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`  Testing: ${modelName}...`);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        response.text();
        console.log(`  ✅ ${modelName} works!\n`);
        break;
      } catch {
        console.log(`  ❌ ${modelName} failed`);
      }
    }
  }
}

testAPIKey();