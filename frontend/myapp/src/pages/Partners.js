// ============================================================
//  Partners.js  —  Law4u / AdvocatesHub "Partners" Page
//  Submissions are saved via messagesStore and appear live on
//  the Admin page's "Messages" tab.
// ============================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { addMessage } from "../data/MessageStore";
import "./Partners.css";

const PARTNER_TYPES = [
  {
    icon: "⚖️",
    title: "Law Firms",
    desc: "Bring your entire firm onto AdvocatesHub and manage client requests for every advocate in one dashboard.",
  },
  {
    icon: "🏫",
    title: "Bar Associations",
    desc: "Partner with us to help verified members reach more clients and grow their practice online.",
  },
  {
    icon: "🏢",
    title: "Corporates & NGOs",
    desc: "Get priority access to vetted advocates for recurring legal needs, compliance, and pro-bono programs.",
  },
  {
    icon: "💻",
    title: "LegalTech Platforms",
    desc: "Integrate our advocate network and verification system into your own product via API.",
  },
];

const CURRENT_PARTNERS = [
  { initials: "BCI", name: "Bar Council of India",         color: "#2563eb" },
  { initials: "BCK", name: "Bar Council of Karnataka",     color: "#16a34a" },
  { initials: "LAF", name: "Legal Aid Foundation",         color: "#7c3aed" },
  { initials: "NLI", name: "National Legal Initiative",    color: "#dc2626" },
];

const BENEFITS = [
  "Priority listing for your advocates and firm",
  "Dedicated partner support and onboarding",
  "Co-branded legal awareness campaigns",
  "Early access to new platform features",
];

function TypeCard({ icon, title, desc }) {
  return (
    <div className="pt-type-card">
      <div className="pt-type-icon">{icon}</div>
      <h3 className="pt-type-title">{title}</h3>
      <p className="pt-type-desc">{desc}</p>
    </div>
  );
}

function PartnerBadge({ initials, name, color }) {
  return (
    <div className="pt-partner-badge">
      <div className="pt-partner-avatar" style={{ background: color }}>{initials}</div>
      <div className="pt-partner-name">{name}</div>
    </div>
  );
}

export default function Partners() {
  const [form, setForm] = useState({ orgName: "", contactName: "", email: "", type: "", message: "" });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.orgName.trim()) e.orgName = "Organization name is required";
    if (!form.contactName.trim()) e.contactName = "Contact person is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format";
    if (!form.type) e.type = "Select a partnership type";
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    // Persist the inquiry so it shows up on the Admin page's Messages tab
    setTimeout(() => {
      addMessage({
        type: "partner",
        orgName: form.orgName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim().toLowerCase(),
        partnershipType: form.type,
        message: form.message.trim() || "(No additional details provided)",
      });

      setSending(false);
      setSent(true);
      setForm({ orgName: "", contactName: "", email: "", type: "", message: "" });
    }, 500);
  };

  return (
    <div className="pt-page">

      {/* Hero */}
      <section className="pt-hero">
        <span className="pt-hero-badge">🤝 Partnerships</span>
        <h1 className="pt-hero-title">Let's Build Access to Justice Together</h1>
        <p className="pt-hero-sub">
          We partner with law firms, bar associations, and organizations to expand access to
          trustworthy legal help across India.
        </p>
      </section>

      <div className="pt-container">

        {/* Partner types */}
        <section>
          <h2 className="pt-section-title">Who We Partner With</h2>
          <div className="pt-types-grid">
            {PARTNER_TYPES.map((t) => <TypeCard key={t.title} {...t} />)}
          </div>
        </section>

        {/* Current partners */}
        <section className="pt-current-section">
          <h2 className="pt-section-title">Our Current Partners</h2>
          <div className="pt-partners-grid">
            {CURRENT_PARTNERS.map((p) => <PartnerBadge key={p.name} {...p} />)}
          </div>
        </section>

        <div className="pt-split">

          {/* Benefits */}
          <div className="pt-benefits-card">
            <h2 className="pt-section-title">Why Partner With Us</h2>
            <ul className="pt-benefits-list">
              {BENEFITS.map((b) => (
                <li key={b}><span className="pt-check">✓</span> {b}</li>
              ))}
            </ul>
            <p className="pt-benefits-note">
              Already an advocate looking to join individually?{" "}
              <Link to="/signup" className="pt-inline-link">Sign up here</Link> instead.
            </p>
          </div>

          {/* Partnership inquiry form */}
          <div className="pt-form-card">
            {sent ? (
              <div className="pt-sent">
                <div className="pt-sent-icon">✅</div>
                <h3>Inquiry Sent!</h3>
                <p>Thanks for your interest — our partnerships team will reach out soon.</p>
                <button className="pt-btn-primary" onClick={() => setSent(false)}>Submit Another Inquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="pt-form-title">Become a Partner</h2>

                <div className="pt-field">
                  <label>Organization Name *</label>
                  <input value={form.orgName} onChange={(e) => setF("orgName", e.target.value)} disabled={sending} />
                  {err.orgName && <p className="pt-err">⚠ {err.orgName}</p>}
                </div>

                <div className="pt-grid-2">
                  <div className="pt-field">
                    <label>Contact Person *</label>
                    <input value={form.contactName} onChange={(e) => setF("contactName", e.target.value)} disabled={sending} />
                    {err.contactName && <p className="pt-err">⚠ {err.contactName}</p>}
                  </div>
                  <div className="pt-field">
                    <label>Email Address *</label>
                    <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} disabled={sending} />
                    {err.email && <p className="pt-err">⚠ {err.email}</p>}
                  </div>
                </div>

                <div className="pt-field">
                  <label>Partnership Type *</label>
                  <select value={form.type} onChange={(e) => setF("type", e.target.value)} disabled={sending}>
                    <option value="">Select type</option>
                    <option value="Law Firm">Law Firm</option>
                    <option value="Bar Association">Bar Association</option>
                    <option value="Corporate / NGO">Corporate / NGO</option>
                    <option value="LegalTech Platform">LegalTech Platform</option>
                    <option value="Other">Other</option>
                  </select>
                  {err.type && <p className="pt-err">⚠ {err.type}</p>}
                </div>

                <div className="pt-field">
                  <label>Tell us more</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setF("message", e.target.value)} disabled={sending} />
                </div>

                <button type="submit" className="pt-btn-primary pt-btn-lg" disabled={sending}>
                  {sending ? "Sending…" : "Submit Inquiry →"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}