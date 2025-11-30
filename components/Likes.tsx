"use client";

import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";

interface LikesProps {
  itemId: string;
  likes?: string[];
  onLike: (id: string) => void;
  className?: string;
}

export default function Likes({ itemId, likes = [], onLike, className = "" }: LikesProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const isLiked = auth.currentUser ? likes.includes(auth.currentUser.uid) : false;
  const likesCount = likes.length || 0;

  const handleLike = () => {
    if (!auth.currentUser) {
      // Optional: Show a tooltip or redirect to login
      return;
    }
    
    setIsAnimating(true);
    onLike(itemId);
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <motion.button
        onClick={handleLike}
        disabled={!auth.currentUser}
        whileTap={{ scale: 0.9 }}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
          transition-all duration-300 group
          ${isLiked 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }
          ${!auth.currentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        {/* Heart Icon */}
        <div className="relative">
          {isLiked ? (
            <motion.div
              initial={isAnimating ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <FaHeart className="text-lg text-red-500 dark:text-red-400" />
            </motion.div>
          ) : (
            <FaRegHeart className="text-lg group-hover:text-red-500 transition-colors" />
          )}
          
          {/* Burst Animation on Like */}
          {isAnimating && isLiked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI) / 3) * 20,
                    y: Math.sin((i * Math.PI) / 3) * 20,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </div>

        {/* Count with Animation */}
        <motion.span
          key={likesCount}
          initial={{ scale: 1 }}
          animate={isAnimating ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="font-semibold"
        >
          {likesCount}
        </motion.span>

        {/* Ripple Effect */}
        {isAnimating && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isLiked ? 'bg-red-500' : 'bg-gray-400'
            }`}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>

      {/* Floating Hearts Animation */}
      {isAnimating && isLiked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute left-1/2"
              initial={{ y: 0, opacity: 1, x: -8 }}
              animate={{
                y: -40 - i * 10,
                opacity: 0,
                x: -8 + (i - 1) * 15,
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
            >
              <FaHeart className="text-red-500 text-xs" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}