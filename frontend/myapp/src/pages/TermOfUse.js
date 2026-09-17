// TermsOfUse.js — Law4u Advocates Hub Terms of Use
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TermOfUse.css";

const LAST_UPDATED  = "01 September 2026";
const EFFECTIVE_DATE= "01 September 2026";
const COMPANY       = "Law4u Legal Technologies Pvt. Ltd.";
const EMAIL         = "legal@law4u.in";
const ADDRESS       = "No. 42, 3rd Floor, Legal Hub Tower, MG Road, Bengaluru – 560001, Karnataka, India";

const SECTIONS = [
  { id:"acceptance",        title:"1. Acceptance of Terms",                 icon:"✅" },
  { id:"definitions",       title:"2. Definitions",                          icon:"📖" },
  { id:"eligibility",       title:"3. Eligibility",                          icon:"👤" },
  { id:"platform-desc",     title:"4. Platform Description",                 icon:"🏛️" },
  { id:"registration",      title:"5. Account Registration",                 icon:"📝" },
  { id:"advocate-terms",    title:"6. Advocate-Specific Terms",              icon:"⚖️" },
  { id:"client-terms",      title:"7. Client-Specific Terms",               icon:"🙋" },
  { id:"fees-payment",      title:"8. Fees and Payments",                   icon:"💰" },
  { id:"prohibited",        title:"9. Prohibited Conduct",                  icon:"🚫" },
  { id:"content",           title:"10. User Content & Intellectual Property",icon:"📄" },
  { id:"disclaimers",       title:"11. Disclaimers",                         icon:"⚠️" },
  { id:"liability",         title:"12. Limitation of Liability",             icon:"🛡️" },
  { id:"indemnification",   title:"13. Indemnification",                    icon:"🤝" },
  { id:"termination",       title:"14. Account Termination",                icon:"🔚" },
  { id:"dispute",           title:"15. Dispute Resolution",                 icon:"🏛️" },
  { id:"governing-law",     title:"16. Governing Law",                      icon:"📜" },
  { id:"modifications",     title:"17. Modifications to Terms",             icon:"✏️" },
  { id:"general",           title:"18. General Provisions",                 icon:"📋" },
  { id:"contact",           title:"19. Contact Information",                icon:"📬" },
];

export default function TermsOfUse() {
  const navigate                   = useNavigate();
  const [activeSection, setActive] = useState("acceptance");
  const [showTOC,       setTOC]    = useState(false);
  const [scrolled,      setScrolled]= useState(false);
  const [accepted,      setAccepted]= useState(false);
  const sectionRefs                = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.values(sectionRefs.current).forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior:"smooth", block:"start" });
    setTOC(false);
  };
  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  const S = ({ children, style }) => (
    <p style={{ fontSize:14, lineHeight:1.85, color:"#374151", marginBottom:13, ...style }}>{children}</p>
  );
  const B = ({ children, style }) => (
    <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", margin:"18px 0 8px", ...style }}>{children}</div>
  );
  const Li = ({ children }) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:9, fontSize:13.5, color:"#374151", lineHeight:1.75, marginBottom:7 }}>
      <span style={{ color:"#2563eb", fontSize:16, marginTop:2, flexShrink:0 }}>•</span>
      <span>{children}</span>
    </div>
  );
  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:"#1e293b", background:"#f8fafc", minHeight:"100vh" }}>
      <style>{`
        .tu-section { scroll-margin-top:80px; }
        .tu-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:28px 32px; margin-bottom:24px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
        .tu-sec-title { font-size:20px; font-weight:800; color:#1e293b; margin:0 0 16px; display:flex; align-items:center; gap:10px; }
        .tu-nav-item { display:flex; align-items:center; gap:8px; padding:7px 12px; border-radius:7px; cursor:pointer; font-size:12.5px; border:none; background:transparent; text-align:left; width:100%; transition:all .15s; color:#64748b; }
        .tu-nav-item:hover { background:#f1f5f9; color:#1e293b; }
        .tu-nav-item.active { background:#dbeafe; color:#1d4ed8; font-weight:600; }
        .tu-def-row { display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f1f5f9; font-size:13.5px; }
        .tu-def-row:last-child { border-bottom:none; }
        .tu-def-term { font-weight:700; color:#1d4ed8; min-width:130px; flex-shrink:0; }
        .tu-def-val { color:#374151; line-height:1.65; }
        .tu-highlight { background:#fff7ed; border:1px solid #fed7aa; border-radius:9px; padding:14px 18px; margin:14px 0; font-size:13.5px; color:#9a3412; line-height:1.7; }
        .tu-info-box { background:#eff6ff; border:1px solid #bfdbfe; border-radius:9px; padding:12px 16px; font-size:13px; color:#1d4ed8; margin:12px 0; line-height:1.6; }
        .tu-warning-box { background:#fef2f2; border:1px solid #fecaca; border-radius:9px; padding:12px 16px; font-size:13px; color:#7f1d1d; margin:12px 0; line-height:1.6; }
        .tu-success-box { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:9px; padding:12px 16px; font-size:13px; color:#14532d; margin:12px 0; line-height:1.6; }
        .tu-table { width:100%; border-collapse:collapse; font-size:13.5px; margin:12px 0; }
        .tu-table th { background:#f1f5f9; padding:10px 14px; text-align:left; font-weight:700; color:#64748b; border-bottom:2px solid #e2e8f0; }
        .tu-table td { padding:10px 14px; border-bottom:1px solid #f1f5f9; color:#374151; vertical-align:top; }
        .tu-table tr:hover td { background:#fafbff; }
        .tu-prohibited-item { display:flex; gap:12px; padding:11px 14px; border-radius:9px; background:#fef2f2; border:1px solid #fecaca; margin-bottom:8px; }
        .tu-proh-icon { font-size:20px; flex-shrink:0; }
        .tu-proh-title { font-size:13.5px; font-weight:700; color:#7f1d1d; margin-bottom:3px; }
        .tu-proh-desc { font-size:13px; color:#991b1b; line-height:1.6; }
        .tu-contact-row { display:flex; align-items:flex-start; gap:12px; padding:9px 0; border-bottom:1px solid #e2e8f0; font-size:13.5px; }
        .tu-contact-row:last-child { border-bottom:none; }
        @media(max-width:900px){ .tu-layout{ flex-direction:column!important; } .tu-sidebar{ display:none; } }
      `}</style>

      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background: scrolled ? "rgba(255,255,255,.95)" : "#fff", backdropFilter:"blur(8px)", borderBottom:"1px solid #e2e8f0", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,.08)" : "none", transition:"all .2s" }}>
        <button onClick={() => navigate(-1)} style={{ background:"none", border:"none", cursor:"pointer", color:"#2563eb", fontSize:13.5, fontWeight:600, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          ← Back
        </button>
        <div style={{ fontWeight:800, fontSize:16 }}>
          <span style={{ color:"#2563eb" }}>Law</span>
          <span style={{ color:"#dc2626" }}>4</span>
          <span style={{ color:"#16a34a" }}>u</span>
          <span style={{ color:"#64748b", fontSize:13, fontWeight:400, marginLeft:8 }}>Terms of Use</span>
        </div>
        <button onClick={() => setTOC(p => !p)} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:7, padding:"6px 14px", color:"#1d4ed8", fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          ☰ Contents
        </button>
      </div>

      {/* Mobile TOC */}
      {showTOC && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:200 }} onClick={() => setTOC(false)}>
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:280, background:"#fff", padding:"20px 14px", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:700, fontSize:14, color:"#1e293b", marginBottom:12 }}>Table of Contents</div>
            {SECTIONS.map(s => (
              <button key={s.id} className={`tu-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span>{s.icon}</span><span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#14532d,#16a34a,#22c55e)", color:"#fff", padding:"48px 24px 40px", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>📜</div>
        <h1 style={{ fontSize:32, fontWeight:900, margin:"0 0 8px", letterSpacing:"-.5px" }}>Terms of Use</h1>
        <p style={{ fontSize:15, opacity:.85, margin:"0 0 20px" }}>{COMPANY}</p>
        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", fontSize:13, opacity:.8 }}>
          <span>📅 Last Updated: {LAST_UPDATED}</span>
          <span>✅ Effective: {EFFECTIVE_DATE}</span>
        </div>
      </div>

      {/* Quick info bar */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"14px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
          {[
            { icon:"🇮🇳", text:"Governed by Indian Law" },
            { icon:"⚖️",  text:"Advocates bound by BCI rules" },
            { icon:"🔒",  text:"Secure platform" },
            { icon:"📞",  text:"Dispute resolution support" },
            { icon:"🚫",  text:"Not a law firm" },
          ].map(item => (
            <div key={item.text} style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"#374151", fontWeight:500 }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="tu-layout" style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px 60px", display:"flex", gap:28, alignItems:"flex-start" }}>

        {/* Sidebar */}
        <aside className="tu-sidebar" style={{ width:250, flexShrink:0, position:"sticky", top:72 }}>
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 10px", boxShadow:"0 1px 4px rgba(0,0,0,.05)", maxHeight:"calc(100vh - 100px)", overflowY:"auto" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5, padding:"0 12px", marginBottom:10 }}>Table of Contents</div>
            {SECTIONS.map(s => (
              <button key={s.id} className={`tu-nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                <span style={{ fontSize:13 }}>{s.icon}</span>
                <span style={{ fontSize:12 }}>{s.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex:1, minWidth:0 }}>

          {/* 1. Acceptance */}
          <div id="acceptance" className="tu-section" ref={setRef("acceptance")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">✅ 1. Acceptance of Terms</h2>
              <div className="tu-highlight">⚠️ Please read these Terms of Use carefully before using the Law4u platform. By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part, please do not use the platform.</div>
              <S>These Terms of Use ("Terms") constitute a legally binding agreement between you ("User") and {COMPANY} ("Law4u", "we", "us", "our") governing your access to and use of the Law4u website (www.law4u.in), mobile application, and all associated services (collectively, "the Platform").</S>
              <S>These Terms apply to all users of the Platform, including registered advocates, clients seeking legal assistance, and visitors browsing the website. Additional terms may apply to specific services and will be presented to you at the time of use.</S>
              <S>Your continued use of the Platform after any modification to these Terms constitutes your acceptance of the revised Terms. These Terms were last updated on {LAST_UPDATED} and are effective as of {EFFECTIVE_DATE}.</S>
            </div>
          </div>

          {/* 2. Definitions */}
          <div id="definitions" className="tu-section" ref={setRef("definitions")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">📖 2. Definitions</h2>
              <S>For the purposes of these Terms, the following definitions shall apply:</S>
              <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"6px 16px" }}>
                {[
                  { term:'"Platform"',       def:'The Law4u website, mobile applications, APIs, and all related services operated by the Company.' },
                  { term:'"User"',           def:'Any individual who accesses or uses the Platform, whether registered or not.' },
                  { term:'"Advocate"',       def:'A lawyer or legal professional enrolled with a Bar Council in India who registers on the Platform to offer legal services.' },
                  { term:'"Client"',         def:'An individual or entity who uses the Platform to seek legal advice, consultation, or assistance from an Advocate.' },
                  { term:'"Services"',       def:'The legal marketplace, consultation, document drafting, Q&A, Bare Acts, and related features offered through the Platform.' },
                  { term:'"Consultation"',   def:'A session (in-person, video, or phone) between an Advocate and a Client facilitated through the Platform.' },
                  { term:'"Content"',        def:'All text, data, information, images, reviews, questions, answers, and other materials posted, uploaded, or transmitted through the Platform.' },
                  { term:'"Fees"',           def:'Charges payable by a Client to an Advocate for consultation, and platform commission charged by Law4u.' },
                  { term:'"Account"',        def:'A registered profile created by a User on the Platform.' },
                  { term:'"Verification"',   def:'The process by which Law4u confirms an Advocate\'s credentials with Bar Council records.' },
                ].map(row => (
                  <div key={row.term} className="tu-def-row">
                    <span className="tu-def-term">{row.term}</span>
                    <span className="tu-def-val">{row.def}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Eligibility */}
          <div id="eligibility" className="tu-section" ref={setRef("eligibility")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">👤 3. Eligibility</h2>
              <S>To use the Law4u Platform, you must meet the following eligibility requirements:</S>
              <B>General Users (Clients)</B>
              <Li>You must be at least 18 years of age or the age of majority in your jurisdiction.</Li>
              <Li>You must have the legal capacity to enter into binding contracts under Indian law.</Li>
              <Li>You must not be prohibited from using the Platform by applicable law.</Li>
              <Li>You must provide accurate, complete, and current information during registration.</Li>
              <B>Advocates</B>
              <Li>You must be a duly enrolled advocate with a State Bar Council or the Bar Council of India.</Li>
              <Li>You must hold a valid Certificate of Practice (Sanad) at the time of registration and throughout your use of the Platform.</Li>
              <Li>You must not be under any suspension, disqualification, or disciplinary proceedings that would prevent you from practising law.</Li>
              <Li>You must comply with the Bar Council of India Rules, 1975, and all applicable professional conduct rules.</Li>
              <Li>You must submit accurate credentials and consent to verification of your Bar enrollment number.</Li>
              <div className="tu-warning-box">⚠️ Law4u reserves the right to terminate any account where eligibility requirements are found to be unmet, at any time and without notice.</div>
            </div>
          </div>

          {/* 4. Platform Description */}
          <div id="platform-desc" className="tu-section" ref={setRef("platform-desc")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🏛️ 4. Platform Description</h2>
              <div className="tu-info-box">ℹ️ Law4u is a technology platform that connects clients with advocates. Law4u is NOT a law firm and does NOT provide legal advice.</div>
              <S>Law4u operates as an online marketplace and technology intermediary that connects individuals seeking legal assistance ("Clients") with licensed legal professionals ("Advocates"). Law4u facilitates this connection but is not a party to any client-advocate relationship or legal engagement.</S>
              <B>What Law4u Provides:</B>
              <Li>A searchable directory of verified advocates categorised by speciality, location, and court experience.</Li>
              <Li>Tools for scheduling consultations via video call, phone, or in-person meetings.</Li>
              <Li>A secure messaging system for client-advocate communication.</Li>
              <Li>Legal Q&A forums where users can post questions and advocates can provide answers.</Li>
              <Li>Access to Bare Acts, legal documents, templates, and educational legal content.</Li>
              <Li>Payment processing infrastructure for consultation fees.</Li>
              <Li>Review and rating systems for advocates.</Li>
              <B>What Law4u Does NOT Provide:</B>
              <Li>Legal advice, legal opinions, or representation of any kind.</Li>
              <Li>Guarantee of the quality, accuracy, or outcome of any legal advice provided by advocates.</Li>
              <Li>Attorney-client privilege as a platform intermediary.</Li>
              <Li>Assurance of specific legal outcomes or results.</Li>
            </div>
          </div>

          {/* 5. Account Registration */}
          <div id="registration" className="tu-section" ref={setRef("registration")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">📝 5. Account Registration</h2>
              <S>To access most features of the Platform, you must create an account. By registering, you agree to the following:</S>
              <Li>You will provide accurate, complete, and current information during registration and keep it updated.</Li>
              <Li>You will maintain the confidentiality of your account credentials and not share them with any third party.</Li>
              <Li>You are responsible for all activities that occur under your account, whether authorised by you or not.</Li>
              <Li>You will immediately notify Law4u of any unauthorised use of your account at legal@law4u.in.</Li>
              <Li>You will not create multiple accounts without express permission from Law4u.</Li>
              <Li>You will not impersonate any person, advocate, or entity on the Platform.</Li>
              <Li>You consent to receive service communications, notifications, and (optionally) promotional messages.</Li>
              <div className="tu-highlight">Law4u reserves the right to refuse registration, suspend, or terminate any account at its sole discretion, particularly in cases of suspected fraud, misrepresentation, or violation of these Terms.</div>
            </div>
          </div>

          {/* 6. Advocate Terms */}
          <div id="advocate-terms" className="tu-section" ref={setRef("advocate-terms")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">⚖️ 6. Advocate-Specific Terms</h2>
              <S>Advocates registered on Law4u are subject to these additional terms, in addition to the general terms applicable to all users.</S>
              <B>6.1 Professional Conduct</B>
              <Li>All advocates must comply with the Bar Council of India Rules on Professional Standards and Conduct of Advocates at all times.</Li>
              <Li>Advocates must not engage in solicitation of clients in a manner that violates BCI Rules or any applicable law.</Li>
              <Li>Advocates must maintain confidentiality of all client information in accordance with professional privilege.</Li>
              <Li>Advocates must not guarantee specific legal outcomes to clients.</Li>
              <Li>Advocates must disclose any conflicts of interest before accepting a client engagement.</Li>
              <B>6.2 Profile and Credentials</B>
              <Li>All information in an advocate's profile must be accurate and up-to-date.</Li>
              <Li>Advocates consent to Law4u verifying their credentials with Bar Council records at any time.</Li>
              <Li>Advocates must promptly update their profiles upon any change in enrolment status, suspension, or disciplinary proceedings.</Li>
              <Li>Falsification of credentials will result in immediate permanent suspension and may be reported to the relevant Bar Council.</Li>
              <B>6.3 Consultations and Availability</B>
              <Li>Advocates must honour confirmed consultation appointments. Repeated cancellations may result in account restrictions.</Li>
              <Li>Advocates must maintain their stated availability on the Platform or update it in a timely manner.</Li>
              <Li>Advocates must clearly communicate their fee structure to clients before commencing any paid service.</Li>
              <B>6.4 Commission and Payments</B>
              <Li>Law4u charges a platform commission of up to 20% on consultation fees processed through the Platform.</Li>
              <Li>Payouts to advocates are processed within 7 business days of completed consultation.</Li>
              <Li>Advocates may not solicit direct payments outside the platform for services facilitated through the Platform.</Li>
              <div className="tu-success-box">✅ Advocates who maintain high ratings, verified credentials, and compliance with these terms will be eligible for "Law4u Verified" and "Law4u Premier" badges.</div>
            </div>
          </div>

          {/* 7. Client Terms */}
          <div id="client-terms" className="tu-section" ref={setRef("client-terms")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🙋 7. Client-Specific Terms</h2>
              <S>Clients using Law4u to seek legal assistance are subject to these additional terms:</S>
              <B>7.1 Nature of Services</B>
              <Li>The legal advice obtained through Law4u is provided by independent advocates and does not create an attorney-client relationship with Law4u.</Li>
              <Li>Clients are responsible for evaluating the quality and suitability of advice received from advocates.</Li>
              <Li>Law4u does not endorse any specific advocate or guarantee the outcome of any legal matter.</Li>
              <B>7.2 Responsibility for Decisions</B>
              <Li>Clients make legal decisions independently and are not obligated to follow any advice received through the Platform.</Li>
              <Li>Clients should verify the advice received through the Platform with a qualified advocate of their choice before taking any significant legal action.</Li>
              <Li>Law4u is not liable for any decisions made based on advice obtained through the Platform.</Li>
              <B>7.3 Client Conduct</B>
              <Li>Clients must be truthful and provide accurate information about their legal matters to advocates.</Li>
              <Li>Clients must not use the Platform to harass, threaten, or intimidate advocates.</Li>
              <Li>Clients must respect advocate availability and not contact advocates outside of the Platform for matters facilitated through Law4u.</Li>
              <Li>Clients must not post false or malicious reviews of advocates.</Li>
              <div className="tu-info-box">ℹ️ If you are dissatisfied with an advocate, contact Law4u support at legal@law4u.in within 48 hours of the consultation for dispute resolution assistance.</div>
            </div>
          </div>

          {/* 8. Fees and Payments */}
          <div id="fees-payment" className="tu-section" ref={setRef("fees-payment")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">💰 8. Fees and Payments</h2>
              <table className="tu-table">
                <thead>
                  <tr>
                    <th>Fee Type</th>
                    <th>Description</th>
                    <th>Who Pays</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type:"Consultation Fee",      desc:"Set by advocate. Varies by speciality and experience.",  who:"Client" },
                    { type:"Platform Commission",   desc:"Up to 20% of consultation fee deducted from advocate payout.", who:"Advocate" },
                    { type:"GST",                  desc:"18% GST applicable on platform commission as per Indian tax law.", who:"Advocate" },
                    { type:"Premium Subscription", desc:"Optional plan for advocates — enhanced visibility, priority listing.", who:"Advocate" },
                    { type:"Document Download",    desc:"Free for basic templates; fee applicable for premium documents.", who:"Client" },
                  ].map(row => (
                    <tr key={row.type}>
                      <td style={{ fontWeight:600 }}>{row.type}</td>
                      <td>{row.desc}</td>
                      <td><span style={{ background:"#eff6ff", color:"#1d4ed8", padding:"2px 9px", borderRadius:12, fontSize:12, fontWeight:600 }}>{row.who}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <B>Refund Policy</B>
              <Li>If an advocate fails to attend a scheduled consultation without notice, the client is entitled to a full refund.</Li>
              <Li>Refunds for completed consultations are at Law4u's discretion and subject to review of the circumstances.</Li>
              <Li>No refunds are issued for no-shows by clients without prior cancellation of at least 2 hours.</Li>
              <Li>Refund requests must be submitted within 48 hours of the scheduled consultation via legal@law4u.in.</Li>
              <Li>Refunds are processed within 5–10 business days to the original payment method.</Li>
            </div>
          </div>

          {/* 9. Prohibited Conduct */}
          <div id="prohibited" className="tu-section" ref={setRef("prohibited")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🚫 9. Prohibited Conduct</h2>
              <S>The following conduct is strictly prohibited on the Law4u Platform:</S>
              {[
                { icon:"🪪", title:"Impersonation",            desc:"Impersonating any advocate, legal professional, Law4u employee, or other person or entity." },
                { icon:"❌", title:"False Credentials",        desc:"Providing false Bar enrollment numbers, fake qualifications, or misrepresenting professional status." },
                { icon:"💸", title:"Fee Circumvention",        desc:"Attempting to arrange payments outside the Law4u Platform for services facilitated through the Platform." },
                { icon:"🤬", title:"Harassment",               desc:"Harassing, threatening, abusing, or intimidating any user, advocate, or Law4u staff member." },
                { icon:"🤖", title:"Automated Scraping",       desc:"Using bots, scrapers, or automated tools to extract data from the Platform without permission." },
                { icon:"🔓", title:"Unauthorized Access",      desc:"Attempting to access another user's account, circumvent security measures, or exploit Platform vulnerabilities." },
                { icon:"📢", title:"Spam & Solicitation",      desc:"Sending unsolicited messages, spam, or bulk communications to other users through the Platform." },
                { icon:"💊", title:"Illegal Services",         desc:"Using the Platform to facilitate services that are illegal, fraudulent, or contrary to public policy." },
                { icon:"🎭", title:"False Reviews",            desc:"Posting fake, misleading, or maliciously false reviews of advocates or clients." },
                { icon:"🔞", title:"Inappropriate Content",   desc:"Posting obscene, defamatory, hateful, or sexually explicit content on any part of the Platform." },
              ].map(item => (
                <div key={item.title} className="tu-prohibited-item">
                  <span className="tu-proh-icon">{item.icon}</span>
                  <div>
                    <div className="tu-proh-title">{item.title}</div>
                    <div className="tu-proh-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
              <div className="tu-warning-box">Violation of any of the above may result in immediate account suspension, permanent ban from the Platform, and/or legal action.</div>
            </div>
          </div>

          {/* 10. Content & IP */}
          <div id="content" className="tu-section" ref={setRef("content")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">📄 10. User Content & Intellectual Property</h2>
              <B>10.1 Ownership of Law4u Content</B>
              <S>All content on the Law4u Platform, including but not limited to the website design, logos, trademarks, software, text, graphics, and databases, is owned by or licensed to Law4u and is protected by Indian and international intellectual property laws. You may not reproduce, distribute, or create derivative works from Law4u's content without express written permission.</S>
              <B>10.2 User-Generated Content</B>
              <Li>By posting content on the Platform (reviews, Q&A answers, profile information), you grant Law4u a non-exclusive, royalty-free, worldwide licence to use, display, and distribute that content for Platform purposes.</Li>
              <Li>You represent that you own or have the rights to all content you post and that it does not infringe any third-party rights.</Li>
              <Li>Law4u may remove any user content that violates these Terms or is otherwise objectionable, without notice.</Li>
              <B>10.3 Legal Documents and Templates</B>
              <Li>Document templates on Law4u are provided for reference purposes only. They must be reviewed and adapted by a qualified advocate before use in any legal proceeding.</Li>
              <Li>Law4u does not warrant the accuracy, completeness, or fitness for purpose of any document template.</Li>
              <B>10.4 Bare Acts and Legal Information</B>
              <Li>Bare Acts and legal information on the Platform are reproduced from publicly available official sources for informational purposes only.</Li>
              <Li>Always verify against official government sources for the most current and authoritative text of any law.</Li>
            </div>
          </div>

          {/* 11. Disclaimers */}
          <div id="disclaimers" className="tu-section" ref={setRef("disclaimers")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">⚠️ 11. Disclaimers</h2>
              <div className="tu-warning-box">⚠️ THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</div>
              <Li>Law4u does not warrant that the Platform will be available, uninterrupted, error-free, or free of viruses or other harmful components.</Li>
              <Li>Law4u does not warrant the accuracy, completeness, or reliability of any content on the Platform, including legal advice provided by advocates.</Li>
              <Li>The legal information on the Platform is for general informational purposes only and does not constitute legal advice.</Li>
              <Li>Law4u is not responsible for the professional conduct, competence, or qualifications of any advocate listed on the Platform beyond the credential verification process.</Li>
              <Li>Law4u does not guarantee that any legal matter will be resolved successfully as a result of using the Platform.</Li>
              <Li>The outcome of any legal consultation, advice, or representation facilitated through the Platform is the sole responsibility of the respective advocate.</Li>
              <Li>Court listings, jurisdiction information, and legal updates on the Platform may not always reflect the most current legal position.</Li>
            </div>
          </div>

          {/* 12. Limitation of Liability */}
          <div id="liability" className="tu-section" ref={setRef("liability")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🛡️ 12. Limitation of Liability</h2>
              <S>To the maximum extent permitted by applicable law:</S>
              <Li>Law4u's total aggregate liability to any user for any claim arising out of or relating to these Terms or use of the Platform shall not exceed the greater of (a) ₹5,000 or (b) the total amount paid by the user to Law4u in the 3 months preceding the claim.</Li>
              <Li>Law4u shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform.</Li>
              <Li>Law4u shall not be liable for any loss of profits, revenue, data, goodwill, or other intangible losses.</Li>
              <Li>Law4u shall not be liable for any damages arising from the conduct or advice of any advocate on the Platform.</Li>
              <Li>Law4u shall not be liable for any technical failures, data breaches, or platform outages beyond its reasonable control.</Li>
              <div className="tu-info-box">ℹ️ Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such cases, our liability will be limited to the minimum extent permitted by law.</div>
            </div>
          </div>

          {/* 13. Indemnification */}
          <div id="indemnification" className="tu-section" ref={setRef("indemnification")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🤝 13. Indemnification</h2>
              <S>You agree to indemnify, defend, and hold harmless Law4u, its directors, officers, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:</S>
              <Li>Your violation of these Terms of Use.</Li>
              <Li>Your violation of any applicable law or regulation.</Li>
              <Li>Your user content or any infringement of intellectual property rights.</Li>
              <Li>Your conduct as an advocate or client in connection with the Platform.</Li>
              <Li>Any misrepresentation made by you to Law4u or other users of the Platform.</Li>
              <Li>Any claim by a third party arising from your use of the Platform.</Li>
            </div>
          </div>

          {/* 14. Termination */}
          <div id="termination" className="tu-section" ref={setRef("termination")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🔚 14. Account Termination</h2>
              <B>14.1 Termination by User</B>
              <S>You may terminate your account at any time by contacting legal@law4u.in or using the account deletion option in your settings. Upon account deletion, your profile will be removed from public view. Certain data will be retained as required by applicable law (see our Privacy Policy).</S>
              <B>14.2 Termination by Law4u</B>
              <S>Law4u reserves the right to suspend or permanently terminate your account, without notice or liability, if:</S>
              <Li>You breach any provision of these Terms.</Li>
              <Li>You provide false or misleading information during registration.</Li>
              <Li>Your conduct causes harm to the Platform, other users, or third parties.</Li>
              <Li>You engage in any prohibited conduct listed in Section 9.</Li>
              <Li>Your Bar enrollment is suspended or cancelled (for advocates).</Li>
              <Li>You receive consistently poor ratings or verified complaints of professional misconduct.</Li>
              <B>14.3 Effect of Termination</B>
              <Li>All licences granted to you under these Terms will immediately terminate.</Li>
              <Li>Pending consultation fees owed to verified advocates will be paid out after deduction of any outstanding amounts.</Li>
              <Li>Client consultation fees for cancelled consultations will be refunded in accordance with the Refund Policy in Section 8.</Li>
            </div>
          </div>

          {/* 15. Dispute Resolution */}
          <div id="dispute" className="tu-section" ref={setRef("dispute")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">🏛️ 15. Dispute Resolution</h2>
              <B>15.1 Internal Resolution</B>
              <S>Before commencing any formal dispute resolution process, you agree to first attempt to resolve any dispute with Law4u through our internal grievance mechanism by contacting legal@law4u.in. Law4u will attempt to resolve the dispute within 30 days.</S>
              <B>15.2 Mediation</B>
              <S>If the dispute is not resolved through internal mechanisms within 30 days, the parties agree to attempt resolution through mediation before a mutually agreed mediator in Bengaluru, Karnataka.</S>
              <B>15.3 Arbitration</B>
              <S>Any dispute, controversy, or claim arising out of or relating to these Terms, or breach thereof, that cannot be resolved through mediation shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Bengaluru, Karnataka. The language of arbitration shall be English.</S>
              <B>15.4 Jurisdiction for Court Proceedings</B>
              <S>Notwithstanding the above, either party may seek injunctive or other equitable relief in the courts of Bengaluru, Karnataka, India. Both parties submit to the exclusive jurisdiction of the courts at Bengaluru for any such proceedings.</S>
            </div>
          </div>

          {/* 16. Governing Law */}
          <div id="governing-law" className="tu-section" ref={setRef("governing-law")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">📜 16. Governing Law</h2>
              <S>These Terms of Use are governed by and construed in accordance with the laws of India, including but not limited to:</S>
              <Li>The Information Technology Act, 2000 and rules thereunder.</Li>
              <Li>The Digital Personal Data Protection Act, 2023.</Li>
              <Li>The Consumer Protection Act, 2019.</Li>
              <Li>The Indian Contract Act, 1872.</Li>
              <Li>The Bharatiya Nyaya Sanhita, 2023 (for criminal offences committed through the Platform).</Li>
              <Li>The Advocates Act, 1961 and Bar Council of India Rules (for advocate conduct).</Li>
              <S>Any disputes shall be subject to the exclusive jurisdiction of competent courts in Bengaluru, Karnataka, India.</S>
            </div>
          </div>

          {/* 17. Modifications */}
          <div id="modifications" className="tu-section" ref={setRef("modifications")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">✏️ 17. Modifications to Terms</h2>
              <S>Law4u reserves the right to modify these Terms of Use at any time. We will provide notice of material changes through:</S>
              <Li>Email notification to your registered email address at least 7 days before changes take effect.</Li>
              <Li>Prominent notice on the Platform homepage or login page.</Li>
              <Li>In-app notification through the Law4u mobile application.</Li>
              <S>Your continued use of the Platform after the effective date of revised Terms constitutes your acceptance of the changes. If you do not agree to the revised Terms, you must cease using the Platform and may request account deletion.</S>
              <S>Previous versions of these Terms are maintained in our archive and may be requested by contacting legal@law4u.in.</S>
            </div>
          </div>

          {/* 18. General */}
          <div id="general" className="tu-section" ref={setRef("general")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">📋 18. General Provisions</h2>
              <B>Entire Agreement</B>
              <S>These Terms, together with the Privacy Policy and any additional terms applicable to specific services, constitute the entire agreement between you and Law4u regarding your use of the Platform and supersede all prior agreements.</S>
              <B>Severability</B>
              <S>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.</S>
              <B>Waiver</B>
              <S>Law4u's failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision unless acknowledged in writing by Law4u.</S>
              <B>Assignment</B>
              <S>You may not assign or transfer your rights or obligations under these Terms without Law4u's prior written consent. Law4u may assign its rights and obligations under these Terms to any successor entity in connection with a merger, acquisition, or sale of assets.</S>
              <B>Force Majeure</B>
              <S>Law4u shall not be liable for any failure or delay in performance resulting from causes beyond its reasonable control, including natural disasters, pandemics, government actions, internet failures, or power outages.</S>
              <B>Language</B>
              <S>These Terms are written in English. If translated into any other language, the English version shall prevail in case of any conflict.</S>
            </div>
          </div>

          {/* 19. Contact */}
          <div id="contact" className="tu-section" ref={setRef("contact")}>
            <div className="tu-card">
              <h2 className="tu-sec-title">📬 19. Contact Information</h2>
              <S>For any questions, concerns, or notices regarding these Terms of Use, please contact us at:</S>
              <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, padding:"18px 20px" }}>
                {[
                  { icon:"🏢", label:"Company",  val: COMPANY },
                  { icon:"✉️", label:"Email",    val: EMAIL },
                  { icon:"📍", label:"Address",  val: ADDRESS },
                  { icon:"⚖️", label:"Legal",    val: "legal@law4u.in" },
                  { icon:"🔒", label:"Privacy",  val: "privacy@law4u.in" },
                  { icon:"🌐", label:"Website",  val: "www.law4u.in/terms" },
                ].map(row => (
                  <div key={row.label} className="tu-contact-row">
                    <span style={{ fontSize:16 }}>{row.icon}</span>
                    <span style={{ color:"#64748b", minWidth:80, flexShrink:0 }}>{row.label}</span>
                    <span style={{ color:"#1e293b", fontWeight:500 }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acceptance banner */}
          <div style={{ background: accepted ? "#f0fdf4" : "#fff", border:`2px solid ${accepted ? "#22c55e" : "#e2e8f0"}`, borderRadius:12, padding:"20px 24px", textAlign:"center" }}>
            <div style={{ fontSize:16, fontWeight:700, color:"#1e293b", marginBottom:8 }}>
              {accepted ? "✅ You have accepted the Terms of Use" : "Have you read the Terms?"}
            </div>
            <p style={{ fontSize:13, color:"#64748b", marginBottom:14 }}>
              By using the Law4u Platform, you agree to these Terms of Use effective {EFFECTIVE_DATE}.
            </p>
            {!accepted && (
              <button
                onClick={() => setAccepted(true)}
                style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:9, padding:"11px 32px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                I Accept the Terms of Use
              </button>
            )}
            {accepted && (
              <div style={{ fontSize:13, color:"#16a34a", fontWeight:600 }}>
                Thank you. You can now use all features of the Law4u Platform.
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 24px", textAlign:"center", fontSize:13, color:"#64748b", lineHeight:1.7, marginTop:20 }}>
            These Terms of Use are effective as of <strong>{EFFECTIVE_DATE}</strong> and were last updated on <strong>{LAST_UPDATED}</strong>.<br />
            <span style={{ color:"#16a34a", fontWeight:600 }}>© 2026 {COMPANY}. All rights reserved.</span>
          </div>

        </main>
      </div>
    </div>
  );
}