"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

// Define Member interface
interface Member {
  id: string;
  displayName?: string;
  photoURL?: string;
  profession?: string;
  bio?: string;
}

// KEF branded quotes with proper typographic quotes
const quotes = [
  '“KEF empowers every member to grow and connect.”',
  '“Your journey at KEF is your path to excellence.”',
  '“Collaboration is the KEF way to success.”',
  '“Share knowledge, inspire others, and thrive at KEF.”',
  '“KEF transforms ideas into action for the community.”',
  '“Every member at KEF is unique, valued, and supported.”'
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Protect page: redirect if not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/auth");
    }
  }, [router]);

  // Fetch members from Firestore
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Quote rotation effect
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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Connect & Grow with KEF
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Explore our community and discover your next collaboration.
        </p>
      </div>

      {/* Featured Quote */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <blockquote className="text-1xl md:text-2xl italic mb-6">
                {quotes[currentQuoteIndex]}
              </blockquote>
              <cite className="text-lg block">KEF Community</cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Statistics */}
        <div className="flex justify-center space-x-6 mb-6 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{members.length}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {members.filter((m) => m.profession).length}
            </div>
            <div className="text-sm text-gray-600">Professionals</div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Members Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <Image
                    src={member.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/users/${member.id}`}
                      className="font-semibold text-lg hover:text-blue-600 transition-colors truncate block"
                    >
                      {member.displayName}
                    </Link>
                    <p className="text-sm text-gray-600 truncate">
                      {member.profession || "Community Member"}
                    </p>
                    {member.bio && (
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{member.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/users/${member.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Profile
                  </Link>

                  {member.id !== auth.currentUser?.uid && (
                    <button
                      onClick={() => router.push(`/messages/${member.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No members found matching your search.</p>
        </div>
      )}
    </div>
  );
}
