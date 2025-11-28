"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";

interface Video {
  id: string;
  videoId: string;
  createdAt: Timestamp;
}

export default function UploadVideoPage() {
  const [videoId, setVideoId] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing video IDs in real-time
  useEffect(() => {
    const q = query(collection(db, "youtubeVideos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const vids: Video[] = snap.docs.map((doc) => ({
        id: doc.id,
        videoId: doc.data().videoId,
        createdAt: doc.data().createdAt,
      }));
      setVideos(vids);
    });
    return () => unsub();
  }, []);

  const handleUpload = async () => {
    if (!videoId.trim()) return alert("Enter a valid YouTube video ID");
    setLoading(true);
    try {
      await addDoc(collection(db, "youtubeVideos"), {
        videoId: videoId.trim(),
        createdAt: Timestamp.now(),
      });
      setVideoId("");
    } catch (err) {
      console.error(err);
      alert("Failed to upload video ID");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteDoc(doc(db, "youtubeVideos", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Upload YouTube Video</h1>

        <input
          type="text"
          placeholder="Enter YouTube Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          className="w-full p-2 rounded border mb-4 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <h2 className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200">Uploaded Videos</h2>
        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
          {videos.length === 0 && <p className="text-gray-500 dark:text-gray-400">No videos uploaded yet.</p>}
          {videos.map((vid) => (
            <div key={vid.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-gray-800 dark:text-gray-100">{vid.videoId}</span>
              <div className="flex space-x-3">
                <a
                  href={`https://youtu.be/${vid.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(vid.id)}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
