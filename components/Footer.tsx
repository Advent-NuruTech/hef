"use client";
import Newsletter from "./Newsletter";
import { motion } from "framer-motion";
import { FaFacebook, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ];

  const resourceLinks = [
    { href: "/files", label: "Bible Studies" },
    { href: "/beliefs", label: "Fundamental Principles" },
    { href: "/vows", label: "Baptismal Vows" },
    { href: "/constitution", label: "Constitution" },
  ];

  const contactInfo = [
    { icon: FaEnvelope, label: "youngevengelistsministry@gmail.com"},
    { icon: FaPhone, label: "call us", href: "tel:+254759167209" },
    { icon: FaMapMarkerAlt, label: "Kenya" }, 
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 dark:from-gray-950 dark:via-gray-950 dark:to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Wave Divider Top */}
      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg viewBox="0 0 1440 80" className="w-full h-auto">
          <path
            fill="currentColor"
            className="text-gray-50 dark:text-gray-950"
            d="M0,32L80,37.3C160,43,320,53,480,48C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Ministry Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">
              Young Evangelists
              <span className="block text-blue-400 mt-1">Ministry</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Raising a generation to proclaim the everlasting gospel with power, truth, and service — preparing a people ready for the Lord&apos;s soon return.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com/groups/1706457559938208/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://youtube.com/@youngevangelistsministry8232?si=kKR1Xs3Cy4BWpVDK"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="inline-block mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="inline-block mr-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Get In Touch</h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 flex-shrink-0 mt-0.5">
                    <item.icon className="text-sm" />
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

       
  {/* Newsletter Section */}
      <Newsletter />
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-400 text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-2">
                © {currentYear} Young Evangelists Ministry. All Rights Reserved.
              </p>
            </div>
            
            <div className="text-gray-500 text-center md:text-right">
              <p className="flex items-center justify-center md:justify-end gap-2">
                Designed & powered by by{" "}
                <a
                  href="https://adventnurutech.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Advent NuruTech
                </a>
              </p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-gray-500">
            <Link href="" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="" className="hover:text-blue-400 transition-colors">
              Sitemap
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}