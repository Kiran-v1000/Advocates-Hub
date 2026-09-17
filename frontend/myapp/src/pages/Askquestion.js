// AskQuestion.js — Ask a Legal Question Page
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Askquestion.css";
import { getAdvocates } from "../data/Advocatesstore";
import { addQuestion } from "../data/QuestionStore";

const CATEGORIES = [
  { icon: "👨‍👩‍👧", label: "Family Law",      sub: "Divorce, custody, maintenance" },
  { icon: "🔒",      label: "Criminal Law",    sub: "FIR, bail, arrest, POCSO" },
  { icon: "🏠",      label: "Property Law",    sub: "Dispute, title, RERA" },
  { icon: "⚖️",      label: "Civil Law",       sub: "Suits, injunction, recovery" },
  { icon: "🏢",      label: "Corporate Law",   sub: "Company, compliance, GST" },
  { icon: "💰",      label: "Tax Law",         sub: "Income tax, GST, returns" },
  { icon: "👷",      label: "Labour Law",      sub: "Termination, PF, ESIC" },
  { icon: "📦",      label: "Consumer Law",    sub: "Refund, product, e-commerce" },
  { icon: "💻",      label: "Cyber Law",       sub: "Online fraud, IT Act" },
  { icon: "✈️",      label: "Immigration",     sub: "Visa, OCI, citizenship" },
  { icon: "🏦",      label: "Banking Law",     sub: "SARFAESI, DRT, fraud" },
  { icon: "📋",      label: "Other",           sub: "Any other legal matter" },
];

const RECENT_QUESTIONS = [
  { id: 1, question: "My landlord is not returning security deposit after 3 months of vacating. What can I do?", category: "Civil Law",    answers: 4, time: "2 hours ago",   avatar: "RK", color: "#2563eb" },
  { id: 2, question: "My husband filed for divorce. Do I get custody of my 4-year-old child automatically?",     category: "Family Law",  answers: 6, time: "5 hours ago",   avatar: "PS", color: "#16a34a" },
  { id: 3, question: "A cheque of ₹2 lakh given by my business partner bounced. What is the legal process?",     category: "Civil Law",   answers: 8, time: "Yesterday",     avatar: "AV", color: "#7c3aed" },
  { id: 4, question: "I was falsely accused in a criminal case. How do I get anticipatory bail?",                 category: "Criminal Law",answers: 5, time: "2 days ago",    avatar: "DR", color: "#dc2626" },
  { id: 5, question: "Builder has not delivered flat after 3 years. Can I file a RERA complaint?",               category: "Property Law",answers: 7, time: "3 days ago",    avatar: "SN", color: "#ea580c" },
];

const getExpertAdvocates = () => getAdvocates().slice(0, 3).map((advocate, index) => ({
  ...advocate,
  spec: advocate.speciality,
  answers: advocate.cases,
  initials: advocate.name
    .replace(/^Adv\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase(),
  color: ["#2563eb", "#16a34a", "#7c3aed"][index],
}));

function Avatar({ initials, color, size = 38 }) {
  const advocate = arguments[0].advocate;

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, color: "#fff", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {advocate?.avatar ? (
        <img
          src={advocate.avatar}
          alt={advocate.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      ) : initials}
    </div>
  );
}

export default function AskQuestion() {
  const EXPERT_ADVOCATES = getExpertAdvocates();
  const navigate = useNavigate();

  const [step,          setStep]          = useState(1); // 1=category, 2=question, 3=success
  const [selectedCat,   setSelectedCat]   = useState(null);
  const [question,      setQuestion]      = useState("");
  const [description,   setDescription]   = useState("");
  const [name,          setName]          = useState("");
  const [phone,         setPhone]         = useState("");
  const [isAnonymous,   setIsAnonymous]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [errors,        setErrors]        = useState({});
  const [activeTab,     setActiveTab]     = useState("ask"); // ask | recent | experts
  const [searchQ,       setSearchQ]       = useState("");

  const filteredRecent = RECENT_QUESTIONS.filter(q =>
    !searchQ || q.question.toLowerCase().includes(searchQ.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQ.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!question.trim())                   e.question    = "Please enter your question";
    else if (question.trim().length < 20)   e.question    = "Question is too short (min 20 chars)";
    if (!description.trim())                e.description = "Please describe your issue in detail";
    else if (description.trim().length < 50)e.description = "Description too short (min 50 chars)";
    if (!isAnonymous) {
      if (!name.trim())  e.name  = "Name is required";
      if (!phone.trim()) e.phone = "Phone is required";
      else if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) e.phone = "Enter valid 10-digit phone";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addQuestion({
      category: selectedCat?.label || "Other",
      question: question.trim(),
      description: description.trim(),
      name: isAnonymous ? "Anonymous" : name.trim(),
      phone: isAnonymous ? "" : phone.trim(),
      isAnonymous,
    });
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1500);
  };

  if (step === 3) {
    return (
      <div className="lw-aq-page">
        <div className="lw-aq-success-card">
          <div style={{ fontSize: 60 }}>✅</div>
          <h2>Question Submitted!</h2>
          <p>Your legal question has been posted. Our verified advocates will answer within <strong>24 hours</strong>.</p>
          <div className="lw-aq-success-info">
            <div>📋 Category: <strong>{selectedCat?.label}</strong></div>
            <div>❓ Question: <strong>{question.slice(0, 60)}{question.length > 60 ? "…" : ""}</strong></div>
            {!isAnonymous && <div>👤 Posted by: <strong>{name}</strong></div>}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="lw-aq-btn-outline" onClick={() => { setStep(1); setSelectedCat(null); setQuestion(""); setDescription(""); }}>
              Ask Another
            </button>
            <button className="lw-aq-btn-primary" onClick={() => navigate("/find-lawyer")}>
              Find a Lawyer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lw-aq-page">
      {/* Header */}
      <div className="lw-aq-header">
        <div className="lw-aq-header-inner">
          <h1 className="lw-aq-title">Ask a Legal Question</h1>
          <p className="lw-aq-subtitle">Get free answers from verified advocates across India</p>
          <div className="lw-aq-header-stats">
            <span>⚖️ 50,000+ Questions Answered</span>
            <span>👨‍⚖️ 500+ Active Advocates</span>
            <span>⏱️ Avg. reply in 2 hours</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lw-aq-tabs">
        {[["ask","❓ Ask a Question"],["recent","💬 Recent Questions"],["experts","👨‍⚖️ Expert Advocates"]].map(([key,label]) => (
          <button key={key} className={`lw-aq-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      <div className="lw-aq-body">

        {/* ── ASK TAB ── */}
        {activeTab === "ask" && (
          <div className="lw-aq-form-wrap">

            {/* Progress bar */}
            <div className="lw-aq-progress">
              {["Select Category", "Your Question", "Your Details"].map((label, i) => (
                <React.Fragment key={label}>
                  <div className={`lw-aq-prog-step ${step > i ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                    <div className="lw-aq-prog-dot">{step > i + 1 ? "✓" : i + 1}</div>
                    <span>{label}</span>
                  </div>
                  {i < 2 && <div className={`lw-aq-prog-line ${step > i + 1 ? "done" : ""}`} />}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h3 className="lw-aq-step-title">What is your legal issue about?</h3>
                <div className="lw-aq-cat-grid">
                  {CATEGORIES.map(cat => (
                    <button key={cat.label}
                      className={`lw-aq-cat-card ${selectedCat?.label === cat.label ? "selected" : ""}`}
                      onClick={() => setSelectedCat(cat)}>
                      <span className="lw-aq-cat-icon">{cat.icon}</span>
                      <div className="lw-aq-cat-label">{cat.label}</div>
                      <div className="lw-aq-cat-sub">{cat.sub}</div>
                      {selectedCat?.label === cat.label && <span className="lw-aq-cat-check">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="lw-aq-step-footer">
                  <button className="lw-aq-btn-primary"
                    disabled={!selectedCat}
                    onClick={() => setStep(2)}>
                    Next: Write Your Question →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Question */}
            {step === 2 && (
              <div>
                <h3 className="lw-aq-step-title">
                  {selectedCat?.icon} {selectedCat?.label} — Describe your issue
                </h3>

                <div className="lw-aq-field">
                  <label>Your Question <span className="lw-req">*</span></label>
                  <input
                    className={`lw-aq-input ${errors.question ? "error" : ""}`}
                    placeholder="e.g. My landlord is not returning my security deposit…"
                    value={question}
                    onChange={e => { setQuestion(e.target.value); setErrors(p => ({ ...p, question: "" })); }}
                    maxLength={200}
                  />
                  <div className="lw-aq-char">{question.length}/200</div>
                  {errors.question && <p className="lw-aq-err">⚠ {errors.question}</p>}
                </div>

                <div className="lw-aq-field">
                  <label>Detailed Description <span className="lw-req">*</span></label>
                  <textarea
                    className={`lw-aq-textarea ${errors.description ? "error" : ""}`}
                    rows={6}
                    placeholder="Provide complete details about your situation, dates, documents involved, and what outcome you are looking for. The more detail you give, the better advice you will receive…"
                    value={description}
                    onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: "" })); }}
                    maxLength={2000}
                  />
                  <div className="lw-aq-char">{description.length}/2000</div>
                  {errors.description && <p className="lw-aq-err">⚠ {errors.description}</p>}
                </div>

                <div className="lw-aq-field">
                  <label className="lw-aq-anon-label">
                    <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                    Post anonymously (your name will not be shown publicly)
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="lw-aq-grid-2">
                    <div className="lw-aq-field">
                      <label>Your Name <span className="lw-req">*</span></label>
                      <input className={`lw-aq-input ${errors.name ? "error" : ""}`}
                        placeholder="Your full name"
                        value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }} />
                      {errors.name && <p className="lw-aq-err">⚠ {errors.name}</p>}
                    </div>
                    <div className="lw-aq-field">
                      <label>Phone Number <span className="lw-req">*</span></label>
                      <input className={`lw-aq-input ${errors.phone ? "error" : ""}`}
                        placeholder="10-digit mobile" type="tel" maxLength={10}
                        value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: "" })); }} />
                      {errors.phone && <p className="lw-aq-err">⚠ {errors.phone}</p>}
                    </div>
                  </div>
                )}

                <div className="lw-aq-note">
                  ℹ️ Your question will be reviewed and answered by verified advocates. Sensitive information will be kept confidential.
                </div>

                <div className="lw-aq-step-footer">
                  <button className="lw-aq-btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="lw-aq-btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting…" : "Submit Question ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RECENT QUESTIONS TAB ── */}
        {activeTab === "recent" && (
          <div className="lw-aq-recent-wrap">
            <div className="lw-aq-search-wrap">
              <span>🔍</span>
              <input className="lw-aq-search" placeholder="Search questions…"
                value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              {searchQ && <button onClick={() => setSearchQ("")}>✕</button>}
            </div>
            <div className="lw-aq-recent-list">
              {filteredRecent.length === 0
                ? <div className="lw-aq-empty">No questions found for "{searchQ}"</div>
                : filteredRecent.map(q => (
                  <div key={q.id} className="lw-aq-q-card">
                    <div className="lw-aq-q-top">
                      <Avatar initials={q.avatar} color={q.color} size={36} />
                      <div className="lw-aq-q-meta">
                        <span className="lw-aq-q-cat">{q.category}</span>
                        <span className="lw-aq-q-time">{q.time}</span>
                      </div>
                    </div>
                    <p className="lw-aq-q-text">{q.question}</p>
                    <div className="lw-aq-q-footer">
                      <span className="lw-aq-q-answers">💬 {q.answers} answers</span>
                      <button className="lw-aq-btn-sm" onClick={() => setActiveTab("ask")}>Answer this</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ── EXPERTS TAB ── */}
        {activeTab === "experts" && (
          <div className="lw-aq-experts-wrap">
            <h3 className="lw-aq-experts-title">Top Answering Advocates</h3>
            <div className="lw-aq-experts-grid">
              {EXPERT_ADVOCATES.map(adv => (
                <div key={adv.name} className="lw-aq-expert-card">
                  <Avatar advocate={adv} initials={adv.initials} color={adv.color} size={60} />
                  <div className="lw-aq-expert-name">{adv.name}</div>
                  <div className="lw-aq-expert-spec">{adv.spec}</div>
                  <div className="lw-aq-expert-stats">
                    <span>💬 {adv.answers} answers</span>
                    <span>⭐ {adv.rating}</span>
                  </div>
                  <button className="lw-aq-btn-primary" style={{ marginTop: 12, width: "100%" }}
                    onClick={() => navigate(`/profile?email=${encodeURIComponent(adv.email)}`)}>
                    Consult Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}