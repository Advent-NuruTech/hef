"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaComment, FaRegComment } from "react-icons/fa";
import { useState } from "react";

interface CommentsProps {
  itemId: string;
  commentCount: number;
  className?: string;
}

export default function Comments({ itemId, commentCount, className = "" }: CommentsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasComments = commentCount > 0;

  return (
    <Link
      href={`/image/${itemId}`}
      className={`inline-flex ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
          transition-all duration-300 group cursor-pointer
          ${hasComments 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        aria-label={`View ${commentCount} comments`}
      >
        {/* Comment Icon */}
        <motion.div
          className="relative"
          animate={isHovered ? { rotate: [-5, 5, -5, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {hasComments ? (
            <FaComment className="text-lg text-blue-500 dark:text-blue-400" />
          ) : (
            <FaRegComment className="text-lg group-hover:text-blue-500 transition-colors" />
          )}
          
          {/* Notification Dot for new comments */}
          {hasComments && (
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        {/* Count with Animation */}
        <motion.span
          key={commentCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-semibold"
        >
          {commentCount || 0}
        </motion.span>

        {/* Hover Text */}
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          animate={isHovered ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap text-xs"
        >
          {commentCount === 0 ? "Add comment" : commentCount === 1 ? "comment" : "comments"}
        </motion.span>

        {/* Ripple Effect on Hover */}
        {isHovered && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              hasComments ? 'bg-blue-500' : 'bg-gray-400'
            }`}
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}

        {/* Dots Animation (like typing indicator) */}
        {isHovered && hasComments && (
          <div className="flex gap-0.5 ml-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Speech Bubble Animation on Hover */}
      {isHovered && (
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {commentCount === 0 ? "Be the first to comment" : `View ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
        </motion.div>
      )}
    </Link>
  );
}