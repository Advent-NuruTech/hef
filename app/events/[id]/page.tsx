"use client";

import React, { useEffect, useState } from "react";
import { getEventOnce, EventItem as FirestoreEventItem } from "../lib/firebaseEvents";
import { daysRemaining } from "../lib/helpers";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";

interface PageProps {
  params: {
    id: string;
  };
}

export default function SingleEventPage({ params }: PageProps) {
  const { id } = params;
  const [event, setEvent] = useState<FirestoreEventItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    getEventOnce(id).then((d) => {
      if (!d) return router.push("/events");
      setEvent(d);
    });
  }, [id, router]);

  if (!event) return <div className="p-6">Loading…</div>;

  const date: Date =
    event.date instanceof Date
      ? event.date
      : event.date instanceof Timestamp
      ? event.date.toDate()
      : new Date(event.date as string | number);

  const days = daysRemaining(date);

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* 🔥 FULL IMAGE – NO CROPPING – UNIFORM HEIGHT */}
      {event.imageUrl && (
        <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 relative mb-4 rounded flex items-center justify-center overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {event.name}
      </h1>

      <div className="text-gray-600 dark:text-gray-300">
        {date.toLocaleDateString()}
      </div>

      <div className="mt-3 text-gray-800 dark:text-gray-200">
        <strong>Venue:</strong> <span>{event.venue || "—"}</span>
      </div>

      <div className="mt-4 text-gray-900 dark:text-gray-200 leading-relaxed">
        {event.description}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            days < 0
              ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              : days <= 3
              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {days < 0
            ? "Event passed"
            : days === 0
            ? "Happening today"
            : `${days} day${days !== 1 ? "s" : ""} remaining`}
        </div>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 dark:text-blue-400 underline"
          >
            Open link
          </a>
        )}
      </div>
    </div>
  );
}
