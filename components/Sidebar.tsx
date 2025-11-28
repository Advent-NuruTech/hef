"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  FaSignInAlt,
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
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;

  /** PRIVATE LINKS */
  const privateItems = [
    { href: "/upload", label: "Post", icon: FaUpload },
    { href: "/links", label: "Links", icon: FaLink },
    { href: "/members", label: "Members", icon: FaUsers },
    { href: "/events", label: "Events", icon: FaCalendarAlt },
    { href: "/messages", label: "Messages", icon: FaEnvelope, badge: unreadCount },
  ];

  /** PUBLIC LINKS */
  const publicItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/about", label: "About Us", icon: FaUsers },
    { href: "/beliefs", label: "Fundamental Principles", icon: FaBookOpen },
    { href: "/vows", label: "Baptismal Vows 1874", icon: FaWater },
    { href: "/contribution", label: "Contribution", icon: FaDonate },
    { href: "/constitution", label: "Our Constitution", icon: FaBookOpen },
  ];

  const handleLink = () => {
    onNavigate();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white/95 backdrop-blur-md shadow-xl z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full overflow-y-auto">

          {/* ===========================================
                LOGGED-IN VIEW
          ============================================ */}
          {user ? (
            <>
              {/* PROFILE */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <Link
                  href="/profile"
                  onClick={handleLink}
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

              {/* NAV ITEMS */}
              <nav className="p-4 space-y-1">
                {publicItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLink}
                    className={`
                      flex items-center gap-4 p-3 rounded-xl transition-all
                      ${isActive(item.href) ? "bg-green-100 shadow-sm scale-[1.02]" : "hover:bg-gray-50"}
                    `}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gray-100 ${isActive(item.href) && "bg-green-200"}`}
                    >
                      <item.icon className="text-lg text-green-700" />
                    </div>
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </Link>
                ))}

                {privateItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLink}
                    className={`
                      flex items-center gap-4 p-3 rounded-xl transition-all
                      ${isActive(item.href) ? "bg-blue-100 shadow-sm scale-[1.02]" : "hover:bg-gray-50"}
                    `}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gray-100 ${isActive(item.href) && "bg-blue-200"}`}
                    >
                      <item.icon className="text-lg text-gray-700" />
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

              {/* LOGOUT BUTTON */}
              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all"
                >
                  <FaTimes className="text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ===========================================
                    LOGGED-OUT VIEW
              ============================================ */}

              <div className="p-5 border-b border-gray-100">
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaUser className="text-xl text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Welcome to Young Evangelist Ministry
                  </h3>

                  <p className="text-gray-500 text-sm mb-3">
                    Sign in to access all features
                  </p>
                </div>
              </div>

              {/* PUBLIC NAV */}
              <nav className="px-4 py-4 space-y-1">
                {publicItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLink}
                    className={`
                      flex items-center gap-4 p-3 rounded-xl transition-all
                      ${isActive(item.href) ? "bg-green-100 shadow-sm scale-[1.02]" : "hover:bg-gray-50"}
                    `}
                  >
                    <div className="p-2 rounded-lg bg-gray-100">
                      <item.icon className="text-lg text-green-700" />
                    </div>

                    <span className="font-medium text-gray-700">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* LOGIN BUTTON */}
              <div className="px-4 pb-6">
                <Link
                  href="/auth"
                  onClick={handleLink}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:scale-[1.02] transition-all shadow-md font-medium"
                >
                  <FaSignInAlt />
                  <span>Login / Sign Up</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
