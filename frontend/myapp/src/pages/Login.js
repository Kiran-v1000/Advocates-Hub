// ============================================================
//  Login.js  —  Law4u Advocate Login Page
//  Authenticates against POST /api/auth/advocate/login — the
//  password is verified server-side against a scrypt hash.
//  Only advocates with status "approved" can log in — "pending"
//  accounts are told to wait for admin approval, "rejected"
//  accounts are told their application was declined.
//  On success → stores the logged-in advocate's id → redirects
//  to /advocate-dashboard.
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdvocate } from "../data/Advocatesstore";
import "./Login.css";

// Key used to remember who's logged in (read by AdvocateDashboard.js)
const SESSION_KEY = "law4u_advocate_id";

// ── Helpers ───────────────────────────────────────────────────
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function Field({ label, required, error, hint, children }) {
  return (
    <div className="lg-field">
      {label && (
        <label className="lg-label">
          {label}{required && <span className="lg-req"> *</span>}
        </label>
      )}
      {children}
      {hint  && !error && <p className="lg-hint">{hint}</p>}
      {error && <p className="lg-field-err">⚠ {error}</p>}
    </div>
  );
}

function Input({ icon, error, type = "text", rightEl, ...props }) {
  return (
    <div className={`lg-input-wrap ${error ? "error" : ""}`}>
      {icon && <span className="lg-input-icon">{icon}</span>}
      <input type={type} className="lg-input" {...props} />
      {rightEl}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const MAP = {
    success:{ bg:"#dcfce7", c:"#14532d", b:"#bbf7d0", i:"✅" },
    error:  { bg:"#fee2e2", c:"#7f1d1d", b:"#fecaca", i:"❌" },
    info:   { bg:"#dbeafe", c:"#1e3a5f", b:"#bfdbfe", i:"ℹ️" },
  };
  const s = MAP[toast.type] || MAP.info;
  return (
    <div className="lg-toast" style={{ background:s.bg, color:s.c, border:`1px solid ${s.b}` }}>
      {s.i} {toast.msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN LOGIN COMPONENT (Advocate)
// ══════════════════════════════════════════════════════════════
export default function Login() {
  const navigate = useNavigate();
  const [toast,   setToast]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [err, setErr] = useState({});

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg, type = "info") => setToast({ msg, type });

  const setF = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErr(p => ({ ...p, [k]: "" }));
  };

  // ── Validate ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email.trim())               e.email    = "Email is required";
    else if (!isValidEmail(form.email))   e.email    = "Invalid email format";
    if (!form.password)                   e.password = "Password is required";
    setErr(e);
    return !Object.keys(e).length;
  };

  // ── Submit — check credentials + approval status ───────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);

    (async () => {
      let match;
      try {
        match = await loginAdvocate(form.email.trim(), form.password, form.remember);
      } catch (error) {
        if (error.status === 401) setErr({ password: "Incorrect email or password" });
        showToast(error.message, error.data?.status === "pending" ? "info" : "error");
        setLoading(false);
        return;
      }

      // Success — remember which advocate is logged in
      if (form.remember) {
        localStorage.setItem(SESSION_KEY, String(match.id));
      } else {
        sessionStorage.setItem(SESSION_KEY, String(match.id));
      }

      showToast(`Welcome back, ${match.name.replace("Adv. ", "")}! 🎉`, "success");
      setLoading(false);

      setTimeout(() => navigate("/advocate-dashboard"), 700);
    })();
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="lg-page">
      <Toast toast={toast} />

      <div className="lg-card">

        {/* Header */}
        <div className="lg-header">
          <Link to="/" className="lg-logo">
            <span style={{ color:"#2563eb", fontWeight:800 }}>Law</span>
            <span style={{ color:"#dc2626", fontWeight:800 }}>4</span>
            <span style={{ color:"#16a34a", fontWeight:800 }}>u</span>
          </Link>
          <h1 className="lg-title">Advocate Login</h1>
          <p className="lg-subtitle">Sign in to manage your practice on Law4u</p>
        </div>

        <div className="lg-badge">⚖️ For Advocates Only</div>
        <Link to="/" className="lg-home-btn">Go to Home</Link>

        <form className="lg-form" onSubmit={handleSubmit} noValidate>

          <Field label="Email Address" required error={err.email}>
            <Input icon="✉️" type="email" placeholder="advocate@advocateshub.in"
              value={form.email} onChange={e => setF("email", e.target.value)}
              error={err.email} disabled={loading}
              rightEl={form.email && isValidEmail(form.email) && <span className="lg-valid">✓</span>} />
          </Field>

          <Field label="Password" required error={err.password}>
            <Input icon="🔒" type={showPw ? "text" : "password"} placeholder="Enter your password"
              value={form.password} onChange={e => setF("password", e.target.value)}
              error={err.password} disabled={loading}
              rightEl={<button type="button" className="lg-eye" onClick={() => setShowPw(p => !p)}>{showPw ? "🙈" : "👁️"}</button>} />
          </Field>

          <div className="lg-row-between">
            <label className="lg-remember">
              <input type="checkbox" checked={form.remember} onChange={e => setF("remember", e.target.checked)} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="lg-forgot">Forgot password?</Link>
          </div>

          <button type="submit" className="lg-btn-primary lg-btn-lg" disabled={loading}>
            {loading ? <><span className="lg-spinner" /> Signing in…</> : "Login to Dashboard →"}
          </button>

          <p className="lg-signup-link">
            Not registered as an advocate yet? <Link to="/signup">Create an account</Link>
          </p>
        </form>

      </div>
    </div>
  );
}