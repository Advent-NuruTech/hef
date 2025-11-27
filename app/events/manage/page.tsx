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
    <div className="min-h-screen p-6 bg-gray-50">
      <Toasts />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create / Update Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Event name" className="border p-2 rounded" />
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" className="border p-2 rounded" />
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="border p-2 rounded" />
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Optional link" className="border p-2 rounded" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded md:col-span-2" />
          <div className="md:col-span-2 flex items-center gap-3">
            <input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
            <button onClick={handleCreate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Posting..." : "Post Event"}
            </button>
          </div>
        </div>

        <hr className="my-6" />

        <h3 className="font-semibold mb-3">Existing Events</h3>
        <div className="space-y-3">
          {events.map((ev) => {
            const dateObj = ev.date instanceof Date ? ev.date : "toDate" in ev.date ? ev.date.toDate() : new Date(ev.date);
            return (
              <div key={ev.id} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <div className="font-medium">{ev.name}</div>
                  <div className="text-xs text-gray-500">{dateObj.toLocaleDateString()} • {ev.venue}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handlePopulateEdit(ev)} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={() => handleSaveEdit(ev.id)} className="px-3 py-1 bg-yellow-100 border rounded">Save</button>
                  <button onClick={() => handleDelete(ev.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
