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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 dark:from-blue-900 dark:via-indigo-950 dark:to-gray-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                Young Evangelist
                <span className="block text-blue-200 mt-2">Ministry</span>
              </h1>
              
              <motion.p
                className="text-xl md:text-2xl font-light text-blue-100 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Making a People Ready for Christ
              </motion.p>

              {/* Rotating Quotes */}
              <div className="mt-10 h-16 md:h-14 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    className="text-base md:text-lg font-medium text-yellow-200 italic max-w-2xl mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                  >
                    {quotes[quoteIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href="/events">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all"
                  >
                    Explore Events
                  </motion.button>
                </Link>
                <Link href="/gallery">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 hover:bg-blue-500/30 transition-all"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="currentColor"
              className="text-gray-50 dark:text-gray-950"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* ================= FEATURED EVENTS ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Featured Upcoming Events" 
            subtitle="Join us in spreading the gospel through meaningful events"
            link="/events" 
          />
          <div className="mt-12">
            <FeaturedEvents />
          </div>
        </div>
      </section>

      {/* ================= FEATURED STUDIES ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-gray-900/50 dark:via-gray-900 dark:to-blue-950/30">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Featured Bible Studies" 
            subtitle="Deepen your understanding of God's word"
            link="/files" 
          />
          <div className="mt-12">
            <FeaturedStudies />
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Ministry Gallery" 
            subtitle="Witness the impact of our evangelistic mission"
            link="/gallery" 
          />
          <div className="mt-12">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && heroItems.length === 0 && <EmptyMessage />}
            {!loading && !error && heroItems.length > 0 && (
              <GalleryHeroSection heroItems={heroItems} />
            )}
          </div>
        </div>
      </section>

      {/* ================= EXPLORE MORE ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-gray-900 dark:to-indigo-950/30">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Explore More" 
            subtitle="Discover opportunities to grow and serve"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {[
              { 
                title: "Departments", 
                desc: "Find your ministry place and serve with purpose in various departments.", 
                link: "/departments",
                icon: "🏛️"
              },
              { 
                title: "Library", 
                desc: "Read Ellen G. White, pioneer writings, and spiritual resources.", 
                link: "/files",
                icon: "📚"
              },
              { 
                title: "Events", 
                desc: "Stay updated on upcoming missions, gatherings, and outreach programs.", 
                link: "/events",
                icon: "📅"
              },
            ].map((card) => (
              <ExploreCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= YOUTUBE VIDEOS ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Latest YouTube Videos" 
            subtitle="Watch our sermons, teachings, and ministry highlights"
            link="https://youtube.com/@youngevangelistsministry8232" 
          />
          <div className="mt-12">
            <YoutubeCarousel />
          </div>
        </div>
      </section>

      {/* ================= CONTACT CTA ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 dark:from-blue-900 dark:via-indigo-900 dark:to-gray-900 p-12 md:p-16 text-center shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="relative z-10">
              <motion.h2
                className="text-3xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Connect With Us
              </motion.h2>
              
              <motion.p
                className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Have questions, prayer requests, or want to collaborate? We&apos;d love to hear from you and walk this journey together.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all text-lg"
                  >
                    Get in Touch
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
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

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No videos uploaded yet.</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Check back soon for inspiring content!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-6 scrollbar-hide">
        <div className="flex gap-6 w-max">
          {videos.map((vid, index) => (
            <motion.div
              key={vid.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <div className="w-80 md:w-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white dark:bg-gray-800">
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/${vid.videoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="text-center mt-4 text-gray-500 dark:text-gray-400 text-sm">
        Scroll horizontally to view more videos
      </p>
    </div>
  );
}

/* ================== REUSABLE COMPONENTS ================== */
function SectionTitle({ title, subtitle, link }: { title: string; subtitle?: string; link?: string }) {
  const content = (
    <div className="text-center space-y-4">
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.div
        className="h-1 w-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 mx-auto rounded-full"
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "6rem", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </div>
  );

  return link ? <Link href={link} className="block hover:opacity-80 transition-opacity">{content}</Link> : content;
}

function ExploreCard({ title, desc, link, icon }: { title: string; desc: string; link: string; icon: string }) {
  return (
    <Link href={link}>
      <motion.div
        whileHover={{ y: -8 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
      >
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{desc}</p>
        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
          Learn more 
          <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </motion.div>
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <span className="mt-6 text-gray-600 dark:text-gray-400 text-lg">Loading gallery...</span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center shadow-lg"
    >
      <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
      <p className="text-red-700 dark:text-red-300 text-lg font-semibold mb-2">Oops! Something went wrong</p>
      <p className="text-red-600 dark:text-red-400 mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium shadow-md"
      >
        Try Again
      </button>
    </motion.div>
  );
}

function EmptyMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center shadow-lg"
    >
      <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📷</div>
      <p className="text-gray-700 dark:text-gray-300 text-xl font-semibold mb-2">No Gallery Items Yet</p>
      <p className="text-gray-600 dark:text-gray-400">
        Ministry highlights will appear here once they are added.
      </p>
    </motion.div>
  );
}

<style jsx global>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>