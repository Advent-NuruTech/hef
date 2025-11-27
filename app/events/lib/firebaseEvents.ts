"use client";

import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

// Strongly typed EventItem
export type EventItem = {
  id: string;
  name: string;
  description?: string;
  venue?: string;
  link?: string | null;
  date: Timestamp | Date;
  imageUrl?: string;
  createdAt?: Timestamp;
  authorId?: string | null;
};

// Listen to events in real-time
export function listenEvents(cb: (items: EventItem[]) => void) {
  const q = query(collection(db, "events"), orderBy("date", "desc"));
  return onSnapshot(q, (snap) => {
    const items: EventItem[] = snap.docs.map((d) => {
      const data = d.data() as Omit<EventItem, "id">;
      return { id: d.id, ...data };
    });
    cb(items);
  });
}

// Create a new event
export async function createEvent(payload: Partial<EventItem>) {
  return await addDoc(collection(db, "events"), {
    ...payload,
    createdAt: serverTimestamp(),
    authorId: auth.currentUser?.uid || null,
    date: payload.date instanceof Date ? Timestamp.fromDate(payload.date) : payload.date,
  });
}

// Update an existing event
export async function updateEvent(id: string, payload: Partial<EventItem>) {
  return await updateDoc(doc(db, "events", id), {
    ...payload,
    date: payload.date instanceof Date ? Timestamp.fromDate(payload.date) : payload.date,
  });
}

// Delete an event
export async function deleteEvent(id: string) {
  return await deleteDoc(doc(db, "events", id));
}

// Get a single event once
export async function getEventOnce(id: string): Promise<EventItem | null> {
  const snap = await getDoc(doc(db, "events", id));
  if (!snap.exists()) return null;

  const data = snap.data() as Omit<EventItem, "id">;
  return { id: snap.id, ...data };
}
