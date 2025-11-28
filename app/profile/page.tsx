"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import axios from "axios";
import {
  FaTrash,
  FaPlus,
  FaEdit,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaUser,
  FaLink,
  FaEllipsisH,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

type TimestampLike = {
  seconds: number;
  nanoseconds: number;
};

interface EducationItem {
  level: string;
  institution: string;
  period: string;
  description: string;
}

interface LinkItem {
  label: string;
  url: string;
}

interface VideoLink {
  label: string;
  url: string;
}

interface UserData {
  displayName: string;
  email: string;
  bio: string;
  photoURL: string;
  phone: string;
  location: string;
  links: LinkItem[];
  specialMessage: string;
  education: EducationItem[];
  profession: string;
  experience: string;
  skills: string[];
  joinedAt: string;
  role: string;
  // NEW FIELDS
  localChurch?: string;
  baptismDate?: string;
  ministryRole?: string;
  favoriteVerse?: string;
  favoriteEGWQuote?: string;
  department?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [showFullBio, setShowFullBio] = useState<boolean>(false);
  const [showFullMessage, setShowFullMessage] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Basic Info
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");

  // Contact & Extra
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [specialMessage, setSpecialMessage] = useState<string>("");

  // Education
  const [education, setEducation] = useState<EducationItem[]>([
    { level: "Primary", institution: "", period: "", description: "" },
    { level: "Secondary", institution: "", period: "", description: "" },
    { level: "University", institution: "", period: "", description: "" },
  ]);

  // Professional Info
  const [profession, setProfession] = useState<string>("");
  const [experience, setExperience] = useState<string>("");

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");

  // New link form
  const [newLabel, setNewLabel] = useState<string>("");
  const [newUrl, setNewUrl] = useState<string>("");

  // NEW FIELDS
  const [localChurch, setLocalChurch] = useState<string>("");
  const [baptismDate, setBaptismDate] = useState<string>("");
  const [ministryRole, setMinistryRole] = useState<string>("");
  const [favoriteVerse, setFavoriteVerse] = useState<string>("");
  const [favoriteEGWQuote, setFavoriteEGWQuote] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  // Refs for auto-resizing textareas
  const bioRef = useRef<HTMLTextAreaElement | null>(null);

  // Fetch profile data
  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchProfile = async () => {
      try {
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
          setLocalChurch(data.localChurch || "");
          setBaptismDate(data.baptismDate || "");
          setMinistryRole(data.ministryRole || "");
          setFavoriteVerse(data.favoriteVerse || "");
          setFavoriteEGWQuote(data.favoriteEGWQuote || "");
          setDepartment(data.department || "");
        } else {
          await setDoc(ref, {
            displayName: auth.currentUser!.displayName || "",
            email: auth.currentUser!.email || "",
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
            localChurch: "",
            baptismDate: "",
            ministryRole: "",
            favoriteVerse: "",
            favoriteEGWQuote: "",
            department: "",
          } as UserData);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = "auto";
      bioRef.current.style.height = `${bioRef.current.scrollHeight}px`;
    }
  }, [bio]);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setFileSelected(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        form
      );

      setPhotoURL(res.data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = () => {
    if (!newLabel.trim() || !newUrl.trim()) return;
    setLinks([...links, { label: newLabel.trim(), url: newUrl.trim() }]);
    setNewLabel("");
    setNewUrl("");
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setEducation(updatedEducation);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid);
    try {
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
        localChurch,
        baptismDate,
        ministryRole,
        favoriteVerse,
        favoriteEGWQuote,
        department,
      });
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save profile failed:", err);
      alert("Failed to save profile");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">Loading profile...</div>
      </div>
    );

  const bioLines = bio.split("\n").length;
  const showReadMore = bioLines > 3;

  const truncateMessage = (message: string) => {
    const words = message.split(" ");
    if (words.length <= 20) return message;
    return words.slice(0, 20).join(" ") + "...";
  };

  // THEME COLORS: Blue + Gold accents
  const accentBg = "bg-gradient-to-r from-blue-700 to-indigo-600";
  const accentText = "text-yellow-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          // Edit Mode (Layout B: stacked sections full width)
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Edit Profile
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={toggleEdit}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="relative">
                <img
                  src={photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-1 right-1 bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md"
                  title="Upload photo"
                >
                  <FaEdit size={14} />
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
              {uploading && <p className="text-sm text-blue-700">Uploading...</p>}
              {!fileSelected && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click the edit icon to upload a photo
                </p>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Your full name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Local Church
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., Maasai Mara University SDA Church"
                  value={localChurch}
                  onChange={(e) => setLocalChurch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department (YEM)
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Select department</option>
                    <option value="Preaching">Preaching</option>
                    <option value="Health Evangelism">Health Evangelism</option>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Mission & Outreach">Mission & Outreach</option>
                    <option value="Media/Tech">Media/Tech</option>
                    <option value="Youth Ministry">Youth Ministry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ministry Role
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                    placeholder="e.g., Song Leader, Elder"
                    value={ministryRole}
                    onChange={(e) => setMinistryRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Baptism Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                    value={baptismDate}
                    onChange={(e) => setBaptismDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Favorite Bible Verse
                  </label>
                  <input
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                    placeholder="e.g., John 3:16"
                    value={favoriteVerse}
                    onChange={(e) => setFavoriteVerse(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Favorite EGW Quote
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                  placeholder="A cherished quote from Ellen G. White"
                  value={favoriteEGWQuote}
                  onChange={(e) => setFavoriteEGWQuote(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job / Department (simple)
                </label>
                <input
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., Media Coordinator"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level
                </label>
                <select
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  My Simple Testimony
                </label>
                <textarea
                  ref={bioRef}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 resize-none"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-600" /> Education Background
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {education.map((edu, index) => (
                  <div key={edu.level} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                      {edu.level}
                    </h4>

                    <div className="space-y-2">
                      <input
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        placeholder={`${edu.level} institution`}
                      />
                      <input
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                        value={edu.period}
                        onChange={(e) => handleEducationChange(index, "period", e.target.value)}
                        placeholder="e.g. 2010-2014"
                      />
                      <textarea
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                        placeholder="Description of your studies"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FaBriefcase className="text-blue-600" /> Skills
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-yellow-700 dark:text-yellow-300"
                      aria-label={`Remove ${skill}`}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded"
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FaLink className="text-blue-600" /> Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded"
                  placeholder="Label (e.g., Facebook)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <input
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded"
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddLink}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FaPlus /> Add Link
              </button>

              <div className="space-y-2">
                {links.map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600">
                      {link.label}
                    </a>
                    <button onClick={() => handleRemoveLink(i)} className="text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // View Mode (Layout B: stacked full width)
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-6">
              <div className="flex flex-col items-center">
                <img
                  src={photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white shadow-md"
                />
                <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-900 dark:text-gray-100">
                  {displayName || "Young Evangelist"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {profession || department || "Member"}
                  {experience && ` • ${experience}`}
                </p>

                <div className="mt-3 text-gray-600 dark:text-gray-300 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{location || "Location not specified"}</span>
                  </div>
                  {localChurch && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Church:</span> {localChurch}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={toggleEdit}
                    className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  My Simple Testimony
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  {showReadMore && !showFullBio ? (
                    <>
                      <p className="whitespace-pre-line">{bio.split("\n").slice(0, 3).join("\n")}</p>
                      <button
                        onClick={() => setShowFullBio(true)}
                        className="text-blue-600 hover:underline mt-2"
                      >
                        Read more <FaEllipsisH className="ml-1 inline" />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="whitespace-pre-line">{bio}</p>
                      {showReadMore && (
                        <button
                          onClick={() => setShowFullBio(false)}
                          className="text-blue-600 hover:underline mt-2"
                        >
                          Read less
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {specialMessage && (
                <div className="mt-6 p-4 rounded-lg border border-yellow-100 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-700 mb-2">Gospel Impact & Testimony</h3>
                  <p className="text-yellow-800">
                    {showFullMessage ? specialMessage : truncateMessage(specialMessage)}
                    {specialMessage.split(" ").length > 20 && (
                      <button
                        onClick={() => setShowFullMessage(!showFullMessage)}
                        className="text-blue-600 hover:underline ml-2"
                      >
                        {showFullMessage ? "Read less" : "Read more"}
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                <FaGraduationCap className="inline mr-2 text-blue-600" /> Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {education.map((edu) => (
                  <div key={edu.level} className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100">{edu.level}</h4>
                    {edu.institution ? (
                      <>
                        <p className="text-gray-700 dark:text-gray-200 mt-2">{edu.institution}</p>
                        {edu.period && <p className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</p>}
                        {edu.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{edu.description}</p>}
                      </>
                    ) : (
                      <p className="text-gray-400 italic mt-2">Not specified</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  <FaBriefcase className="inline mr-2 text-blue-600" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact & Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact & Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                    <MdEmail /> <span>{user?.email || "Not available"}</span>
                  </div>
                  {phone && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MdPhone /> <span>{phone}</span>
                    </div>
                  )}
                  {ministryRole && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Role:</strong> {ministryRole}
                    </p>
                  )}
                  {baptismDate && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <strong>Baptism:</strong> {baptismDate}
                    </p>
                  )}
                </div>

                <div>
                  {links.length > 0 ? (
                    <div className="space-y-2">
                      {links.map((lnk, idx) => (
                        <a key={idx} href={lnk.url} target="_blank" rel="noreferrer" className="text-blue-600 block">
                          {lnk.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No links added.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Favorites</h3>
              <div className="space-y-2">
                {favoriteVerse && <p><strong>Verse:</strong> <span className="text-blue-700 dark:text-blue-300">{favoriteVerse}</span></p>}
                {favoriteEGWQuote && <p><strong>EGW Quote:</strong> <span className="text-yellow-800 dark:text-yellow-200">{favoriteEGWQuote}</span></p>}
              </div>
            </div>

            {/* Location */}
            {location && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  <FaMapMarkerAlt className="inline mr-2 text-blue-600" /> Location
                </h3>
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500">
                  Google Map placeholder for: {location}
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
