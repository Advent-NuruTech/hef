"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

type FileType = {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
  pages?: number;
};

export default function FileManagerPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [pages, setPages] = useState<number | "">("");
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load all files
  const fetchFiles = async () => {
    const snap = await getDocs(collection(db, "files"));
    const docs = snap.docs.map((docSnap) => {
  const data = docSnap.data() as Omit<FileType, "id">;
  return { id: docSnap.id, ...data };
});
    setFiles(docs);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Cloudinary Upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("Uploading thumbnail...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      setThumbnailUrl(data.secure_url);
      setMessage("Thumbnail uploaded!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload thumbnail.");
    } finally {
      setLoading(false);
    }
  };

  // Add or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        // Update existing
        await updateDoc(doc(db, "files", editingId), {
          name,
          description,
          fileUrl,
          thumbnailUrl,
          pages: pages ? Number(pages) : null,
        });
        setMessage("✅ File updated successfully!");
        setEditingId(null);
      } else {
        // Add new
        await addDoc(collection(db, "files"), {
          name,
          description,
          fileUrl,
          thumbnailUrl,
          pages: pages ? Number(pages) : null,
          createdAt: serverTimestamp(),
        });
        setMessage("✅ File uploaded successfully!");
      }

      // Reset form
      setName("");
      setDescription("");
      setFileUrl("");
      setThumbnailUrl("");
      setPages("");

      fetchFiles();
    } catch (err) {
      console.error(err);
      setMessage("❌ Operation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit a file
  const handleEdit = (file: FileType) => {
    setEditingId(file.id);
    setName(file.name);
    setDescription(file.description);
    setFileUrl(file.fileUrl);
    setThumbnailUrl(file.thumbnailUrl);
    setPages(file.pages || "");
    setMessage("");
  };

  // Delete a file
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "files", id));
      setMessage("File deleted!");
      fetchFiles();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete file.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
        {editingId ? "Edit File" : "Upload a New File"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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

        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Total Pages"
          value={pages}
          onChange={(e) => setPages(e.target.value === "" ? "" : Number(e.target.value))}
          min={1}
        />

        <div className="border p-3 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Thumbnail (Cloudinary)
          </label>
          <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="w-full text-sm" />
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
          {loading ? "Processing..." : editingId ? "Update File" : "Upload File"}
        </button>
      </form>

      {message && <p className="text-center mt-3 font-medium text-gray-700">{message}</p>}

      {/* Files List */}
      <h2 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Uploaded Files</h2>
      <div className="space-y-4">
        {files.length === 0 && <p>No files uploaded yet.</p>}
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {file.thumbnailUrl && (
                <img
                  src={file.thumbnailUrl}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-600">{file.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(file)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
