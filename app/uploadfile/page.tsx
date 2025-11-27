"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadFilePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [pages, setPages] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Cloudinary Upload Logic
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setThumbnailUrl(data.secure_url);
        setMessage("✅ Thumbnail uploaded successfully!");
      } else {
        throw new Error("Failed to upload thumbnail.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Cloudinary upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Firestore upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "files"), {
        name,
        description,
        fileUrl,
        thumbnailUrl,
        pages: pages ? Number(pages) : null,
        createdAt: serverTimestamp(),
      });

      setMessage("✅ File uploaded successfully!");
      setName("");
      setDescription("");
      setFileUrl("");
      setThumbnailUrl("");
      setPages("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload file. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-2xl mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
        Upload a New File
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded-lg"
          placeholder="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border rounded-lg"
          placeholder="File Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded-lg"
          placeholder="Google Drive File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          required
        />

        {/* ✅ Total Pages */}
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Total Pages (optional)"
          value={pages}
          onChange={(e) => setPages(e.target.value === "" ? "" : Number(e.target.value))}
          min={1}
        />

        {/* ✅ Cloudinary Thumbnail Upload */}
        <div className="border p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Thumbnail (Cloudinary)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="w-full text-sm"
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail Preview"
              className="mt-3 w-full h-40 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
}
