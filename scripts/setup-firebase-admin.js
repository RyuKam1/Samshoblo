#!/usr/bin/env node

console.log("🔥 Firebase Admin SDK Setup Helper");
console.log("==================================");
console.log();

console.log("To complete the Firebase Admin SDK setup, you need to:");
console.log();

console.log("1. Go to Firebase Console: https://console.firebase.google.com/");
console.log("2. Select your project: shikriki-9c697");
console.log("3. Go to Project Settings (gear icon) → Service Accounts");
console.log("4. Click 'Generate new private key'");
console.log("5. Download the JSON file");
console.log();

console.log("6. Open the downloaded JSON file and copy these values:");
console.log("   - project_id");
console.log("   - private_key");
console.log("   - client_email");
console.log();

console.log("7. Create a .env.local file in your project root with:");
console.log("   FIREBASE_PROJECT_ID=shikriki-9c697");
console.log(
  '   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour_Private_Key_Here\\n-----END PRIVATE KEY-----"'
);
console.log(
  "   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@shikriki-9c697.iam.gserviceaccount.com"
);
console.log();

console.log("⚠️  Important:");
console.log("   - Keep the .env.local file private (don't commit it to git)");
console.log(
  "   - The private key should be the entire key including BEGIN/END markers"
);
console.log("   - Use double quotes around the private key value");
console.log();

console.log("✅ After setting up .env.local, restart your development server");
console.log("   Your push notifications should work with Firebase Admin SDK!");
