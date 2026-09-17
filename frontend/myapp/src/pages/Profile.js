import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAdvocates } from '../data/Advocatesstore';
import './Profile.css';

// Same storage key/shape used by AdvocateDashboard.js —
// { [advocateId]: Request[] }
const REQUESTS_KEY = 'law4u_requests';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const getAvatarColor = (name = '') => {
  const palette = ['#2563eb', '#16a34a', '#7c3aed', '#dc2626', '#ea580c', '#0891b2', '#0f766e', '#9333ea'];
  const sum = name.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
};

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidPhone = (p) => /^\d{10}$/.test(p.replace(/\s|-/g, ''));

function ProfileAvatar({ advocate }) {
  const [imagePath, setImagePath] = useState(advocate.avatar || '');
  const [failed, setFailed] = useState(false);

  const tryAlternateImage = () => {
    if (!imagePath || !advocate.avatar) {
      setFailed(true);
      return;
    }

    const basePath = advocate.avatar.replace(/\.(png|jpe?g|webp)$/i, '');
    const candidates = [`${basePath}.jpg`, `${basePath}.jpeg`, `${basePath}.png`, `${basePath}.webp`];
    const nextPath = candidates.find((candidate) => candidate !== imagePath);
    if (nextPath) {
      setImagePath(nextPath);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className="lw-profile-avatar"
      style={{ background: !failed && imagePath ? 'transparent' : getAvatarColor(advocate.name) }}
    >
      {!failed && imagePath ? (
        <img
          src={imagePath}
          alt={advocate.name}
          className="lw-profile-avatar-img"
          onError={tryAlternateImage}
        />
      ) : getInitials(advocate.name)}
    </div>
  );
}

function loadAllRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllRequests(all) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all));
}

// ── Book Consultation modal ────────────────────────────────────
function BookConsultationModal({ advocate, onClose, onSent }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [err, setErr] = useState({});
  const [sending, setSending] = useState(false);

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!isValidPhone(form.phone)) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Invalid email format';
    if (!form.message.trim()) e.message = 'Please add a short message for the advocate';
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    const request = {
      id: `${advocate.id}-${Date.now()}`,
      clientName: form.name.trim(),
      clientPhone: form.phone.trim(),
      clientEmail: form.email.trim().toLowerCase(),
      clientCity: '',
      message: form.message.trim(),
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    const all = loadAllRequests();
    const existing = all[advocate.id] || [];
    all[advocate.id] = [request, ...existing];
    saveAllRequests(all);

    setSending(false);
    onSent();
  };

  return (
    <div className="lw-modal-overlay" onClick={onClose}>
      <div className="lw-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lw-modal-header">
          <h3>Book a Consultation</h3>
          <button className="lw-modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="lw-modal-sub">
          Send your details to <strong>{advocate.name}</strong> — they'll reach out to confirm your consultation.
        </p>

        <form onSubmit={handleSend} noValidate>
          <div className="lw-modal-field">
            <label>Your Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setF('name', e.target.value)}
              disabled={sending}
            />
            {err.name && <p className="lw-modal-err">⚠ {err.name}</p>}
          </div>

          <div className="lw-modal-field">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => setF('phone', e.target.value)}
              maxLength={10}
              disabled={sending}
            />
            {err.phone && <p className="lw-modal-err">⚠ {err.phone}</p>}
          </div>

          <div className="lw-modal-field">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setF('email', e.target.value)}
              disabled={sending}
            />
            {err.email && <p className="lw-modal-err">⚠ {err.email}</p>}
          </div>

          <div className="lw-modal-field">
            <label>Message *</label>
            <textarea
              rows={3}
              placeholder="Briefly describe your legal issue…"
              value={form.message}
              onChange={(e) => setF('message', e.target.value)}
              disabled={sending}
            />
            {err.message && <p className="lw-modal-err">⚠ {err.message}</p>}
          </div>

          <div className="lw-modal-actions">
            <button type="button" className="lw-btn-back" onClick={onClose} disabled={sending}>
              Cancel
            </button>
            <button type="submit" className="lw-btn-book" disabled={sending}>
              {sending ? 'Sending…' : 'Send Request →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Success confirmation ────────────────────────────────────────
function RequestSentModal({ advocate, onClose }) {
  return (
    <div className="lw-modal-overlay" onClick={onClose}>
      <div className="lw-modal lw-modal-success" onClick={(e) => e.stopPropagation()}>
        <div className="lw-modal-success-icon">✅</div>
        <h3>Request Sent!</h3>
        <p>
          Your consultation request has been sent to <strong>{advocate.name}</strong>.
          They'll review your details and get back to you soon.
        </p>
        <button className="lw-btn-book" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [showBookModal, setShowBookModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);

  const advocatesData = getAdvocates();

  const email = searchParams.get('email');
  const advocate = email
    ? advocatesData.find(a => String(a.email).toLowerCase() === email.toLowerCase())
    : id
      ? advocatesData.find(a => String(a.id) === String(id)) || advocatesData[0]
      : advocatesData[0];

  if (!advocate) {
    return (
      <div className="lw-profile-page">
        <div className="lw-profile-container">
          <div className="lw-profile-card">
            <div className="lw-profile-body">
              <p>Advocate not found.</p>
              <button type="button" className="lw-btn-back" onClick={() => navigate(-1)}>Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lw-profile-page">
      <div className="lw-profile-container">
        <div className="lw-profile-card">

          {/* Header Banner */}
          <div className="lw-profile-header">
            <div className="lw-profile-header-content">
              <ProfileAvatar advocate={advocate} />
              <div>
                <h1 className="lw-profile-name">{advocate.name}</h1>
                <div className="lw-profile-spec">{advocate.speciality}</div>
                <div className="lw-profile-meta">{advocate.city} · {advocate.experience} Experience</div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="lw-profile-body">

            {/* Highlights Grid */}
            <div className="lw-profile-stats-grid">
              <div className="lw-stat-box">
                <span className="lw-stat-title">Rating</span>
                <span className="lw-stat-value">⭐ {advocate.rating}</span>
              </div>
              <div className="lw-stat-box">
                <span className="lw-stat-title">Cases Handled</span>
                <span className="lw-stat-value">{advocate.cases}+</span>
              </div>
              <div className="lw-stat-box">
                <span className="lw-stat-title">Consultation Fee</span>
                <span className="lw-stat-value">{advocate.fee}</span>
              </div>
              <div className="lw-stat-box">
                <span className="lw-stat-title">Availability</span>
                <span className="lw-stat-value">{advocate.availability}</span>
              </div>
            </div>

            {/* About Section */}
            <div className="lw-profile-section">
              <h3 className="lw-profile-subtitle">About Advocate</h3>
              <p className="lw-profile-bio">{advocate.bio}</p>
            </div>

            {/* Languages Spoken */}
            <div className="lw-profile-section">
              <h3 className="lw-profile-subtitle">Languages</h3>
              <div className="lw-lang-badges">
                {advocate.languages && advocate.languages.map((lang) => (
                  <span key={lang} className="lw-lang-badge">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lw-profile-actions">
              <button
                type="button"
                className="lw-btn-book"
                onClick={() => setShowBookModal(true)}
              >
                Book Consultation
              </button>
              <button
                type="button"
                className="lw-btn-back"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>

          </div>
        </div>
      </div>

      {showBookModal && (
        <BookConsultationModal
          advocate={advocate}
          onClose={() => setShowBookModal(false)}
          onSent={() => {
            setShowBookModal(false);
            setShowSentModal(true);
          }}
        />
      )}

      {showSentModal && (
        <RequestSentModal
          advocate={advocate}
          onClose={() => setShowSentModal(false)}
        />
      )}
    </div>
  );
}