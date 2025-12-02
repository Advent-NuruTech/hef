"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

type LinkItem = {
  name: string;
  href: string;
};

export default function ManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 List of management links (flexible for future updates)
  const [links, setLinks] = useState<LinkItem[]>([
    { name: "Subscribed newsletter", href: "/subscribe" },
    { name: "library", href: "/uploadfile" },
    { name: "Upload Youtube video", href: "/upload-video" },
    { name: "Manage Events", href: "/events/manage" },
    { name: "Prayer Requests", href: "/prayer/received-prayer" },
        { name: "Reviews", href: "/review/received" },


  ]);

  // 🔹 Restrict page to logged-in users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login"); // redirect to login if not logged in
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Checking authentication...</p>;

  if (!user) return null; // User will be redirected

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
        Management Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="p-4 bg-green-600 text-white rounded-xl text-center hover:bg-green-700 transition"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
