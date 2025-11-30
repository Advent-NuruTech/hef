"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [subscriptionTime, setSubscriptionTime] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser?.email) {
      setEmail(currentUser.email);
      setName(currentUser.displayName || "User");

      // Check if already subscribed
      const checkSubscription = async () => {
        const q = query(
          collection(db, "subscriptions"),
          where("email", "==", currentUser.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setSubscribed(true);
          const subData = snap.docs[0].data();
          if (subData.createdAt) {
            const date = (subData.createdAt as Timestamp).toDate();
            setSubscriptionTime(`${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`);
          }
        }
      };
      checkSubscription();
    }
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Check if email already subscribed
      const q = query(collection(db, "subscriptions"), where("email", "==", email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSubscribed(true);
        const subData = snap.docs[0].data();
        if (subData.createdAt) {
          const date = (subData.createdAt as Timestamp).toDate();
          setSubscriptionTime(`${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`);
        }
        setMessage("❌ You have already subscribed.");
        setLoading(false);
        return;
      }

      // Add subscription
      const docRef = await addDoc(collection(db, "subscriptions"), {
        name: name || "Guest",
        email,
        createdAt: serverTimestamp(),
      });

      setSubscribed(true);
      const now = new Date();
      setSubscriptionTime(`${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`);
      setMessage(`✅ ${name || "Guest"}, thanks for subscribing! You will be updated at ${email}.`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = auth.currentUser !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-16 pt-12 border-t border-gray-800"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Stay Connected</h3>
        <p className="text-gray-400 mb-6">
          Subscribe to receive updates on events, Bible studies, and ministry news.
        </p>

        {!subscribed && (
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggedIn}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="px-6 py-3 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        )}

        {subscribed && (
          <button
            disabled
            className="px-6 py-3 font-semibold rounded-lg shadow-lg bg-green-600 text-white cursor-not-allowed"
          >
            {subscriptionTime
              ? `Subscribed on ${subscriptionTime}`
              : "Already Subscribed"}
          </button>
        )}

        {message && <p className="text-green-500 mt-3">{message}</p>}
      </div>
    </motion.div>
  );
}
