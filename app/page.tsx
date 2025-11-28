"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import FeaturedStudies from "@/components/FeaturedStudies";
import FeaturedEvents from "@/app/events/components/FeaturedEvents";
import GalleryHeroSection from "@/components/GalleryHeroSection";

interface Item {
  id: string;
  url: string;
  description?: string;
  title?: string;
  likes?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
  userName?: string;
  userPhotoURL?: string;
}

interface FirebaseItemData {
  url: string;
  description?: string;
  title?: string;
  likes?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
}

interface UserData {
  displayName?: string;
  photoURL?: string;
}

export default function Page() {
  const [heroItems, setHeroItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "“Arise, shine; for thy light is come.” – Isaiah 60:1",
    "“Carry the message of salvation to the ends of the earth.” – Ellen G. White",
    "“The harvest truly is great, but the labourers are few.” – Luke 10:2",
    "“Every true disciple is born into the kingdom of God as a missionary.” – DA 195.2",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "hefGallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          const itemsWithUser = await Promise.all(
            snap.docs.slice(0, 3).map(async (d) => {
              const data = d.data() as FirebaseItemData;
              let userName = "Anonymous Evangelist";
              let userPhotoURL = "/default-avatar.png";

              if (data.userId) {
                const userDoc = await getDoc(doc(db, "users", data.userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as UserData;
                  userName = userData.displayName || "Anonymous Evangelist";
                  userPhotoURL = userData.photoURL || "/default-avatar.png";
                }
              }

              return {
                id: d.id,
                ...data,
                url: data.url || "/placeholder-image.jpg",
                userName,
                userPhotoURL,
              } as Item;
            })
          );
          setHeroItems(itemsWithUser);
          setLoading(false);
        } catch (err) {
          setError("Failed to load gallery data");
          setLoading(false);
        }
      },
      (err) => {
        setError("Failed to connect to gallery");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* ================= HERO SECTION ================= */}
      <section className="relative text-center py-16 px-6 md:px-12 bg-gradient-to-r from-blue-800 via-sky-600 to-blue-900 text-white rounded-b-3xl shadow-lg">
        <motion.h2
          className="mt-3 text-lg md:text-xl font-light text-blue-100 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          MAKING A PEOPLE READY FOR CHRIST
        </motion.h2>

        {/* Rotating quotes */}
        <div className="mt-7 h-15 md:h-12 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              className="text-base md:text-lg font-medium text-yellow-100 italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              {quotes[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* ================= FEATURED EVENTS ================= */}
      <section className="py-16 px-6 md:px-12 text-center">
        <SectionTitle title="Featured Upcoming Events" link="/events" />
        <FeaturedEvents />
      </section>

      {/* ================= FEATURED STUDIES ================= */}
      <section className="py-16 px-6 md:px-12 text-center">
        <SectionTitle title="Featured Bible Studies" link="/files" />
        <FeaturedStudies />
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-blue-50 dark:from-gray-800 to-white dark:to-gray-900 rounded-xl">
        <SectionTitle title="Featured Gallery" link="/gallery" />
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading gallery...</span>
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && heroItems.length === 0 && <EmptyMessage />}
        {!loading && !error && heroItems.length > 0 && <GalleryHeroSection heroItems={heroItems} />}
      </section>

      {/* ================= MORE PREVIEW ================= */}
      <section className="py-16 px-6 md:px-12 text-center">
        <SectionTitle title="Explore More" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[
            { title: "Departments", desc: "Find your ministry place and serve.", link: "/departments" },
            { title: "Library", desc: "Read Ellen G. White & pioneer writings.", link: "/files" },
            { title: "Events", desc: "Stay updated on upcoming missions.", link: "/events" },
          ].map((card) => (
            <UniformCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* ================= YOUTUBE VIDEOS ================= */}
      <section className="py-16 px-6 md:px-12">
        <SectionTitle title="Latest YouTube Videos" link="https://youtube.com/@youngevangelistsministry8232" />
        <YoutubeCarousel />
      </section>

      {/* ================= CONTACT ================= */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-sky-50 dark:from-gray-800 to-blue-100 dark:to-gray-700 text-center rounded-t-3xl">
        <SectionTitle title="Connect With Us" />
        <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-300 mb-6">
          Have questions, prayer requests, or want to collaborate? We’d love to hear from you.
        </p>
        <Link href="/contact">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-blue-700 dark:bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </motion.button>
        </Link>
      </section>
    </div>
  );
}

/* ================== YOUTUBE CAROUSEL COMPONENT ================== */
function YoutubeCarousel() {
  const [videos, setVideos] = useState<{ id: string; videoId: string }[]>([]);

  useEffect(() => {
    const q = query(collection(db, "youtubeVideos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const vids = snap.docs.map((doc) => ({
        id: doc.id,
        videoId: doc.data().videoId,
      }));
      setVideos(vids);
    });
    return () => unsub();
  }, []);

  if (videos.length === 0)
    return <p className="text-center text-gray-500 dark:text-gray-400">No videos uploaded yet.</p>;

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex space-x-4 w-max min-w-full">
        {videos.map((vid) => (
          <iframe
            key={vid.id}
            className="w-72 md:w-96 aspect-video rounded-xl shadow-lg flex-shrink-0"
            src={`https://www.youtube.com/embed/${vid.videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ))}
      </div>
      <p className="text-center mt-2 text-gray-500 dark:text-gray-400 text-sm">
        Scroll horizontally to view more videos
      </p>
    </div>
  );
}

/* ================== REUSABLE COMPONENTS ================== */
function SectionTitle({ title, link }: { title: string; link?: string }) {
  const content = (
    <motion.h2
      className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-500 to-blue-600 animate-gradient-x hover:scale-105 transition-transform cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {title}
    </motion.h2>
  );
  return (
    <div className="text-center mb-10">
      {link ? <Link href={link}>{content}</Link> : content}
      <motion.div
        className="mt-3 h-[3px] w-24 bg-gradient-to-r from-blue-700 via-sky-500 to-blue-600 mx-auto rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "6rem", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  );
}

function UniformCard({ title, desc, link }: { title: string; desc: string; link: string }) {
  return (
    <Link href={link}>
      <motion.div
        whileHover={{ y: -5 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all border border-blue-100 dark:border-gray-700"
      >
        <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{desc}</p>
        <span className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Learn more →</span>
      </motion.div>
    </Link>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 text-center">
      <p className="text-red-600 dark:text-red-400">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyMessage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
      <p className="text-gray-600 dark:text-gray-300 mb-4">No gallery items found.</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ministry highlights will appear here once they are added.
      </p>
    </div>
  );
}
