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
  FaPrayingHands,
  FaSignInAlt,
  FaSignOutAlt,
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
    { href: "/prayer", label: "Prayer Requests", icon: FaPrayingHands },
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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-gray-500 text-xl" />
        </button>

        <div className="flex flex-col h-full">
          {/* ===========================================
                LOGGED-IN VIEW
          ============================================ */}
          {user ? (
            <>
              {/* Profile Section */}
              <div className="flex-shrink-0 p-6 pb-4 bg-gradient-to-br from-blue-50 via-white to-green-50 border-b border-gray-200">
                <Link
                  href="/profile"
                  onClick={handleLink}
                  className="flex items-center gap-3 group"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      fill
                      className="rounded-full object-cover border-2 border-blue-400 shadow-md group-hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-base">
                      {userProfile.displayName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">View Profile</p>
                  </div>
                </Link>
              </div>

              {/* Scrollable Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {/* Public Items */}
                <div className="mb-4">
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    General
                  </p>
                  {publicItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLink}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                        ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex items-center justify-center w-9 h-9 rounded-lg transition-colors
                          ${
                            isActive(item.href)
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }
                        `}
                      >
                        <item.icon className="text-base" />
                      </div>
                      <span className="font-medium text-sm flex-1">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Private Items */}
                <div>
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Member Area
                  </p>
                  {privateItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLink}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                        ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex items-center justify-center w-9 h-9 rounded-lg transition-colors
                          ${
                            isActive(item.href)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }
                        `}
                      >
                        <item.icon className="text-base" />
                      </div>
                      <span className="font-medium text-sm flex-1">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Logout Button - Fixed at Bottom */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 active:bg-red-100 transition-all shadow-sm border border-red-200"
                >
                  <FaSignOutAlt className="text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ===========================================
                    LOGGED-OUT VIEW
              ============================================ */}

              {/* Welcome Section */}
              <div className="flex-shrink-0 p-6 bg-gradient-to-br from-blue-50 via-white to-green-50 border-b border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <FaUser className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Young Evangelist Ministry
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Sign in to access all features
                  </p>
                </div>
              </div>

              {/* Scrollable Public Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {publicItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLink}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                      ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex items-center justify-center w-9 h-9 rounded-lg transition-colors
                        ${
                          isActive(item.href)
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        }
                      `}
                    >
                      <item.icon className="text-base" />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Login Button - Fixed at Bottom */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
                <Link
                  href="/auth"
                  onClick={handleLink}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all shadow-md font-medium text-sm"
                >
                  <FaSignInAlt />
                  <span>Login / Sign Up</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}