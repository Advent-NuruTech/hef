"use client";

import { useState } from "react";

export default function AboutPage() {
  const [showMoreIntro, setShowMoreIntro] = useState(false);
  const [showMoreMission, setShowMoreMission] = useState(false);
  const [showMoreMembership, setShowMoreMembership] = useState(false);
  const [showMoreDiscipline, setShowMoreDiscipline] = useState(false);
  const [showMoreOrg, setShowMoreOrg] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>

      {/* Introduction */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
        <p>
          The Young Evangelist Ministry (YEM) is a devoted group of Old Seventh-day Adventist youth committed to proclaiming the gospel of Christ in its purity. We believe in the principles of true education, upholding the Three Angels’ Messages, and promoting all reforms in harmony with God’s Word. Our members are inspired to lead lives dedicated to spiritual growth, service, and obedience to the one true God.
        </p>
        {showMoreIntro && (
          <div className="mt-2 space-y-2">
            <p>
              Rooted in the faith of the pioneers, prophets, and apostles, YEM seeks to prepare the world for the soon return of Christ. Our mission is to turn hearts back to the simplicity of the gospel, embracing the commandments of God and the faith of Jesus, and reflecting Christ’s character through personal consecration and holy living.
            </p>
            <p>
              We are committed to practical ministry in all aspects of life—education, health, music, work, and lifestyle—encouraging members to grow spiritually, serve communities, and live in harmony with God’s plan for His church.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowMoreIntro(!showMoreIntro)}
          className="text-blue-600 hover:underline mt-1"
        >
          {showMoreIntro ? "Read Less" : "Read More"}
        </button>
      </section>

      {/* Challenges */}
<section>
  <h2 className="text-2xl font-semibold mb-2">Rising to the Challenge</h2>
  <p>
    In struggling to restore old waste places, we came across THE CROSS—yes, True Education—and its effect has not ceased (1MCP 58.2). Now, as never before, we need to understand the true science of education. If we fail to understand this, we shall never have a place in the kingdom of God. “This is life eternal, that they might know Thee, the only true God, and Jesus Christ, whom Thou hast sent” (John 17:3). If this is the price of heaven, shall not our education be conducted along these lines? (1MCP 53.2)
  </p> 
  <p>
    In our efforts to put this into practice, we have faced reproach, ridicule, and scorn—more from within than without. Education and redemption are one; this we firmly believe. God, who is faithful, will eventually open avenues—if not in this world, then in the world to come. Yet we will not cease to proclaim it, even amid persecution and reproach. False systems of worship and deception are the fruits of false education systems, and we commit to uproot Babylon from its roots (PH081 38.1). Join us to make this a success.
  </p>
</section>


      {/* Mission & Vision */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Mission & Vision</h2>
        <p>
          We aim to empower youth to actively participate in evangelism, revival, and reformation, guiding others toward obedience to God’s commandments and the message of salvation. Our work centers on living and sharing the truths of Scripture, especially as revealed in the Three Angels’ Messages.
        </p>
        {showMoreMission && (
          <div className="mt-2 space-y-2">
            <p><strong>Mission:</strong> To inspire and equip young believers to lead in spreading the gospel with conviction, rooted in biblical truths and prophetic guidance.</p>
            <p><strong>Vision:</strong> A global movement of youth evangelists committed to revival and reformation, shining as lights in the darkness and upholding the everlasting gospel.</p>
          </div>
        )}
        <button
          onClick={() => setShowMoreMission(!showMoreMission)}
          className="text-blue-600 hover:underline mt-1"
        >
          {showMoreMission ? "Read Less" : "Read More"}
        </button>
      </section>

      {/* Membership */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Membership & Commitment</h2>
        <p>
          Membership in YEM is open to youth who accept the principles of the Old SDA Church and are willing to actively participate in evangelistic work, spiritual growth, and reform advocacy. We acknowledge one God, the Father, one Lord, Jesus Christ, and one Spirit—the Spirit of truth and power from God.
        </p>
        {showMoreMembership && (
          <div className="mt-2 space-y-2">
            <p>
              Members commit to annual renewal of dedication, humility, and service. Active participation, respect for fellow members, and a life of purity and abstinence from evil are essential. Each member pledges to uphold the mission of the ministry and contribute to spiritual and community development.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowMoreMembership(!showMoreMembership)}
          className="text-blue-600 hover:underline mt-1"
        >
          {showMoreMembership ? "Read Less" : "Read More"}
        </button>
      </section>

      {/* Discipline */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Group Discipline</h2>
        <p>
          Discipline within YEM reflects biblical principles and mirrors church guidelines. We address matters of correction with care, transparency, and love, ensuring fairness and Christian kindness.
        </p>
        {showMoreDiscipline && (
          <div className="mt-2 space-y-2">
            <p>
              Members are expected to follow established procedures for conflict resolution, avoiding personal prejudice, and promoting unity. Maintaining discipline is a shared responsibility, ensuring the integrity and spiritual health of the ministry.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowMoreDiscipline(!showMoreDiscipline)}
          className="text-blue-600 hover:underline mt-1"
        >
          {showMoreDiscipline ? "Read Less" : "Read More"}
        </button>
      </section>

      {/* Leadership & Organization */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Leadership & Organization</h2>
        <p>
          YEM is structured with functional departments led by elected leaders. Leadership oversees activities, ensuring that the ministry fulfills its mission while fostering spiritual growth and service.
        </p>
        {showMoreOrg && (
          <div className="mt-2 space-y-2">
            <p><strong>General Leadership:</strong> Chairperson, General Coordinator, Secretary, Treasurer, Regional Coordinators.</p>
            <p><strong>Departmental Leaders:</strong> Health Ministry, Music, True Education, Publishing, Literature Evangelism, Public Evangelism, Church Ministry, Strategic Planning & Development, Patron.</p>
            <p>
              Leaders are selected based on commitment, spiritual maturity, and dedication to the mission. They guide members, ensure harmony, and nurture accountability in all aspects of ministry work.
            </p>
          </div>
        )}
        <button
          onClick={() => setShowMoreOrg(!showMoreOrg)}
          className="text-blue-600 hover:underline mt-1"
        >
          {showMoreOrg ? "Read Less" : "Read More"}
        </button>
      </section>

      {/* Acknowledgments */}
      <section className="mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Acknowledgments</h2>
        <p>
          We sincerely thank all our servants, mentors, and well-wishers for their unwavering guidance. Special gratitude goes to our beloved mother and father in Israel for their prayerful support, encouragement, and love. Your dedication inspires us to continue faithfully in the work God has called us to.
        </p>
      </section>
    </div>
  );
}
