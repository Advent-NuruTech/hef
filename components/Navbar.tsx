"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { FaUsers, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false); // dropdown for avatar
  const [mobileMenu, setMobileMenu] = useState(false); // mobile nav toggle
  const [loading, setLoading] = useState(false); // spinner state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
    setMobileMenu(false);
    setTimeout(() => {
      router.push("/auth");
    }, 1500);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close avatar dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.mobile-menu-button')) {
        setMobileMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setOpen(false);
    setMobileMenu(false);
  }, [pathname]);

  // Close mobile menu when tapping/clicking anywhere (for mobile)
  useEffect(() => {
    const handleDocumentClick = () => {
      if (mobileMenu) {
        setMobileMenu(false);
      }
    };
    
    if (mobileMenu) {
      document.addEventListener('click', handleDocumentClick);
      return () => document.removeEventListener('click', handleDocumentClick);
    }
  }, [mobileMenu]);

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

  // Dismiss spinner on click anywhere
  useEffect(() => {
    if (!loading) return;
    const dismiss = () => setLoading(false);
    document.addEventListener("click", dismiss);
    return () => document.removeEventListener("click", dismiss);
  }, [loading]);

  // Nav links (desktop & mobile reuse)
  const navLinks = (
    <>
      <Link 
        href="/upload" 
        className="text-sm font-medium hover:text-blue-600"
        onClick={() => setLoading(true)}
      >
        Upload
      </Link>
      <Link 
        href="/links" 
        className="text-sm font-medium hover:text-blue-600"
        onClick={() => setLoading(true)}
      >
        Links
      </Link>
      <Link 
        href="/contribution" 
        className="text-sm font-medium hover:text-green-600"
        onClick={() => setLoading(true)}
      >
        Contribution
      </Link>
      <Link 
        href="/members" 
        className="relative"
        onClick={() => setLoading(true)}
      >
        <FaUsers className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
      </Link>
      <Link 
        href="/messages" 
        className="relative"
        onClick={() => setLoading(true)}
      >
        <FaEnvelope className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-blue-600 flex-shrink-0">
          <Image
            src="/assets/heflogoo.jpg"
            alt="Site Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-black -800 font-bold text-lg">KEF GALLERY</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <Link
              href="/auth"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setLoading(true)}
            >
              Login
            </Link>
          )}

          {user && (
            <div ref={dropdownRef} className="relative flex items-center gap-4">
              {navLinks}

              {/* Avatar */}
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
                <div className="absolute right-0 mt-12 w-40 bg-white border rounded shadow-lg z-50">
                  <Link
                    href="/profile"
                    onClick={() => {
                      setOpen(false);
                      setLoading(true);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <Link 
              href="/messages" 
              className="relative"
              onClick={() => setLoading(true)}
            >
              <FaEnvelope className="text-xl text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <button 
            className="mobile-menu-button p-2 rounded-md text-gray-700"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenu && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t shadow-md px-4 py-3">
          <div className="flex flex-col gap-4">
            {!user && (
              <Link
                href="/auth"
                onClick={() => {
                  setMobileMenu(false);
                  setLoading(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
              >
                Login
              </Link>
            )}

            {user && (
              <>
                <div className="flex items-center gap-3 pb-3 border-b">
                  <Image
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-medium">{userProfile.displayName}</p>
                    <p className="text-sm text-gray-600">Welcome back!</p>
                  </div>
                </div>
                
                <Link 
                  href="/upload" 
                  className="py-2 px-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setMobileMenu(false);
                    setLoading(true);
                  }}
                >
                  Upload
                </Link>
                
                <Link 
                  href="/links" 
                  className="py-2 px-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setMobileMenu(false);
                    setLoading(true);
                  }}
                >
                  Links
                </Link>
                
                <Link 
                  href="/contribution" 
                  className="py-2 px-2 hover:bg-gray-100 rounded text-green-600"
                  onClick={() => {
                    setMobileMenu(false);
                    setLoading(true);
                  }}
                >
                  Contribution
                </Link>
                
                <Link 
                  href="/members" 
                  className="py-2 px-2 hover:bg-gray-100 rounded flex items-center gap-2"
                  onClick={() => {
                    setMobileMenu(false);
                    setLoading(true);
                  }}
                >
                  <FaUsers className="text-gray-600" /> Members
                </Link>
                
                <Link 
                  href="/profile" 
                  className="py-2 px-2 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setMobileMenu(false);
                    setLoading(true);
                  }}
                >
                  My Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="py-2 px-2 text-left text-red-600 hover:bg-gray-100 rounded mt-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}