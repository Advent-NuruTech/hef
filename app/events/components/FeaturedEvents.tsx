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
    <div className="p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  ? "bg-red-100 text-red-700"
                  : status.variant === "orange"
                  ? "bg-orange-100 text-orange-700"
                  : status.variant === "blue"
                  ? "bg-blue-100 text-blue-800"
                  : status.variant === "green"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700";

              return (
                <motion.article
                  key={event.id}
                  layout
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl shadow p-4 flex gap-4"
                >
                  <div className="w-32 h-24 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <div className="text-xs text-gray-500">{date.toLocaleDateString()}</div>
                      </div>
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                      >
                        {status.label}
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-3">{event.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-blue-700 font-semibold">
                        {d >= 0 ? countdown : timeAgo(date)}
                      </div>
                      <Link href={`/events/${event.id}`} className="text-sm text-gray-600">
                        Details →
                      </Link>
                    </div>
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
