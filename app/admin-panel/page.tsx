"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface RegistrationData {
  childName: string;
  childSurname: string;
  childAge: string;
  parentName: string;
  parentSurname: string;
  parentPhone: string;
  timestamp: string;
  id: string;
}

export default function AdminPanel() {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [storageStats, setStorageStats] = useState<{
    totalRegistrations: number;
    storageUsed: number;
    estimatedStorageRemainingMB: number;
    storageMethod: string;
  } | null>(null);

  // Check if notifications are supported and enabled
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");

      // Check for existing subscription
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.getRegistration(
          "/sw.js"
        );
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            // We have a subscription, restore it regardless of format
            setNotificationsEnabled(true);
            console.log(
              "Restored existing push subscription:",
              subscription.endpoint
            );
          }
        }
      }
    } catch (error) {
      console.error("Error checking existing subscription:", error);
    }
  };

  const handleNotificationToggle = async () => {
    if (!("Notification" in window)) {
      alert("Push notifications are not supported in this browser");
      return;
    }

    if (Notification.permission === "granted") {
      // Disable notifications
      setNotificationsEnabled(false);
      localStorage.removeItem("pushSubscription");
    } else {
      // Enable notifications
      setIsSubscribing(true);
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await subscribeToNotifications();
          setNotificationsEnabled(true);
        } else {
          alert("Notification permission denied");
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        alert("Failed to enable notifications");
      } finally {
        setIsSubscribing(false);
      }
    }
  };

  const subscribeToNotifications = async () => {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        // Unregister any existing service worker first
        const existingRegistrations =
          await navigator.serviceWorker.getRegistrations();
        for (const registration of existingRegistrations) {
          await registration.unregister();
        }

        // Register the service worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        // Send message to force Web Push format
        if (registration.active) {
          registration.active.postMessage({ type: "FORCE_WEBPUSH_FORMAT" });
        }

        // Always unsubscribe from any existing subscription first
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        // Create new subscription with VAPID key (required for browser subscription)
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
          throw new Error(
            "VAPID public key not configured. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY in your environment variables."
          );
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Log the subscription for debugging
        console.log(
          "Subscription created successfully:",
          subscription.endpoint
        );

        // Send subscription to server
        const response = await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription }),
        });

        if (!response.ok) {
          throw new Error("Failed to save subscription on server");
        }

        localStorage.setItem("pushSubscription", JSON.stringify(subscription));
        console.log("Successfully subscribed to push notifications");
      }
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      throw error;
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const fetchRegistrations = async () => {
    setIsRefreshing(true);
    setError("");

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations);

        // Fetch storage statistics
        try {
          const statsResponse = await fetch("/api/storage-stats");
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStorageStats(statsData);
          }
        } catch (statsError) {
          console.error("Failed to fetch storage stats:", statsError);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch registrations");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations);
        setIsAuthenticated(true);

        // Fetch storage statistics
        try {
          const statsResponse = await fetch("/api/storage-stats");
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setStorageStats(statsData);
          }
        } catch (statsError) {
          console.error("Failed to fetch storage stats:", statsError);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Authentication failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl max-w-md w-full mx-4">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {t("adminAccess")}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              {t("adminSubtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                {t("password")}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                placeholder={t("enterPassword")}
              />
            </div>

            {error && (
              <div className="mt-4 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center backdrop-blur-sm text-sm sm:text-base">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-base sm:text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="relative z-10">
                {isLoading ? t("authenticating") : t("accessAdminPanel")}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {t("adminPanel")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 px-4">
            {t("adminSubtitle2")}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-gray-400 text-sm sm:text-base">
              {t("totalRegistrations")} {registrations.length}
            </div>
            <button
              onClick={fetchRegistrations}
              disabled={isRefreshing}
              className="group flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-400 hover:bg-amber-500/30 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isRefreshing ? t("refreshing") : t("refresh")}</span>
            </button>

            {/* Notification Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-xl">
              <span className="text-blue-400 text-sm sm:text-base">
                Push Notifications
              </span>
              <button
                onClick={handleNotificationToggle}
                disabled={isSubscribing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  notificationsEnabled ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              {isSubscribing && (
                <svg
                  className="w-4 h-4 animate-spin text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>
          </div>

          {/* Storage Statistics */}
          {storageStats && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-yellow-400 font-semibold text-sm">
                    Storage Used
                  </div>
                  <div className="text-white text-lg font-bold">
                    {storageStats.storageUsed}MB
                  </div>
                  <div className="text-gray-400 text-xs">of 30MB Redis</div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold text-sm">
                    Storage Method
                  </div>
                  <div className="text-white text-sm font-bold">
                    {storageStats.storageMethod}
                  </div>
                  <div className="text-gray-400 text-xs">data persistence</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Registrations List */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          {registrations.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-lg sm:text-xl">
                {t("noRegistrations")}
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {registrations.map((registration, index) => (
                <div
                  key={registration.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-amber-400">
                      {t("registration")}
                      {index + 1}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-400">
                      {formatDate(registration.timestamp)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Child Information */}
                    <div className="space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white border-b border-white/20 pb-2">
                        {t("childInformation")}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-gray-400 text-sm">
                            {t("name")}
                          </span>
                          <span className="text-white font-medium text-sm sm:text-base">
                            {registration.childName} {registration.childSurname}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-gray-400 text-sm">
                            {t("age")}
                          </span>
                          <span className="text-white font-medium text-sm sm:text-base">
                            {registration.childAge} {t("yearsOld")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div className="space-y-3">
                      <h4 className="text-base sm:text-lg font-semibold text-white border-b border-white/20 pb-2">
                        {t("parentInformation")}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-gray-400 text-sm">
                            {t("name")}
                          </span>
                          <span className="text-white font-medium text-sm sm:text-base">
                            {registration.parentName}{" "}
                            {registration.parentSurname}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-gray-400 text-sm">
                            {t("phone")}
                          </span>
                          <span className="text-white font-medium text-sm sm:text-base">
                            {registration.parentPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <span className="text-xs sm:text-sm text-gray-400">
                        ID: {registration.id}
                      </span>
                      <button
                        onClick={() => {
                          const text = `Child: ${registration.childName} ${
                            registration.childSurname
                          } (${registration.childAge} ${t(
                            "yearsOld"
                          )})\nParent: ${registration.parentName} ${
                            registration.parentSurname
                          }\nPhone: ${
                            registration.parentPhone
                          }\nDate: ${formatDate(registration.timestamp)}`;
                          navigator.clipboard.writeText(text);
                        }}
                        className="px-3 sm:px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-all duration-300 text-xs sm:text-sm"
                      >
                        {t("copyDetails")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword("");
              setRegistrations([]);
              setError("");
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 hover:bg-red-500/30 transition-all duration-300 text-sm sm:text-base"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
