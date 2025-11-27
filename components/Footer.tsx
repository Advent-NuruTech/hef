"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-sky-700 to-blue-950 text-white py-16 px-6 md:px-12 mt-10 rounded-t-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Ministry Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-green-300 tracking-wide">
            Young Evangelists Ministry
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            “Raising a generation to proclaim the everlasting gospel with power,
            truth, and service — preparing a people ready for the Lord’s soon
            return.”
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-green-300">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-green-400 transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/files" className="hover:text-green-400 transition-colors duration-300">
                Bible Studies
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-green-400 transition-colors duration-300">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-400 transition-colors duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-green-300">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-6">
            <a
              href="https://facebook.com/young-evangelists-ministry"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-3xl hover:text-blue-400 transition-transform transform hover:scale-110"
            >
              <FaFacebook />
            </a>
            <a
              href="https://youtube.com/@YoungEvangelistsMinistry"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-3xl hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <FaYoutube />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        © {new Date().getFullYear()} Young Evangelists Ministry — All Rights Reserved. <br />
        <span className="text-gray-500 text-xs">
          Designed & powered by{" "}
          <a
            href="https://adventnurutech.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition"
          >
            Advent NuruTech
          </a>
        </span>
      </motion.div>
    </footer>
  );
}
