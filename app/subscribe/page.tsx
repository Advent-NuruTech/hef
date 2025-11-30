"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

type Subscription = {
  id: string;
  email: string;
  name: string;
  createdAt?: Timestamp;
};

export default function SubscribePage() {
  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const q = query(
          collection(db, "subscriptions"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const list: Subscription[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as Omit<Subscription, "id">;
          list.push({ id: doc.id, ...data });
        });
        setSubs(list);
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
      }
    };

    fetchSubs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Newsletter Subscriptions</h1>

      {subs.length === 0 && <p>No subscriptions yet.</p>}

      <ul className="space-y-2">
        {subs.map((s) => {
          const date = s.createdAt?.toDate();
          const formattedDate = date
            ? `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
            : "Unknown date";
          return (
            <li
              key={s.id}
              className="p-3 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row md:justify-between"
            >
              <span>
                <strong>{s.name}</strong> ({s.email})
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 md:mt-0">
                Subscribed on {formattedDate}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
