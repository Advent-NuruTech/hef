"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { getDriveLinks } from "@/app/files/utils/driveLinks";
import Link from "next/link";

interface FileItem {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
  pages?: number;
}

export default function FeaturedStudies() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  // 🔹 Fetch latest 8 files
  useEffect(() => {
    const fetchLatestFiles = async () => {
      try {
        const q = query(collection(db, "files"), orderBy("createdAt", "desc"), limit(8));
        const snapshot = await getDocs(q);

        // ✅ Fix: exclude 'id' from doc.data() to prevent duplicate key
        const fileList = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<FileItem, "id">;
          return { id: doc.id, ...data };
        });

        setFiles(fileList);
      } catch (err) {
        console.error("Error fetching featured files:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestFiles();
  }, []);

  // 🔹 Auto-slide every 5 seconds
  useEffect(() => {
    if (files.length > 2) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 2) % files.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [files]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading Featured Studies...</p>;
  }

  if (files.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No featured studies yet.</p>;
  }

  // ✅ Show two side-by-side cards (2 columns × 1 row)
  const currentFiles = files.slice(index, index + 2);
  if (currentFiles.length < 2 && files.length > 2) {
    currentFiles.push(files[0]); // wrap-around for smooth transition
  }

  return (
    <div className="mt-10 text-center">
      {/* ✅ Clickable header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <Link
          href="/files"
          className="text-sm text-gray-600 hover:text-green-700 transition"
        >
          View all →
        </Link>
      </div>

      {/* ✅ Slideshow container */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {currentFiles.map((file) => {
              const { viewUrl, downloadUrl } = getDriveLinks(file.fileUrl);
              return (
                <div
                  key={file.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-full bg-gray-100 cursor-pointer flex items-center justify-center"
                    onClick={() => window.open(viewUrl, "_blank")}
                  >
                    <img
                      src={file.thumbnailUrl}
                      alt={file.name}
                      className="w-full h-56 object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{file.name}</h3>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                      {file.description}
                    </p>

                    {file.pages && (
                      <p className="text-gray-500 text-xs mb-2">
                        📄 {file.pages} page{file.pages > 1 ? "s" : ""}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-xs">
                      <a
                        href={downloadUrl}
                        target="_blank"
                        className="text-purple-600 hover:underline"
                      >
                        Download
                      </a>

                      <button
                        onClick={async () => {
                          if (navigator.share) {
                            await navigator.share({
                              title: file.name,
                              text: file.description,
                              url: file.fileUrl,
                            });
                          } else {
                            await navigator.clipboard.writeText(file.fileUrl);
                            alert("Link copied!");
                          }
                        }}
                        className="text-green-600 hover:underline"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
