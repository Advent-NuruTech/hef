"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { listenEvents, EventItem } from "@/app/events/lib/firebaseEvents";
import { friendlyStatus, timeAgo } from "@/app/events/lib/helpers";

export default function FeaturedEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const nowRef = useRef(Date.now());
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = listenEvents((items) => setEvents(items));
    return () => unsub();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      nowRef.current = Date.now();
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-4 bg-gray-50 dark:bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {events.map((event) => {
              const date =
                event.date instanceof Date
                  ? event.date
                  : "toDate" in event.date
                  ? event.date.toDate()
                  : new Date(event.date);

              const msLeft = date.getTime() - nowRef.current;
              const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
              const d = Math.floor(totalSeconds / (3600 * 24));
              const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
              const m = Math.floor((totalSeconds % 3600) / 60);
              const s = totalSeconds % 60;
              const countdown = d > 50 ? "50+ days" : `${d}d ${h}h ${m}m ${s}s`;

              const status = friendlyStatus(date);
              const badgeColor =
                status.variant === "red"
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  : status.variant === "orange"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200"
                  : status.variant === "blue"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : status.variant === "green"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

              return (
                <motion.article
                  key={event.id}
                  layout
                  whileHover={{ scale: 1.01 }}
                  className="bg-white dark:bg-[#161616] rounded-2xl shadow-md p-4 border border-gray-100 dark:border-gray-800"
                >

                  {/* 🔥 FULL IMAGE — UNIFORM SIZE — NO CROPPING */}
                  <div className="w-full h-52 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </div>

                  {/* Title below image */}
                  <h3 className="mt-3 font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {event.name}
                  </h3>

                  {/* Timer under title */}
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                    {d >= 0 ? countdown : timeAgo(date)}
                  </div>

                  {/* Badge + Description on same line */}
                  <div className="mt-3 flex gap-3 items-start">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeColor}`}
                    >
                      {status.label}
                    </motion.div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-gray-500 dark:text-gray-400">
                      {date.toLocaleDateString()}
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Details →
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
