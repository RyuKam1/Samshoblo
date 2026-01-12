# FCM v1 API Migration - What We Fixed

## 🚨 The Problem

You were getting **"Requested entity was not found"** errors because:

1. **Legacy FCM API Deprecated**: The old FCM API was shut down on July 22, 2024
2. **Missing v1 API Configuration**: Your code needed to be updated for the new HTTP v1 API
3. **Incorrect Firebase Setup**: Service account configuration was incomplete

## ✅ What We Fixed

### 1. Updated Notifications Code (`app/lib/notifications.ts`)

- **FCM v1 API Format**: Now uses the new message structure required by v1 API
- **Platform-Specific Configs**: Added Android, iOS, and Web push configurations
- **Data Conversion**: Automatically converts nested JSON to strings (required by v1 API)
- **Better Error Handling**: Detailed logging for FCM v1 API errors
- **Token Validation**: Improved FCM token extraction and validation

### 2. Enhanced Error Logging

- **FCM v1 API Errors**: Specific error codes and messages
- **Project ID Validation**: Shows which Firebase project is being used
- **Token Debugging**: Logs token details for troubleshooting
- **Credential Issues**: Detects and reports Firebase credential problems

### 3. Created Test Script

- **Configuration Validation**: Tests Firebase Admin SDK setup
- **FCM v1 API Test**: Validates message format and structure
- **Environment Check**: Verifies all required variables are set
- **Usage**: Run `npm run test-firebase` to test your setup

## 🔧 What You Need to Do

### 1. Fix Environment Variables

Create/update your `.env.local` file:

```bash
# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# VAPID Keys for Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 2. Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the values to your `.env.local`

### 3. Test Your Configuration

```bash
npm run test-firebase
```

This will verify:

- ✅ Environment variables are set
- ✅ Firebase Admin SDK initializes
- ✅ FCM v1 API is accessible
- ✅ Message format is valid

## 🆕 FCM v1 API Changes

### Old Format (Deprecated):

```json
{
  "to": "token",
  "notification": { "title": "Hello" }
}
```

### New Format (v1 API):

```json
{
  "message": {
    "token": "token",
    "notification": { "title": "Hello" },
    "android": { "notification": { "click_action": "ACTIVITY" } },
    "apns": { "payload": { "aps": { "badge": 1 } } }
  }
}
```

## 🧪 Testing

1. **Run the test script**: `npm run test-firebase`
2. **Check console logs**: Look for FCM v1 API messages
3. **Test with real token**: Try sending a notification
4. **Monitor errors**: Check for any remaining FCM issues

## 🆘 Still Having Issues?

1. **Check Firebase Console** for API errors
2. **Verify project ID** matches everywhere
3. **Ensure Cloud Messaging API** is enabled
4. **Check service account permissions**
5. **Run the test script** for debugging

## 📚 Resources

- [FCM v1 API Migration Guide](https://firebase.google.com/docs/cloud-messaging/migrate-v1)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [FCM Error Codes](https://firebase.google.com/docs/cloud-messaging/admin/errors)

---

**Status**: ✅ Code Updated for FCM v1 API  
**Next Step**: Configure your `.env.local` file and test with `npm run test-firebase`
