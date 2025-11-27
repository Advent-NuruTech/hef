"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FaUsers, FaEnvelope, FaBars, FaTimes, FaUpload, FaLink, FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false); // dropdown for avatar
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar state
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState<{ displayName: string; photoURL: string }>({
    displayName: "Anonymous",
    photoURL: "/default-avatar.jpg",
  });

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setOpen(false);
    setSidebarOpen(false);
    setTimeout(() => {
      setLoading(false);
      router.push("/auth");
    }, 1500);
  };

  // Auto-dismiss loading spinner when page loads or after timeout
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); // Auto-dismiss after 3 seconds max

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Dismiss loading when route changes (page loads)
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Fetch user profile
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

  // Unread messages
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

  // Improved navigation handler
  const handleNavigation = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setLoading(true);
  };

  // Navigation items with icons
  const navItems = [
    { href: "/upload", label: "Upload", icon: FaUpload, color: "text-gray-700" },
    { href: "/links", label: "Links", icon: FaLink, color: "text-gray-700" },
    { href: "/contribution", label: "Contribution", icon: FaHandHoldingHeart, color: "text-green-600" },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Title */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group flex-shrink-0"
              onClick={handleNavigation}
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/heflogoo.jpg"
                  alt="Site Logo"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-gray-900 font-bold text-xl tracking-tight">YOUNG EVANGELIST</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {!user ? (
                <Link
                  href="/auth"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                  onClick={handleNavigation}
                >
                  Login
                </Link>
              ) : (
                <div ref={dropdownRef} className="flex items-center gap-6">
                  {/* Navigation Links */}
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium ${item.color} hover:scale-105`}
                      onClick={handleNavigation}
                    >
                      <item.icon className="text-lg" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {/* Members Link */}
                  <Link 
                    href="/members" 
                    className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                    onClick={handleNavigation}
                  >
                    <FaUsers className="text-xl text-gray-600 hover:text-blue-600 transition-colors" />
                  </Link>

                  {/* Messages Link with Badge */}
                  <Link 
                    href="/messages" 
                    className="relative p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                    onClick={handleNavigation}
                  >
                    <FaEnvelope className="text-xl text-gray-600 hover:text-blue-600 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Avatar */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="relative w-10 h-10">
                        <Image
                          src={userProfile.photoURL}
                          alt={userProfile.displayName}
                          fill
                          className="rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors"
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {open && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900 truncate">{userProfile.displayName}</p>
                          <p className="text-sm text-gray-500">Welcome back!</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          onClick={() => {
                            setOpen(false);
                            handleNavigation();
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          <FaUser className="text-gray-400" />
                          <span>My Profile</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-red-600 font-medium"
                        >
                          <FaTimes className="text-red-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              {user && (
                <>
                

                  {/* User Avatar - Mobile */}
                  <div className="relative w-8 h-8">
                    <Image
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      fill
                      className="rounded-full object-cover border border-gray-300"
                    />
                  </div>
                </>
              )}

              {/* Sidebar Toggle Button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <FaBars className="text-xl text-gray-700" />
              </button>
            </div>
          </div>
        </div>
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
    </>
  );
}