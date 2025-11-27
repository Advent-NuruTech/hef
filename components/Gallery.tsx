"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import Likes from "@/components/Likes";
import Comments from "@/components/Comments";
import ShareButtons from '@/components/ShareButtons';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Item {
  id: string;
  url: string;
  description?: string;
  title?: string;
  likes?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
  userName?: string;
  userPhotoURL?: string;
}

interface FirebaseItemData {
  url: string;
  description?: string;
  title?: string;
  likes?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
}

interface UserData {
  displayName?: string;
  photoURL?: string;
}

export default function Gallery() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [expandedDesc, setExpandedDesc] = useState<{ [key: string]: boolean }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});

  // Load gallery images
  useEffect(() => {
    const q = query(collection(db, "hefGallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, async (snap) => {
      const itemsWithUser = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data() as FirebaseItemData;
          let userName = "Anonymous";
          let userPhotoURL = "/default-avatar.png";

          if (data.userId) {
            const userDoc = await getDoc(doc(db, "users", data.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData;
              userName = userData.displayName || "Anonymous";
              userPhotoURL = userData.photoURL || "/default-avatar.png";
            }
          }

          return {
            id: d.id,
            ...data,
            url: data.url || "/placeholder-image.jpg",
            userName,
            userPhotoURL: userPhotoURL || "/default-avatar.png",
          } as Item;
        })
      );
      setItems(itemsWithUser);
    });

    return () => unsub();
  }, []);

  // Count comments
  useEffect(() => {
    if (items.length === 0) return;

    const unsubscribers: (() => void)[] = [];
    items.forEach((it) => {
      const commentsRef = collection(db, "hefGallery", it.id, "comments");
      const unsub = onSnapshot(commentsRef, (snap) => {
        setCommentCounts((prev) => ({
          ...prev,
          [it.id]: snap.size,
        }));
      });
      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach((u) => u());
  }, [items]);

  // Like function
  const like = async (id: string) => {
    if (!auth.currentUser) return alert("Login to like");
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: id, userId: auth.currentUser.uid }),
    });
  };

  // Get latest 3 items for hero section
  const heroItems = items.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
     
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => {
          const isExpanded = expandedDesc[it.id] || false;
          const descTooLong = (it.description?.length || 0) > 100;

          return (
            <div
              key={it.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* User Profile Section at the Top */}
              <div className="p-4 border-b border-gray-100">
                <Link
                  href={`/users/${it.userId}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src={it.userPhotoURL || "/default-avatar.png"}
                      alt={it.userName || "Anonymous"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {it.userName || "Anonymous"}
                    </span>
                    {it.createdAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(it.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Image */}
              <div className="relative aspect-square">
                <Image
                  src={it.url || "/placeholder-image.jpg"}
                  alt={it.title || "image"}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelected(it)}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{it.title}</h3>

                {it.description && (
                  <div className="mb-3">
                    <p className="text-gray-600 text-sm">
                      {isExpanded
                        ? it.description
                        : it.description.slice(0, 100)}
                      {descTooLong && (
                        <button
                          className="text-blue-600 font-medium ml-1 hover:text-blue-800 transition-colors"
                          onClick={() =>
                            setExpandedDesc((prev) => ({
                              ...prev,
                              [it.id]: !isExpanded,
                            }))
                          }
                        >
                          {isExpanded ? "Show less" : "...Show more"}
                        </button>
                      )}
                    </p>
                  </div>
                )}

                {/* Interaction Buttons */}
                <div className="mt-auto pt-3 flex items-center justify-between text-sm border-t border-gray-100">
                  <Likes 
                    itemId={it.id} 
                    likes={it.likes} 
                    onLike={like}
                    className="flex items-center gap-1"
                  />

                  <Comments 
                    itemId={it.id} 
                    commentCount={commentCounts[it.id] || 0}
                    className="flex items-center gap-1"
                  />

                  <ShareButtons 
                    item={it} 
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-lg">🔗</span>
                    <span>Share</span>
                  </ShareButtons>

                  {auth.currentUser?.uid === it.userId && (
                    <Link
                      href={`/image/${it.id}/edit`}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-lg">✏️</span>
                      <span>Edit</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen Image Viewer */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/90 p-4">
          <Dialog.Panel className="relative w-full max-w-6xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="relative h-96 md:h-[70vh]">
                <Image
                  src={selected?.url || "/placeholder-image.jpg"}
                  alt={selected?.title || "full"}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 mr-3">
                    <Image
                      src={selected?.userPhotoURL || "/default-avatar.png"}
                      alt={selected?.userName || "Anonymous"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selected?.userName || "Anonymous"}</h3>
                    {selected?.createdAt && (
                      <p className="text-sm text-gray-500">
                        {new Date(selected.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-2">{selected?.title}</h2>
                <p className="text-gray-700 mb-4">{selected?.description}</p>
                
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                  <Likes 
                    itemId={selected?.id || ""} 
                    likes={selected?.likes} 
                    onLike={like}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  />
                  
                  <Comments 
                    itemId={selected?.id || ""} 
                    commentCount={selected ? commentCounts[selected.id] || 0 : 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  />
                  
                  {selected && (
                    <ShareButtons 
                      item={selected} 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-xl">🔗</span>
                      <span>Share</span>
                    </ShareButtons>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}