"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUsers, FaEnvelope } from "react-icons/fa";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);

  const [userProfile, setUserProfile] = useState<{ displayName: string; photoURL: string }>({
    displayName: "Anonymous",
    photoURL: "/default-avatar.jpg",
  });

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/auth");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          displayName: data.displayName || "Anonymous",
          photoURL: data.photoURL || "/default-avatar.jpg",
        });
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", user.uid),
      where("read", "==", false)
    );
    const unsub = onSnapshot(q, (snap) => {
      setUnreadCount(snap.size);
    });
    return () => unsub();
  }, [user]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo + KEF GALLERY */}
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-blue-600">
          <Image
            src="/assets/heflogoo.jpg"
            alt="Site Logo"
            width={120}
            height={120}
            className="w-14 h-14 object-contain"
          />
          <span className="text-gray-800 font-bold text-lg">KEF GALLERY</span>
        </Link>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          {!user && (
            <Link
              href="/auth"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}

          {user && (
            <div ref={dropdownRef} className="relative flex items-center gap-4">
              <Link href="/upload" className="text-sm font-medium hover:text-blue-600">
                Upload
              </Link>

              <Link href="/links" className="text-sm font-medium hover:text-blue-600">
                Links
              </Link>

              {/* 💰 Contribution Link */}
              <Link href="/contribution" className="text-sm font-medium hover:text-green-600">
                Contribution
              </Link>

              {/* 👥 Members Icon */}
              <Link href="/members" className="relative">
                <FaUsers className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
              </Link>

              {/* ✉️ Messages Icon */}
              <Link href="/messages" className="relative">
                <FaEnvelope className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Avatar with real user data */}
              <button onClick={() => setOpen((p) => !p)}>
                <Image
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-12 w-40 bg-white border rounded shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
