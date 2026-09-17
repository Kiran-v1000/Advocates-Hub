// ============================================================
//   AboutUs.js  —  Law4u / AdvocatesHub "About Us" Page
// ============================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Aboutus.css";  // Ensure this matches your exact file path to Aboutus.css
import chetanImg from "../images/chetan.png";
// import vidhvathImg from "../images/vidhvath.png";
import sandeepImg from "../images/sandeep.jpeg";

const STATS = [
  { icon: "⚖️", value: "50+",   label: "Verified Advocates" },
  { icon: "🏙️", value: "18+",   label: "Cities Covered" },
  { icon: "📁", value: "5,000+",label: "Cases Handled" },
  { icon: "⭐", value: "4.8/5", label: "Average Client Rating" },
];

const VALUES = [
  { icon: "🤝", title: "Trust First",      desc: "Every advocate on our platform is verified through their Bar enrollment before they can accept clients." },
  { icon: "⚡", title: "Fast Connections",   desc: "Send a consultation request and hear back from a qualified advocate, usually within a day." },
  { icon: "🔒", title: "Privacy Respected",  desc: "Your case details and personal information are only shared with the advocate you choose to connect with." },
  { icon: "🌐", title: "Accessible to All",  desc: "From metro cities to smaller towns, we're building a network that makes legal help reachable everywhere." },
];

const TEAM = [
  { 
    initials: "CC", 
    name: "Chetan Chandaragi", 
    role: "Founder & CEO", 
    photo: chetanImg, 
    color: "#2563eb",
    email: "chetanchandaragi@gmail.com",
    phone: "8884393044",
    bio: "Leading AdvocatesHub's vision to revolutionize access to legal services across India. Passionate about technology, transparency, and bridging the gap between clients and verified legal professionals.",
    expertise: ["Strategic Growth", "Legal Tech", "Operations"]
  },
  { 
    initials: "VC", 
    name: "Vidhvath Chandaragi", 
    role: "Head of Legal Ops", 
    photo: null, 
    color: "#16a34a",
    email: "vidhwat@gmail.com",
    phone: "19346738291",
    bio: "Overseeing day-to-day legal operations and verification workflows. Ensures every advocate on the platform meets rigorous professional compliance standards.",
    expertise: ["Compliance", "Bar Verification", "Operations"]
  },
  { 
    initials: "SM", 
    name: "Sandeep Masaguppi", 
    role: "Head of Partnerships", 
    photo: sandeepImg, 
    color: "#7c3aed",
    email: "sandeeprmasaguppi@gmail.com",
    phone: "9108717353",
    bio: "Driving strategic partnerships and expanding the advocate network into new cities and communities to make legal help universally accessible.",
    expertise: ["Strategic Alliances", "Network Expansion", "Client Relations"]
  },
];

function StatCard({ icon, value, label }) {
  return (
    <div className="ab-stat-card">
      <div className="ab-stat-icon">{icon}</div>
      <div className="ab-stat-value">{value}</div>
      <div className="ab-stat-label">{label}</div>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="ab-value-card">
      <div className="ab-value-icon">{icon}</div>
      <h3 className="ab-value-title">{title}</h3>
      <p className="ab-value-desc">{desc}</p>
    </div>
  );
}

function TeamCard({ initials, name, role, color, photo, onClick }) {
  return (
    <div className="ab-team-card" onClick={onClick}>
      <div className="ab-team-avatar" style={{ background: color }}>
        {photo ? (
          <img 
            src={photo} 
            alt={name} 
            className="ab-team-avatar-img" 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
        ) : (
          initials
        )}
      </div>
      <div className="ab-team-name">{name}</div>
      <div className="ab-team-role">{role}</div>
      <span className="ab-team-hint">Click to view profile →</span>
    </div>
  );
}

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="ab-page">

      {/* Hero */}
      <section className="ab-hero">
        <div className="ab-hero-inner">
          <span className="ab-hero-badge">⚖️ About AdvocatesHub</span>
          <h1 className="ab-hero-title">
            India's Most Trusted Platform to Find the Right Advocate
          </h1>
          <p className="ab-hero-sub">
            We connect people who need legal help with verified advocates across the country —
            making legal support simpler, faster, and more transparent for everyone.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="ab-stats-section">
        <div className="ab-stats-grid">
          {STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </section>

      {/* Mission */}
      <section className="ab-mission-section">
        <div className="ab-mission-inner">
          <h2 className="ab-section-title">Our Mission</h2>
          <p className="ab-mission-text">
            Finding the right advocate shouldn't be confusing or intimidating. AdvocatesHub was built
            to close that gap — helping clients find advocates by speciality, city, and experience,
            while giving advocates a simple way to grow their practice and manage client requests
            in one place.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="ab-values-section">
        <h2 className="ab-section-title ab-center">What We Stand For</h2>
        <div className="ab-values-grid">
          {VALUES.map((v) => <ValueCard key={v.title} {...v} />)}
        </div>
      </section>

      {/* Team */}
      <section className="ab-team-section">
        <h2 className="ab-section-title ab-center">The Team Behind AdvocatesHub</h2>
        <p className="ab-team-subtitle">Click on any profile card to view detailed background info.</p>
        <div className="ab-team-grid">
          {TEAM.map((t) => (
            <TeamCard key={t.name} {...t} onClick={() => setSelectedMember(t)} />
          ))}
        </div>
      </section>

      {/* Full Display Profile Modal */}
      {selectedMember && (
        <div className="ab-modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="ab-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="ab-modal-close" onClick={() => setSelectedMember(null)}>✕</button>
            <div className="ab-modal-header" style={{ background: selectedMember.color }}>
              <div className="ab-modal-avatar">
                {selectedMember.photo ? (
                  <img src={selectedMember.photo} alt={selectedMember.name} />
                ) : (
                  selectedMember.initials
                )}
              </div>
            </div>
            <div className="ab-modal-body">
              <h2 className="ab-modal-name">{selectedMember.name}</h2>
              <span className="ab-modal-role" style={{ color: selectedMember.color }}>
                {selectedMember.role}
              </span>
              <p className="ab-modal-bio">{selectedMember.bio}</p>

              <div className="ab-modal-contact">
                <a href={`mailto:${selectedMember.email}`} className="ab-modal-contact-link">
                  <span className="ab-modal-contact-icon" aria-hidden="true">✉</span>
                  {selectedMember.email}
                </a>
                <a href={`tel:${selectedMember.phone}`} className="ab-modal-contact-link">
                  <span className="ab-modal-contact-icon" aria-hidden="true">☎</span>
                  {selectedMember.phone}
                </a>
              </div>
              
              <div className="ab-modal-tags-title">Core Focus Areas:</div>
              <div className="ab-modal-tags">
                {selectedMember.expertise.map((item, idx) => (
                  <span key={idx} className="ab-modal-tag" style={{ borderColor: selectedMember.color, color: selectedMember.color }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="ab-cta-section">
        <div className="ab-cta-inner">
          <h2>Ready to find the right advocate?</h2>
          <p>Search by speciality, city, or legal issue and connect in minutes.</p>
          <div className="ab-cta-actions">
            <Link to="/find-lawyer" className="ab-btn-primary">Find a Lawyer →</Link>
            <Link to="/contact" className="ab-btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}