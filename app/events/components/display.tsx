"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { daysRemaining, friendlyStatus, timeAgo } from "@/app/events/lib/helpers";
import { listenEvents, EventItem } from "@/app/events/lib/firebaseEvents";
import { useToasts } from "@/app/events/components/Toasts";

type Props = {
     event: EventItem; 
  showImage?: boolean;
};

export default function EventGallery({ showImage = true }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const nowRef = useRef(Date.now());
  const [, setTick] = useState(0);
  const { push, Toasts } = useToasts();

  // Listen for events in real-time
  useEffect(() => {
    const unsub = listenEvents((items) => setEvents(items));
    return () => unsub();
  }, []);

  // Live tick for countdowns
  useEffect(() => {
    const t = setInterval(() => {
      nowRef.current = Date.now();
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Listen for custom "event-created" toast
  useEffect(() => {
    function handler(e: CustomEvent<{ id: string; name: string; date: string }>) {
      const payload = e.detail;
      push(
        `Event posted: ${payload.name}`,
        `Starts ${new Date(payload.date).toLocaleDateString()}`
      );
    }
    window.addEventListener("event-created", handler as EventListener);
    return () => window.removeEventListener("event-created", handler as EventListener);
  }, [push]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Toasts />
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Upcoming Events</h1>
        </header>

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
                  className="bg-white rounded-lg shadow p-3 flex gap-3"
                >
                  {/* image */}
                  <div className="w-36 h-24 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {showImage && event.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.imageUrl}
                        className="w-full h-full object-cover"
                        alt={event.name}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <div className="text-xs text-gray-500">{date.toLocaleDateString()}</div>
                      </div>

                      {/* animated badge */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                      >
                        {status.label}
                      </motion.div>
                    </div>

                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">{event.description}</p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-blue-700 font-semibold">
                        {d >= 0 ? countdown : timeAgo(date)}
                      </div>
                      <div className="space-x-2">
                        <Link href={`/events/${event.id}`} className="text-sm text-gray-600">
                          Details
                        </Link>
                      </div>
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
