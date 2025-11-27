"use client";

import { motion } from "framer-motion";
import {
  FaGlobe,
  FaXTwitter,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaPhone,
  FaGooglePlay,
 
} from "react-icons/fa6";

const links = [
  {
    name: "Official Website",
    url: "",
    icon: <FaGlobe className="text-blue-600" />,
  },
  {
    name: "Twitter (X)",
    url: "",
    icon: <FaXTwitter className="text-black" />,
  },
  {
    name: "Facebook",
    url: "",
    icon: <FaFacebook className="text-blue-700" />,
  },
  {
    name: "LinkedIn",
    url: "",
    icon: <FaLinkedin className="text-blue-800" />,
  },
  {
    name: "YouTube",
    url: "",
    icon: <FaYoutube className="text-red-600" />,
  },
  

];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col items-center py-16 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10 text-gray-800"
      >
        Young Evangelists Official Links
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {links.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center p-5 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="text-3xl mr-4">{link.icon}</div>
            <div className="text-lg font-semibold text-gray-700">{link.name}</div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12 bg-white shadow rounded-2xl p-6 text-center max-w-lg w-full"
      >
        <FaPhone className="text-green-600 text-3xl mx-auto mb-2" />
        <p className="text-xl font-bold text-gray-800">YEM Official Contact</p>
       
      </motion.div>
    </div>
  );
}
