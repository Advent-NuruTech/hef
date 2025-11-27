export default function DepartmentsPage() {
  const departments = [
    {
      name: "Evangelism Department",
      description:
        "Responsible for organizing outreach missions, Bible study groups, and soul-winning activities.",
    },
    {
      name: "Media & Communications",
      description:
        "Handles video editing, social media updates, photography, and digital evangelism.",
    },
    {
      name: "Music & Worship Team",
      description:
        "Leads praise, worship, special music, and supports spiritual atmosphere during meetings.",
    },
    {
      name: "Prayer & Spiritual Nurture",
      description:
        "Coordinates prayer sessions, devotions, and supports the spiritual growth of members.",
    },
    {
      name: "Logistics & Planning",
      description:
        "Ensures proper organization of events, transportation, equipment, and venue preparation.",
    },
    {
      name: "Community Service",
      description:
        "Organizes charity work, visitations, and community impact programs.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Young Evangelist Ministry Departments
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                {dept.name}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
