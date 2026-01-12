// Service Worker for Push Notifications
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/dancePic.jpg", // Using your existing dance image
      badge: "/dancePic.jpg",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/admin-panel",
      },
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
      requireInteraction: true, // Keep notification visible until user interacts
      tag: "registration-notification", // Prevent duplicate notifications
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

self.addEventListener("install", function (event) {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activating...");
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clear any old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }),
    ])
  );
});

// Force Web Push format by intercepting subscription requests
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "FORCE_WEBPUSH_FORMAT") {
    console.log("Forcing Web Push format...");
    // This will help ensure we get /wp/ endpoints instead of /fcm/send/
  }
});
