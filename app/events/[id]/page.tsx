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
      if (!d) return router.push("/events"); // redirect if not found
      setEvent(d);
    });
  }, [id, router]);

  if (!event) return <div className="p-6">Loading…</div>;

  // Handle Firestore Timestamp, Date object, or string
  const date: Date =
    event.date instanceof Date
      ? event.date
      : event.date instanceof Timestamp
      ? event.date.toDate()
      : new Date(event.date as string | number);

  const days = daysRemaining(date);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {event.imageUrl && (
        <div className="w-full h-72 relative mb-4 rounded overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="text-2xl font-bold">{event.name}</h1>
      <div className="text-gray-600">{date.toLocaleDateString()}</div>

      <div className="mt-3">
        <strong>Venue:</strong> <span>{event.venue || "—"}</span>
      </div>

      <div className="mt-4 text-gray-800">{event.description}</div>

      <div className="mt-6 flex items-center gap-3">
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            days < 0
              ? "bg-gray-100 text-gray-700"
              : days <= 3
              ? "bg-orange-100 text-orange-800"
              : "bg-green-100 text-green-800"
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
            className="text-blue-700 underline"
          >
            Open link
          </a>
        )}
      </div>
    </div>
  );
}
