"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { listenEvents, EventItem } from "./lib/firebaseEvents";
import EventCard from "./components/display"; // import the component
import { useToasts } from "./components/Toasts";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const nowRef = useRef(Date.now());
  const [, setTick] = useState(0);
  const { push, Toasts } = useToasts();

  // Firestore real-time listener
  useEffect(() => {
    const unsub = listenEvents((items) => setEvents(items));
    return () => unsub();
  }, []);

  // Live ticking for countdowns
  useEffect(() => {
    const t = setInterval(() => {
      nowRef.current = Date.now();
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Event-created toast
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toasts />

      <div className="max-w-4xl mx-auto">
      

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {events.map((event) => (
              <EventCard key={event.id} event={event} /> // just render the imported component
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
