import React from "react";
import { auth, db, messaging, getToken, onMessage } from "@/src/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function NotificationManager() {
  const [showBanner, setShowBanner] = React.useState(false);
  const [permission, setPermission] = React.useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  React.useEffect(() => {
    if (permission === "default") {
      const timer = setTimeout(() => setShowBanner(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const requestPermission = async () => {
    try {
      const status = await Notification.requestPermission();
      setPermission(status);
      setShowBanner(false);

      if (status === "granted") {
        await setupNotifications();
      }
    } catch (error) {
      console.error("Permission request failed", error);
    }
  };

  const setupNotifications = async () => {
    const msg = await messaging();
    if (!msg) return;

    try {
      // NOTE: You must generate a 'Web Push Certificate' in the Firebase Console
      // (Project Settings -> Cloud Messaging -> Web configuration)
      // and replace this placeholder with your actual 'Vapid Key'.
      const token = await getToken(msg, {
        vapidKey: "BKeN9f-U-X-E-Z1-G-D-S-K-E-Y-H-E-R-E-" 
      });

      if (token && auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          fcmTokens: arrayUnion(token)
        });
        console.log("FCM Token saved");
      }

      onMessage(msg, (payload) => {
        console.log("Message received in foreground: ", payload);
        // You could show a custom toast here
        if (payload.notification) {
          alert(`New Notification: ${payload.notification.title}\n${payload.notification.body}`);
        }
      });
    } catch (error) {
      console.error("FCM Setup failed", error);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 bg-white rounded-3xl shadow-2xl border border-primary/10 p-6 flex items-start gap-4"
        >
          <div className="bg-primary/10 p-3 rounded-2xl text-primary">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Enable Notifications?</h4>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Get alerted instantly when someone finds your lost item or reports something near you.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={requestPermission}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
              >
                Allow
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="flex-1 bg-gray-50 text-gray-500 py-2 px-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
              >
                Later
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
