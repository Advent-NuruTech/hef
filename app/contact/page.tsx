"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const whatsappNumber = "254105178685";

  const sendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // PHONE VALIDATION — at least 10 digits
    const numbersOnly = phone.replace(/\D/g, "");
    if (numbersOnly.length < 10) {
      setError("⚠ Phone number must be at least 10 digits.");
      return;
    }

    const text = `Hey, I'm from the YEM WEBSITE.

New Contact Request:
Name: ${name}
Phone: ${phone}
Message: ${message}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black px-6 py-12 transition">
      <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-neutral-900 p-8 rounded-2xl shadow-lg 
      border border-gray-300 dark:border-neutral-700 transition">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Contact Us
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-8">
          Fill in the form below and your message will be sent directly to WhatsApp.
        </p>

        {/* FORM */}
        <form onSubmit={sendToWhatsApp} className="space-y-5">

          {/* INLINE ERROR */}
          {error && (
            <p className="text-red-600 text-sm font-medium bg-red-100 dark:bg-red-900 
            dark:text-red-300 p-2 rounded-lg">
              {error}
            </p>
          )}

          {/* NAME */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-neutral-800 
              border border-gray-300 dark:border-neutral-600
              text-gray-900 dark:text-gray-100
              outline-none focus:outline-none focus:ring-0 focus:border-neutral-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Your Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-neutral-800 
              border border-gray-300 dark:border-neutral-600
              text-gray-900 dark:text-gray-100
              outline-none focus:outline-none focus:ring-0 focus:border-neutral-500"
              placeholder="e.g. 07XXXXXXXX"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Special Message</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-neutral-800 
              border border-gray-300 dark:border-neutral-600
              text-gray-900 dark:text-gray-100
              outline-none focus:outline-none focus:ring-0 focus:border-neutral-500"
              placeholder="Type your message..."
            ></textarea>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-xl 
            transition outline-none focus:outline-none active:outline-none"
          >
            Send Message on WhatsApp
          </button>
        </form>
      </div>
    </main>
  );
}
