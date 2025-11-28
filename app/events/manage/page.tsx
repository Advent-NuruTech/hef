"use client";
import React, { useEffect, useState } from "react";
import { listenEvents, createEvent, updateEvent, deleteEvent, EventItem } from "../lib/firebaseEvents";
import { uploadToCloudinary } from "../lib/upload";
import { useToasts } from "../components/Toasts";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { push, Toasts } = useToasts();

  useEffect(() => {
    const unsub = listenEvents((items) => setEvents(items));
    return () => unsub();
  }, []);

  const validateDateNotPast = (d: string) => {
    const selected = new Date(d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected.getTime() >= today.getTime();
  };

  const handleCreate = async () => {
    if (!name || !date || !validateDateNotPast(date)) {
      return alert("Provide valid name and date (today or future).");
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      const docRef = await createEvent({
        name,
        venue,
        description,
        link: link || null,
        date: new Date(date),
        imageUrl,
      });

      push("Event posted", name);

      const evtDetail = { id: docRef.id, name, date: new Date(date).toISOString() };
      window.dispatchEvent(new CustomEvent("event-created", { detail: evtDetail }));

      setName(""); setVenue(""); setDate(""); setLink(""); setDescription(""); setImageFile(null);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert("Error creating event: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateEdit = (ev: EventItem) => {
    setName(ev.name || "");
    setVenue(ev.venue || "");
    setDate(ev.date instanceof Date ? ev.date.toISOString().slice(0, 10)
      : "toDate" in ev.date ? ev.date.toDate().toISOString().slice(0, 10)
      : new Date(ev.date).toISOString().slice(0, 10)
    );
    setLink(ev.link || "");
    setDescription(ev.description || "");
  };

  const handleSaveEdit = async (id: string) => {
    if (!id) return;
    if (date && !validateDateNotPast(date)) return alert("Date cannot be in the past");
    setLoading(true);
    try {
      const payload: Partial<EventItem> = { name, venue, description, link: link || null };
      if (date) payload.date = new Date(date);
      if (imageFile) payload.imageUrl = await uploadToCloudinary(imageFile);
      await updateEvent(id, payload);
      push("Event updated", name || "Updated");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert("Update failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    push("Event deleted");
  };

  return (
   <div className="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <Toasts />
  <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create / Update Event</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Event name"
        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
      />
      <input
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        placeholder="Venue"
        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
      />
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Optional link"
        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none sm:col-span-2 w-full"
      />
      <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          className="text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition-colors duration-200"
        >
          {loading ? "Posting..." : "Post Event"}
        </button>
      </div>
    </div>

    <hr className="my-6 border-gray-300 dark:border-gray-600" />

    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Existing Events</h3>
    <div className="space-y-3">
      {events.map((ev) => {
        const dateObj =
          ev.date instanceof Date ? ev.date : "toDate" in ev.date ? ev.date.toDate() : new Date(ev.date);
        return (
          <div
            key={ev.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-gray-700 transition-colors duration-300"
          >
            <div className="mb-2 sm:mb-0">
              <div className="font-medium text-gray-900 dark:text-gray-100">{ev.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                {dateObj.toLocaleDateString()} • {ev.venue}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 border rounded text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" onClick={() => handlePopulateEdit(ev)}>Edit</button>
              <button className="px-3 py-1 border rounded bg-yellow-100 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 hover:bg-yellow-200 dark:hover:bg-yellow-500 transition-colors duration-200" onClick={() => handleSaveEdit(ev.id)}>Save</button>
              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200" onClick={() => handleDelete(ev.id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
}
