"use client";

import { getDriveLinks } from "../utils/driveLinks";

interface FileItem {
  id: string;
  name: string;
  pages?: number;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
}

export default function FileCard({ file }: { file: FileItem }) {
  const { viewUrl, downloadUrl } = getDriveLinks(file.fileUrl);

  // ✅ Safe sharing for mobile & desktop
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.name,
          text: file.description,
          url: file.fileUrl,
        });
      } catch (err) {
        console.warn("Share canceled or failed:", err);
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(file.fileUrl);
      alert("Link copied to clipboard!");
    } else {
      window.prompt("Copy this link:", file.fileUrl);
    }
  };

  // ✅ Limit description to 50 words
  const shortDesc = file.description.split(" ");
  const displayDesc =
    shortDesc.length > 50
      ? shortDesc.slice(0, 50).join(" ") + "..."
      : file.description;

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col">
      {/* ✅ Perfect image handling */}
      <div
        className="w-full bg-gray-100 cursor-pointer flex items-center justify-center"
        onClick={() => window.open(viewUrl, "_blank")}
      >
        <img
          src={file.thumbnailUrl}
          alt={file.name}
          className="w-full h-auto max-h-52 object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-base font-semibold truncate">{file.name}</h2>
          <p className="text-gray-600 text-xs mb-2">{displayDesc}</p>

          {/* ✅ Manual Page Count */}
          {file.pages && (
            <p className="text-gray-500 text-xs mb-1">
              📄 {file.pages} page{file.pages > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="mt-3 flex justify-between items-center text-xs">
          <button
            onClick={() => window.open(downloadUrl, "_blank")}
            className="text-purple-600 hover:underline"
          >
            Download
          </button>

          <button
            onClick={handleShare}
            className="text-green-600 hover:underline"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
