"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaEllipsisH,
  FaEdit,
  FaLink,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

type Education = {
  level?: string;
  institution?: string;
  period?: string;
  description?: string;
};

type UserLink = {
  label: string;
  url: string;
};

type UserProfile = {
  id: string;
  displayName: string;
  bio?: string;
  photoURL?: string;
  email?: string;
  phone?: string;
  location?: string;
  specialMessage?: string;
  profession?: string;
  experience?: string;
  skills?: string[];
  education?: Education[];
  links?: UserLink[];
  joinedAt?: string | number | Date | null;
};

type GalleryItem = {
  id: string;
  url: string;
  title?: string;
  description?: string;
  createdAt?: string | number | Date;
  userId?: string;
};

// Function to truncate text after a certain number of words
const truncateWords = (text: string, maxWords: number) => {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

export default function UserProfilePage() {
  const { id } = useParams(); // user id from URL
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      // get user profile
      const ref = doc(db, "users", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Omit<UserProfile, "id">;
        setProfile({
          id: snap.id,
          displayName: data.displayName || "User",
          bio: data.bio || "",
          photoURL: data.photoURL || "/default-avatar.png",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          specialMessage: data.specialMessage || "",
          profession: data.profession || "",
          experience: data.experience || "",
          skills: data.skills || [],
          education: data.education || [],
          links: data.links || [],
          joinedAt: data.joinedAt || null,
        });
      }

      // get this user's gallery items
      const q = query(
        collection(db, "hefGallery"),
        where("userId", "==", id),
        orderBy("createdAt", "desc")
      );
      const snaps = await getDocs(q);
      setItems(
        snaps.docs.map(
          (d) =>
            ({
              id: d.id,
              ...(d.data() as Omit<GalleryItem, "id">),
            } as GalleryItem)
        )
      );

      setLoading(false);
    };

    loadProfile();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">
          Loading profile...
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-white-50">
        <p className="text-center text-xl text-gray-700">User not found ❌</p>
      </div>
    );

  const isOwner = auth.currentUser?.uid === profile.id;
  const wordCount = profile.bio ? profile.bio.split(/\s+/).length : 0;
  const showReadMore = wordCount > 50;
  const truncatedBio = profile.bio ? truncateWords(profile.bio, 50) : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-white500 to-white-600"></div>

          <div className="px-6 pb-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-center -mt-16">
                <Image
                  src={profile.photoURL || "/default-avatar.png"}
                  alt={profile.displayName}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <h1 className="text-2xl font-bold mt-4 text-gray-800">
                  {profile.displayName}
                </h1>
                <p className="text-gray-600">
                  {profile.profession}{" "}
                  {profile.experience && `• ${profile.experience}`}
                </p>

                {profile.location && (
                  <div className="flex items-center mt-2 text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {isOwner && (
                <Link
                  href="/profile"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </Link>
              )}
            </div>

            {profile.bio && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  About Me
                </h2>
                <div className="text-gray-600">
                  {showReadMore && !showFullBio ? (
                    <>
                      <p className="whitespace-pre-line">{truncatedBio}</p>
                      <button
                        onClick={() => setShowFullBio(true)}
                        className="text-blue-600 hover:underline mt-2 flex items-center"
                      >
                        Read more <FaEllipsisH className="ml-1" />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="whitespace-pre-line">{profile.bio}</p>
                      {showReadMore && (
                        <button
                          onClick={() => setShowFullBio(false)}
                          className="text-blue-600 hover:underline mt-2"
                        >
                          Read less
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {profile.specialMessage && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Special Message
                </h3>
                <p className="text-blue-700">{profile.specialMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Education Card */}
        {profile.education &&
          profile.education.some((edu) => edu.institution) && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" /> Education
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.education.map(
                  (edu, index) =>
                    edu.institution && (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800">
                          {edu.level}
                        </h3>
                        <p className="text-gray-700 mt-2">{edu.institution}</p>
                        {edu.period && (
                          <p className="text-gray-500 text-sm mt-1">
                            {edu.period}
                          </p>
                        )}
                        {edu.description && (
                          <p className="text-gray-600 text-sm mt-2">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          )}

        {/* Skills Card */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaBriefcase className="text-blue-500" /> Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Links Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contact & Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MdEmail className="text-blue-500" /> Contact Info
              </h3>

              <div className="space-y-2">
                {profile.email && (
                  <div className="flex items-center text-gray-600">
                    <MdEmail className="mr-2" />
                    <span>{profile.email}</span>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-center text-gray-600">
                    <MdPhone className="mr-2" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {profile.links && profile.links.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FaLink className="text-blue-500" /> Links
                </h3>

                <div className="space-y-2">
                  {profile.links.map((link, i) => (
                    <div key={i} className="flex items-center">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Card */}
        {profile.location && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" /> Location
            </h2>

            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Google Map would be integrated here for: {profile.location}
              </p>
              {/* In a real implementation, you would use the Google Maps JavaScript API */}
            </div>
          </div>
        )}

        {/* User's Gallery */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {isOwner ? "Your Uploads" : `${profile.displayName}'s Uploads`}
          </h2>

          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No uploads yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <Link key={it.id} href={`/image/${it.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <Image
                      src={it.url}
                      alt={it.title || "image"}
                      width={400}
                      height={300}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {it.title || "Untitled"}
                      </h3>
                      {it.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {it.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Join Date */}
        {profile.joinedAt && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Member since:{" "}
            {new Date(profile.joinedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
