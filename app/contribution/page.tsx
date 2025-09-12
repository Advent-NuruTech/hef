"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Heart, Users, Target, TrendingUp, Sparkles, Play, Calendar, MapPin, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const featuredProjects = [
  {
    title: "Community Water Project",
    description: "Clean water provided to 500+ families in rural Kisumu.",
    image: "https://source.unsplash.com/800x400/?water,community",
    amount: "KES 2.5M",
    progress: 85,
    donors: 234
  },
  {
    title: "Youth Innovation Hub",
    description: "KEF alumni funded a tech hub empowering 200+ students.",
    image: "https://source.unsplash.com/800x400/?technology,students",
    amount: "KES 1.8M",
    progress: 60,
    donors: 156
  },
  {
    title: "Green Farming Project",
    description: "Sustainable farming project creating 50+ jobs.",
    image: "https://source.unsplash.com/800x400/?farming,green",
    amount: "KES 3.2M",
    progress: 90,
    donors: 312
  },
];

const familiesHelped = [
  { name: "Okoth Family", impact: "Medical bills fully covered", image: "https://source.unsplash.com/100x100/?portrait,family", date: "2024-01-15" },
  { name: "Achieng Family", impact: "New house built after floods", image: "https://source.unsplash.com/100x100/?portrait,mother", date: "2024-02-20" },
  { name: "Odhiambo Family", impact: "Supported with school fees", image: "https://source.unsplash.com/100x100/?portrait,father", date: "2024-03-10" },
];

const studentsHelped = [
  { name: "Mary Atieno", course: "Medicine at UoN", image: "https://source.unsplash.com/100x100/?student,medical", year: "3rd Year" },
  { name: "James Otieno", course: "Engineering at JKUAT", image: "https://source.unsplash.com/100x100/?student,engineering", year: "2nd Year" },
  { name: "Sarah Njeri", course: "Education at KU", image: "https://source.unsplash.com/100x100/?student,education", year: "4th Year" },
];

export default function KEFGalleryImpactPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [animatedNumbers, setAnimatedNumbers] = useState({
    families: 0,
    students: 0,
    projects: 0,
    donations: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedNumbers({
        families: 127,
        students: 89,
        projects: 23,
        donations: 2450000
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full mb-6">
          <Sparkles className="w-5 h-5 mr-2" />
          <span>Making a Difference Together</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
          KEF Impact Gallery
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Together, KEF alumni are creating difference : jobs, sponsoring the vulnerable, and shaping society.{" "}
          <span className="font-semibold text-blue-600">Small contributions, big change.</span>
        </p>
      </motion.div>

      {/* Impact Statistics */}
      <motion.section 
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {[
          { icon: Heart, label: "Families Helped", value: animatedNumbers.families, color: "text-red-500" },
          { icon: GraduationCap, label: "Students Sponsored", value: animatedNumbers.students, color: "text-blue-500" },
          { icon: Target, label: "Projects Completed", value: animatedNumbers.projects, color: "text-green-500" },
          { icon: DollarSign, label: "Total Donations", value: `KES ${animatedNumbers.donations.toLocaleString()}`, color: "text-purple-500" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all"
            whileHover={{ y: -5 }}
          >
            <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
            <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* Navigation Tabs */}
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-white rounded-2xl shadow-md p-2 flex">
          {["projects", "families", "students", "contribute"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto">
        {/* Featured Projects */}
        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.section
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  whileHover={{ y: -8 }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.amount}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{project.progress}% funded</span>
                        <span>{project.donors} donors</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Support Project
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {/* Families Helped */}
          {activeTab === "families" && (
            <motion.section
              key="families"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {familiesHelped.map((family, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={family.image}
                      alt={family.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{family.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {family.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                    {family.impact}
                  </p>
                </motion.div>
              ))}
            </motion.section>
          )}

          {/* Students Helped */}
          {activeTab === "students" && (
            <motion.section
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {studentsHelped.map((student, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
                  />
                  <h3 className="font-bold text-gray-800 mb-2">{student.name}</h3>
                  <p className="text-gray-600 mb-2">{student.course}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {student.year}
                  </span>
                </motion.div>
              ))}
            </motion.section>
          )}

          {/* Contribution System */}
          {activeTab === "contribute" && (
            <motion.section
              key="contribute"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white">
                <TrendingUp className="w-16 h-16 mx-auto mb-6" />
               <h2 className="text-3xl font-bold mb-6">
                     <Link href="/members" className="text-white-700 hover:underline">
    Join the Movement
  </Link>
</h2>
                
                <div className="text-lg mb-6 bg-white/10 p-6 rounded-2xl">
                  <p className="mb-4">
                    Imagine if every KEF alumni contributed just{" "}
                    <span className="font-bold text-yellow-300">20 KES/month</span>
                  </p>
                  <p>
                    With 1,000,000 members, 
                    <span className="font-bold text-green-300">240,000,000 KES yearly</span> —
                    enough to transform communities!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { amount: "5 KES", label: "Daily Coffee" },
                    { amount: "10 KES", label: "Weekly Lunch" },
                    { amount: "20 KES", label: "Monthly Impact" },
                  ].map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-blue-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
                    >
                      {option.amount}
                      <div className="text-sm text-gray-600">{option.label}</div>
                    </motion.button>
                  ))}
                </div>

               <Link href="/payment">
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition"
  >
    Start Contributing Today
  </motion.button>
</Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Floating CTA */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          Make a Difference
        </button>
      </motion.div>
    </div>
  );
}