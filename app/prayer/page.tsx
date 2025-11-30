"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function PrayerPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    request: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inspirationalQuotes = [
    "“The Lord is near to all who call upon Him.” – Psalm 145:18",
    "“Cast your burden upon the Lord, and He shall sustain you.” – Psalm 55:22",
    "“With God all things are possible.” – Matthew 19:26",
    "“God is our refuge and strength, a very present help in trouble.” – Psalm 46:1",
  ];

  const quote =
    inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "prayerRequests"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", request: "" });
    } catch (error) {
      console.error("Failed to submit prayer request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">

      {/* TITLE + DESCRIPTION (HIDDEN AFTER SUCCESS) */}
      {!success && (
        <>
          <h1 className="text-3xl font-bold text-center mb-5 dark:text-white">
           🕊️ Prayer Request Box
          </h1>

          {/* DESCRIPTION CARD */}
         <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border dark:border-gray-700 mb-6">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
    Why We Pray Together
  </h2>

  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
    Feel free to share your prayer requests with us. We believe in the power of united prayer.
  </p>

  {/* Bible Verse Card */}
  <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-600 dark:border-blue-400 rounded">
    <p className="italic text-blue-800 dark:text-blue-300 font-medium">
      “The effectual fervent prayer of a righteous man availeth much.”  
      <span className="block mt-1 text-sm text-blue-600 dark:text-blue-400 font-semibold">
        — James 5:16
      </span>
    </p>
  </div>

  <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
    You are welcome to share your burdens, hopes, thanksgivings, and any requests
    on your heart. As Young Evangelists, we stand together in faith—lifting one another
    before God and trusting that He hears every prayer and answers according to His
    perfect will.
  </p>

  <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
    Once your request is submitted, our team will reach out to you with encouragement,
    prayer support, and guidance as God leads.
  </p>
</div>

        </>
      )}

      {!success ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-900 p-5 rounded-lg shadow border dark:border-gray-700"
        >
          {/* NAME */}
          <div>
            <label className="block font-medium dark:text-gray-200">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block font-medium dark:text-gray-200">
              Phone Number *
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium dark:text-gray-200">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* REQUEST */}
          <div>
            <label className="block font-medium dark:text-gray-200">
              Your Prayer Request *
            </label>
            <textarea
              name="request"
              required
              value={formData.request}
              onChange={handleChange}
              className="w-full p-2 border rounded h-32 bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {loading ? "Submitting..." : "Submit Prayer Request"}
          </button>
        </form>
      ) : (
        <div className="bg-green-100 dark:bg-gray-900 p-6 rounded-lg shadow text-center border dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400">
            Thank You for Submitting Your Prayer Request 🙏
          </h2>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            We will join you in prayer. May the Lord strengthen and uplift you.
          </p>

          {/* QUOTE CARD */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow font-medium text-blue-700 dark:text-blue-300">
            {quote}
          </div>

          <button
            onClick={() => setSuccess(false)}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
}
