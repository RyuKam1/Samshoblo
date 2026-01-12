#!/usr/bin/env node

const webpush = require("web-push");

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log("🔑 VAPID Keys Generated Successfully!");
console.log("");
console.log("Add these to your .env.local file:");
console.log("");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log("");
console.log(
  "⚠️  Keep your private key secret and never commit it to version control!"
);
console.log("✅ Your public key is safe to expose in the client-side code.");
