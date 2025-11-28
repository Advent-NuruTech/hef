"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DepartmentsPage() {
  // -----------------------------
  // Cleaned department data
  // -----------------------------
  const departments = [
    {
      name: "Music Department",
      description: `
Singing is an act of worship that brings the soul into harmony with God (Col 3:16).
We aim for solemn, inspiring, elevating songs that draw the mind to heavenly themes.

**Key Points:**
• No percussion instruments or drum-based beats  
• No worldly music styles  
• Songs must uplift the spiritual nature  
• Stringed instruments allowed because they blend with the human voice  
`
    },
    {
      name: "Public Evangelism Department",
      description: `
This department leads Bible studies, sermons, and outreach programs preparing souls for Christ’s soon return.

**Key Responsibilities:**
• Health messages  
• Family life teachings  
• Bible doctrines  
• Prophetic messages  
Based on the Elijah message—restoring the hearts of the people to God.
`
    },
    {
      name: "Health Ministry & Medical Missionary Department",
      description: `
We believe the laws of health are as binding as the Ten Commandments. Therefore, we live to glorify God physically, mentally, and spiritually.

**This department focuses on:**
1. Teaching correct health principles  
2. Conducting medical missionary training  
3. Treating disease using natural, rational methods  
“Present your bodies a living sacrifice...” (Romans 12:1)
`
    },
    {
      name: "Church Ministry Department",
      description: `
According to Ephesians 4:11–16, every believer is called to minister.

**Department roles:**
• Organize missions  
• Involve every member in ministry  
• Strengthen churches spiritually  
So the church may go forth “fair as the moon, clear as the sun...” (Song of Solomon 6:10)
`
    },
    {
      name: "Literature Evangelism Department",
      description: `
Literature evangelism has always been central to gospel work.

**Duties:**
1. Promote true literature evangelism  
2. Distribute pure present-truth publications  
3. Reject worldly, corrupted books  
“We have a definite mission...” (Jeremiah 6:16)
`
    },
    {
      name: "Publishing Department",
      description: `
This department handles production of all printed and digital gospel materials.

**Areas of focus:**
• Books & tracts  
• Digital publications  
• Electronic media content  
“Knowledge shall be increased.”
`
    },
    {
      name: "Education Department",
      description: `
True education develops the physical, mental, and spiritual powers (ED 13.1).

**Guiding Principles:**
1. True science leads to the knowledge of God  
2. Avoid Babylonian systems of education  
3. Prepare members for end-time service  

**Objectives include:**
• Spiritual growth  
• Vocational training  
• Missionary preparation  
• Character development  
`
    },
    {
      name: "Strategic Planning & Development Department",
      description: `
This department oversees ministry projects such as health centers, education centers, restaurants, and other gospel “centers of influence.”

**Focus areas:**
• Organizing income-generating projects  
• Supporting ministry development  
• Strengthening long-term sustainability  
`
    }
  ];

  // State for "Read more"
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (i: number) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  // Sidebar toggle (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen py-12 px-4 bg-white dark:bg-black transition">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
          Young Evangelist Ministry Departments
        </h1>

        {/* Mobile Toggle Button */}
        <div className="flex justify-center mb-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
          >
            View Table of Contents
          </button>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 float-left mr-6">
          <aside className="bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-xl p-4 sticky top-6">
            <h3 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
              Table of Contents
            </h3>
            <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
              {departments.map((d, i) => (
                <li key={i}>
                  <a href={`#dept-${i}`} className="hover:text-indigo-500">
                    {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Mobile Sidebar (Slide-in) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-neutral-900 shadow-xl p-6 z-50 md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="mb-4 text-red-500 font-semibold"
              >
                Close ✕
              </button>

              <h3 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                Table of Contents
              </h3>

              <ul className="space-y-2 text-gray-800 dark:text-gray-300">
                {departments.map((d, i) => (
                  <li key={i}>
                    <a
                      onClick={() => setSidebarOpen(false)}
                      href={`#dept-${i}`}
                      className="hover:text-indigo-500"
                    >
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
{/* INTRODUCTION */}
<section className="mb-10 clear-both">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
    Introduction
  </h2>

  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
    The work of God advances best where there is <strong>gospel order</strong>. 
    Just as the early church organized workers according to their gifts, we also 
    establish departments so that every member may labor intelligently, harmoniously, 
    and effectively in the finishing of the gospel work.

    <br /><br />

    <strong>Why Departments Are Needed:</strong>
    <br />
    1. To ensure coordinated, orderly, and balanced ministry in all lines of evangelism.  
    <br />
    2. To develop and mentor members in their spiritual gifts for active service.  
    <br />
    3. To strengthen the spiritual, physical, and intellectual wellbeing of the church.  
    <br /><br />

    In harmony with Heaven’s plan for organized labor, each department carries a 
    distinct burden that contributes to the united mission of preparing a people 
    to stand true to God in the final crisis.
  </p>
</section>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 clear-both">
          {departments.map((dept, index) => {
            const words = dept.description.trim().split(/\s+/);
            const shortText = words.slice(0, 50).join(" ");
            const isLong = words.length > 50;

            return (
              <div
                id={`dept-${index}`}
                key={index}
                className="bg-gray-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 shadow-sm rounded-2xl p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
                  {dept.name}
                </h2>

                <div className="text-gray-800 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                  {!expanded[index] ? shortText : dept.description}

                  {isLong && (
                    <button
                      onClick={() => toggleExpand(index)}
                      className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      {expanded[index] ? "Read Less ↑" : "... Read More ↓"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
