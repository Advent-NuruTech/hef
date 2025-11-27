"use client";

import Link from "next/link";

interface CommentsProps {
  itemId: string;
  commentCount: number;
  className?: string;
}

export default function Comments({ itemId, commentCount, className = "" }: CommentsProps) {
  return (
    <Link
      href={`/image/${itemId}`}
      className={`flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors ${className}`}
    >
      <span className="text-lg">💬</span>
      <span>{commentCount || 0}</span>
    </Link>
  );
}