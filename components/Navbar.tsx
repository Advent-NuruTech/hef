"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  FaUsers,
  FaEnvelope,
  FaBars,
  FaUpload,
  FaLink,
  FaDonate,
  FaUser,
  FaHome,
  FaBookOpen,
  FaWater,
  FaPrayingHands,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaRegUser,
} from "react-icons/fa";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false); // Avatar dropdown
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState<{ displayName: string; photoURL: string }>({
    displayName: "Anonymous",
    photoURL: "",
  });

  // Logout handler
  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setOpen(false);
    setSidebarOpen(false);
    router.push("/auth");
  };

  // Fetch user profile
  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          displayName: data.displayName || "Anonymous",
          photoURL: data.photoURL || "",
        });
      }
    };
    fetchUser();
  }, [user]);

  // Track unread messages
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", user.uid),
      where("read", "==", false)
    );
    const unsub = onSnapshot(q, (snap) => setUnreadCount(snap.size));
    return () => unsub();
  }, [user]);

  // Handle navigation: show loading bar
  const handleNavigation = () => {
    setLoading(true);
  };

  // Stop loading after route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  // Navigation Items
  const privateNavItems = [
    { href: "/upload", label: "Post", icon: FaUpload },
    { href: "/links", label: "Links", icon: FaLink },
    { href: "/members", label: "Members", icon: FaUsers },
    { href: "/events", label: "Events", icon: FaCalendarAlt },
  ];

  const publicNavItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/about", label: "About Us", icon: FaUsers },
    { href: "/prayer", label: "Prayer", icon: FaPrayingHands },
    { href: "/beliefs", label: "Principles", icon: FaBookOpen },
    { href: "/vows", label: "Vows", icon: FaWater },
    { href: "/contribution", label: "Give", icon: FaDonate },
    { href: "/constitution", label: "Constitution", icon: FaBookOpen },
  ];

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Title */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0" onClick={handleNavigation}>
              <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="/assets/heflogoo.jpg"
                  alt="Site Logo"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-gray-900 font-bold text-lg sm:text-xl tracking-tight hidden sm:block">
                YOUNG EVANGELIST
              </span>
              <span className="text-gray-900 font-bold text-base tracking-tight sm:hidden">
                YOUNG EVANGELIST
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {!user ? (
                <>
                  {publicNavItems.slice(0, 4).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavigation}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isActive(item.href)
                          ? "bg-green-100 text-green-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                      }`}
                    >
                      <item.icon className="text-base" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Link
                    href="/auth"
                    onClick={handleNavigation}
                    className="ml-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm"
                  >
                    Login / Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {publicNavItems.slice(0, 3).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavigation}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isActive(item.href)
                          ? "bg-green-100 text-green-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                      }`}
                    >
                      <item.icon className="text-base" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {privateNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavigation}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                        isActive(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <item.icon className="text-base" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {/* Messages */}
                  <Link
                    href="/messages"
                    onClick={handleNavigation}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      isActive("/messages")
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <FaEnvelope className="text-base" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold min-w-[18px] h-[18px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Avatar Dropdown */}
                  <div className="relative ml-2" ref={dropdownRef}>
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 p-1 pl-3 pr-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                    >
                      <div className="relative w-8 h-8 flex-shrink-0">
                        {userProfile.photoURL ? (
                          <Image
                            src={userProfile.photoURL}
                            alt={userProfile.displayName}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <FaRegUser />
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <FaChevronDown
                        className={`text-xs text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
                          <p className="font-semibold text-gray-900 truncate">{userProfile.displayName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Welcome back!</p>
                        </div>

                        <div className="py-2">
                          {publicNavItems.slice(3).map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm"
                            >
                              <item.icon className="text-gray-600" />
                              <span>{item.label}</span>
                            </Link>
                          ))}

                          <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm"
                          >
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                              <FaUser className="text-gray-600" />
                            </div>
                            <span>My Profile</span>
                          </Link>

                          <Link
                            href="/contribution"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm"
                          >
                            <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg">
                              <FaDonate className="text-green-600" />
                            </div>
                            <span>Contribution</span>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 font-medium text-sm"
                          >
                            <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                              <FaSignOutAlt className="text-red-600" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-3">
              {user && (
                <>
                  <Link
                    href="/messages"
                    onClick={handleNavigation}
                    className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaEnvelope className="text-lg text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold min-w-[16px] h-[16px] rounded-full flex items-center justify-center text-[10px] animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative w-9 h-9 flex-shrink-0">
                    {userProfile.photoURL ? (
                      <Image
                        src={userProfile.photoURL}
                        alt={userProfile.displayName}
                        fill
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-gray-200">
                        <FaRegUser />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </>
              )}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="Open menu"
              >
                <FaBars className="text-xl text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 animate-pulse">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div>
        )}
      </nav>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        userProfile={userProfile}
        unreadCount={unreadCount}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
}
