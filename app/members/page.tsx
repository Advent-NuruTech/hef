"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Define User interface
interface Member {
  id: string;
  displayName?: string;
  photoURL?: string;
  profession?: string;
  bio?: string;
}

const quotes = [
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
  "If life were predictable it would cease to be life, and be without flavor. - Eleanor Roosevelt",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "Spread love everywhere you go. - Mother Teresa",
  "When you reach the end of your rope, tie a knot in it and hang on. - Franklin D. Roosevelt",
  "Always remember that you are absolutely unique. Just like everyone else. - Margaret Mead",
  "Don't judge each day by the harvest you reap but by the seeds that you plant. - Robert Louis Stevenson",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Whoever is happy will make others happy too. - Anne Frank"
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [currentQuote, setCurrentQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/auth"); 
      return;
    }

    // Rotating quotes
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);

    const quoteInterval = setInterval(() => {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(newQuote);
    }, 10000);

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

    return () => clearInterval(quoteInterval);
  }, [router]);

  const filtered = members.filter((m) =>
    m.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Connect & Grow Together
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Discover how our community has transformed lives and find your next connection
        </p>
        
        {/* Rotating Quote */}
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
          <p className="text-blue-800 italic text-center">{`"{currentQuote}"`}</p>
        </div>
        
        {/* Statistics */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{members.length}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {members.filter(m => m.profession).length}
            </div>
            <div className="text-sm text-gray-600">Professionals</div>
          </div>
        </div>
      </div>

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
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {member.bio}
                      </p>
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
