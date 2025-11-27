"use client";

import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">About Young Evangelist Ministry</h1>

        <p className="text-gray-700 mb-4">
          The Young Evangelist Ministry is dedicated to spreading the Present Truth of the 
          Gospel, embracing the principles of the Primitive Adventist Faith. Our mission is 
          to empower young people to grow spiritually, serve their communities, and proclaim 
          the everlasting gospel with clarity and courage.
        </p>

        <p className="text-gray-700 mb-4">
          We organize Bible studies, outreach programs, and evangelistic activities that 
          nurture faith, build character, and encourage the love of God in everyday life. 
          Our ministry values integrity, dedication, and the joy of sharing the message 
          of hope and salvation.
        </p>

        <p className="text-gray-700 mb-4">
          Join us in our mission to strengthen the faith of young believers, support one 
          another in spiritual growth, and shine the light of Christ in every community we touch.
        </p>

        <div className="mt-6 text-center">
          <a
            href="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
