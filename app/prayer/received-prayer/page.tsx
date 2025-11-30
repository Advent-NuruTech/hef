"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface PrayerRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  request: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function ReceivedPrayersPage() {
  const router = useRouter();
  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);

  // 🔐 Authentication protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  // 🔥 Fetch all prayers (once)
  const loadPrayers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "prayerRequests"));

      const list: PrayerRequest[] = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...(doc.data() as Omit<PrayerRequest, "id">),
        })
      );

      setPrayers(list);
    } catch (err) {
      console.error("Failed to load prayers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadPrayers();
  }, [user]);

  // 🗑️ Delete a prayer request
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this prayer request?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "prayerRequests", id));

      // Update UI after deletion
      setPrayers((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete prayer request:", error);
      alert("Error deleting the request.");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
         Received Prayer Requests
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading prayer requests...
        </p>
      ) : prayers.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No prayer requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow border dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {prayer.name}
                </h2>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(prayer.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Phone:</strong> {prayer.phone}
              </p>

              {prayer.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> {prayer.email}
                </p>
              )}

              <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                {prayer.request}
              </p>

              {prayer.createdAt && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Submitted on:{" "}
                  {new Date(
                    prayer.createdAt.seconds * 1000
                  ).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
