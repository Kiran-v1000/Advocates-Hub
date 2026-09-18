// Navbar.js — Law4u Navigation
import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const LAWYER_CATEGORIES = [
  { icon: "👨‍👩‍👧", label: "Person / Family", desc: "Divorce, custody, marriage, adoption", path: "/find-lawyer?cat=family" },
  { icon: "🔒", label: "Criminal / Property", desc: "FIR, bail, property disputes, theft", path: "/find-lawyer?cat=criminal" },
  { icon: "⚖️", label: "Civil / Debt Matter", desc: "Civil suits, debt recovery, contracts", path: "/find-lawyer?cat=civil" },
  { icon: "🏢", label: "Corporate Law", desc: "Company, GST, tax, compliance", path: "/find-lawyer?cat=corporate" },
];

const LEGAL_ADVICE = [
  { icon: "❓", label: "Ask a Question",    path: "/legal-advice/ask-question" },
  { icon: "📋", label: "Legal Documents",    path: "/legal-advice/documents" },
  { icon: "🏛️", label: "Bare Acts",          path: "/legal-advice/bare-acts" },
  { icon: "📰", label: "Legal News",         path: "/legal-advice/news" },
];

const ABOUT = [
  { icon: "ℹ️", label: "About Us",  path: "/aboutus" },
  { icon: "📞", label: "Contact",   path: "/Contact" },
  { icon: "🤝", label: "Partners",  path: "/Partners" },
];

function Dropdown({ items, onClose }) {
  return (
    <div className="lw-dropdown" onClick={e => e.stopPropagation()}>
      {items.map((item) => (
        <Link key={item.label} to={item.path} className="lw-dropdown-item" onClick={onClose}>
          <span className="lw-dd-icon">{item.icon}</span>
          <div>
            <div className="lw-dd-label">{item.label}</div>
            {item.desc && <div className="lw-dd-desc">{item.desc}</div>}
          </div>
        </Link>
      ))}
    </div>
  );
}

function LawyerMegaMenu({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="lw-mega-menu" onClick={e => e.stopPropagation()}>
      <div className="lw-mega-title">Find A Lawyer By Category</div>
      <div className="lw-mega-grid">
        {LAWYER_CATEGORIES.map((cat) => (
          <Link key={cat.label} to={cat.path} className="lw-mega-card" onClick={onClose}>
            <span className="lw-mega-icon">{cat.icon}</span>
            <div className="lw-mega-card-label">{cat.label}</div>
            <div className="lw-mega-card-desc">{cat.desc}</div>
          </Link>
        ))}
      </div>
      <div className="lw-mega-footer">
        <Link to="/find-lawyer" className="lw-mega-all" onClick={onClose}>
          View All Lawyers →
        </Link>
        <button className="lw-mega-talk" onClick={() => { onClose(); navigate("/talk-to-advocate"); }}>
          Talk to a Lawyer Now
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  
  //Fixed: Mobile menu state properly placed inside the component function
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (menu) => setOpenMenu(prev => prev === menu ? null : menu);

  // Close mobile drawer when any link is clicked
  const handleLinkClick = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="lw-navbar" ref={navRef}>
      <div className="lw-nav-inner">
        {/* Logo */}
        <Link to="/" className="lw-logo" onClick={handleLinkClick}>
          <BrandLogo size={34} />
          <span className="lw-logo-tagline">Best Legal Platform</span>
        </Link>

        {/* Hamburger Menu Toggle Button for Mobile/Tabs */}
        <button 
          className="lw-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Nav links (Applies 'active' class when mobile menu is toggled open) */}
        <div className={`lw-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="lw-nav-link" onClick={handleLinkClick}>Home</Link>

          {/* Find A Lawyer */}
          <div className="lw-nav-item">
            <button className={`lw-nav-link lw-has-drop ${openMenu === "lawyer" ? "active" : ""}`}
              onMouseOver={() => toggle("lawyer")}>
              Find A Lawyer <span className="lw-arrow"></span>
            </button>
            {openMenu === "lawyer" && <LawyerMegaMenu onClose={handleLinkClick} />}
          </div>

          {/* Legal Advice */}
          <div className="lw-nav-item">
            <button className={`lw-nav-link lw-has-drop ${openMenu === "advice" ? "active" : ""}`}
              onMouseOver={() => toggle("advice")}>
              Legal Advice <span className="lw-arrow"></span>
            </button>
            {openMenu === "advice" && <Dropdown items={LEGAL_ADVICE} onClose={handleLinkClick} />}
          </div>

          {/* About */}
          <div className="lw-nav-item">
            <button className={`lw-nav-link lw-has-drop ${openMenu === "about" ? "active" : ""}`}
              onMouseOver={() => toggle("about")}>
              About <span className="lw-arrow"></span>
            </button>
            {openMenu === "about" && <Dropdown items={ABOUT} onClose={handleLinkClick} />}
          </div>

          {/* Lawyer Signup & Admin links */}
          <Link to="/signup" className="lw-nav-link" onClick={handleLinkClick}>Lawyer Signup</Link>
          <Link to="/admin" className="lw-nav-link" onClick={handleLinkClick}>Admin</Link>
          <br></br>
          <Link to="/login" className="lw-btn-login" onClick={handleLinkClick}>Login</Link>
          <br></br>
          <Link to="/signup" className="lw-btn-register" onClick={handleLinkClick}>Register</Link>
        </div>
      </div>
    </nav>
  );
}