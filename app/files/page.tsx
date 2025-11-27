"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import FileGrid from "./components/FileGrid";

interface FileItem {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
}

// 🔗 Convert Google Drive links to direct downloads
const getDirectLink = (url: string) => {
  const match = url.match(/\/d\/(.*?)\//);
  return match
    ? `https://drive.google.com/uc?export=download&id=${match[1]}`
    : url;
};

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🌀 Quotes for subtitle
  const quotes = [
    "A library is a spiritual treasury.",
    "Read to grow closer to God.",
    "Truth shines brighter when studied.",
    "Every book is a doorway to light.",
    "Knowledge strengthens faith.",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // ⏳ Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const q = query(collection(db, "files"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fileList: FileItem[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<FileItem, "id">;
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            thumbnailUrl: data.thumbnailUrl,
            fileUrl: getDirectLink(data.fileUrl),
          };
        });

        setFiles(fileList);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(search.toLowerCase()) ||
      file.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* 📚 Header */}
      <div className="text-center py-8 bg-white shadow-sm mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Our Library</h1>
        <p className="text-gray-600 mt-2 text-sm transition-opacity duration-500">
          {quotes[currentQuoteIndex]}
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="sticky top-0 bg-white shadow z-10 p-4">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* 📁 File Grid */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading files...</p>
      ) : (
        <FileGrid files={filteredFiles} />
      )}
    </div>
  );
}