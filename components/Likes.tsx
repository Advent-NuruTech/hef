"use client";

import { auth } from "@/lib/firebase";

interface LikesProps {
  itemId: string;
  likes?: string[];
  onLike: (id: string) => void;
  className?: string;
}

export default function Likes({ itemId, likes = [], onLike, className = "" }: LikesProps) {
  const handleLike = () => {
    onLike(itemId);
  };

  const isLiked = auth.currentUser ? likes.includes(auth.currentUser.uid) : false;

  return (
    <button 
      onClick={handleLike} 
      className={`flex items-center gap-1 transition-colors ${className} ${
        isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      <span className="text-lg">{isLiked ? '👍' : '👋'}</span>
      <span>{likes.length || 0}</span>
    </button>
  );
}