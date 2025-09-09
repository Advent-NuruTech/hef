"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import axios from "axios";
import { FaTrash, FaPlus, FaEdit, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaUser, FaLink, FaEllipsisH } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

interface UserData {
  displayName: string;
  email: string;
  bio: string;
  photoURL: string;
  phone: string;
  location: string;
  links: { label: string; url: string }[];
  specialMessage: string;
  education: EducationItem[];
  profession: string;
  experience: string;
  skills: string[];
  joinedAt: string;
  role: string;
}

interface EducationItem {
  level: string;
  institution: string;
  period: string;
  description: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Basic Info
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // Contact & Extra
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [specialMessage, setSpecialMessage] = useState("");

  // Education
  const [education, setEducation] = useState<EducationItem[]>([
    { level: "Primary", institution: "", period: "", description: "" },
    { level: "Secondary", institution: "", period: "", description: "" },
    { level: "University", institution: "", period: "", description: "" }
  ]);

  // Professional Info
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // New link form
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Refs for auto-resizing textareas
  const bioRef = useRef<HTMLTextAreaElement>(null);

  // Fetch profile data
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", auth.currentUser!.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as UserData;
        setUser(data);
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setPhotoURL(data.photoURL || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setLinks(data.links || []);
        setSpecialMessage(data.specialMessage || "");
        setEducation(data.education || education);
        setProfession(data.profession || "");
        setExperience(data.experience || "");
        setSkills(data.skills || []);
      } else {
        await setDoc(ref, {
          displayName: auth.currentUser!.displayName || "",
          email: auth.currentUser!.email,
          bio: "",
          photoURL: "",
          phone: "",
          location: "",
          links: [],
          specialMessage: "",
          education: education,
          profession: "",
          experience: "",
          skills: [],
          joinedAt: new Date().toISOString(),
          role: "member",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = "auto";
      bioRef.current.style.height = bioRef.current.scrollHeight + "px";
    }
  }, [bio]);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setFileSelected(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        form
      );

      setPhotoURL(res.data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = () => {
    if (!newLabel || !newUrl) return;
    setLinks([...links, { label: newLabel, url: newUrl }]);
    setNewLabel("");
    setNewUrl("");
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEducation(updatedEducation);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid);
    await updateDoc(ref, {
      displayName,
      bio,
      photoURL,
      phone,
      location,
      links,
      specialMessage,
      education,
      profession,
      experience,
      skills,
    });

    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="animate-pulse text-xl text-gray-600">Loading profile...</div>
    </div>
  );

  const bioLines = bio.split('\n').length;
  const showReadMore = bioLines > 3;
  
  // Function to truncate special message at 20th word
  const truncateMessage = (message: string) => {
    const words = message.split(' ');
    if (words.length <= 20) return message;
    return words.slice(0, 20).join(' ') + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          // Edit Mode
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={toggleEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="relative">
                <img
                  src={photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label htmlFor="photo-upload" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md">
                  <FaEdit size={16} />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePhotoUpload(e.target.files[0]);
                      setFileSelected(true);
                    }
                  }}
                />
              </div>
              {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
              {!fileSelected && (
                <p className="text-sm text-gray-500">Click the edit icon to upload a photo</p>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Basic Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Software Engineer"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="">Select experience level</option>
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                  <textarea
                    ref={bioRef}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <MdPhone className="text-blue-500" /> Contact Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Message</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your special message..."
                    value={specialMessage}
                    onChange={(e) => setSpecialMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" /> Education Background
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-3">{edu.level}</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Institution</label>
                        <input
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          placeholder={`${edu.level} institution`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Period</label>
                        <input
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          value={edu.period}
                          onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                          placeholder="e.g. 2010-2014"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Description</label>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          value={edu.description}
                          onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                          placeholder="Description of your studies"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-blue-500" /> Skills
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Links Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FaLink className="text-blue-500" /> My Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  className="p-2 border border-gray-300 rounded"
                  placeholder="Label (e.g. Twitter)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <input
                  className="p-2 border border-gray-300 rounded"
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleAddLink}
                className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FaPlus /> Add Link
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link, i) => (
                  <div key={i} className="flex justify-between items-center border border-gray-200 p-3 rounded-lg bg-gray-50">
                    <a
                      href={link.url}
                      target="_blank"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {link.label}
                    </a>
                    <button
                      onClick={() => handleRemoveLink(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              Save Profile
            </button>
          </div>
        ) : (
          // View Mode (Beautiful Card Layout)
          <div className="space-y-8">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-white-50 to-white-0"></div>
              
              <div className="px-6 pb-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col items-center -mt-16">
                    <img
                      src={photoURL || "/default-avatar.png"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <h1 className="text-2xl font-bold mt-4 text-gray-800">{displayName}</h1>
                    <p className="text-gray-600">{profession} {experience && `• ${experience}`}</p>
                    
                    <div className="flex items-center mt-2 text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{location || "Location not specified"}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={toggleEdit}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">About Me</h2>
                  <div className="text-gray-600">
                    {showReadMore && !showFullBio ? (
                      <>
                        <p>{bio.split('\n').slice(0, 3).join('\n')}</p>
                        <button 
                          onClick={() => setShowFullBio(true)}
                          className="text-blue-600 hover:underline mt-2 flex items-center"
                        >
                          Read more <FaEllipsisH className="ml-1" />
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="whitespace-pre-line">{bio}</p>
                        {showReadMore && (
                          <button 
                            onClick={() => setShowFullBio(false)}
                            className="text-blue-600 hover:underline mt-1"
                          >
                            Read less
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {specialMessage && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-red-800 mb-2">HEF IMPACT TO ME AND MY SUCESS STORY</h3>
                    <p className="text-blue-700">
                      {showFullMessage ? specialMessage : truncateMessage(specialMessage)}
                      {specialMessage.split(' ').length > 20 && (
                        <button 
                          onClick={() => setShowFullMessage(!showFullMessage)}
                          className="text-blue-600 hover:underline ml-1"
                        >
                          {showFullMessage ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" /> Education
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800">{edu.level}</h3>
                    {edu.institution ? (
                      <>
                        <p className="text-gray-700 mt-2">{edu.institution}</p>
                        {edu.period && <p className="text-gray-500 text-sm mt-1">{edu.period}</p>}
                        {edu.description && <p className="text-gray-600 text-sm mt-2">{edu.description}</p>}
                      </>
                    ) : (
                      <p className="text-gray-400 italic mt-2">Not specified</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Card */}
            {skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-blue-500" /> Skills
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Links Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact & Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MdPhone className="text-blue-500" /> Contact Info
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MdEmail className="mr-2" />
                      <span>{user?.email || "Not available"}</span>
                    </div>
                    
                    {phone && (
                      <div className="flex items-center text-gray-600">
                        <MdPhone className="mr-2" />
                        <span>{phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {links.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FaLink className="text-blue-500" /> Links
                    </h3>
                    
                    <div className="space-y-2">
                      {links.map((link, i) => (
                        <div key={i} className="flex items-center">
                          <a
                            href={link.url}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            {link.label}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Card */}
            {location && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Location
                </h2>
                
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Google Map would be integrated here for: {location}
                  </p>
                  {/* In a real implementation, you would use the Google Maps JavaScript API */}
                </div>
              </div>
            )}
          </div>
        )}

        {saved && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Profile updated successfully! ✅
          </div>
        )}
      </div>
    </div>
  );
}