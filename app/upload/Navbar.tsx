"use client";

import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/auth";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="py-6 px-4 border-b bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link href="/">HEF Gallery</Link>
        </h1>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-sm">Gallery</Link>
          <Link href="/upload" className="text-sm">Upload</Link>
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={logout} className="text-sm font-bold">Logout</button>
            </>
          ) : (
            <Link href="/auth" className="text-sm">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}