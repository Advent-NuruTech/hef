"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ContributionPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number | string>("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const presetAmounts = [20, 200, 1000, 2000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      // Simulate delay before redirect
      setTimeout(() => {
        router.push("/members");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 py-10 px-6 flex items-center justify-center">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Start Your Contribution Today
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Preset Amounts */}
                <div className="grid grid-cols-2 gap-4">
                  {presetAmounts.map((amt, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAmount(amt)}
                      className={`p-3 rounded-xl border text-lg font-semibold transition ${
                        amount === amt
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      {amt} KES
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or Enter Your Desired Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={
                      amount === "" || typeof amount === "number" ? amount : ""
                    }
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                      aria-label="Loading..."
                    />
                  ) : (
                    "Contribute Now"
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="thankyou"
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 Thank You!
              </h2>
              <p className="text-gray-700 mb-6">
                We appreciate your generosity. <br />
                Contribution channels will be integrated soon.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you back to Members page...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
