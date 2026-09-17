// ============================================================
//   AdvocateDashboard.js  —  Law4u Advocate Account Page
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdvocateDashboard.css";
import { getAdvocateById, logoutAdvocate } from "../data/Advocatesstore";
import Chatbot from "./Chatbot";


const SESSION_KEY  = "law4u_advocate_id";
const REQUESTS_KEY = "law4u_requests";
const EARNINGS_OVERRIDES_KEY = "law4u_earnings_overrides";

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

function loadEarningsOverrides() {
  try {
    const raw = localStorage.getItem(EARNINGS_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEarningsOverrides(all) {
  localStorage.setItem(EARNINGS_OVERRIDES_KEY, JSON.stringify(all));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatBox({ icon, label, value }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-icon">{icon}</div>
      <div>
        <div className="ad-stat-value">{value}</div>
        <div className="ad-stat-label">{label}</div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { key: "dashboard", icon: "🏠", label: "Dashboard" },
  { key: "requests",  icon: "📥", label: "Client Requests" },
  { key: "sessions",  icon: "📅", label: "My Sessions" },
  { key: "cases",     icon: "⚖️", label: "My Cases" },
  { key: "earnings",  icon: "💰", label: "Earnings" },
  { key: "profile",   icon: "👤", label: "My Profile" },
  { key: "settings",  icon: "⚙️", label: "Settings" },
];

function StatusBadge({ status }) {
  const MAP = {
    pending:  { label: "Pending",  bg: "#fef3c7", c: "#92400e" },
    accepted: { label: "Accepted", bg: "#dcfce7", c: "#14532d" },
    declined: { label: "Declined", bg: "#fee2e2", c: "#7f1d1d" },
    "accepted status": { label: "Accepted Status", bg: "#dcfce7", c: "#14532d" },
  };
  const s = MAP[status] || MAP.pending;
  return <span className="ad-status-badge" style={{ background: s.bg, color: s.c }}>{s.label}</span>;
}

function RequestCard({ req, onAccept, onDecline, onSaveStage }) {
  const [caseStage, setCaseStage] = useState(req.caseStage || "Start Case");
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  return (
    <div className="ad-request-card">
      <div className="ad-request-top">
        <div className="ad-request-avatar">{req.clientName.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
        <div className="ad-request-info">
          <div className="ad-request-name">{req.clientName}</div>
          <div className="ad-request-meta">
            {req.clientCity ? `${req.clientCity} · ` : ""}{formatDate(req.requestedAt)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <StatusBadge status={req.status} />
        </div>
      </div>

      {(req.clientPhone || req.clientEmail) && (
        <div className="ad-request-contact">
          {req.clientPhone && <span className="ad-request-contact-item">📱 {req.clientPhone}</span>}
          {req.clientEmail && <span className="ad-request-contact-item">✉️ {req.clientEmail}</span>}
        </div>
      )}

      <p className="ad-request-msg">{req.message}</p>

      {req.status === "pending" && (
        <div className="ad-request-actions">
          <button className="ad-btn-accept" onClick={() => onAccept(req.id)}>✓ Accept</button>
          <button className="ad-btn-decline" onClick={() => onDecline(req.id)}>✕ Decline</button>
        </div>
      )}

      {req.status === "accepted" && (
        <div className="ad-case-stage" style={{ marginTop: "12px" }}>
          {req.isSaved && !isEditing ? (
            <div className="ad-saved-indicator" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {showSavedAlert && (
                <div className="ad-alert-banner">
                  <span>Successfully saved status!</span>
                  <button onClick={() => setShowSavedAlert(false)} className="ad-alert-close">×</button>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span className={`ad-stage-pill ${req.caseStage.toLowerCase().replace(" ", "-")}`}>
                  ✓ Current Case Status: {req.caseStage}
                </span>
                <button className="ad-btn-secondary" onClick={() => { setShowSavedAlert(false); setIsEditing(true); }}>
                  Edit Status ✎
                </button>
              </div>
            </div>
          ) : (
            <>
              <label htmlFor={`case-stage-${req.id}`} className="ad-label">Case status</label>
              <select
                id={`case-stage-${req.id}`}
                value={caseStage}
                onChange={event => setCaseStage(event.target.value)}
                className="ad-select"
              >
                <option value="Start Case">Start Case</option>
                <option value="Case Progress">Case Progress</option>
                <option value="Close Case">Close Case</option>
              </select>
              
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button className="ad-btn-primary" onClick={() => { onSaveStage(req.id, caseStage); setIsEditing(false); setShowSavedAlert(true); }}>
                  Save Status
                </button>
                {req.isSaved && (
                  <button className="ad-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdvocateDashboard() {
  const navigate = useNavigate();
  const [advocateId, setAdvocateId] = useState(null);
  const [requests, setRequests]     = useState([]);
  const [activeNav, setActiveNav]   = useState("dashboard");
  const [filter, setFilter]         = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [ready, setReady]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Earnings Overrides State: { [reqId]: { clientName, requestedAt, amount, paymentStatus } }
  const [earningsOverrides, setEarningsOverrides] = useState({});
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingEarningId, setEditingEarningId] = useState(null);
  const [editForm, setEditForm] = useState({ clientName: "", requestedAt: "", amount: "", paymentStatus: "" });

  useEffect(() => {
    const idStr = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!idStr) {
      navigate("/login");
      return;
    }
    setAdvocateId(Number(idStr));
    setReady(true);
  }, [navigate]);

  const advocate = useMemo(
    () => (advocateId ? getAdvocateById(advocateId) : null),
    [advocateId]
  );

  useEffect(() => {
    if (ready && advocate && advocate.status !== "approved") {
      logoutAdvocate();
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      navigate("/login");
    }
  }, [ready, advocate, navigate]);

  useEffect(() => {
    if (!advocateId) return;
    const refresh = () => {
      const all = loadAllRequests();
      const list = all[advocateId] || [];
      list.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
      setRequests(list);

      const allOverrides = loadEarningsOverrides();
      setEarningsOverrides(allOverrides[advocateId] || {});
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [advocateId]);

  const updateRequestStatus = (reqId, status, extra = {}) => {
    const all = loadAllRequests();
    const list = (all[advocateId] || []).map(r => r.id === reqId ? { ...r, status, ...extra } : r);
    all[advocateId] = list;
    saveAllRequests(all);
    setRequests(list);
  };

  const saveCaseStage = (reqId, caseStage) => {
    updateRequestStatus(reqId, "accepted", { caseStage, isSaved: true });
  };

  const handleSaveEarningEdit = (reqId) => {
    const allOverrides = loadEarningsOverrides();
    const currentAdvOverrides = allOverrides[advocateId] || {};
    
    const updatedRecord = {
      clientName: editForm.clientName,
      requestedAt: editForm.requestedAt,
      amount: editForm.amount,
      paymentStatus: editForm.paymentStatus,
    };

    currentAdvOverrides[reqId] = updatedRecord;
    allOverrides[advocateId] = currentAdvOverrides;
    saveEarningsOverrides(allOverrides);
    setEarningsOverrides({ ...currentAdvOverrides });
    setEditingEarningId(null);
  };

  const handleLogout = () => {
    logoutAdvocate();
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/login");
  };

  const filteredRequests = requests.filter(r => {
    let matchesFilter = true;
    if (filter === "pending") matchesFilter = r.status === "pending";
    else if (filter === "accepted") matchesFilter = r.status === "accepted" && !r.isSaved;
    else if (filter === "declined") matchesFilter = r.status === "declined";
    else if (filter === "accepted status") matchesFilter = r.status === "accepted" && r.isSaved;

    const matchesSearch = r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.clientCity && r.clientCity.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;

  const acceptedRequests = useMemo(() => {
    return requests.filter(r => r.status === "accepted" || r.status === "accepted status");
  }, [requests]);

  if (!ready) return null;

  if (!advocate) {
    return (
      <div className="ad-page">
        <div className="ad-card ad-notfound">
          <h2>Account not found</h2>
          <p>We couldn't find an advocate profile for this session.</p>
          <button className="ad-btn-primary" onClick={handleLogout}>Back to Login</button>
        </div>
      </div>
    );
  }

  const filterOptions = [
    { key: "all", label: "All Requests", icon: "📋" },
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "accepted", label: "Accepted", icon: "✅" },
    { key: "declined", label: "Declined", icon: "❌" },
    { key: "accepted status", label: "Accepted Status", icon: "📂" },
  ];

  return (
    <div className="ad-page" onClick={() => setActiveMenuId(null)}>
      {/* ── Top Bar ── */}
      <div className="ad-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="ad-hamburger-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open Menu">
            ☰
          </button>
          <Link to="/" className="ad-logo">
            <span style={{ color: "#2563eb", fontWeight: 800 }}>Advocates </span>
            <span style={{ color: "#dc2626", fontWeight: 800 }}>Hub</span>
          </Link>
        </div>
        <div className="ad-topbar-actions">
          <Link to="/" className="ad-site-btn">Go to Site</Link>
          <button className="ad-logout-btn" onClick={handleLogout}>Logout ↩</button>
        </div>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileMenuOpen && (
        <div className="ad-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="ad-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="ad-drawer-header">
              <h3>Navigation Menu</h3>
              <button className="ad-drawer-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <div className="ad-drawer-body">
              <nav className="ad-drawer-nav-list">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.key}
                    className={`ad-drawer-nav-item ${activeNav === item.key ? "active" : ""}`}
                    onClick={() => { setActiveNav(item.key); setMobileMenuOpen(false); }}
                  >
                    <span>{item.icon}</span> {item.label}
                    {item.key === "requests" && pendingCount > 0 && (
                      <span className="ad-badge-count">{pendingCount}</span>
                    )}
                  </button>
                ))}
              </nav>
              <hr className="ad-divider" />
              <button className="ad-drawer-logout" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                Logout ↩
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dashboard Layout ── */}
      <div className="ad-dashboard-layout">
        
        {/* Left Sidebar Navigation (Desktop) */}
        <aside className="ad-sidebar-nav">
          <div className="ad-sidebar-user-brief">
            <div className="ad-sidebar-avatar">
              {advocate.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="ad-sidebar-name">{advocate.name}</div>
              <div className="ad-sidebar-role">Advocate Portal</div>
            </div>
          </div>

          <nav className="ad-sidebar-menu">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className={`ad-sidebar-link ${activeNav === item.key ? "active" : ""}`}
              >
                <span className="ad-link-icon">{item.icon}</span>
                <span className="ad-link-label">{item.label}</span>
                {item.key === "requests" && pendingCount > 0 && (
                  <span className="ad-badge-count">{pendingCount}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="ad-container">
          
          {/* VIEW: DASHBOARD */}
          {activeNav === "dashboard" && (
            <div className="ad-fade-in">
              <div className="ad-card ad-profile-card">
                <div className="ad-profile-top">
                  <div className="ad-avatar" style={{ background: advocate.avatar ? "transparent" : "#eff6ff" }}>
                    {advocate.avatar ? (
                      <img src={advocate.avatar} alt={advocate.name} className="ad-avatar-img" />
                    ) : (
                      advocate.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("")
                    )}
                  </div>
                  <div className="ad-profile-main">
                    <h1 className="ad-profile-name">{advocate.name}</h1>
                    <p className="ad-profile-spec">{advocate.speciality} · {advocate.city}</p>
                    <div className="ad-availability">🟢 {advocate.availability}</div>
                  </div>
                  <div className="ad-rating-pill">⭐ {advocate.rating}</div>
                </div>

                <p className="ad-bio">{advocate.bio}</p>

                <div className="ad-stats-row">
                  <StatBox icon="📁" label="Cases Handled" value={advocate.cases} />
                  <StatBox icon="⏳" label="Experience" value={advocate.experience} />
                  <StatBox icon="💰" label="Fee" value={advocate.fee} />
                  <StatBox icon="📨" label="Pending Requests" value={pendingCount} />
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CLIENT REQUESTS */}
          {activeNav === "requests" && (
            <div className="ad-fade-in">
              <div className="ad-card ad-requests-card">
                <div className="ad-requests-header">
                  <h2>Client Connection Requests</h2>
                  <div className="ad-filter-pills">
                    {filterOptions.map(f => (
                      <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`ad-pill-btn ${filter === f.key ? "active" : ""}`}
                      >
                        {f.icon} {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="🔍 Search client by name or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ad-search-input"
                  />
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="ad-empty">
                    {requests.length === 0
                      ? "No consultation requests yet."
                      : "No matching client requests found for this filter."}
                  </div>
                ) : (
                  <div className="ad-requests-list">
                    {filteredRequests.map(req => (
                      <RequestCard
                        key={req.id}
                        req={req}
                        onAccept={(id) => updateRequestStatus(id, "accepted")}
                        onDecline={(id) => updateRequestStatus(id, "declined")}
                        onSaveStage={saveCaseStage}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: MY SESSIONS */}
          {activeNav === "sessions" && (
            <div className="ad-fade-in">
              <div className="ad-card">
                <h2>📅 My Sessions / Consultations</h2>
                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px", marginBottom: "20px" }}>
                  Scheduled attendance dates and consultation slots for clients whose requests you have accepted.
                </p>

                {acceptedRequests.length === 0 ? (
                  <div className="ad-empty">No active consultation sessions found. Accept client connection requests to populate sessions.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {acceptedRequests.map(req => {
                      const override = earningsOverrides[req.id] || {};
                      const displayName = override.clientName || req.clientName;
                      const displayDate = override.requestedAt || req.requestedAt;

                      return (
                        <div key={req.id} style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                            <div>
                              <h3 style={{ fontSize: "16px", color: "#0f172a" }}>{displayName}</h3>
                              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                                {req.clientPhone ? `📱 ${req.clientPhone} ` : ""} {req.clientEmail ? `| ✉️ ${req.clientEmail}` : ""}
                              </p>
                            </div>
                            <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                              Requested Date: {formatDate(displayDate)}
                            </span>
                          </div>
                          <p style={{ fontSize: "14px", color: "#334155", marginTop: "10px", background: "#ffffff", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <strong>Note:</strong> {req.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: MY CASES */}
          {activeNav === "cases" && (
            <div className="ad-fade-in">
              <div className="ad-card">
                <h2>⚖️ My Cases Tracker</h2>
                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px", marginBottom: "20px" }}>
                  All accepted client profiles and their respective progress stages.
                </p>

                {acceptedRequests.length === 0 ? (
                  <div className="ad-empty">No active cases found. Accept requests to start tracking cases.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {acceptedRequests.map(req => {
                      const override = earningsOverrides[req.id] || {};
                      const displayName = override.clientName || req.clientName;
                      const displayDate = override.requestedAt || req.requestedAt;

                      return (
                        <div key={req.id} style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <h3 style={{ fontSize: "16px", color: "#0f172a" }}>{displayName}</h3>
                            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                              Location: {req.clientCity || "Not Specified"} · Booking Date: {formatDate(displayDate)}
                            </p>
                          </div>
                          <div>
                            <span className={`ad-stage-pill ${(req.caseStage || "Start Case").toLowerCase().replace(" ", "-")}`}>
                              Status: {req.caseStage || "Start Case"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: EARNINGS */}
          {activeNav === "earnings" && (
            <div className="ad-fade-in">
              <div className="ad-card">
                <h2>💰 Earnings & Consultation Fees</h2>
                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px", marginBottom: "20px" }}>
                  Ledger of accepted clients and consultation fees. Click the 3 dots on any row to edit client details, date, custom amount, or payment status.
                </p>

                {acceptedRequests.length === 0 ? (
                  <div className="ad-empty">No earnings data available yet.</div>
                ) : (
                  <div style={{ overflowX: "auto", overflowY: "visible" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", color: "#475569", borderBottom: "1px solid #cbd5e1" }}>
                          <th style={{ padding: "12px" }}>Client Name</th>
                          <th style={{ padding: "12px" }}>Date Accepted</th>
                          <th style={{ padding: "12px" }}>Consultation Fee</th>
                          <th style={{ padding: "12px" }}>Payment Status</th>
                          <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acceptedRequests.map(req => {
                          const override = earningsOverrides[req.id] || {};
                          const displayName = override.clientName !== undefined ? override.clientName : req.clientName;
                          const displayDate = override.requestedAt !== undefined ? override.requestedAt : req.requestedAt;
                          const displayAmount = override.amount !== undefined && override.amount !== "" ? override.amount : advocate.fee;
                          const displayStatus = override.paymentStatus !== undefined ? override.paymentStatus : "Paid / Completed";

                          const isEditingRow = editingEarningId === req.id;

                          return (
                            <tr key={req.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                              {isEditingRow ? (
                                <>
                                  <td style={{ padding: "10px" }}>
                                    <input
                                      type="text"
                                      value={editForm.clientName}
                                      onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                                    />
                                  </td>
                                  <td style={{ padding: "10px" }}>
                                    <input
                                      type="date"
                                      value={editForm.requestedAt ? editForm.requestedAt.split("T")[0] : ""}
                                      onChange={(e) => setEditForm({ ...editForm, requestedAt: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                                    />
                                  </td>
                                  <td style={{ padding: "10px" }}>
                                    <input
                                      type="text"
                                      value={editForm.amount}
                                      placeholder="e.g. ₹2,500"
                                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid #cbd5e1", fontWeight: "600", color: "#2563eb" }}
                                    />
                                  </td>
                                  <td style={{ padding: "10px" }}>
                                    <select
                                      value={editForm.paymentStatus}
                                      onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                                    >
                                      <option value="Paid / Completed">Paid / Completed</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Failed">Failed</option>
                                    </select>
                                  </td>
                                  <td style={{ padding: "10px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                      <button
                                        onClick={() => handleSaveEarningEdit(req.id)}
                                        style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingEarningId(null)}
                                        style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", padding: "6px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: "12px", fontWeight: "600", color: "#0f172a" }}>{displayName}</td>
                                  <td style={{ padding: "12px", color: "#64748b" }}>{formatDate(displayDate)}</td>
                                  <td style={{ padding: "12px", fontWeight: "600", color: "#2563eb" }}>{displayAmount}</td>
                                  <td style={{ padding: "12px" }}>
                                    <span style={{ 
                                      background: displayStatus === "Paid / Completed" ? "#dcfce7" : displayStatus === "Pending" ? "#fef3c7" : "#fee2e2", 
                                      color: displayStatus === "Paid / Completed" ? "#166534" : displayStatus === "Pending" ? "#92400e" : "#991b1b", 
                                      padding: "4px 8px", 
                                      borderRadius: "4px", 
                                      fontSize: "12px", 
                                      fontWeight: "600" 
                                    }}>
                                      {displayStatus}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px", textAlign: "center", position: "relative" }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === req.id ? null : req.id);
                                      }}
                                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", fontWeight: "bold", color: "#64748b", padding: "4px 8px" }}
                                    >
                                      ⋮
                                    </button>

                                    {activeMenuId === req.id && (
                                      <div style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "40px",
                                        background: "#ffffff",
                                        border: "1px solid #cbd5e1",
                                        borderRadius: "6px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                        zIndex: 10,
                                        width: "140px",
                                        textAlign: "left"
                                      }}>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingEarningId(req.id);
                                            setEditForm({
                                              clientName: displayName,
                                              requestedAt: displayDate,
                                              amount: displayAmount,
                                              paymentStatus: displayStatus,
                                            });
                                            setActiveMenuId(null);
                                          }}
                                          style={{
                                            background: "none",
                                            border: "none",
                                            padding: "8px 12px",
                                            width: "100%",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            color: "#1e293b",
                                            fontWeight: "500"
                                          }}
                                        >
                                          ✎ Edit Record
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: PROFILE & SETTINGS */}
          {["profile", "settings"].includes(activeNav) && (
            <div className="ad-fade-in">
              <div className="ad-card" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                  {NAV_ITEMS.find(n => n.key === activeNav)?.icon}
                </div>
                <h2>{NAV_ITEMS.find(n => n.key === activeNav)?.label}</h2>
                <p style={{ color: "#64748b", marginTop: "8px" }}>
                  Configuration settings and profile updates for your advocate account.
                </p>
                <button className="ad-btn-primary" style={{ marginTop: "20px" }} onClick={() => setActiveNav("dashboard")}>
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </main>

      </div>
         {/* ── FLOATING CHATBOT — renders on every page via App.js ── */}
            <Chatbot />
    </div>
  );
}