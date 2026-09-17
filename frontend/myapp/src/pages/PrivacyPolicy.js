// PrivacyPolicy.js — Law4u Advocates Hub Privacy Policy
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PrivacyPolicy.css";

const LAST_UPDATED = "01 September 2026";
const EFFECTIVE_DATE = "01 September 2026";
const COMPANY = "Law4u Legal Technologies Pvt. Ltd.";
const EMAIL = "privacy@law4u.in";
const ADDRESS = "No. 42, 3rd Floor, Legal Hub Tower, MG Road, Bengaluru – 560001, Karnataka, India";
const PHONE = "+91 80 4567 8900";

const SECTIONS = [
  { id: "introduction",         title: "1. Introduction",                        icon: "📋" },
  { id: "information-collect",  title: "2. Information We Collect",              icon: "📥" },
  { id: "how-we-use",           title: "3. How We Use Your Information",         icon: "⚙️" },
  { id: "sharing",              title: "4. Sharing of Information",              icon: "🤝" },
  { id: "advocate-data",        title: "5. Advocate-Specific Data",              icon: "⚖️" },
  { id: "client-data",          title: "6. Client-Specific Data",               icon: "👤" },
  { id: "cookies",              title: "7. Cookies & Tracking Technologies",     icon: "🍪" },
  { id: "data-security",        title: "8. Data Security",                       icon: "🔒" },
  { id: "data-retention",       title: "9. Data Retention",                      icon: "🗂️" },
  { id: "user-rights",          title: "10. Your Rights",                        icon: "✅" },
  { id: "third-party",          title: "11. Third-Party Links & Services",       icon: "🔗" },
  { id: "children",             title: "12. Children's Privacy",                 icon: "👶" },
  { id: "grievance",            title: "13. Grievance Officer",                  icon: "📞" },
  { id: "changes",              title: "14. Changes to This Policy",             icon: "📝" },
  { id: "contact",              title: "15. Contact Us",                         icon: "📬" },
];

const CONTENT = {
  introduction: {
    paragraphs: [
      `Welcome to Law4u Advocates Hub ("Law4u", "we", "us", or "our"). We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (www.law4u.in), use our mobile application, or engage with any of our legal services platform features.`,
      `This Privacy Policy applies to all users of the Law4u platform, including registered advocates, clients seeking legal assistance, visitors browsing our website, and any other individuals who interact with our services.`,
      `By accessing or using Law4u's services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this policy, please do not access or use our services.`,
      `This policy is published in compliance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and applicable provisions of the Digital Personal Data Protection Act, 2023.`,
    ],
  },
  "information-collect": {
    intro: "We collect the following categories of information from users of the Law4u platform:",
    subsections: [
      {
        title: "A. Information You Provide Directly",
        items: [
          "Full name, email address, phone number, and date of birth",
          "Profile photo and professional photograph (for advocates)",
          "Bar enrollment number, Bar Council name, and registration year (for advocates)",
          "Practice areas, court specialisations, and years of experience",
          "Educational qualifications and professional certifications",
          "Consultation fees, availability, and preferred consultation mode",
          "Billing address and payment information (processed securely through payment gateways)",
          "Legal questions, issues, and case descriptions submitted by clients",
          "Messages, consultations, and communications exchanged on the platform",
          "Feedback, reviews, and ratings submitted by users",
        ],
      },
      {
        title: "B. Information Collected Automatically",
        items: [
          "IP address, browser type, device type, and operating system",
          "Pages visited, links clicked, and time spent on each page",
          "Referring URLs and search terms used to reach our platform",
          "Device identifiers, session identifiers, and access logs",
          "Geolocation data (city/state level, with your permission)",
          "App usage data including features accessed and actions taken",
        ],
      },
      {
        title: "C. Information from Third Parties",
        items: [
          "Bar Council of India verification data (for advocate credential checks)",
          "Social login data if you sign in using Google or other OAuth providers",
          "Payment verification data from payment gateway partners",
          "Background verification reports from authorised verification agencies",
        ],
      },
    ],
  },
  "how-we-use": {
    intro: "We use the information we collect for the following purposes:",
    groups: [
      {
        title: "Platform Operation",
        items: [
          "To create, manage, and maintain your account on Law4u",
          "To match clients with appropriate advocates based on legal needs and location",
          "To facilitate consultations, messaging, and communications between users",
          "To display advocate profiles, ratings, reviews, and availability",
          "To process payments and issue receipts for consultation fees",
          "To send service-related notifications, booking confirmations, and reminders",
        ],
      },
      {
        title: "Verification & Trust",
        items: [
          "To verify advocate credentials, Bar enrollment numbers, and professional qualifications",
          "To conduct background checks as required for advocate onboarding",
          "To detect, prevent, and address fraudulent activity or misuse of the platform",
          "To enforce our Terms of Use and Community Guidelines",
        ],
      },
      {
        title: "Improvement & Analytics",
        items: [
          "To analyse usage patterns and improve platform features and user experience",
          "To conduct research and develop new services",
          "To generate anonymised, aggregated statistics about platform usage",
          "To personalise your experience and show relevant content",
        ],
      },
      {
        title: "Communication & Marketing",
        items: [
          "To send newsletters, legal updates, and platform announcements (with your consent)",
          "To send promotional offers, discounts, and new feature announcements",
          "To respond to your queries, complaints, and support requests",
          "To conduct user surveys and collect feedback",
        ],
      },
    ],
  },
  sharing: {
    intro: "We do not sell your personal data to third parties. We share your information only in the following circumstances:",
    items: [
      { title: "Between Users", desc: "Advocate profiles (name, photo, speciality, location, ratings, fees) are visible to all users. Client information shared during consultations is visible only to the matched advocate." },
      { title: "Service Providers", desc: "We share data with trusted third-party service providers who assist us in operating the platform, including cloud hosting providers (AWS/Azure), payment gateways (Razorpay/PayU), SMS and email service providers, and analytics tools. These providers are contractually bound to protect your data." },
      { title: "Verification Partners", desc: "Advocate credential information may be shared with Bar Council verification systems and authorised background check agencies solely for the purpose of verification." },
      { title: "Legal Requirements", desc: "We may disclose your information when required by law, court order, government authority, or to protect the rights, property, or safety of Law4u, our users, or the public." },
      { title: "Business Transfers", desc: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections." },
      { title: "With Your Consent", desc: "We may share your information with third parties for any other purpose with your explicit prior consent." },
    ],
  },
  "advocate-data": {
    paragraphs: [
      `As an advocate registered on Law4u, we collect and process additional professional data to verify your credentials and display your profile to prospective clients.`,
      `Your public profile will display: your full name, photograph, Bar enrollment number (partial), speciality areas, court experience, years of practice, location, consultation fee, languages spoken, education, and client ratings and reviews.`,
      `Your Bar enrollment number and Bar Council registration details are verified through official records. We do not share your complete enrollment number publicly but retain it for verification purposes.`,
      `All client communications, consultation notes, and case descriptions handled through the Law4u platform are subject to legal professional privilege to the maximum extent permitted by law. However, we may retain metadata about such communications for platform security and dispute resolution purposes.`,
      `Advocates are responsible for maintaining the accuracy and currency of their profile information. Outdated or misleading information may result in suspension of the advocate's profile pending correction.`,
      `Law4u reserves the right to remove or suspend advocate profiles that receive consistent negative ratings, verified complaints of professional misconduct, or that fail credential re-verification checks.`,
    ],
  },
  "client-data": {
    paragraphs: [
      `As a client using Law4u to seek legal assistance, your privacy and the confidentiality of your legal matters are of paramount importance to us.`,
      `The legal issue description, case details, and documents you share when seeking consultation are shared only with the advocate you are connected with. Law4u staff do not have routine access to the content of your legal consultations.`,
      `Your contact information (name, phone, email) is shared with the advocate only after you initiate a consultation request. Advocates are bound by our Terms of Use and professional ethics obligations not to misuse client information.`,
      `Consultation history, payment records, and review submissions are retained in your account and are visible to you at any time. You may request deletion of your account and associated data as described in Section 10.`,
      `If you post a public question in the Legal Q&A section, that question and any answers from advocates will be publicly visible. Do not include sensitive personal information in public questions.`,
    ],
  },
  cookies: {
    intro: "Law4u uses cookies and similar tracking technologies to enhance your experience on our platform.",
    types: [
      { name: "Essential Cookies",      desc: "Required for the platform to function. These include session cookies, authentication tokens, and security cookies. Cannot be disabled." },
      { name: "Preference Cookies",     desc: "Remember your settings and preferences such as language, city, and search filters. Help personalise your experience." },
      { name: "Analytics Cookies",      desc: "Help us understand how users interact with the platform. We use Google Analytics and similar tools. Data is anonymised and aggregated." },
      { name: "Marketing Cookies",      desc: "Used to show you relevant advertisements on Law4u and third-party platforms. You may opt out of marketing cookies in your account settings." },
    ],
    footer: "You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain features of the Law4u platform. Our Cookie Preference Centre is available in your account settings.",
  },
  "data-security": {
    paragraphs: [
      `Law4u implements industry-standard security measures to protect your personal data from unauthorised access, alteration, disclosure, or destruction.`,
      `We use 256-bit SSL/TLS encryption for all data transmitted between your device and our servers. All passwords are hashed using bcrypt and are never stored in plain text.`,
      `Our servers are hosted on ISO 27001 certified infrastructure with regular security audits, penetration testing, and vulnerability assessments.`,
      `Access to user data within Law4u is role-based and limited to authorised personnel on a need-to-know basis. All internal access is logged and audited.`,
      `We maintain a data breach response plan. In the event of a security breach affecting your personal data, we will notify you within 72 hours as required by applicable law.`,
      `Despite our best efforts, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security of your data. You are also responsible for keeping your account credentials confidential.`,
    ],
  },
  "data-retention": {
    intro: "We retain your personal data for the following periods:",
    table: [
      { dataType: "Account Information",           retention: "Duration of account + 3 years after deletion" },
      { dataType: "Consultation Records",          retention: "7 years (for legal compliance)" },
      { dataType: "Payment Records",               retention: "8 years (as required by tax laws)" },
      { dataType: "Advocate Verification Records", retention: "10 years" },
      { dataType: "Usage Logs and Analytics",      retention: "2 years (anonymised after 6 months)" },
      { dataType: "Support Communications",        retention: "3 years" },
      { dataType: "Marketing Preferences",         retention: "Until opt-out or account deletion" },
    ],
    footer: "After the retention period, data is permanently deleted or anonymised. You may request early deletion as described in Section 10, subject to legal retention requirements.",
  },
  "user-rights": {
    intro: "Under applicable Indian data protection laws, you have the following rights regarding your personal data:",
    rights: [
      { icon: "👁️",  title: "Right to Access",         desc: "Request a copy of all personal data we hold about you. We will provide this within 30 days of verified request." },
      { icon: "✏️",  title: "Right to Correction",     desc: "Request correction of inaccurate or incomplete personal data. You can also update most information directly from your account settings." },
      { icon: "🗑️",  title: "Right to Erasure",        desc: "Request deletion of your account and personal data, subject to legal retention requirements. Certain data must be retained for legal compliance." },
      { icon: "📦",  title: "Right to Portability",    desc: "Request your data in a machine-readable format (JSON/CSV) to transfer to another platform." },
      { icon: "🚫",  title: "Right to Object",         desc: "Object to processing of your data for marketing purposes. You may unsubscribe from marketing communications at any time." },
      { icon: "⏸️",  title: "Right to Restriction",    desc: "Request restriction of processing while a dispute or correction request is pending." },
      { icon: "🔕",  title: "Right to Withdraw Consent",desc: "Withdraw consent for processing based on consent at any time. Withdrawal does not affect processing done before withdrawal." },
    ],
    footer: "To exercise any of these rights, please email privacy@law4u.in with your registered email address and a description of your request. We may require identity verification before processing certain requests.",
  },
  "third-party": {
    paragraphs: [
      `Law4u's platform may contain links to third-party websites, payment gateways, and services. This Privacy Policy does not apply to those third-party services.`,
      `We integrate with the following third-party services, each with their own privacy policies: Razorpay/PayU (payment processing), Google Analytics (usage analytics), Firebase (mobile app infrastructure), Twilio/MSG91 (SMS notifications), SendGrid (email notifications), and AWS/Azure (cloud hosting).`,
      `We encourage you to review the privacy policies of any third-party services you access through our platform. Law4u is not responsible for the privacy practices of third-party services.`,
      `Bar Council verification links to official Bar Council portals for credential validation. This data exchange is governed by official government data sharing protocols.`,
    ],
  },
  children: {
    paragraphs: [
      `Law4u's services are intended for users who are 18 years of age or older. We do not knowingly collect personal information from children under the age of 18.`,
      `If you are a parent or guardian and believe that your child has provided personal information to us, please contact us immediately at privacy@law4u.in. We will take steps to delete such information from our systems.`,
      `If we discover that we have collected personal information from a child under 18, we will promptly delete such information and terminate the associated account.`,
    ],
  },
  grievance: {
    paragraphs: [
      `In accordance with the Information Technology Act, 2000 and associated rules, Law4u has appointed a Grievance Officer to address privacy-related complaints and concerns.`,
    ],
    officer: {
      name:     "Adv. Ravi Shankar Iyer",
      title:    "Grievance Officer & Data Protection Officer",
      company:  COMPANY,
      email:    "grievance@law4u.in",
      phone:    "+91 80 4567 8901",
      address:  ADDRESS,
      hours:    "Monday to Friday, 10:00 AM – 6:00 PM IST",
      response: "We will acknowledge your complaint within 48 hours and resolve it within 30 days.",
    },
  },
  changes: {
    paragraphs: [
      `Law4u reserves the right to update or modify this Privacy Policy at any time. We will notify you of material changes by email, in-app notification, or by posting a prominent notice on our website at least 7 days before the changes take effect.`,
      `Your continued use of Law4u's services after the effective date of the revised Privacy Policy constitutes your acceptance of the updated policy.`,
      `We maintain an archive of previous versions of this Privacy Policy. You may request access to previous versions by contacting us at privacy@law4u.in.`,
      `We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.`,
    ],
  },
  contact: {
    paragraphs: [
      `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:`,
    ],
    details: {
      company: COMPANY,
      email:   EMAIL,
      phone:   PHONE,
      address: ADDRESS,
      website: "www.law4u.in/privacy",
    },
  },
};

export default function PrivacyPolicy() {
  const navigate                  = useNavigate();
  const [activeSection, setActive]= useState("introduction");
  const [showTOC,       setTOC]   = useState(false);
  const [scrolled,      setScrolled] = useState(false);
  const sectionRefs               = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.values(sectionRefs.current).forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTOC(false);
  };

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:"#1e293b", background:"#f8fafc", minHeight:"100vh" }}>
      <style>{`
        .pp-section { scroll-margin-top: 80px; }
        .pp-nav-item { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:7px; cursor:pointer; font-size:13px; border:none; background:transparent; text-align:left; width:100%; transition:all .15s; color:#64748b; }
        .pp-nav-item:hover { background:#f1f5f9; color:#1e293b; }
        .pp-nav-item.active { background:#dbeafe; color:#1d4ed8; font-weight:600; }
        .pp-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:28px 32px; margin-bottom:24px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
        .pp-section-title { font-size:20px; font-weight:800; color:#1e293b; margin:0 0 16px; display:flex; align-items:center; gap:10px; }
        .pp-para { font-size:14px; line-height:1.85; color:#374151; margin-bottom:14px; }
        .pp-para:last-child { margin-bottom:0; }
        .pp-list { margin:10px 0 14px 0; padding-left:0; list-style:none; display:flex; flex-direction:column; gap:8px; }
        .pp-list li { display:flex; align-items:flex-start; gap:9px; font-size:13.5px; line-height:1.7; color:#374151; }
        .pp-list li::before { content:"•"; color:#2563eb; font-size:16px; margin-top:2px; flex-shrink:0; }
        .pp-sub-title { font-size:15px; font-weight:700; color:#1e293b; margin:18px 0 10px; }
        .pp-group-title { font-size:14px; font-weight:700; color:#2563eb; margin:14px 0 8px; background:#eff6ff; padding:6px 12px; border-radius:6px; border-left:3px solid #2563eb; }
        .pp-table { width:100%; border-collapse:collapse; font-size:13.5px; margin-top:12px; }
        .pp-table th { background:#f1f5f9; padding:10px 14px; text-align:left; font-weight:700; color:#64748b; border-bottom:2px solid #e2e8f0; }
        .pp-table td { padding:10px 14px; border-bottom:1px solid #f1f5f9; color:#374151; }
        .pp-table tr:hover td { background:#fafbff; }
        .pp-right-card { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; padding:14px 16px; margin-bottom:10px; display:flex; gap:12px; }
        .pp-right-icon { font-size:22px; flex-shrink:0; }
        .pp-right-title { font-size:13.5px; font-weight:700; color:#14532d; margin-bottom:4px; }
        .pp-right-desc { font-size:13px; color:#166534; line-height:1.6; }
        .pp-cookie-card { background:#fefce8; border:1px solid #fef08a; border-radius:9px; padding:13px 16px; margin-bottom:10px; }
        .pp-cookie-name { font-size:13.5px; font-weight:700; color:#78350f; margin-bottom:4px; }
        .pp-cookie-desc { font-size:13px; color:#92400e; line-height:1.6; }
        .pp-officer-card { background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:20px; }
        .pp-contact-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px; }
        .pp-detail-row { display:flex; align-items:flex-start; gap:12px; padding:9px 0; border-bottom:1px solid #e2e8f0; font-size:13.5px; }
        .pp-detail-row:last-child { border-bottom:none; }
        .pp-detail-label { color:#64748b; min-width:100px; flex-shrink:0; }
        .pp-detail-val { color:#1e293b; font-weight:500; }
        .pp-info-box { background:#eff6ff; border:1px solid #bfdbfe; border-radius:9px; padding:12px 16px; font-size:13px; color:#1d4ed8; margin-top:14px; }
        .pp-share-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f1f5f9; }
        .pp-share-item:last-child { border-bottom:none; }
        .pp-share-title { font-size:13.5px; font-weight:700; color:#1e293b; margin-bottom:4px; }
        .pp-share-desc { font-size:13px; color:#64748b; line-height:1.65; }
        @media(max-width:900px){ .pp-layout{ flex-direction:column!important; } .pp-sidebar{ display:none; } }
      `}</style>

      {/* Sticky top bar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background: scrolled ? "rgba(255,255,255,.95)" : "#fff", backdropFilter:"blur(8px)", borderBottom:"1px solid #e2e8f0", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,.08)" : "none", transition:"all .2s" }}>
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#2563eb", fontSize:13.5, fontWeight:600, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          ← Back
        </button>
        <div style={{ fontWeight:800, fontSize:16 }}>
          <span style={{ color:"#2563eb" }}>Law</span>
          <span style={{ color:"#dc2626" }}>4</span>
          <span style={{ color:"#16a34a" }}>u</span>
          <span style={{ color:"#64748b", fontSize:13, fontWeight:400, marginLeft:8 }}>Privacy Policy</span>
        </div>
        <button onClick={() => setTOC(p => !p)} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:7, padding:"6px 14px", color:"#1d4ed8", fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          ☰ Contents
        </button>
      </div>

      {/* Mobile TOC drawer */}
      {showTOC && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:200 }} onClick={() => setTOC(false)}>
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:280, background:"#fff", padding:"20px 14px", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:700, fontSize:14, color:"#1e293b", marginBottom:12 }}>Contents</div>
            {SECTIONS.map(s => (
              <button key={s.id} className={`pp-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span>{s.icon}</span><span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e3a5f,#1d4ed8,#2563eb)", color:"#fff", padding:"48px 24px 40px", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🔒</div>
        <h1 style={{ fontSize:32, fontWeight:900, margin:"0 0 8px", letterSpacing:"-.5px" }}>Privacy Policy</h1>
        <p style={{ fontSize:15, opacity:.85, margin:"0 0 20px" }}>{COMPANY}</p>
        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", fontSize:13, opacity:.8 }}>
          <span>📅 Last Updated: {LAST_UPDATED}</span>
          <span>✅ Effective: {EFFECTIVE_DATE}</span>
        </div>
      </div>

      {/* Quick summary bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"14px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { icon:"🚫", text:"We never sell your data" },
            { icon:"🔒", text:"SSL encrypted platform" },
            { icon:"✅", text:"DPDPA 2023 compliant" },
            { icon:"🗑️", text:"Right to delete your data" },
            { icon:"📞", text:"Dedicated grievance officer" },
          ].map(item => (
            <div key={item.text} style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"#374151", fontWeight:500 }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="pp-layout" style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px 60px", display:"flex", gap:28, alignItems:"flex-start" }}>

        {/* Sidebar */}
        <aside className="pp-sidebar" style={{ width:250, flexShrink:0, position:"sticky", top:72 }}>
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 10px", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, padding:"0 12px", marginBottom:10 }}>Table of Contents</div>
            {SECTIONS.map(s => (
              <button key={s.id} className={`pp-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span style={{ fontSize:14 }}>{s.icon}</span>
                <span style={{ fontSize:12.5 }}>{s.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex:1, minWidth:0 }}>

          {/* Section 1: Introduction */}
          <div id="introduction" className="pp-section" ref={setRef("introduction")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[0].icon}</span>{SECTIONS[0].title}</h2>
              {CONTENT.introduction.paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 2: Information We Collect */}
          <div id="information-collect" className="pp-section" ref={setRef("information-collect")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[1].icon}</span>{SECTIONS[1].title}</h2>
              <p className="pp-para">{CONTENT["information-collect"].intro}</p>
              {CONTENT["information-collect"].subsections.map(sub => (
                <div key={sub.title}>
                  <div className="pp-sub-title">{sub.title}</div>
                  <ul className="pp-list">
                    {sub.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: How We Use */}
          <div id="how-we-use" className="pp-section" ref={setRef("how-we-use")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[2].icon}</span>{SECTIONS[2].title}</h2>
              <p className="pp-para">{CONTENT["how-we-use"].intro}</p>
              {CONTENT["how-we-use"].groups.map(g => (
                <div key={g.title}>
                  <div className="pp-group-title">{g.title}</div>
                  <ul className="pp-list">
                    {g.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Sharing */}
          <div id="sharing" className="pp-section" ref={setRef("sharing")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[3].icon}</span>{SECTIONS[3].title}</h2>
              <p className="pp-para">{CONTENT.sharing.intro}</p>
              {CONTENT.sharing.items.map(item => (
                <div key={item.title} className="pp-share-item">
                  <div>
                    <div className="pp-share-title">{item.title}</div>
                    <div className="pp-share-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Advocate Data */}
          <div id="advocate-data" className="pp-section" ref={setRef("advocate-data")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[4].icon}</span>{SECTIONS[4].title}</h2>
              {CONTENT["advocate-data"].paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 6: Client Data */}
          <div id="client-data" className="pp-section" ref={setRef("client-data")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[5].icon}</span>{SECTIONS[5].title}</h2>
              {CONTENT["client-data"].paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 7: Cookies */}
          <div id="cookies" className="pp-section" ref={setRef("cookies")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[6].icon}</span>{SECTIONS[6].title}</h2>
              <p className="pp-para">{CONTENT.cookies.intro}</p>
              {CONTENT.cookies.types.map(t => (
                <div key={t.name} className="pp-cookie-card">
                  <div className="pp-cookie-name">{t.name}</div>
                  <div className="pp-cookie-desc">{t.desc}</div>
                </div>
              ))}
              <p className="pp-para" style={{ marginTop: 12 }}>{CONTENT.cookies.footer}</p>
            </div>
          </div>

          {/* Section 8: Data Security */}
          <div id="data-security" className="pp-section" ref={setRef("data-security")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[7].icon}</span>{SECTIONS[7].title}</h2>
              {CONTENT["data-security"].paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 9: Data Retention */}
          <div id="data-retention" className="pp-section" ref={setRef("data-retention")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[8].icon}</span>{SECTIONS[8].title}</h2>
              <p className="pp-para">{CONTENT["data-retention"].intro}</p>
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTENT["data-retention"].table.map(row => (
                    <tr key={row.dataType}>
                      <td>{row.dataType}</td>
                      <td>{row.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pp-para" style={{ marginTop: 14 }}>{CONTENT["data-retention"].footer}</p>
            </div>
          </div>

          {/* Section 10: User Rights */}
          <div id="user-rights" className="pp-section" ref={setRef("user-rights")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[9].icon}</span>{SECTIONS[9].title}</h2>
              <p className="pp-para">{CONTENT["user-rights"].intro}</p>
              {CONTENT["user-rights"].rights.map(r => (
                <div key={r.title} className="pp-right-card">
                  <div className="pp-right-icon">{r.icon}</div>
                  <div>
                    <div className="pp-right-title">{r.title}</div>
                    <div className="pp-right-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
              <div className="pp-info-box">📧 To exercise your rights: <strong>{EMAIL}</strong></div>
            </div>
          </div>

          {/* Section 11: Third Party */}
          <div id="third-party" className="pp-section" ref={setRef("third-party")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[10].icon}</span>{SECTIONS[10].title}</h2>
              {CONTENT["third-party"].paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 12: Children */}
          <div id="children" className="pp-section" ref={setRef("children")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[11].icon}</span>{SECTIONS[11].title}</h2>
              {CONTENT.children.paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 13: Grievance */}
          <div id="grievance" className="pp-section" ref={setRef("grievance")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[12].icon}</span>{SECTIONS[12].title}</h2>
              {CONTENT.grievance.paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
              <div className="pp-officer-card">
                {[
                  { label:"Name",      val: CONTENT.grievance.officer.name    },
                  { label:"Designation",val: CONTENT.grievance.officer.title  },
                  { label:"Company",   val: COMPANY                           },
                  { label:"Email",     val: CONTENT.grievance.officer.email   },
                  { label:"Phone",     val: CONTENT.grievance.officer.phone   },
                  { label:"Address",   val: ADDRESS                           },
                  { label:"Hours",     val: CONTENT.grievance.officer.hours   },
                  { label:"Response",  val: CONTENT.grievance.officer.response},
                ].map(row => (
                  <div key={row.label} className="pp-detail-row">
                    <span className="pp-detail-label">{row.label}</span>
                    <span className="pp-detail-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 14: Changes */}
          <div id="changes" className="pp-section" ref={setRef("changes")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[13].icon}</span>{SECTIONS[13].title}</h2>
              {CONTENT.changes.paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
            </div>
          </div>

          {/* Section 15: Contact */}
          <div id="contact" className="pp-section" ref={setRef("contact")}>
            <div className="pp-card">
              <h2 className="pp-section-title"><span>{SECTIONS[14].icon}</span>{SECTIONS[14].title}</h2>
              {CONTENT.contact.paragraphs.map((p, i) => <p key={i} className="pp-para">{p}</p>)}
              <div className="pp-contact-card">
                {[
                  { label:"Company", val: CONTENT.contact.details.company },
                  { label:"Email",   val: CONTENT.contact.details.email   },
                  { label:"Phone",   val: CONTENT.contact.details.phone   },
                  { label:"Address", val: CONTENT.contact.details.address },
                  { label:"Website", val: CONTENT.contact.details.website },
                ].map(row => (
                  <div key={row.label} className="pp-detail-row">
                    <span className="pp-detail-label">{row.label}</span>
                    <span className="pp-detail-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 24px", textAlign:"center", fontSize:13, color:"#64748b", lineHeight:1.7 }}>
            This Privacy Policy is effective as of <strong>{EFFECTIVE_DATE}</strong> and was last updated on <strong>{LAST_UPDATED}</strong>.<br />
            By using Law4u, you acknowledge that you have read and understood this Privacy Policy.<br />
            <span style={{ color:"#2563eb", fontWeight:600 }}>© 2026 {COMPANY}. All rights reserved.</span>
          </div>
        </main>
      </div>
    </div>
  );
}