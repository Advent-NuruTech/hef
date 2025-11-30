"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  userId?: string;
};

type Comment = {
  id: string;
  text: string;
  userId: string;
  createdAt: Timestamp;
  userName?: string;
  userPhoto?: string;
};

type UserProfile = {
  displayName?: string;
  photoURL?: string;
};

export default function ImagePage() {
  const { id } = useParams(); // image id from URL
  const [image, setImage] = useState<Item | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Load image details
  useEffect(() => {
    if (!id) return;
    const loadImage = async () => {
      const ref = doc(db, "hefGallery", id as string);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Omit<Item, "id">;
        setImage({ id: snap.id, ...data });
      }
    };
    loadImage();
  }, [id]);

  // Load comments with user info
  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, "hefGallery", id as string, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, async (snap) => {
      const list: Comment[] = [];
      for (const d of snap.docs) {
        const data = d.data() as Omit<Comment, "id">;
        let userName = "Unknown";
        let userPhoto = "/default-avatar.png";

        if (data.userId) {
          const userRef = doc(db, "users", data.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const u = userSnap.data() as UserProfile;
            userName = u.displayName || "User";
            userPhoto = u.photoURL || "/default-avatar.png";
          }
        }

        list.push({
          id: d.id,
          ...data,
          userName,
          userPhoto,
        });
      }
      setComments(list);
    });
    return () => unsub();
  }, [id]);

  const postComment = async () => {
    if (!auth.currentUser) return alert("Login to comment");
    if (!newComment.trim()) return;

    const ref = collection(db, "hefGallery", id as string, "comments");
    await addDoc(ref, {
      text: newComment,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setNewComment("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {image && (
        <>
          {/* Image Card */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <Image
              src={image.url}
              alt={image.title || "image"}
              width={800}
              height={600}
              className="w-full h-auto rounded"
            />
            <h1 className="text-xl font-semibold mt-3 text-gray-900 dark:text-gray-100">
              {image.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{image.description}</p>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Comments ({comments.length})
            </h2>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <Link href={`/users/${c.userId}`}>
                    <Image
                      src={c.userPhoto || "/default-avatar.png"}
                      alt={c.userName || "user"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/users/${c.userId}`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
                    >
                      {c.userName}
                    </Link>
                    <p className="text-gray-700 dark:text-gray-200 mt-1">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button
                onClick={postComment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded"
              >
                Post
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
