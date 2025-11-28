"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Member {
  id: string;
  displayName?: string;
  photoURL?: string;
  profession?: string;
  bio?: string;
}

const quotes = [
  '“Young Evangelists Ministry empowers every member to proclaim the Present Truth.”',
  '“Your journey with Young Evangelists Ministry is a path of faith, truth, and service.”',
  '“Collaboration and ministry work are at the heart of the Present Truth Ministry.”',
  '“Share the everlasting gospel, inspire others, and grow in the Primitive Adventist faith.”',
  '“Present Truth Ministry transforms lives through dedication and service to the Lord.”',
  '“Every member is valued and called to participate in the mission of Young Evangelists Ministry.”'
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Protect page
  useEffect(() => {
    if (!auth.currentUser) router.push("/auth");
  }, [router]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "users"));
        const snap = await getDocs(q);
        const users: Member[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Member, "id">),
        }));
        setMembers(users);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Quote rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = members.filter((m) =>
    m.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Quote Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg mb-6">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <blockquote className="text-lg md:text-2xl italic mb-4 md:mb-6 text-gray-800 dark:text-gray-100">
                {quotes[currentQuoteIndex]}
              </blockquote>
              <cite className="text-sm md:text-lg text-gray-600 dark:text-gray-300 block">
                YOUNG EVANGELISTS MINISTRY — PRESENT TRUTH MINISTRY
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Members Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No members found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-4 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <Image
                      src={member.photoURL || "/default-avatar.png"}
                      alt={member.displayName || "Profile"}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/users/${member.id}`}
                        className="font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                      >
                        {member.displayName}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {member.profession || "Ministry Member"}
                      </p>
                      {member.bio && (
                        <p className="text-sm text-gray-700 dark:text-gray-200 mt-1 line-clamp-2">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/users/${member.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Profile
                  </Link>
                  {member.id !== auth.currentUser?.uid && (
                    <button
                      onClick={() => router.push(`/messages/${member.id}`)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
                    >
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
