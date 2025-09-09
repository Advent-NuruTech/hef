
"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

export default function EditPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;

    const fetchImage = async () => {
      const docRef = doc(db, "hefGallery", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setAuthorId(data.userId);
      } else {
        setError("Image not found.");
      }
    };

    fetchImage();
  }, [id]);

  const handleUpdate = async () => {
    if (auth.currentUser?.uid !== authorId) {
      return setError("You are not authorized to edit this image.");
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, "hefGallery", id);
      await updateDoc(docRef, {
        title,
        description,
      });
      alert("✅ Image updated successfully!");
      router.push(`/image/${id}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (auth.currentUser?.uid !== authorId && authorId) {
    return <p>You are not authorized to view this page.</p>
  }

  return (
    <div className="p-4 border rounded-md max-w-md space-y-3">
      <h1 className="text-xl font-bold">Edit Image</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

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
        onClick={handleUpdate}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}
