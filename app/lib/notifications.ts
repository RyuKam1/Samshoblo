import admin from "firebase-admin";
import webpush from "web-push";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    // Check if required environment variables are set
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_PRIVATE_KEY ||
      !process.env.FIREBASE_CLIENT_EMAIL
    ) {
      console.warn(
        "Firebase Admin SDK environment variables not set. FCM notifications will not work."
      );
      console.warn(
        "Required variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL"
      );
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log("Firebase Admin SDK initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

// Configure VAPID keys for web push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn(
    "VAPID keys not configured. Web push notifications will not work."
  );
  console.warn(
    "Required variables: NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY"
  );
} else {
  console.log("VAPID keys configured:", {
    publicKey: vapidPublicKey.substring(0, 20) + "...",
    privateKey: vapidPrivateKey.substring(0, 20) + "...",
  });

  webpush.setVapidDetails(
    "mailto:admin@samshoblo.com",
    vapidPublicKey,
    vapidPrivateKey
  );
}

// Shared in-memory storage for subscriptions (in production, you'd use a database)
let subscriptions: PushSubscription[] = [];

// Function to add/update subscription
export function addSubscription(subscription: PushSubscription): number {
  const existingIndex = subscriptions.findIndex(
    (sub) => sub.endpoint === subscription.endpoint
  );

  if (existingIndex >= 0) {
    // Update existing subscription
    subscriptions[existingIndex] = subscription;
    console.log(
      `Subscription updated. Total subscriptions: ${subscriptions.length}`
    );
  } else {
    // Add new subscription
    subscriptions.push(subscription);
    console.log(
      `Subscription added. Total subscriptions: ${subscriptions.length}`
    );
  }

  return subscriptions.length;
}

// Function to remove subscription
export function removeSubscription(endpoint: string): number {
  subscriptions = subscriptions.filter((sub) => sub.endpoint !== endpoint);
  console.log(
    `Subscription removed. Total subscriptions: ${subscriptions.length}`
  );
  return subscriptions.length;
}

// Function to get all subscriptions
export function getSubscriptions(): PushSubscription[] {
  return [...subscriptions]; // Return a copy to prevent external modification
}

// Function to get subscription count
export function getSubscriptionCount(): number {
  return subscriptions.length;
}

// Export function to send notifications (used by other parts of the app)
export async function sendNotificationToAll(
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  if (subscriptions.length === 0) {
    console.log("No active subscriptions to send notifications to");
    return;
  }

  // Check if Firebase Admin SDK is initialized
  if (!admin.apps.length) {
    console.error("Firebase Admin SDK not initialized");
    return;
  }

  console.log(`Sending notification to ${subscriptions.length} subscriptions`);

  const promises = subscriptions.map(async (subscription) => {
    try {
      console.log(`Processing subscription: ${subscription.endpoint}`);

      // Determine if this is a web push subscription or FCM subscription
      if (subscription.endpoint.includes("/fcm/send/")) {
        // This is a native FCM subscription - use Firebase Admin SDK
        console.log("Using Firebase Admin SDK for FCM subscription");

        // Extract FCM token from the endpoint
        let fcmToken: string = "";
        const urlParts = subscription.endpoint.split("/");
        fcmToken = urlParts[urlParts.length - 1];

        if (!fcmToken || fcmToken.length < 10) {
          console.warn(
            `Invalid FCM token extracted from endpoint: ${subscription.endpoint} -> ${fcmToken}`
          );
          return;
        }

        console.log(`Extracted FCM token: ${fcmToken.substring(0, 20)}...`);

        // Use FCM v1 API format (new format as of 2024)
        const message = {
          token: fcmToken,
          notification: {
            title: title,
            body: body,
          },
          data: {
            url: "/admin-panel",
            ...Object.fromEntries(
              Object.entries(data || {}).map(([key, value]) => [
                key,
                typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value),
              ])
            ),
          },
          // Platform-specific configurations for v1 API
          android: {
            notification: {
              click_action: "FLUTTER_NOTIFICATION_CLICK",
              icon: "/dancePic.jpg",
              color: "#FF6B6B",
            },
          },
          apns: {
            payload: {
              aps: {
                badge: 1,
                sound: "default",
                category: "REGISTRATION_NOTIFICATION",
              },
            },
          },
          webpush: {
            notification: {
              icon: "/dancePic.jpg",
              badge: "/dancePic.jpg",
              vibrate: [200, 100, 200],
              actions: [
                {
                  action: "view",
                  title: "View Details",
                  icon: "/dancePic.jpg",
                },
                {
                  action: "close",
                  title: "Close",
                  icon: "/dancePic.jpg",
                },
              ],
              requireInteraction: true,
              tag: "registration-notification",
            },
          },
        };

        try {
          console.log("Sending FCM v1 message:", {
            projectId: process.env.FIREBASE_PROJECT_ID,
            token: fcmToken.substring(0, 20) + "...",
            messageStructure: "v1",
          });

          const response = await admin.messaging().send(message);
          console.log(
            `Firebase notification sent successfully to ${subscription.endpoint}. Message ID: ${response}`
          );
        } catch (fcmError: unknown) {
          const errorPayload = fcmError as { code?: string; message?: string; errorInfo?: unknown };
          console.error("FCM v1 API Error details:", {
            code: errorPayload.code,
            message: errorPayload.message,
            errorInfo: errorPayload.errorInfo,
            projectId: process.env.FIREBASE_PROJECT_ID,
            token: fcmToken.substring(0, 20) + "...",
            apiVersion: "v1",
          });

          // Handle specific FCM error codes
          if (
            errorPayload.code === "messaging/registration-token-not-registered" ||
            errorPayload.code === "messaging/invalid-registration-token" ||
            errorPayload.code === "messaging/registration-token-expired"
          ) {
            console.warn(
              `FCM token is invalid/expired: ${fcmToken.substring(0, 20)}...`
            );
            // Remove this subscription as it's no longer valid
            subscriptions = subscriptions.filter(
              (sub) => sub.endpoint !== subscription.endpoint
            );
            console.log(
              `Removed invalid FCM subscription. Total subscriptions: ${subscriptions.length}`
            );
          } else if (
            errorPayload.code === "messaging/unsupported-credential" ||
            errorPayload.code === "messaging/invalid-credential"
          ) {
            console.error(
              "Firebase credentials issue. Check your service account configuration."
            );
            console.error("Make sure you're using the new FCM v1 API format.");
          } else {
            throw fcmError; // Re-throw other errors to be handled by outer catch
          }
        }
      } else {
        // This is a web push subscription - use web-push library
        console.log("Using web-push for web push subscription");

        // Check if this subscription has the required keys
        if (!subscription.getKey || typeof subscription.getKey !== "function") {
          console.warn(
            "Subscription missing getKey method, skipping notification"
          );
          return;
        }

        const payload = JSON.stringify({
          title: title,
          body: body,
          data: {
            url: "/admin-panel",
            ...data,
          },
          icon: "/dancePic.jpg",
          badge: "/dancePic.jpg",
          vibrate: [200, 100, 200],
          actions: [
            {
              action: "view",
              title: "View Details",
              icon: "/dancePic.jpg",
            },
            {
              action: "close",
              title: "Close",
              icon: "/dancePic.jpg",
            },
          ],
          requireInteraction: true,
          tag: "registration-notification",
        });

        // Convert browser PushSubscription to web-push format
        const p256dh = subscription.getKey("p256dh");
        const auth = subscription.getKey("auth");

        if (!p256dh || !auth) {
          console.warn("Missing subscription keys, skipping notification");
          return;
        }

        const webPushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode.apply(
                null,
                Array.from(new Uint8Array(p256dh))
              )
            ),
            auth: btoa(
              String.fromCharCode.apply(null, Array.from(new Uint8Array(auth)))
            ),
          },
        };

        const response = await webpush.sendNotification(
          webPushSubscription,
          payload
        );
        console.log(
          `Web push notification sent successfully to ${subscription.endpoint}. Status: ${response.statusCode}`
        );
      }
    } catch (error: unknown) {
      const e = error as { statusCode?: number; code?: string; message?: string };
      console.error(
        `Failed to send notification to ${subscription.endpoint}:`,
        error
      );

      // If subscription is expired or invalid, remove it
      if (
        e.statusCode === 410 || // Gone (subscription expired)
        e.statusCode === 404 || // Not Found
        e.statusCode === 401 || // Unauthorized
        e.code === "messaging/registration-token-not-registered" ||
        e.code === "messaging/invalid-registration-token" ||
        e.code === "messaging/registration-token-expired" ||
        e.message?.includes("failed")
      ) {
        subscriptions = subscriptions.filter(
          (sub) => sub.endpoint !== subscription.endpoint
        );
        console.log(
          `Removed invalid subscription. Total subscriptions: ${subscriptions.length}`
        );
      }
    }
  });

  await Promise.all(promises);
}
