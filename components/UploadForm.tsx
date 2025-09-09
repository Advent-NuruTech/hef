"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      return setError("Please choose a file.");
    }
    if (!auth.currentUser) {
      return setError("You must be logged in to upload.");
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload file to Cloudinary (unsigned preset)
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        form
      );

      const url: string = res.data.secure_url;

      // 2. Save metadata to Firestore via your API route
      const saveRes = await fetch("/api/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          title,
          description,
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          userPhotoURL: auth.currentUser.photoURL,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save metadata to Firestore.");
      }

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      alert("✅ Image uploaded successfully!");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
