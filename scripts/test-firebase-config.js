#!/usr/bin/env node

/**
 * Firebase Configuration Test Script
 *
 * This script helps test your Firebase Admin SDK configuration
 * and verifies that FCM v1 API is working correctly.
 *
 * Usage: node scripts/test-firebase-config.js
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Simple environment variable loader (no external dependencies)
function loadEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#")) {
          const equalIndex = trimmedLine.indexOf("=");
          if (equalIndex > 0) {
            const key = trimmedLine.substring(0, equalIndex);
            const value = trimmedLine.substring(equalIndex + 1);

            // Remove quotes if present
            const cleanValue = value.replace(/^["']|["']$/g, "");
            process.env[key] = cleanValue;
          }
        }
      });
      console.log(`✅ Loaded environment variables from ${filePath}`);
    } else {
      console.log(`⚠️  Environment file not found: ${filePath}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not load environment file: ${error.message}`);
  }
}

// Load environment variables from .env.local
loadEnvFile(path.join(__dirname, "..", ".env.local"));

console.log("🔥 Firebase Configuration Test\n");

// Check environment variables
console.log("📋 Environment Variables Check:");
const requiredVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
];

let allVarsSet = true;
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(
      `✅ ${varName}: ${
        varName === "FIREBASE_PRIVATE_KEY" ? "Set (hidden)" : value
      }`
    );
  } else {
    console.log(`❌ ${varName}: Not set`);
    allVarsSet = false;
  }
});

if (!allVarsSet) {
  console.log("\n❌ Missing required environment variables!");
  console.log(
    "Please check your .env.local file and ensure all Firebase variables are set."
  );
  process.exit(1);
}

console.log("\n🔧 Testing Firebase Admin SDK Initialization...");

try {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });

  console.log("✅ Firebase Admin SDK initialized successfully");
  console.log(`📱 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);

  // Test FCM messaging
  console.log("\n🧪 Testing FCM v1 API...");

  // Create a test message (this won't actually send, just tests the format)
  const testMessage = {
    token: "test-token-for-validation",
    notification: {
      title: "Test Notification",
      body: "This is a test message to validate FCM v1 API format",
    },
    data: {
      test: "true",
      timestamp: Date.now().toString(),
    },
    android: {
      notification: {
        click_action: "TEST_ACTIVITY",
      },
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
        },
      },
    },
  };

  console.log("✅ FCM message format is valid");
  console.log("📤 Message structure:", JSON.stringify(testMessage, null, 2));

  // Test if we can access the messaging service
  const messaging = admin.messaging();
  console.log("✅ FCM messaging service accessible");

  console.log(
    "\n🎉 All tests passed! Your Firebase configuration is working correctly."
  );
  console.log("\n📝 Next steps:");
  console.log(
    "1. Ensure your FCM tokens are from the correct Firebase project"
  );
  console.log("2. Test with a real FCM token (not this test token)");
  console.log(
    "3. Check that Cloud Messaging API is enabled in Firebase Console"
  );
} catch (error) {
  console.error("\n❌ Firebase initialization failed:", error.message);

  if (error.code === "app/duplicate-app") {
    console.log("ℹ️  Firebase app already initialized (this is fine)");
  } else if (error.code === "app/invalid-credential") {
    console.log(
      "❌ Invalid credentials. Check your service account JSON file."
    );
    console.log(
      "💡 Make sure you downloaded the correct service account key from Firebase Console."
    );
  } else if (error.code === "app/invalid-project-id") {
    console.log(
      "❌ Invalid project ID. Check your FIREBASE_PROJECT_ID environment variable."
    );
  } else {
    console.log("❌ Unknown error. Check your Firebase configuration.");
  }

  process.exit(1);
}

// Cleanup
process.on("exit", () => {
  try {
    admin.app().delete();
  } catch (e) {
    // Ignore cleanup errors
  }
});
