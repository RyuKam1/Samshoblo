# Firebase Setup Guide for Push Notifications

This guide will help you properly configure Firebase for both Web Push and FCM notifications.

## 🚨 Current Issue

You're getting "Requested entity was not found" errors because:

1. **Legacy FCM API Deprecated** - You're using the old FCM API which was shut down on July 22, 2024
2. **Missing FCM v1 API Configuration** - Need to migrate to the new HTTP v1 API
3. **Incorrect Firebase configuration** - Missing or wrong service account credentials
4. **FCM tokens from wrong project** - Tokens may be from a different Firebase project
5. **Missing VAPID keys** - Required for web push notifications

## 🔧 Step 1: Fix Firebase Admin SDK Configuration

### 1.1 Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one if needed)
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file

### 1.2 Update Environment Variables

Create or update your `.env.local` file with the correct values:

```bash
# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Firebase Client Config (from project settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**⚠️ Important**: The `FIREBASE_PRIVATE_KEY` should be the actual private key, not the service account email!

## 🔑 Step 2: Generate VAPID Keys

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Generate Keys

```bash
npm run generate-vapid
```

### 2.3 Add VAPID Keys to .env.local

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-generated-public-key
VAPID_PRIVATE_KEY=your-generated-private-key
```

## 📱 Step 3: Enable FCM v1 API

### 3.1 In Firebase Console

1. Go to **Project Settings** → **Cloud Messaging**
2. Enable **Cloud Messaging API** if not already enabled
3. Note your **Sender ID** (used in client config)
4. **Important**: Ensure you're using the new FCM v1 API (not legacy)

### 3.2 Verify Project ID Match

Ensure your Firebase project ID matches in:

- Service account JSON
- Client configuration
- Environment variables

### 3.3 FCM v1 API Endpoint

The new FCM v1 API uses this endpoint format:

```
https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send
```

**Note**: The Admin SDK automatically handles this migration, but ensure your service account has the correct permissions.

## 🧪 Step 4: Test Configuration

### 4.1 Check Environment Variables

```bash
# In your terminal, check if variables are loaded
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
```

### 4.2 Test Firebase Admin SDK

The updated code will now log detailed information about:

- Firebase initialization status
- FCM error details
- Invalid token handling

### 4.3 Check Console Logs

Look for these messages:

- ✅ "Firebase Admin SDK initialized successfully"
- ✅ "Using Firebase Admin SDK for FCM subscription"
- ❌ "Firebase Admin SDK environment variables not set"

## 🚨 Troubleshooting FCM Errors

### Common Error Codes:

1. **"Requested entity was not found"**

   - **Legacy FCM API deprecated** (shut down July 22, 2024)
   - Wrong project ID
   - Invalid service account credentials
   - Token from different project
   - **Solution**: Ensure you're using FCM v1 API via Admin SDK

2. **"messaging/registration-token-not-registered"**

   - Token expired or revoked
   - App uninstalled
   - User logged out

3. **"messaging/invalid-registration-token"**
   - Malformed token
   - Wrong token format

### Debug Steps:

1. **Check Project ID Match**:

   ```bash
   # In .env.local
   FIREBASE_PROJECT_ID=should-match-your-console
   ```

2. **Verify Service Account**:

   - Ensure you downloaded the correct service account JSON
   - Check that the project ID in JSON matches your Firebase project

3. **Test with Simple Message**:
   ```typescript
   // Test FCM connection
   const testMessage = {
     token: "test-token",
     notification: { title: "Test", body: "Test message" },
   };
   ```

## 🔄 Alternative: Use Web Push Only

If you continue having FCM issues, you can disable FCM and use only Web Push:

1. **Remove Firebase Admin SDK**:

   ```bash
   npm uninstall firebase-admin
   ```

2. **Update notifications.ts**:
   - Remove Firebase imports
   - Route all subscriptions to web-push
   - Use only VAPID keys

## 🆕 FCM v1 API Migration

### What Changed in 2024:

1. **Legacy API Shutdown**: The old FCM API (`https://fcm.googleapis.com/fcm/send`) was deprecated
2. **New v1 API**: Uses `https://fcm.googleapis.com/v1/projects/PROJECT_ID/messages:send`
3. **OAuth 2.0**: Replaces server keys with access tokens
4. **Message Format**: New structure with platform-specific overrides

### Your Code is Already Updated:

The updated `notifications.ts` now:

- ✅ Uses FCM v1 API format via Admin SDK
- ✅ Handles platform-specific configurations
- ✅ Converts nested JSON data to strings (required by v1 API)
- ✅ Provides detailed error logging for debugging

### Required Environment Variables:

```bash
# These MUST be set for FCM v1 API to work
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## 📋 Checklist

- [ ] Service account JSON downloaded
- [ ] Environment variables set correctly
- [ ] VAPID keys generated and added
- [ ] Firebase project ID matches everywhere
- [ ] Cloud Messaging API enabled
- [ ] Test notification sent successfully

## 🆘 Still Having Issues?

1. **Check Firebase Console** for any error messages
2. **Verify project ID** in all locations
3. **Test with a new service account** if needed
4. **Check Firebase billing** (some features require paid plan)

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [FCM Error Codes](https://firebase.google.com/docs/cloud-messaging/admin/errors)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)

---

**Last Updated**: $(date)  
**Status**: 🔧 In Progress - Needs Firebase Configuration Fix
