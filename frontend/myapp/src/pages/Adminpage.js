// ============================================================
//  AdminPage.js  —  Law4u Admin Page
//  Password-protected admin console:
//   - Approve / reject pending advocate signups
//   - Add / edit / delete any advocate account
//   - View Contact & Partners form submissions as messages
//
//  ⚠️ Demo-only auth: the admin credentials below are hardcoded
//  and checked entirely client-side. For a real deployment, move
//  admin auth to a backend with hashed passwords and a real
//  session/token — never ship credentials in client code.
// ============================================================

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getAdvocates,
  addAdvocate,
  updateAdvocate,
  deleteAdvocate,
  approveAdvocate,
  rejectAdvocate,
  loadAdvocates,
} from "../data/Advocatesstore";
import { api, setAdminToken, getAdminToken } from "../data/api";
import BrandLogo from "../components/BrandLogo";
import { getMessages, markAsRead, deleteMessage } from "../data/MessageStore";
import { getQuestions, markQuestionAsRead, deleteQuestion } from "../data/QuestionStore";
import "./AdminPage.css";
const REQUESTS_KEY   = "law4u_requests";    // { [advocateId]: Request[] }
const BOOKINGS_KEY   = "law4u_bookings";    // { bookingId: Booking }


function readLS(key, fallback = null) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function writeLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function loadRequests()  { return readLS(REQUESTS_KEY, {}); }
function loadBookings()  { return readLS(BOOKINGS_KEY, {}); }

function saveBookings(b) { writeLS(BOOKINGS_KEY, b); }
function saveRequests(r) { writeLS(REQUESTS_KEY, r); }

// Save accepted booking to bookings store
function persistBooking(req, advocate) {
  const all  = loadBookings();
  const key  = `${advocate.id}_${req.id || Date.now()}`;
  all[key]   = {
    bookingId:     key,
    advocateId:    advocate.id,
    advocateName:  advocate.name,
    advocateSpec:  advocate.speciality || advocate.practiceArea || "",
    advocateCity:  advocate.city || "",
    clientName:    req.clientName,
    clientEmail:   req.clientEmail || "",
    clientPhone:   req.clientPhone || "",
    clientCity:    req.clientCity  || "",
    message:       req.message     || "",
    status:        "accepted",
    acceptedAt:    req.acceptedAt  || new Date().toISOString(),
    requestedAt:   req.requestedAt || new Date().toISOString(),
    caseStage:     req.caseStage   || "Start Case",
  };
  saveBookings(all);
  return all[key];
}

const CITIES = ["Aland", "Afzalpur", "Alur", "Ankola", "Arakalgud", "Arasikere", "Athani", "Aurad", "Badami", "Bagepalli", "Bagalkot", "Baindur", "Bailhongal", "Ballari", "Banahatti", "Bangarapet", "Bantwal", "Basavakalyan", "Basavana Bagewadi", "Belagavi", "Belthangady", "Belur", "Bengaluru", "Bengaluru Rural", "Bhadravati", "Bhalki", "Bhatkal", "Bidar", "Bilagi", "Byadgi", "Chamarajanagar", "Challakere", "Channagiri", "Channapatna", "Channarayapatna", "Chikkaballapur", "Chikkamagaluru", "Chikkodi", "Chiknayakanhalli", "Chincholi", "Chitapur", "Chitradurga", "Chintamani", "Dandeli", "Davangere", "Devadurga", "Devanahalli", "Dharwad", "Doddaballapur", "Gadag", "Gangavathi", "Gauribidanur", "Gokak", "Gudibande", "Gundlupet", "Gubbi", "H.D. Kote", "Hagaribommanahalli", "Haliyal", "Hanagal", "Harapanahalli", "Harihar", "Hassan", "Haveri", "Hirekerur", "Holenarasipura", "Honnavar", "Honnali", "Hoovina Hadagali", "Hosanagara", "Hoscote", "Hospete", "Hukeri", "Humnabad", "Hunsur", "Hungund", "Indi", "Jagalur", "Jamkhandi", "Jevargi", "Kadur", "Kagwad", "Kalaburagi", "Kalghatgi", "Kanakapura", "Karwar", "Karkala", "KGF", "Khanapur", "Kittur", "Kolar", "Kollegal", "Koppa", "Koppal", "Koratagere", "Kudachi", "Kudligi", "Kumta", "Kunigal", "Kupa", "Kushalnagar", "Kushtagi", "Lakshmeshwar", "Lingasugur", "Maddur", "Madhugiri", "Madikeri", "Magadi", "Malavalli", "Malur", "Mangaluru", "Mandya", "Manvi", "Moodbidri", "Muddebihal", "Mudalagi", "Mudhol", "Mudigere", "Mundargi", "Mundgod", "Mulbagal", "Mysuru", "Nagamangala", "Nanjangud", "Narasimharajapura", "Nargund", "Navalgund", "Nelamangala", "Nippani", "Pandavapura", "Pavagada", "Periyapatna", "Ponnampet", "Puttur", "Raibag", "Raichur", "Ramanagara", "Ramdurg", "Ranebennur", "Ron", "Sadalaga", "Sagar", "Sakleshpur", "Sankeshwar", "Sandur", "Sindagi", "Sindhanur", "Sirsi", "Siruguppa", "Siddapur", "Sidlaghatta", "Sira", "Somwarpet", "Soraba", "Sringeri", "Srinivaspur", "Srirangapatna", "Sullia", "Tarikere", "Thirthahalli", "Tiptur", "Tirumakudalu Narasipura", "Tumakuru", "Turuvekere", "Udupi", "Virajpet", "Vijayapura", "Yadgir", "Yaragatti", "Yellapur", "Yelburga"];
const PRACTICE_AREAS = [
  "Criminal Law","Family Law","Property Law","Civil Law",
  "Corporate Law","Tax Law","Labour Law","Consumer Law",
  "Cyber Law","Immigration","Banking Law","Intellectual Property",
  "Divorce","Cheque Bounce","NRI Matters","Supreme Court",
];
function getReqStats(advocateId, allReqs) {
  const list = allReqs[advocateId] || [];
  return {
    total:    list.length,
    pending:  list.filter(r => r.status === "pending").length,
    accepted: list.filter(r => r.status === "accepted").length,
    declined: list.filter(r => r.status === "declined").length,
  };
}
const COURTS = [
  "District Court","High Court","Supreme Court",
  "Family Court","Consumer Forum","Labour Court",
  "Civil Court","Criminal Court","Revenue Court",
];

const EMPTY_FORM = {
  name: "", email: "", phone: "", password: "",
  city: "", speciality: "", court: "", experience: "",
  fee: "", bio: "", barId: "", status: "approved",
};

// ─────────────────────────────────────────────────────────────
//  MICRO COMPONENTS
// ─────────────────────────────────────────────────────────────

// Avatar
function Avi({ name = "", color, size = 38, src }) {
  const [err, setErr] = useState(false);
  const initials = name.replace(/^Adv\.\s*/i, "")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bg = color || colorFor(name.charCodeAt(0));

  if (src && !err) {
    return (
      <img src={src} alt={name} onError={() => setErr(true)}
        style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
    );
  }
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:bg, color:"#fff",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.35, fontWeight:800, flexShrink:0,
      boxShadow:`0 2px 8px ${bg}44`,
    }}>{initials}</div>
  );
}

// ─────────────────────────────────────────────────────────────
//  REQUEST STATS BAR
// ─────────────────────────────────────────────────────────────
function ReqStatsBar({ stats }) {
  if (stats.total === 0) {
    return <div style={{ fontSize:11.5, color:"#94a3b8", fontStyle:"italic", marginTop:4 }}>No requests yet</div>;
  }
  const accPct = Math.round((stats.accepted / stats.total) * 100);
  const decPct = Math.round((stats.declined / stats.total) * 100);
  const penPct = 100 - accPct - decPct;

  return (
    <div style={{ marginTop:7 }}>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:5 }}>
        {[
          { label:`${stats.total} Total`,    c:"#6366f1" },
          { label:`${stats.accepted} Accepted`, c:"#22c55e" },
          { label:`${stats.pending} Pending`,   c:"#f59e0b" },
          { label:`${stats.declined} Declined`, c:"#ef4444" },
        ].map(s => (
          <span key={s.label} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, fontWeight:700, color:s.c }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:s.c, display:"inline-block" }}/>
            {s.label}
          </span>
        ))}
      </div>
      <div style={{ height:7, borderRadius:4, background:"#f1f5f9", overflow:"hidden", display:"flex", minWidth:180 }}>
        {accPct > 0 && <div style={{ width:`${accPct}%`, background:"#22c55e", transition:"width .4s" }}/>}
        {penPct > 0 && <div style={{ width:`${penPct}%`, background:"#f59e0b", transition:"width .4s" }}/>}
        {decPct > 0 && <div style={{ width:`${decPct}%`, background:"#ef4444", transition:"width .4s" }}/>}
      </div>
    </div>
  );
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function fmtDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function colorFor(id) { return AVATAR_COLORS[(Number(id) || 0) % AVATAR_COLORS.length]; }
const AVATAR_COLORS = [
  "#2563eb","#16a34a","#7c3aed","#dc2626",
  "#ea580c","#0891b2","#be185d","#d97706",
  "#059669","#6366f1","#0284c7","#9333ea",
];
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^\d{10}$/.test(String(p).replace(/\s|-/g, "")); }
// Status badge
function SBadge({ status }) {
  const M = {
    approved: ["#dcfce7","#14532d"],
    pending:  ["#fef9c3","#92400e"],
    rejected: ["#fee2e2","#7f1d1d"],
    accepted: ["#dcfce7","#14532d"],
    declined: ["#fee2e2","#7f1d1d"],
    active:   ["#dcfce7","#14532d"],
  };
  const [bg, c] = M[status] || ["#f1f5f9","#64748b"];
  return (
    <span style={{ background:bg, color:c, fontSize:11, fontWeight:700,
      padding:"2px 10px", borderRadius:20 }}>
      {(status||"").charAt(0).toUpperCase()+(status||"").slice(1)}
    </span>
  );
}
function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}


// ─────────────────────────────────────────────────────────────
//  BOOKING DETAIL MODAL
// ─────────────────────────────────────────────────────────────
function BookingModal({ booking, onClose }) {
  const rows = [
    { icon:"👤", label:"Client",        val:booking.clientName },
    { icon:"✉️", label:"Email",         val:booking.clientEmail || "—" },
    { icon:"📱", label:"Phone",         val:booking.clientPhone || "—" },
    { icon:"📍", label:"Client City",   val:booking.clientCity  || "—" },
    { icon:"⚖️", label:"Advocate",      val:booking.advocateName },
    { icon:"🏛️", label:"Speciality",    val:booking.advocateSpec || "—" },
    { icon:"📍", label:"Advocate City", val:booking.advocateCity || "—" },
    { icon:"📅", label:"Requested",     val:fmtDateTime(booking.requestedAt) },
    { icon:"✅", label:"Accepted",      val:fmtDateTime(booking.acceptedAt)  },
    { icon:"📂", label:"Case Stage",    val:booking.caseStage || "—" },
    { icon:"📋", label:"Message",       val:booking.message   || "—" },
  ];

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.48)",zIndex:500,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:480,
        maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.22)" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 20px",borderBottom:"1px solid #e2e8f0",
          background:"linear-gradient(135deg,#2563eb,#7c3aed)",borderRadius:"14px 14px 0 0" }}>
          <div>
            <div style={{ fontWeight:800,fontSize:15,color:"#fff" }}>📋 Booking Details</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,.75)",marginTop:2 }}>
              {booking.clientName} ↔ {booking.advocateName}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)",border:"none",color:"#fff",
            width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16,
            display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"18px 20px",display:"flex",flexDirection:"column",gap:0 }}>
          {rows.map(r => (
            <div key={r.label} style={{ display:"flex",alignItems:"flex-start",gap:12,
              padding:"9px 0",borderBottom:"1px solid #f1f5f9",fontSize:13.5 }}>
              <span style={{ fontSize:16,width:22,flexShrink:0 }}>{r.icon}</span>
              <span style={{ color:"#64748b",minWidth:110,flexShrink:0 }}>{r.label}</span>
              <span style={{ fontWeight:500,color:"#1e293b",lineHeight:1.5 }}>{r.val}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:"14px 20px",borderTop:"1px solid #e2e8f0",textAlign:"right" }}>
          <button onClick={onClose} style={{ padding:"8px 22px",borderRadius:8,border:"none",
            background:"#2563eb",color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SIDEBAR NAVIGATION
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
//  REQUEST DETAIL MODAL (per advocate)
// ─────────────────────────────────────────────────────────────
function ReqDetailModal({ adv, allReqs, onClose, onStatusChange }) {
  const [filter,  setFilter]  = useState("all");
  const [saving,  setSaving]  = useState(null);
  const list = (allReqs[adv.id] || []).filter(r =>
    filter === "all" ? true : r.status === filter
  );
  const stats = getReqStats(adv.id, allReqs);

  const handleChange = async (req, newStatus) => {
    setSaving(req.id || req.clientName);
    await new Promise(r => setTimeout(r, 400));
    onStatusChange(adv.id, req, newStatus);
    setSaving(null);
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.48)",zIndex:500,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#fff",borderRadius:14,width:"100%",maxWidth:560,
        maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.22)",
        display:"flex",flexDirection:"column" }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 20px",borderBottom:"1px solid #e2e8f0",flexShrink:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <Avi name={adv.name} color={colorFor(adv.id)} size={40} src={adv.avatar||adv.image} />
            <div>
              <div style={{ fontWeight:700,fontSize:15 }}>{adv.name}</div>
              <div style={{ fontSize:12,color:"#64748b" }}>{adv.speciality||adv.practiceArea} · {adv.city||adv.location}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#94a3b8" }}>✕</button>
        </div>

        {/* Stats strip */}
        <div style={{ display:"flex",gap:0,borderBottom:"1px solid #e2e8f0",flexShrink:0 }}>
          {[
            { label:"Total",    val:stats.total,    c:"#6366f1" },
            { label:"Pending",  val:stats.pending,  c:"#f59e0b" },
            { label:"Accepted", val:stats.accepted, c:"#22c55e" },
            { label:"Declined", val:stats.declined, c:"#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ flex:1,textAlign:"center",padding:"12px 6px",
              borderRight:"1px solid #e2e8f0",borderTop:`3px solid ${s.c}` }}>
              <div style={{ fontSize:20,fontWeight:800,color:s.c }}>{s.val}</div>
              <div style={{ fontSize:11,color:"#64748b",marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex",gap:4,padding:"10px 16px",borderBottom:"1px solid #e2e8f0",flexShrink:0,background:"#fafbff" }}>
          {["all","pending","accepted","declined"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:"6px 14px",borderRadius:7,border:"none",fontSize:12.5,fontWeight:filter===f?700:500,
                fontFamily:"inherit",cursor:"pointer",
                background:filter===f?"#2563eb":"transparent",
                color:filter===f?"#fff":"#64748b",transition:"all .15s" }}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        {/* Request list */}
        <div style={{ padding:"12px 16px",flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10 }}>
          {list.length === 0 ? (
            <div style={{ textAlign:"center",padding:"32px",color:"#94a3b8",fontSize:14 }}>
              No {filter!=="all"?filter:""} requests
            </div>
          ) : list.map((req, i) => (
            <div key={i} style={{ background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:9,padding:"12px 14px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <Avi name={req.clientName} size={32} />
                  <div>
                    <div style={{ fontWeight:700,fontSize:13.5 }}>{req.clientName}</div>
                    <div style={{ fontSize:11.5,color:"#64748b" }}>{fmtDate(req.requestedAt)}</div>
                  </div>
                </div>
                <SBadge status={req.status} />
              </div>
              {req.clientPhone && <div style={{ fontSize:12,color:"#64748b",marginBottom:2 }}>📱 {req.clientPhone}</div>}
              {req.clientEmail && <div style={{ fontSize:12,color:"#64748b",marginBottom:2 }}>✉️ {req.clientEmail}</div>}
              {req.message && (
                <div style={{ fontSize:12.5,color:"#475569",marginTop:6,padding:"8px",background:"#fff",borderRadius:7,border:"1px solid #e2e8f0" }}>
                  {req.message.slice(0,120)}{req.message.length>120?"…":""}
                </div>
              )}
              {req.status === "pending" && (
                <div style={{ display:"flex",gap:7,marginTop:10 }}>
                  <button onClick={() => handleChange(req, "accepted")} disabled={saving===req.id}
                    style={{ flex:1,background:"#16a34a",color:"#fff",border:"none",borderRadius:7,
                      padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                    {saving===req.id ? "…" : "✅ Accept"}
                  </button>
                  <button onClick={() => handleChange(req, "declined")} disabled={saving===req.id}
                    style={{ flex:1,background:"#fee2e2",color:"#dc2626",border:"1px solid #fecaca",borderRadius:7,
                      padding:"7px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>
                    ❌ Decline
                  </button>
                </div>
              )}
              {req.status === "accepted" && req.acceptedAt && (
                <div style={{ fontSize:11.5,color:"#16a34a",marginTop:6,fontWeight:600 }}>
                  ✓ Accepted {fmtDate(req.acceptedAt)}
                  {req.caseStage && ` · Stage: ${req.caseStage}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Admin Login Gate ────────────────────────────────────────
// ── Theme (light / dark), remembered per browser ────────────
const THEME_KEY = "law4u_admin_theme";

function useAdminTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch { /* storage unavailable */ }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return [theme, toggle];
}

// Persisted boolean preference (rail expanded / collapsed)
const RAIL_KEY = "law4u_admin_rail";

function useStoredFlag(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === "1" || saved === "0") return saved === "1";
    } catch { /* storage unavailable */ }
    return initial;
  });
  useEffect(() => {
    try { localStorage.setItem(key, value ? "1" : "0"); } catch { /* ignore */ }
  }, [key, value]);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="am-theme-btn"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      )}
    </button>
  );
}

function AdminLogin({ onLogin, theme, onToggleTheme }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr]   = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await api("/api/auth/admin/login", {
        method: "POST",
        body: { email: form.email.trim(), password: form.password },
      });
      setAdminToken(token);
      setErr("");
      onLogin();
    } catch (error) {
      setErr(error.status === 401 ? "Invalid admin email or password." : error.message);
    }
  };

  return (
    <div className={`am-login-page ${theme === "dark" ? "am-dark" : ""}`}>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <form className="am-login-card" onSubmit={handleSubmit}>
        <BrandLogo size={56} wordmark={false} style={{ margin: "0 auto" }} />
        <h1 className="am-login-title">Admin Console</h1>
        <p className="am-login-sub">Law4u — Advocate Management</p>

        <div className="am-field">
          <label>Admin Email</label>
          <input
            type="email"
            placeholder="admin@law4u.in"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div className="am-field">
          <label>Password</label>
          <div className="am-pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Enter admin password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
            <button type="button" className="am-eye" onClick={() => setShowPw((p) => !p)}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {err && <p className="am-err">⚠ {err}</p>}

        <button type="submit" className="am-btn-primary">Login to Admin →</button>

        <Link to="/" className="am-back-link">← Back to site</Link>
      </form>
    </div>
  );
}

// ── Stat card ───────────────────────────────────────────────
function StatCard({ icon, label, value, tone, hint }) {
  return (
    <div className={`am-stat-card ${tone || ""}`}>
      {icon && <div className="am-stat-icon">{icon}</div>}
      <div style={{ minWidth: 0 }}>
        <div className="am-stat-value">{value}</div>
        <div className="am-stat-label">{label}</div>
        {hint && <div className="am-stat-hint">{hint}</div>}
      </div>
    </div>
  );
}

// ── Icon rail (mirrors the tabs; same setTab handlers) ─────
const RAIL_ICONS = {
  pending:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></svg>,
  all:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M17 13.5a6.5 6.5 0 0 1 4.5 6.5" /></svg>,
  messages:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
  questions: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7" /><path d="M12 17h.01" /></svg>,
  bookings:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
  requests:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" /></svg>,
  logout:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" /></svg>,
  collapse:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>,
  expand:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>,
};

function RailButton({ id, label, tab, setTab, count }) {
  return (
    <button
      type="button"
      className={`am-rail-btn ${tab === id ? "active" : ""}`}
      onClick={() => setTab(id)}
      aria-label={label}
      title={label}
      aria-current={tab === id ? "page" : undefined}
    >
      {RAIL_ICONS[id]}
      <span className="am-rail-label">{label}</span>
      {count > 0 && <span className="am-rail-dot">{count}</span>}
    </button>
  );
}

// ── Advocate row (All Advocates tab) ───────────────────────
function AdvocateRow({ adv, onEdit, onDelete }) {
  const STATUS_MAP = {
    approved: { bg: "#dcfce7", c: "#14532d", label: "Approved" },
    pending:  { bg: "#fef3c7", c: "#92400e", label: "Pending" },
    rejected: { bg: "#fee2e2", c: "#7f1d1d", label: "Rejected" },
  };
  const s = STATUS_MAP[adv.status] || STATUS_MAP.pending;

  return (
    <div className="am-row">
      <div className="am-row-main">
        <div className="am-row-avatar">{adv.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("").slice(0,2)}</div>
        <div>
          <div className="am-row-name">{adv.name}</div>
          <div className="am-row-sub">{adv.speciality} · {adv.city}</div>
        </div>
      </div>
      <div className="am-row-contact">
        <div>{adv.email}</div>
        <div>{adv.phone}</div>
      </div>
      <span className="am-status-pill" style={{ background: s.bg, color: s.c }}>{s.label}</span>
      <div className="am-row-actions">
        <button className="am-btn-edit" onClick={() => onEdit(adv)}>✎ Edit</button>
        <button className="am-btn-delete" onClick={() => onDelete(adv)}>🗑 Delete</button>
      </div>
    </div>
  );
}

// ── Pending approval card ──────────────────────────────────
function PendingCard({ adv, onApprove, onReject, onEdit }) {
  return (
    <div className="am-pending-card">
      <div className="am-row-main">
        <div className="am-row-avatar">{adv.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("").slice(0,2)}</div>
        <div>
          <div className="am-row-name">{adv.name}</div>
          <div className="am-row-sub">{adv.speciality} · {adv.city}</div>
        </div>
      </div>

      <div className="am-pending-details">
        <div><strong>Email:</strong> {adv.email}</div>
        <div><strong>Phone:</strong> {adv.phone}</div>
        <div><strong>Bar ID:</strong> {adv.barId}</div>
        <div><strong>Court:</strong> {adv.court}</div>
        <div><strong>Experience:</strong> {adv.experience}</div>
        <div><strong>Fee:</strong> {adv.fee}</div>
      </div>
      {adv.bio && <p className="am-pending-bio">{adv.bio}</p>}

      <div className="am-pending-actions">
        <button className="am-btn-approve" onClick={() => onApprove(adv.id)}>✓ Approve</button>
        <button className="am-btn-reject" onClick={() => onReject(adv.id)}>✕ Reject</button>
        <button className="am-btn-edit" onClick={() => onEdit(adv)}>✎ Edit first</button>
      </div>
    </div>
  );
}

// ── Add / Edit modal ────────────────────────────────────────
function AdvocateFormModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial, password: "" } : EMPTY_FORM);
  const [err, setErr] = useState({});

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!isEdit && !form.password) e.password = "Password is required for a new account";
    if (!form.city) e.city = "Select a city";
    if (!form.speciality) e.speciality = "Select a practice area";
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password; // keep existing password if left blank
    onSave(payload);
  };

  return (
    <div className="am-modal-overlay" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-modal-header">
          <h3>{isEdit ? "Edit Advocate" : "Add New Advocate"}</h3>
          <button className="am-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="am-modal-form">
          <div className="am-modal-grid">
            <div className="am-field">
              <label>Full Name *</label>
              <input value={form.name} onChange={(e) => setF("name", e.target.value)} />
              {err.name && <p className="am-err">⚠ {err.name}</p>}
            </div>

            <div className="am-field">
              <label>Phone *</label>
              <input value={form.phone} onChange={(e) => setF("phone", e.target.value)} maxLength={10} />
              {err.phone && <p className="am-err">⚠ {err.phone}</p>}
            </div>
          </div>

          <div className="am-field">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} />
            {err.email && <p className="am-err">⚠ {err.email}</p>}
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>City *</label>
              <select value={form.city} onChange={(e) => setF("city", e.target.value)}>
                <option value="">Select city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {err.city && <p className="am-err">⚠ {err.city}</p>}
            </div>

            <div className="am-field">
              <label>Practice Area *</label>
              <select value={form.speciality} onChange={(e) => setF("speciality", e.target.value)}>
                <option value="">Select speciality</option>
                {PRACTICE_AREAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {err.speciality && <p className="am-err">⚠ {err.speciality}</p>}
            </div>
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>Court</label>
              <select value={form.court} onChange={(e) => setF("court", e.target.value)}>
                <option value="">Select court</option>
                {COURTS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="am-field">
              <label>Experience</label>
              <input placeholder="e.g. 10 years" value={form.experience} onChange={(e) => setF("experience", e.target.value)} />
            </div>
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>Bar ID</label>
              <input value={form.barId} onChange={(e) => setF("barId", e.target.value)} />
            </div>

            <div className="am-field">
              <label>Fee</label>
              <input placeholder="e.g. ₹2,000 / consult" value={form.fee} onChange={(e) => setF("fee", e.target.value)} />
            </div>
          </div>

          <div className="am-field">
            <label>Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setF("bio", e.target.value)} />
          </div>

          <div className="am-modal-grid">
            <div className="am-field">
              <label>{isEdit ? "Reset Password (optional)" : "Password *"}</label>
              <input
                type="text"
                placeholder={isEdit ? "Leave blank to keep current password" : "Set a password"}
                value={form.password}
                onChange={(e) => setF("password", e.target.value)}
              />
              {err.password && <p className="am-err">⚠ {err.password}</p>}
            </div>

            <div className="am-field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setF("status", e.target.value)}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="am-modal-actions">
            <button type="button" className="am-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="am-btn-primary">
              {isEdit ? "Save Changes" : "Create Advocate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm modal ───────────────────────────────────
function ConfirmDeleteModal({ label, itemName, onCancel, onConfirm }) {
  return (
    <div className="am-modal-overlay" onClick={onCancel}>
      <div className="am-modal am-modal-sm" onClick={(e) => e.stopPropagation()}>
        <h3>{label}</h3>
        <p>
          This will permanently remove <strong>{itemName}</strong>. This can't be undone.
        </p>
        <div className="am-modal-actions">
          <button className="am-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="am-btn-delete-confirm" onClick={onConfirm}>Delete Permanently</button>
        </div>
      </div>
    </div>
  );
}

// ── Message row (Messages tab) ─────────────────────────────
function MessageRow({ msg, onOpen, onDelete }) {
  const isContact = msg.type === "contact";
  const title  = isContact ? msg.name : msg.orgName;
  const sub    = isContact ? (msg.subject || "(No subject)") : `${msg.partnershipType} · ${msg.contactName}`;
  const badge  = isContact
    ? { label: "Contact", bg: "#dbeafe", c: "#1e3a5f" }
    : { label: "Partner", bg: "#ede9fe", c: "#5b21b6" };

  return (
    <div className={`am-msg-row ${msg.read ? "" : "unread"}`} onClick={() => onOpen(msg)}>
      {!msg.read && <span className="am-msg-dot" />}
      <div className="am-msg-avatar">{(title || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</div>
      <div className="am-msg-body">
        <div className="am-msg-top">
          <span className="am-msg-title">{title}</span>
          <span className="am-msg-type-badge" style={{ background: badge.bg, color: badge.c }}>{badge.label}</span>
        </div>
        <div className="am-msg-sub">{sub}</div>
        <div className="am-msg-snippet">{msg.message}</div>
      </div>
      <div className="am-msg-right">
        <span className="am-msg-date">{formatDateTime(msg.createdAt)}</span>
        <button
          className="am-btn-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(msg); }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ── Message detail modal ───────────────────────────────────
function MessageDetailModal({ msg, onClose }) {
  const isContact = msg.type === "contact";
  return (
    <div className="am-modal-overlay" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-modal-header">
          <h3>{isContact ? "Contact Enquiry" : "Partnership Inquiry"}</h3>
          <button className="am-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="am-msg-detail">
          {isContact ? (
            <>
              <div className="am-detail-row"><strong>Name:</strong> {msg.name}</div>
              <div className="am-detail-row"><strong>Email:</strong> {msg.email}</div>
              {msg.phone && <div className="am-detail-row"><strong>Phone:</strong> {msg.phone}</div>}
              <div className="am-detail-row"><strong>Subject:</strong> {msg.subject}</div>
            </>
          ) : (
            <>
              <div className="am-detail-row"><strong>Organization:</strong> {msg.orgName}</div>
              <div className="am-detail-row"><strong>Contact Person:</strong> {msg.contactName}</div>
              <div className="am-detail-row"><strong>Email:</strong> {msg.email}</div>
              <div className="am-detail-row"><strong>Partnership Type:</strong> {msg.partnershipType}</div>
            </>
          )}
          <div className="am-detail-row"><strong>Received:</strong> {formatDateTime(msg.createdAt)}</div>

          <div className="am-detail-message">
            <strong>Message:</strong>
            <p>{msg.message}</p>
          </div>
        </div>

        <div className="am-modal-actions">
          <button className="am-btn-secondary" onClick={onClose}>Close</button>
          <a className="am-btn-primary" href={`mailto:${msg.email}`}>✉️ Reply by Email</a>
        </div>
      </div>
    </div>
  );
}

function QuestionRow({ question, onOpen, onDelete }) {
  return (
    <div className={`am-msg-row ${question.read ? "" : "unread"}`} onClick={() => onOpen(question)}>
      {!question.read && <span className="am-msg-dot" />}
      <div className="am-msg-avatar">?</div>
      <div className="am-msg-body">
        <div className="am-msg-top">
          <span className="am-msg-title">{question.name}</span>
          <span className="am-msg-type-badge" style={{ background: "#dcfce7", color: "#166534" }}>{question.category}</span>
        </div>
        <div className="am-msg-sub">{formatDateTime(question.createdAt)}</div>
        <div className="am-msg-snippet">{question.question}</div>
      </div>
      <div className="am-msg-right">
        <button className="am-btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(question); }}>🗑</button>
      </div>
    </div>
  );
}

function QuestionDetailModal({ question, onClose }) {
  return (
    <div className="am-modal-overlay" onClick={onClose}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        <div className="am-modal-header">
          <h3>Legal Question</h3>
          <button className="am-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="am-msg-detail">
          <div className="am-detail-row"><strong>Category:</strong> {question.category}</div>
          <div className="am-detail-row"><strong>From:</strong> {question.name}</div>
          {question.phone && <div className="am-detail-row"><strong>Phone:</strong> {question.phone}</div>}
          <div className="am-detail-row"><strong>Received:</strong> {formatDateTime(question.createdAt)}</div>
          <div className="am-detail-message"><strong>Question:</strong><p>{question.question}</p></div>
          <div className="am-detail-message"><strong>Description:</strong><p>{question.description}</p></div>
        </div>
        <div className="am-modal-actions"><button className="am-btn-secondary" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN ADMIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [theme, toggleTheme] = useAdminTheme();
  const [railOpen, toggleRail] = useStoredFlag(RAIL_KEY, false);
  const [advocates, setAdvocates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tab, setTab] = useState("pending"); // pending | all | messages | questions
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [msgTypeFilter, setMsgTypeFilter] = useState("all"); // all | contact | partner
  const [bookings,    setBookings]    = useState({});
    const [allReqs,     setAllReqs]     = useState({});
    const [bookSearch,   setBookSearch]   = useState("");
    const [bookingModal,  setBookingModal]  = useState(null);
    const [reqModal,      setReqModal]      = useState(null);
    const [, setToast]       = useState(null);
  
  
  const [editing, setEditing] = useState(null);       // advocate being edited, or null
  const [adding, setAdding] = useState(false);         // add-new modal open?
  const [deleting, setDeleting] = useState(null);      // advocate pending delete confirm
  const [openMessage, setOpenMessage] = useState(null); // message being viewed
  const [deletingMsg, setDeletingMsg] = useState(null); // message pending delete confirm
  const [openQuestion, setOpenQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  // Restore a session if the stored token is still valid.
  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    api("/api/auth/me", { token })
      .then((me) => setAuthed(me.role === "admin"))
      .catch(() => setAdminToken(null));
  }, []);

  // Admin sees every status (pending/rejected too), so pull the full list.
  const refreshAdvocates = useCallback(() => {
    loadAdvocates({ all: true })
      .then(setAdvocates)
      .catch(() => setAdvocates(getAdvocates()));
  }, []);
  const refreshMessages  = () => setMessages(getMessages());
  const refreshQuestions = () => setQuestions(getQuestions());

   // ── Toast helper ──────────────────────────────────────────
    const showToast = useCallback((msg, type="success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3200);
    }, []);

  useEffect(() => {
    if (authed) {
      refreshAdvocates();
      refreshMessages();
      refreshQuestions();
      setAllReqs(loadRequests());
      setBookings(loadBookings());
    }
  }, [authed, refreshAdvocates]);

  // Pick up new submissions if Contact/Partners were filled out in another tab
  useEffect(() => {
    if (!authed) return;
    const onFocus = () => { refreshAdvocates(); refreshMessages(); refreshQuestions(); setAllReqs(loadRequests()); setBookings(loadBookings()); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [authed, refreshAdvocates]);
    const allReqList = useMemo(() => Object.values(allReqs).flat(), [allReqs]);
    const dashStats = useMemo(() => {
      const totalReqs = allReqList.length;
      const accReqs   = allReqList.filter(r => r.status === "accepted").length;
      const penReqs   = allReqList.filter(r => r.status === "pending").length;
      const decReqs   = allReqList.filter(r => r.status === "declined").length;
      return { totalReqs, accReqs, penReqs, decReqs };
    }, [allReqList]);

  const handleLogout = () => {
    setAdminToken(null);
    setAuthed(false);
  };
  const pending  = useMemo(() => advocates.filter(a => a.status === "pending"), [advocates]);
  const approved = useMemo(() => advocates.filter(a => a.status === "approved"), [advocates]);
  const unreadMessages = useMemo(() => messages.filter(m => !m.read), [messages]);
  const unreadQuestions = useMemo(() => questions.filter(q => !q.read), [questions]);

  const visibleAll = useMemo(() => {
    let list = advocates;
    if (statusFilter !== "all") list = list.filter(a => a.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.city || "").toLowerCase().includes(q) ||
        (a.speciality || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [advocates, statusFilter, search]);
  

  const visibleMessages = useMemo(() => {
    let list = messages;
    if (msgTypeFilter !== "all") list = list.filter(m => m.type === msgTypeFilter);
    return list;
  }, [messages, msgTypeFilter]);

  const withApi = useCallback(async (action, okMsg) => {
    try {
      await action();
      if (okMsg) showToast(okMsg);
    } catch (error) {
      showToast(error.message || "Request failed", "error");
    } finally {
      refreshAdvocates();
    }
  }, [refreshAdvocates, showToast]);

  const handleApprove = (id) => withApi(() => approveAdvocate(id), "Advocate approved");
  const handleReject  = (id) => withApi(() => rejectAdvocate(id), "Advocate rejected");

  const handleSaveNew = async (form) => {
    await addAdvocate(form);   // throws → AddModal shows the message
    setAdding(false);
    refreshAdvocates();
  };
   // ── Bookings filtered ─────────────────────────────────────
    const filteredBookings = useMemo(() => {
      const list = Object.values(bookings);
      if (!bookSearch.trim()) return list;
      const q = bookSearch.toLowerCase();
      return list.filter(b =>
        (b.clientName||"").toLowerCase().includes(q) ||
        (b.advocateName||"").toLowerCase().includes(q) ||
        (b.clientCity||"").toLowerCase().includes(q) ||
        (b.advocateSpec||"").toLowerCase().includes(q)
      );
    }, [bookings, bookSearch]);

  const handleSaveEdit = (form) =>
    withApi(() => updateAdvocate(editing.id, form), "Advocate updated").then(() => setEditing(null));

  const handleConfirmDelete = () =>
    withApi(() => deleteAdvocate(deleting.id), "Advocate deleted").then(() => setDeleting(null));

  const handleOpenMessage = (msg) => {
    if (!msg.read) {
      markAsRead(msg.id);
      refreshMessages();
    }
    setOpenMessage(msg);
  };

  const handleConfirmDeleteMessage = () => {
    deleteMessage(deletingMsg.id);
    setDeletingMsg(null);
    refreshMessages();
  };

  const handleOpenQuestion = (question) => {
    if (!question.read) {
      markQuestionAsRead(question.id);
      refreshQuestions();
    }
    setOpenQuestion(question);

  };
   // Change request status (from ReqDetailModal or inline)
    const handleReqStatusChange = useCallback((advocateId, req, newStatus) => {
      const reqs     = loadRequests();
      const list     = reqs[advocateId] || [];
      const updated  = list.map(r => {
        const match = (r.id && r.id === req.id) || (r.clientName === req.clientName && r.requestedAt === req.requestedAt);
        if (!match) return r;
        const upd = { ...r, status: newStatus, updatedAt: new Date().toISOString() };
        if (newStatus === "accepted") upd.acceptedAt = new Date().toISOString();
        return upd;
      });
  
      reqs[advocateId] = updated;
      saveRequests(reqs);
      setAllReqs({ ...reqs });
  
      // If accepted → save to bookings AND post to server
      if (newStatus === "accepted") {
        const acceptedReq = updated.find(r => {
          const match = (r.id && r.id === req.id) || (r.clientName === req.clientName);
          return match;
        });
        const adv = advocates.find(a => String(a.id) === String(advocateId));
        if (adv && acceptedReq) {
          persistBooking(acceptedReq, adv);
          setBookings(loadBookings());
          updateAdvocate(adv.id, { lastBookingAt: new Date().toISOString() }).catch(() => {});
          showToast("✅ Booking accepted");
        }
      } else {
        showToast(`Request ${newStatus}`);
      }
    }, [advocates, showToast]);


  const handleConfirmDeleteQuestion = () => {
    deleteQuestion(deletingQuestion.id);
    setDeletingQuestion(null);
    refreshQuestions();
  };
  

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <div className={`am-page ${theme === "dark" ? "am-dark" : ""}`}>
      <nav className={`am-rail ${railOpen ? "am-rail-open" : ""}`} aria-label="Admin sections">
        <Link to="/" className="am-rail-logo" aria-label="AdvocatesHub home">
          <img className="am-rail-logo-mark" src={`${process.env.PUBLIC_URL || ""}/brand/logo-mark.svg`} alt="" />
          <span className="am-rail-label">Advocates<b>Hub</b></span>
        </Link>
        <RailButton id="pending"   label="Pending approvals" tab={tab} setTab={setTab} count={pending.length} />
        <RailButton id="all"       label="All advocates"     tab={tab} setTab={setTab} />
        <RailButton id="messages"  label="Messages"          tab={tab} setTab={setTab} count={unreadMessages.length} />
        <RailButton id="questions" label="Questions"         tab={tab} setTab={setTab} count={unreadQuestions.length} />
        <RailButton id="bookings"  label="Client bookings"   tab={tab} setTab={setTab} />
        <RailButton id="requests"  label="All requests"      tab={tab} setTab={setTab} />
        <div className="am-rail-spacer" />
        <button type="button" className="am-rail-btn am-rail-logout" onClick={handleLogout} aria-label="Logout" title="Logout">
          {RAIL_ICONS.logout}
          <span className="am-rail-label">Logout</span>
        </button>
        <button
          type="button"
          className="am-rail-btn am-rail-toggle"
          onClick={toggleRail}
          aria-label={railOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={railOpen}
          title={railOpen ? "Collapse" : "Expand"}
        >
          {railOpen ? RAIL_ICONS.collapse : RAIL_ICONS.expand}
          <span className="am-rail-label">Collapse</span>
        </button>
      </nav>

      <div className="am-main">
      <div className="am-topbar">
        <div className="am-topbar-left">
          <Link to="/" className="am-logo">
            <BrandLogo size={30} wordmark={false} />
            <span>Advocates<span style={{ color: "var(--adm-accent)" }}>Hub</span></span>
            <span className="am-logo-tag">Admin console</span>
          </Link>
          <span className="am-live-badge">Live · API connected</span>
        </div>
        <div className="am-topbar-right">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <div className="am-admin-avatar" aria-label="Administrator">AD</div>
          <button className="am-logout-btn" onClick={handleLogout}>
            Logout ↩
          </button>
        </div>
      </div>

      <div className="am-container">

        {/* ── Stats ── */}
        <div className="am-stats-row">
          <StatCard label="Total advocates"  value={advocates.length}      hint="All registered accounts" tone="am-tone-navy" />
          <StatCard label="Pending approval" value={pending.length}        hint="Needs your action" tone="am-tone-warn" />
          <StatCard label="Approved"         value={approved.length}       hint={advocates.length ? `${Math.round((approved.length / advocates.length) * 100)}% of directory` : "—"} tone="am-tone-good" />
          <StatCard label="Unread messages"  value={unreadMessages.length} hint="Contact & partner forms" tone="am-tone-blue" />
          <StatCard label="New questions"    value={unreadQuestions.length} hint="Awaiting an answer" tone="am-tone-violet" />
        </div>

        {/* ── Tabs ── */}
        <div className="am-panel">
        <div className="am-tabs">
          <button className={`am-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
            Pending Approvals {pending.length > 0 && <span className="am-tab-badge">{pending.length}</span>}
          </button>
          <button className={`am-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
            All Advocates
          </button>
          <button className={`am-tab ${tab === "messages" ? "active" : ""}`} onClick={() => setTab("messages")}>
            Messages {unreadMessages.length > 0 && <span className="am-tab-badge">{unreadMessages.length}</span>}
          </button>
          <button className={`am-tab ${tab === "questions" ? "active" : ""}`} onClick={() => setTab("questions")}>
            Questions {unreadQuestions.length > 0 && <span className="am-tab-badge">{unreadQuestions.length}</span>}
          </button>
          <button className={`am-tab ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>
          Client Bookings {Object.keys(bookings).length > 0 && <span className="am-tab-badge">{Object.keys(bookings).length}</span>}
         </button>
         <button className={`am-tab ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>
           All Requests {dashStats.totalReqs > 0 && <span className="am-tab-badge">{dashStats.totalReqs}</span>}
        </button>
          
        </div>

        {/* ── Pending Approvals tab ── */}
        {tab === "pending" && (
          <div className="am-section">
            {pending.length === 0 ? (
              <div className="am-empty">🎉 No pending applications right now.</div>
            ) : (
              <div className="am-pending-grid">
                {pending.map((adv) => (
                  <PendingCard
                    key={adv.id}
                    adv={adv}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onEdit={setEditing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── All Advocates tab ── */}
        {tab === "all" && (
          <div className="am-section">
            <div className="am-toolbar">
              <input
                className="am-search"
                placeholder="Search by name, email, city, speciality…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="am-status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="am-btn-primary" onClick={() => setAdding(true)}>+ Add Advocate</button>
            </div>

            {visibleAll.length === 0 ? (
              <div className="am-empty">No advocates match your search.</div>
            ) : (
              <div className="am-list">
                {visibleAll.map((adv) => (
                  <AdvocateRow key={adv.id} adv={adv} onEdit={setEditing} onDelete={setDeleting} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Messages tab ── */}
        {tab === "messages" && (
          <div className="am-section">
            <div className="am-toolbar">
              <div className="am-msg-filter-tabs">
                {["all", "contact", "partner"].map((f) => (
                  <button
                    key={f}
                    className={`am-msg-filter-tab ${msgTypeFilter === f ? "active" : ""}`}
                    onClick={() => setMsgTypeFilter(f)}
                  >
                    {f === "all" ? "All" : f === "contact" ? "Contact" : "Partners"}
                  </button>
                ))}
              </div>
            </div>

            {visibleMessages.length === 0 ? (
              <div className="am-empty">📭 No messages yet. Submissions from the Contact and Partners pages will show up here.</div>
            ) : (
              <div className="am-msg-list">
                {visibleMessages.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    onOpen={handleOpenMessage}
                    onDelete={setDeletingMsg}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
          {/* ═══════════════════════════════════════════════
              BOOKINGS TAB — who booked whom
              ═══════════════════════════════════════════════ */}
          {tab === "bookings" && (
            <div className="am-section am-bk">
              <div className="am-bk-head">
                <h2 className="am-bk-title">
                  Client bookings
                  <span className="am-count-pill">{Object.keys(bookings).length} total</span>
                </h2>
                <input className="am-search am-bk-search" placeholder="Search client or advocate…" value={bookSearch}
                  onChange={e=>setBookSearch(e.target.value)} />
              </div>

              {/* Summary stats */}
              <div className="am-mini-stats">
                <StatCard label="Total bookings"    value={Object.keys(bookings).length} tone="am-tone-navy" />
                <StatCard label="Accepted"          value={Object.values(bookings).filter(b=>b.status==="accepted").length} tone="am-tone-good" />
                <StatCard label="Cases in progress" value={Object.values(bookings).filter(b=>b.caseStage==="Case Progress").length} tone="am-tone-warn" />
                <StatCard label="Cases closed"      value={Object.values(bookings).filter(b=>b.caseStage==="Close Case").length} tone="am-tone-blue" />
              </div>

              {filteredBookings.length === 0 ? (
                <div className="am-empty am-empty-rich">
                  <div className="am-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                  </div>
                  <div className="am-empty-title">{bookSearch ? `No bookings matching "${bookSearch}"` : "No bookings yet"}</div>
                  <div>When a client&rsquo;s request is accepted, the booking appears here.</div>
                </div>
              ) : (
                <div className="am-list">
                  {filteredBookings.map((b,i) => (
                    <div key={i} className="am-row am-bk-row">
                      {/* Client side */}
                      <div className="am-bk-party">
                        <Avi name={b.clientName} size={42} />
                        <div className="am-bk-party-text">
                          <div className="am-row-name">{b.clientName}</div>
                          <div className="am-row-sub">Client</div>
                          {b.clientPhone && <div className="am-row-contact">{b.clientPhone}</div>}
                        </div>
                      </div>

                      <div className="am-bk-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </div>

                      {/* Advocate side */}
                      <div className="am-bk-party am-bk-party-grow">
                        <Avi name={b.advocateName} color={colorFor(b.advocateId)} size={42} />
                        <div className="am-bk-party-text">
                          <div className="am-row-name">{b.advocateName}</div>
                          <div className="am-row-sub">Advocate</div>
                          {b.advocateSpec && <div className="am-row-contact">{b.advocateSpec}</div>}
                        </div>
                      </div>

                      {/* Status & stage */}
                      <div className="am-bk-status">
                        <SBadge status={b.status} />
                        <span className="am-stage-pill">{b.caseStage||"Start Case"}</span>
                        <span className="am-msg-date">{fmtDate(b.acceptedAt)}</span>
                      </div>

                      <button className="am-btn-edit" onClick={()=>setBookingModal(b)}>View details</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              ALL REQUESTS TAB
              ═══════════════════════════════════════════════ */}
          {tab === "requests" && (
            <div className="am-section am-bk">
              <div className="am-bk-head">
                <h2 className="am-bk-title">All client requests</h2>
              </div>

              {/* Global stats */}
              <div className="am-mini-stats">
                <StatCard label="Total requests" value={dashStats.totalReqs} tone="am-tone-navy" />
                <StatCard label="Accepted"       value={dashStats.accReqs} tone="am-tone-good" />
                <StatCard label="Pending"        value={dashStats.penReqs} tone="am-tone-warn" />
                <StatCard label="Declined"       value={dashStats.decReqs} tone="am-tone-bad" />
              </div>

              {/* Per-advocate sections */}
              {advocates.map(adv => {
                const list = allReqs[adv.id] || [];
                if (list.length === 0) return null;
                const stats = getReqStats(adv.id, allReqs);
                return (
                  <div key={adv.id} className="am-req-card">
                    {/* Header */}
                    <div className="am-req-head">
                      <Avi name={adv.name} color={colorFor(adv.id)} size={40} src={adv.avatar||adv.image} />
                      <div className="am-req-head-text">
                        <div className="am-row-name">{adv.name}</div>
                        <div className="am-row-sub">{adv.speciality||adv.practiceArea} · {adv.city||adv.location}</div>
                        <ReqStatsBar stats={stats} />
                      </div>
                      <button className="am-btn-primary am-btn-sm" onClick={()=>setReqModal(adv)}>Manage requests →</button>
                    </div>

                    {/* Request list */}
                    <div className="am-req-list">
                      {list.slice(0,3).map((req,i)=>(
                        <div key={i} className="am-req-item">
                          <Avi name={req.clientName} size={30} />
                          <div className="am-req-item-text">
                            <div className="am-req-item-name">{req.clientName}</div>
                            <div className="am-msg-date">{fmtDate(req.requestedAt)}</div>
                            {req.message && <div className="am-req-item-msg">{req.message.slice(0,60)}{req.message.length>60?"…":""}</div>}
                          </div>
                          <SBadge status={req.status} />
                          {req.status === "pending" && (
                            <div className="am-row-actions">
                              <button className="am-btn-approve" onClick={()=>handleReqStatusChange(adv.id,req,"accepted")}>✓ Accept</button>
                              <button className="am-btn-reject" onClick={()=>handleReqStatusChange(adv.id,req,"declined")}>✕ Decline</button>
                            </div>
                          )}
                        </div>
                      ))}
                      {list.length > 3 && (
                        <button className="am-link-btn" onClick={()=>setReqModal(adv)}>
                          + {list.length-3} more requests — View all →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {dashStats.totalReqs === 0 && (
                <div className="am-empty am-empty-rich">
                  <div className="am-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
                  </div>
                  <div className="am-empty-title">No requests yet</div>
                  <div>Consultation requests sent from advocate profiles will appear here.</div>
                </div>
              )}
            </div>
          )}

        {tab === "questions" && (
          <div className="am-section">
            {questions.length === 0 ? (
              <div className="am-empty">❓ No legal questions submitted yet.</div>
            ) : (
              <div className="am-msg-list">
                {questions.map((question) => (
                  <QuestionRow key={question.id} question={question} onOpen={handleOpenQuestion} onDelete={setDeletingQuestion} />
                ))}
              </div>
            )}
          </div>
        )}

        </div>{/* /am-panel */}
      </div>{/* /am-container */}
      </div>{/* /am-main */}

      {adding && (
        <AdvocateFormModal
          initial={null}
          onClose={() => setAdding(false)}
          onSave={handleSaveNew}
        />
      )}

      {editing && (
        <AdvocateFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          label="Delete this advocate?"
          itemName={`${deleting.name}'s account`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {openMessage && (
        <MessageDetailModal
          msg={openMessage}
          onClose={() => setOpenMessage(null)}
        />
      )}

      {deletingMsg && (
        <ConfirmDeleteModal
          label="Delete this message?"
          itemName="this message"
          onCancel={() => setDeletingMsg(null)}
          onConfirm={handleConfirmDeleteMessage}
        />
      )}

      {openQuestion && <QuestionDetailModal question={openQuestion} onClose={() => setOpenQuestion(null)} />}

      {deletingQuestion && (
        <ConfirmDeleteModal
          label="Delete this question?"
          itemName="this legal question"
          onCancel={() => setDeletingQuestion(null)}
          onConfirm={handleConfirmDeleteQuestion}
        />
      )}
      {reqModal && (
        <ReqDetailModal
          adv={reqModal} allReqs={allReqs}
          onClose={() => setReqModal(null)}
          onStatusChange={handleReqStatusChange}
        />
      )}
      {bookingModal && (
        <BookingModal booking={bookingModal} onClose={() => setBookingModal(null)} />
      )}
    </div>
  );
}