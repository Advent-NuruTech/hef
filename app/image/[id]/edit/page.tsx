"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Fetch existing image data
  useEffect(() => {
    if (!id) return;
    const fetchImage = async () => {
      const docRef = doc(db, "hefGallery", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setImageUrl(data.url || "");
        setAuthorId(data.userId || null);
      } else {
        setError("Image not found.");
      }
    };
    fetchImage();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (auth.currentUser?.uid !== authorId) {
      return setError("You are not authorized to edit this image.");
    }
    if (!title.trim() || !description.trim()) {
      return setError("Title and description cannot be empty.");
    }

    setLoading(true);
    setError(null);

    try {
      let updatedUrl = imageUrl;

      // Upload new image to Cloudinary if a file is selected
      if (imageFile) {
        const form = new FormData();
        form.append("file", imageFile);
        form.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          form
        );
        updatedUrl = res.data.secure_url;
      }

      // Update Firestore
      const docRef = doc(db, "hefGallery", id);
      await updateDoc(docRef, {
        title,
        description,
        url: updatedUrl,
      });

      alert("✅ Image updated successfully!");
      router.push(`/image/${id}`);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    if (auth.currentUser?.uid !== authorId) {
      return setError("You are not authorized to delete this image.");
    }

    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, "hefGallery", id));
      alert("🗑️ Image deleted successfully!");
      router.push("/"); // redirect to homepage or gallery
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (auth.currentUser?.uid !== authorId && authorId) {
    return (
      <div className="p-4 text-center text-red-600 dark:text-red-400">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-md max-w-md mx-auto space-y-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow">
      <h1 className="text-2xl font-bold">Edit Image</h1>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

      <input
        type="text"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <div className="flex flex-col gap-2">
        <label className="font-medium">Update Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        {imageFile && <p>Selected file: {imageFile.name}</p>}
        {!imageFile && imageUrl && (
          <img src={imageUrl} alt="Current" className="mt-2 rounded w-full" />
        )}
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update"}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete Image"}
      </button>
    </div>
  );
}
