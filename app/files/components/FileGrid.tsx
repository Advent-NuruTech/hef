"use client";

import FileCard from "./FileCard";

interface FileItem {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
}

// Helper function to handle redirect download links
const getDirectLink = (url: string) => {
  // Matches any Google Drive file structure with /d/<id>/
  const match = url.match(/\/d\/(.*?)\//);
  if (match) {
    // This redirect-based link always works for downloads
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return url;
};

export default function FileGrid({ files }: { files: FileItem[] }) {
  if (!files.length)
    return <p className="text-center mt-10 text-gray-600">No files found.</p>;

  return (
    <div
      className="
        grid 
        grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
        gap-4 sm:gap-6
        px-3 sm:px-6 py-4
      "
    >
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={{
            ...file,
            fileUrl: getDirectLink(file.fileUrl), // ✅ convert file URL for working redirect
          }}
        />
      ))}
    </div>
  );
}
