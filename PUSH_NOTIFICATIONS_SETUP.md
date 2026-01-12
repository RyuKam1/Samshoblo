# Push Notifications Setup Guide

This guide explains how to set up and use the push notification feature for the admin panel.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate VAPID Keys

```bash
npm run generate-vapid
```

This will generate two keys. Copy them to your `.env.local` file:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_generated_public_key
VAPID_PRIVATE_KEY=your_generated_private_key
```

### 3. Start the Development Server

```bash
npm run dev
```

## 🔧 How It Works

### For Admins:

1. **Enable Notifications**: In the admin panel, you'll see a "Push Notifications" toggle switch
2. **Grant Permission**: Click the toggle to enable notifications (browser will ask for permission)
3. **Receive Notifications**: You'll get instant push notifications whenever someone registers on the website

### For Users:

- Users don't need to do anything special
- When they submit a registration form, admins with notifications enabled will receive a push notification

## 📱 Notification Details

Each notification includes:

- **Title**: "New Registration Received! 🎉"
- **Body**: Child's name, age, and parent's name
- **Actions**: "View Details" and "Close" buttons
- **Clicking**: Takes you directly to the admin panel

## 🛠️ Technical Implementation

- **Service Worker**: Handles push notifications in the background
- **Web Push API**: Free, unrestricted push notification service
- **VAPID**: Voluntary Application Server Identification for Web Push
- **In-Memory Storage**: Subscriptions are stored in memory (resets on server restart)

## 🔒 Security Notes

- VAPID private key is kept secret on the server
- Public key is safe to expose in client-side code
- Notifications only work on HTTPS (required by browsers)
- Users must explicitly grant permission

## 🚨 Troubleshooting

### Notifications Not Working?

1. Check if you're on HTTPS (required for push notifications)
2. Ensure you've granted notification permission in your browser
3. Verify VAPID keys are correctly set in `.env.local`
4. Check browser console for any errors

### Service Worker Issues?

1. Clear browser cache and reload
2. Check if service worker is registered in browser dev tools
3. Ensure `/sw.js` file is accessible

## 🌟 Features

- ✅ **Free & Unrestricted**: Uses Web Push API (no external services needed)
- ✅ **Instant Notifications**: Real-time alerts for new registrations
- ✅ **Rich Content**: Includes registration details and actions
- ✅ **Cross-Platform**: Works on desktop and mobile browsers
- ✅ **Privacy-First**: Requires explicit user permission

## 📝 Browser Support

- ✅ Chrome 42+
- ✅ Firefox 44+
- ✅ Safari 16+
- ✅ Edge 17+

## 🔄 Future Enhancements

- Database storage for subscriptions (currently in-memory)
- Notification preferences and categories
- Email fallback for unsupported browsers
- Notification history and management
