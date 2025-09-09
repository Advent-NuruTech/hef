"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function SetupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    // Prevent multiple visits
    const seenSetup = localStorage.getItem("seenSetup");
    if (seenSetup) {
      router.replace("/"); // redirect if already visited
      return;
    }

    // Get user’s first name
    const user = auth.currentUser;
    if (user?.displayName) {
      setFirstName(user.displayName.split(" ")[0]);
    } else if (user?.email) {
      setFirstName(user.email.split("@")[0]); // fallback
    } else {
      setFirstName("Friend");
    }
  }, [router]);

  const finishSetup = (path: string) => {
    localStorage.setItem("seenSetup", "true"); // mark as seen
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-4"
        >
          Welcome, {firstName} 👋
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-6"
        >
          Thanks for signing up.Would you like to update your profile now or
          skip and do it later?
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={() => finishSetup("/profile")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Profile
          </button>
          <button
            onClick={() => finishSetup("/")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Skip for Now
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
