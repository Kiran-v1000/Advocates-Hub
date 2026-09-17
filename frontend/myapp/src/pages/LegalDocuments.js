// LegalDocuments.js — Legal Documents Page
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./LegalDocuments.css";


const CATEGORIES = [
  "All", "Family", "Property", "Criminal", "Civil",
  "Corporate", "Labour", "Consumer", "Banking",
];

const DOCUMENTS = [
  { id: 1,  icon: "📝", title: "Divorce Petition",               category: "Family",    desc: "Draft a divorce petition under Hindu Marriage Act or Special Marriage Act.", downloads: 12400, free: true,  pages: 4 },
  { id: 2,  icon: "👶", title: "Child Custody Agreement",         category: "Family",    desc: "Legal agreement for child custody, visitation rights and maintenance.", downloads: 8200,  free: true,  pages: 3 },
  { id: 3,  icon: "🤝", title: "Maintenance Agreement",          category: "Family",    desc: "Monthly maintenance agreement between separated spouses.", downloads: 6500,  free: true,  pages: 2 },
  { id: 4,  icon: "🏠", title: "Rental Agreement",               category: "Property",  desc: "Standard residential/commercial rent agreement as per local laws.", downloads: 45000, free: true,  pages: 6 },
  { id: 5,  icon: "🏗️", title: "Sale Deed",                     category: "Property",  desc: "Property sale deed template compliant with Registration Act.", downloads: 23000, free: false, pages: 8 },
  { id: 6,  icon: "📋", title: "Power of Attorney",             category: "Property",  desc: "General and specific power of attorney for property matters.", downloads: 18000, free: false, pages: 3 },
  { id: 7,  icon: "🔒", title: "Bail Application",              category: "Criminal",  desc: "Regular and anticipatory bail application template for district court.", downloads: 9800,  free: true,  pages: 2 },
  { id: 8,  icon: "📄", title: "FIR Complaint Letter",          category: "Criminal",  desc: "Format for complaint letter to police station for filing FIR.", downloads: 15600, free: true,  pages: 1 },
  { id: 9,  icon: "⚖️", title: "Civil Suit Plaint",             category: "Civil",     desc: "Plaint format for filing civil suit in district court.", downloads: 7400,  free: false, pages: 5 },
  { id: 10, icon: "💰", title: "Recovery Suit",                 category: "Civil",     desc: "Suit for recovery of money — NI Act Section 138 cheque bounce.", downloads: 11200, free: true,  pages: 3 },
  { id: 11, icon: "🏢", title: "Partnership Deed",              category: "Corporate", desc: "Partnership firm deed template compliant with Indian Partnership Act.", downloads: 5600,  free: false, pages: 7 },
  { id: 12, icon: "📊", title: "Shareholders Agreement",        category: "Corporate", desc: "Agreement between company shareholders defining rights and obligations.", downloads: 4200,  free: false, pages: 12 },
  { id: 13, icon: "📃", title: "Employment Agreement",          category: "Labour",    desc: "Employer-employee agreement with salary, role, and termination clauses.", downloads: 19800, free: true,  pages: 5 },
  { id: 14, icon: "📬", title: "Legal Notice (General)",        category: "Civil",     desc: "General legal notice format for demand, breach of contract or default.", downloads: 31000, free: true,  pages: 1 },
  { id: 15, icon: "🛒", title: "Consumer Complaint",            category: "Consumer",  desc: "Complaint format for consumer forum against product/service deficiency.", downloads: 8900,  free: true,  pages: 3 },
  { id: 16, icon: "🏦", title: "Loan Agreement",                category: "Banking",   desc: "Personal loan agreement between lender and borrower with repayment terms.", downloads: 6700,  free: false, pages: 4 },
  { id: 17, icon: "📑", title: "Non-Disclosure Agreement (NDA)",category: "Corporate", desc: "Confidentiality and NDA between parties for business dealings.", downloads: 13400, free: false, pages: 3 },
  { id: 18, icon: "🧾", title: "Affidavit",                     category: "Civil",     desc: "General affidavit format notarised before magistrate.", downloads: 28000, free: true,  pages: 1 },
  { id: 19, icon: "🤝", title: "MOU (Memorandum of Understanding)", category: "Corporate", desc: "MOU template for business agreements and joint ventures.", downloads: 9100, free: false, pages: 4 },
  { id: 20, icon: "📰", title: "Will and Testament",            category: "Property",  desc: "Last will and testament format compliant with Indian Succession Act.", downloads: 7800,  free: false, pages: 5 },
];

function DocCard({ doc, onDownload, onPreview }) {
  return (
    <div className="ld-doc-card">
      <div className="ld-doc-card-top">
        <div className="ld-doc-icon">{doc.icon}</div>
        <div className="ld-doc-meta">
          <span className={`ld-doc-badge ${doc.free ? "free" : "premium"}`}>
            {doc.free ? "FREE" : "PREMIUM"}
          </span>
          <span className="ld-doc-pages">{doc.pages} pages</span>
        </div>
      </div>
      <h3 className="ld-doc-title">{doc.title}</h3>
      <p className="ld-doc-desc">{doc.desc}</p>
      <div className="ld-doc-downloads">⬇ {doc.downloads.toLocaleString()} downloads</div>
      <div className="ld-doc-actions">
        <button className="ld-btn-preview" onClick={() => onPreview(doc)}>👁 Preview</button>
        <button className="ld-btn-download" onClick={() => onDownload(doc)}>
          {doc.free ? "⬇ Download Free" : "🔒 Download"}
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ doc, onClose, onDownload }) {
  if (!doc) return null;
  return (
    <div className="ld-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ld-modal">
        <div className="ld-modal-header">
          <div>
            <h3>{doc.icon} {doc.title}</h3>
            <p>{doc.category} · {doc.pages} pages</p>
          </div>
          <button className="ld-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ld-modal-body">
          <div className="ld-doc-preview-box">
            <div className="ld-preview-header">
              <div className="ld-preview-logo">LAW4U</div>
              <div style={{ textAlign: "right", fontSize: 11 }}>
                <div>Template Document</div>
                <div>Indian Legal Format</div>
              </div>
            </div>
            <h2 className="ld-preview-title">{doc.title.toUpperCase()}</h2>
            <div className="ld-preview-content">
              <p>IN THE COURT OF THE LEARNED ____________________</p>
              <p>AT ____________________</p>
              <br />
              <p><strong>Case No.: ____________________ of ____</strong></p>
              <br />
              <p><strong>Petitioner/Plaintiff:</strong> ____________________</p>
              <p>S/o, D/o, W/o: ____________________</p>
              <p>R/o: ____________________</p>
              <br />
              <p><strong>Versus</strong></p>
              <br />
              <p><strong>Respondent/Defendant:</strong> ____________________</p>
              <p>S/o, D/o, W/o: ____________________</p>
              <p>R/o: ____________________</p>
              <br />
              <p className="ld-preview-blur">
                The petitioner/plaintiff respectfully states that... [Complete content available after download]
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt...
              </p>
            </div>
          </div>
        </div>
        <div className="ld-modal-footer">
          <span className={`ld-doc-badge ${doc.free ? "free" : "premium"}`}>
            {doc.free ? "FREE DOWNLOAD" : "PREMIUM DOCUMENT"}
          </span>
          <button className="ld-btn-download" onClick={() => { onDownload(doc); onClose(); }}>
            {doc.free ? "⬇ Download Free" : "🔒 Get Premium Access"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LegalDocuments() {
  const navigate = useNavigate();
  const [activeCat,  setActiveCat]  = useState("All");
  const [search,     setSearch]     = useState("");
  const [freeOnly,   setFreeOnly]   = useState(false);
  const [sortBy,     setSortBy]     = useState("popular");
  const [preview,    setPreview]    = useState(null);
  const [toast,      setToast]      = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = (doc) => {
    if (doc.free) {
      showToast(`✅ Downloading "${doc.title}"…`);
    } else {
      showToast("🔒 Premium document — please sign up for access");
    }
  };

  const filtered = useMemo(() => {
    let list = [...DOCUMENTS];
    if (activeCat !== "All") list = list.filter(d => d.category === activeCat);
    if (freeOnly)            list = list.filter(d => d.free);
    if (search.trim())       list = list.filter(d =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "popular") list.sort((a, b) => b.downloads - a.downloads);
    if (sortBy === "newest")  list.sort((a, b) => b.id - a.id);
    if (sortBy === "az")      list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [activeCat, search, freeOnly, sortBy]);

  return (
    <div className="ld-page">
      {toast && <div className="ld-toast">{toast}</div>}

      {/* Header */}
      <div className="ld-header">
        <div className="ld-header-inner">
          <h1 className="ld-title">Legal Documents</h1>
          <p className="ld-subtitle">Download ready-to-use legal document templates verified by advocates</p>
          <div className="ld-header-stats">
            <span>📄 {DOCUMENTS.length}+ Templates</span>
            <span>⬇ 2 Lakh+ Downloads</span>
            <span>✅ Advocate Verified</span>
            <span>🆓 {DOCUMENTS.filter(d => d.free).length} Free Templates</span>
          </div>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="ld-filter-bar">
        <div className="ld-search-wrap">
          <span>🔍</span>
          <input className="ld-search" placeholder="Search legal documents…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")}>✕</button>}
        </div>
        <label className="ld-free-toggle">
          <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} />
          Free only
        </label>
        <select className="ld-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="popular">Most Downloaded</option>
          <option value="newest">Newest First</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="ld-cat-tabs">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`ld-cat-tab ${activeCat === cat ? "active" : ""}`}
            onClick={() => setActiveCat(cat)}>
            {cat}
            {cat !== "All" && (
              <span className="ld-cat-count">
                {DOCUMENTS.filter(d => d.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="ld-body">
        <div className="ld-results-bar">
          Showing <strong>{filtered.length}</strong> document{filtered.length !== 1 ? "s" : ""}
          {activeCat !== "All" && ` in ${activeCat}`}
        </div>

        {filtered.length === 0 ? (
          <div className="ld-empty">
            <div style={{ fontSize: 48 }}>📂</div>
            <h3>No documents found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="ld-grid">
            {filtered.map(doc => (
              <DocCard key={doc.id} doc={doc}
                onDownload={handleDownload}
                onPreview={setPreview} />
            ))}
          </div>
        )}
      </div>

      {/* CTA banner */}
      <div className="ld-cta-banner">
        <div>
          <h3>Need a Custom Legal Document?</h3>
          <p>Our verified advocates can draft a customised document for your specific case.</p>
        </div>
        <button className="ld-cta-btn" onClick={() => navigate("/find-lawyer")}>
          Find an Advocate →
        </button>
      </div>

      {preview && (
        <PreviewModal doc={preview} onClose={() => setPreview(null)} onDownload={handleDownload} />
      )}
    </div>
  );
}