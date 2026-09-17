// ============================================================
//  Contact.js  —  Law4u / AdvocatesHub "Contact Us" Page
//  Submissions are saved via messagesStore and appear live on
//  the Admin page's "Messages" tab.
// ============================================================

import React, { useState } from "react";
import { addMessage } from "../data/MessageStore";
import "./Contact.css";

const CONTACT_INFO = [
  { icon: "📞", label: "Call Us",   value: "+91 91087 17353", hint: "Mon–Sat, 9am – 7pm IST" },
  { icon: "✉️", label: "Email Us",  value: "support@advocateshub.in", hint: "We reply within 24 hours" },
  { icon: "📍", label: "Head Office", value: "Gokak, Bengaluru, Karnataka", hint: "By appointment only" },
];

const FAQS = [
  { q: "How do I find an advocate near me?", a: "Use the \"Find A Lawyer\" menu to search by city, practice area, or legal issue." },
  { q: "Is registering as an advocate free?", a: "Yes, creating an advocate profile is free. Your account is reviewed and approved by our team before it goes live." },
  { q: "How fast will an advocate respond?", a: "Most advocates respond to consultation requests within 24 hours." },
];

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function InfoCard({ icon, label, value, hint }) {
  return (
    <div className="ct-info-card">
      <div className="ct-info-icon">{icon}</div>
      <div>
        <div className="ct-info-label">{label}</div>
        <div className="ct-info-value">{value}</div>
        <div className="ct-info-hint">{hint}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ct-faq-item ${open ? "open" : ""}`} onClick={() => setOpen((p) => !p)}>
      <div className="ct-faq-q">
        <span>{q}</span>
        <span className="ct-faq-arrow">{open ? "−" : "+"}</span>
      </div>
      {open && <div className="ct-faq-a">{a}</div>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format";
    if (!form.message.trim()) e.message = "Please write a message";
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    // Persist the enquiry so it shows up on the Admin page's Messages tab
    setTimeout(() => {
      addMessage({
        type: "contact",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        subject: form.subject.trim() || "(No subject)",
        message: form.message.trim(),
      });

      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 500);
  };

  return (
    <div className="ct-page">

      {/* Hero */}
      <section className="ct-hero">
        <span className="ct-hero-badge">📩 Get In Touch</span>
        <h1 className="ct-hero-title">We'd Love to Hear From You</h1>
        <p className="ct-hero-sub">
          Questions about finding an advocate, registering your practice, or anything else — reach out.
        </p>
      </section>

      <div className="ct-container">

        {/* Contact info cards */}
        <div className="ct-info-grid">
          {CONTACT_INFO.map((c) => <InfoCard key={c.label} {...c} />)}
        </div>

        <div className="ct-body-grid">

          {/* Contact form */}
          <div className="ct-form-card">
            {sent ? (
              <div className="ct-sent">
                <div className="ct-sent-icon">✅</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out — our team will get back to you shortly.</p>
                <button className="ct-btn-primary" onClick={() => setSent(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="ct-form-title">Send Us a Message</h2>

                <div className="ct-grid-2">
                  <div className="ct-field">
                    <label>Full Name *</label>
                    <input value={form.name} onChange={(e) => setF("name", e.target.value)} disabled={sending} />
                    {err.name && <p className="ct-err">⚠ {err.name}</p>}
                  </div>
                  <div className="ct-field">
                    <label>Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setF("phone", e.target.value)} maxLength={10} disabled={sending} />
                  </div>
                </div>

                <div className="ct-field">
                  <label>Email Address *</label>
                  <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} disabled={sending} />
                  {err.email && <p className="ct-err">⚠ {err.email}</p>}
                </div>

                <div className="ct-field">
                  <label>Subject</label>
                  <input value={form.subject} onChange={(e) => setF("subject", e.target.value)} placeholder="What's this about?" disabled={sending} />
                </div>

                <div className="ct-field">
                  <label>Message *</label>
                  <textarea rows={5} value={form.message} onChange={(e) => setF("message", e.target.value)} disabled={sending} />
                  {err.message && <p className="ct-err">⚠ {err.message}</p>}
                </div>

                <button type="submit" className="ct-btn-primary ct-btn-lg" disabled={sending}>
                  {sending ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div className="ct-faq-card">
            <h2 className="ct-form-title">Frequently Asked</h2>
            <div className="ct-faq-list">
              {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}