"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "firebase/auth";
import { 
  FaHome,
  FaBookOpen, 
  FaWater, 
  FaUpload, 
  FaLink, 
  FaDonate, 
  FaUsers, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaTimes, 
  FaUser, 
  FaSignInAlt 
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userProfile: {
    displayName: string;
    photoURL: string;
  };
  unreadCount: number;
  onNavigate: () => void;
  onLogout: () => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  user, 
  userProfile, 
  unreadCount, 
  onNavigate, 
  onLogout 
}: SidebarProps) {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Navigation items
  const navItems = [
   { href: "/", label: "Home", icon: FaHome, color: "text-green-600" }, // ← Home link added
  { href: "/beliefs", label: "Fundamental Principles", icon: FaBookOpen, color: "text-green-600" },
  { href: "/vows", label: "Baptismal Vows 1874", icon: FaWater, color: "text-green-600" },
  { href: "/upload", label: "Post", icon: FaUpload, color: "text-gray-700" },
  { href: "/links", label: "Links", icon: FaLink, color: "text-gray-700" },
  { href: "/contribution", label: "Contribution", icon: FaDonate, color: "text-green-600" },
  { href: "/members", label: "Members", icon: FaUsers, color: "text-gray-700" },
  { href: "/events", label: "Events", icon: FaCalendarAlt, color: "text-gray-700" },
  { href: "/messages", label: "Messages", icon: FaEnvelope, color: "text-gray-700", badge: unreadCount },
  { href: "/constitution", label: "Our Constitution", icon: FaBookOpen, color: "text-green-600" }
];

  const handleLinkClick = () => {
    onNavigate();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white/95 backdrop-blur-md shadow-xl z-50
        transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Content */}
        <div className="h-full overflow-y-auto">
          {user ? (
            <>
              {/* User Profile Section */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-14 h-14">
                    <Image
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      fill
                      className="rounded-full object-cover border-2 border-blue-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {userProfile.displayName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Welcome back!</p>
                  </div>
                </Link>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors ${item.color}`}>
                      <item.icon className="text-lg" />
                    </div>
                    <span className="font-medium text-gray-700 flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all duration-200"
                >
                  <FaTimes className="text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            /* Login Section */
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Welcome to YEM Gallery
                </h3>
                <p className="text-gray-500 mb-6">
                  Sign in to access all features
                </p>
                <Link
                  href="/auth"
                  onClick={handleLinkClick}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md font-medium"
                >
                  <FaSignInAlt />
                  <span>Login / Sign Up</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
