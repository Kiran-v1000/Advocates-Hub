// BareActs.js — Bare Acts Browser Page
import React, { useState, useMemo } from "react";
import "./BareActs.css";

const CATEGORIES = [
  "All","Criminal","Civil","Family","Property",
  "Corporate","Labour","Constitutional","New Acts",
];

const BARE_ACTS = [
  { id: 1,  icon: "📕", title: "Bharatiya Nyaya Sanhita (BNS), 2023",          shortName: "BNS",    category: "Criminal",      year: 2023, sections: 358, desc: "Replaces IPC. Comprehensive criminal law covering all offences and punishments.", isNew: true,  popular: true  },
  { id: 2,  icon: "📘", title: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023", shortName: "BNSS",  category: "Criminal",      year: 2023, sections: 531, desc: "Replaces CrPC. Criminal procedure code governing investigation and trial.", isNew: true,  popular: true  },
  { id: 3,  icon: "📗", title: "Bharatiya Sakshya Adhiniyam (BSA), 2023",      shortName: "BSA",    category: "Criminal",      year: 2023, sections: 170, desc: "Replaces Indian Evidence Act. Rules of evidence in Indian courts.", isNew: true,  popular: true  },
  { id: 4,  icon: "📙", title: "Indian Penal Code (IPC), 1860",                shortName: "IPC",    category: "Criminal",      year: 1860, sections: 511, desc: "Main criminal code of India. Defines offences and prescribes punishments.", isNew: false, popular: true  },
  { id: 5,  icon: "📒", title: "Code of Criminal Procedure (CrPC), 1973",      shortName: "CrPC",  category: "Criminal",      year: 1973, sections: 484, desc: "Procedural law for administration of criminal law in India.", isNew: false, popular: true  },
  { id: 6,  icon: "📓", title: "Indian Evidence Act, 1872",                    shortName: "IEA",    category: "Criminal",      year: 1872, sections: 167, desc: "Rules regarding admissibility of evidence in civil and criminal proceedings.", isNew: false, popular: true  },
  { id: 7,  icon: "⚖️", title: "Code of Civil Procedure (CPC), 1908",         shortName: "CPC",    category: "Civil",         year: 1908, sections: 158, desc: "Procedure for civil courts in India. Covers filing suits, trial and appeals.", isNew: false, popular: true  },
  { id: 8,  icon: "👨‍👩‍👧", title: "Hindu Marriage Act, 1955",                   shortName: "HMA",    category: "Family",        year: 1955, sections: 32,  desc: "Marriage, divorce, judicial separation and ancillary relief for Hindus.", isNew: false, popular: true  },
  { id: 9,  icon: "👶", title: "Hindu Adoption and Maintenance Act, 1956",     shortName: "HAMA",  category: "Family",        year: 1956, sections: 30,  desc: "Governs adoption and maintenance rights of Hindus.", isNew: false, popular: false },
  { id: 10, icon: "🏠", title: "Transfer of Property Act, 1882",               shortName: "TPA",    category: "Property",      year: 1882, sections: 137, desc: "Law relating to transfer of property by act of parties in India.", isNew: false, popular: true  },
  { id: 11, icon: "🏗️", title: "Real Estate (RERA) Act, 2016",                 shortName: "RERA",  category: "Property",      year: 2016, sections: 92,  desc: "Regulates real estate sector, protects buyers and promotes transparency.", isNew: false, popular: true  },
  { id: 12, icon: "🏢", title: "Companies Act, 2013",                          shortName: "CA",     category: "Corporate",     year: 2013, sections: 470, desc: "Comprehensive law governing incorporation, management of companies.", isNew: false, popular: true  },
  { id: 13, icon: "📊", title: "Goods and Services Tax Act, 2017",             shortName: "GST",    category: "Corporate",     year: 2017, sections: 174, desc: "Central GST law governing levy, collection and administration of GST.", isNew: false, popular: true  },
  { id: 14, icon: "👷", title: "Industrial Disputes Act, 1947",                shortName: "IDA",    category: "Labour",        year: 1947, sections: 40,  desc: "Investigates and settles industrial disputes between employer and workers.", isNew: false, popular: false },
  { id: 15, icon: "📜", title: "Constitution of India, 1950",                  shortName: "COI",    category: "Constitutional",year: 1950, sections: 395, desc: "Supreme law of India. Contains fundamental rights, duties and governance structure.", isNew: false, popular: true  },
  { id: 16, icon: "💳", title: "Negotiable Instruments Act, 1881",             shortName: "NIA",    category: "Civil",         year: 1881, sections: 147, desc: "Governs promissory notes, bills of exchange and cheques (Sec 138 cheque bounce).", isNew: false, popular: true  },
  { id: 17, icon: "🛒", title: "Consumer Protection Act, 2019",                shortName: "CPA",    category: "Civil",         year: 2019, sections: 107, desc: "Protects consumer rights and provides for redressal of consumer disputes.", isNew: false, popular: true  },
  { id: 18, icon: "💻", title: "Information Technology Act, 2000",             shortName: "IT Act", category: "Criminal",      year: 2000, sections: 94,  desc: "Legal framework for electronic commerce, cybercrime and digital signatures.", isNew: false, popular: true  },
  { id: 19, icon: "🤰", title: "Protection of Children from Sexual Offences (POCSO), 2012", shortName: "POCSO", category: "Criminal", year: 2012, sections: 46, desc: "Protects children from sexual abuse and exploitation. Special courts.", isNew: false, popular: false },
  { id: 20, icon: "🏦", title: "Insolvency and Bankruptcy Code, 2016",        shortName: "IBC",    category: "Corporate",     year: 2016, sections: 255, desc: "Consolidated law for insolvency resolution of individuals and companies.", isNew: false, popular: false },
  { id: 21, icon: "💍", title: "Dowry Prohibition Act, 1961",                  shortName: "DPA",    category: "Family",        year: 1961, sections: 10,  desc: "Prohibits giving or taking dowry. Punishes dowry-related harassment.", isNew: false, popular: false },
  { id: 22, icon: "🔨", title: "SARFAESI Act, 2002",                           shortName: "SARFAESI",category: "Corporate",    year: 2002, sections: 41,  desc: "Empowers banks to recover NPAs without court intervention.", isNew: false, popular: false },
];

const CAT_COLORS = {
  Criminal:"#dc2626", Civil:"#2563eb", Family:"#16a34a",
  Property:"#7c3aed", Corporate:"#ea580c", Labour:"#d97706",
  Constitutional:"#0891b2", "New Acts":"#059669",
};

function ActCard({ act, onRead }) {
  return (
    <div className="ba-card">
      <div className="ba-card-top">
        <div className="ba-act-icon">{act.icon}</div>
        <div className="ba-act-badges">
          {act.isNew && <span className="ba-badge new">🆕 New</span>}
          {act.popular && <span className="ba-badge popular">🔥 Popular</span>}
        </div>
      </div>
      <div className="ba-short-name" style={{ color: CAT_COLORS[act.category] || "#6366f1" }}>
        {act.shortName}
      </div>
      <h3 className="ba-act-title">{act.title}</h3>
      <p className="ba-act-desc">{act.desc}</p>
      <div className="ba-act-meta">
        <span className="ba-act-year">📅 {act.year}</span>
        <span className="ba-act-sections">📋 {act.sections} Sections</span>
        <span className="ba-act-cat" style={{ background: (CAT_COLORS[act.category] || "#6366f1") + "18", color: CAT_COLORS[act.category] || "#6366f1" }}>
          {act.category}
        </span>
      </div>
      <div className="ba-card-actions">
        <button className="ba-btn-read" onClick={() => onRead(act)}>📖 Read Act</button>
        <button className="ba-btn-download" onClick={() => alert(`Downloading ${act.shortName} PDF…`)}>⬇ PDF</button>
      </div>
    </div>
  );
}

function ReadModal({ act, onClose }) {
  const [activeSection, setActiveSection] = useState(1);
  const SAMPLE_SECTIONS = [
    { no: 1, title: "Short title, extent and commencement", content: `(1) This Act may be called the ${act.title}.\n(2) It extends to the whole of India.\n(3) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint.` },
    { no: 2, title: "Definitions", content: `In this Act, unless the context otherwise requires—\n\n(a) "appropriate Government" means—\n    (i) in relation to a matter concerning the Union territory, the Central Government;\n    (ii) in relation to a matter concerning a State, the State Government;\n\n(b) "court" means the court referred to in section 6;\n\n(c) such other terms as defined within this enactment...` },
    { no: 3, title: "Application", content: `The provisions of this Act shall apply to all persons within the territory of India, unless otherwise specified by a subsequent provision or exemption notified by the appropriate authority under the provisions herein.` },
  ];

  return (
    <div className="ba-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ba-modal">
        <div className="ba-modal-header" style={{ borderBottom: `3px solid ${CAT_COLORS[act.category] || "#6366f1"}` }}>
          <div>
            <div className="ba-modal-short" style={{ color: CAT_COLORS[act.category] || "#6366f1" }}>{act.shortName}</div>
            <h3 className="ba-modal-title">{act.title}</h3>
            <div className="ba-modal-meta">Year: {act.year} · {act.sections} Sections · {act.category}</div>
          </div>
          <button className="ba-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ba-modal-body">
          <div className="ba-modal-sidebar">
            <div className="ba-sections-title">Sections</div>
            {SAMPLE_SECTIONS.map(s => (
              <button key={s.no}
                className={`ba-section-item ${activeSection === s.no ? "active" : ""}`}
                onClick={() => setActiveSection(s.no)}>
                <span className="ba-section-no">§ {s.no}</span>
                <span className="ba-section-name">{s.title}</span>
              </button>
            ))}
            <div className="ba-more-sections">
              + {act.sections - 3} more sections available in full version
            </div>
          </div>
          <div className="ba-modal-content">
            {SAMPLE_SECTIONS.filter(s => s.no === activeSection).map(s => (
              <div key={s.no}>
                <h4 className="ba-content-title">Section {s.no} — {s.title}</h4>
                <div className="ba-content-text">
                  {s.content.split("\n").map((line, i) => (
                    <p key={i} style={{ marginBottom: line === "" ? 8 : 4 }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ba-modal-footer">
          <span className="ba-modal-note">📖 Showing sample sections. Download PDF for complete act.</span>
          <button className="ba-btn-download" onClick={() => alert(`Downloading ${act.shortName} PDF…`)}>
            ⬇ Download Full PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BareActs() {
  const [activeCat, setActiveCat]   = useState("All");
  const [search,    setSearch]      = useState("");
  const [showNew,   setShowNew]     = useState(false);
  const [showPop,   setShowPop]     = useState(false);
  const [sortBy,    setSortBy]      = useState("popular");
  const [readModal, setReadModal]   = useState(null);

  const filtered = useMemo(() => {
    let list = [...BARE_ACTS];
    if (activeCat !== "All") {
      if (activeCat === "New Acts") list = list.filter(a => a.isNew);
      else list = list.filter(a => a.category === activeCat);
    }
    if (showNew) list = list.filter(a => a.isNew);
    if (showPop) list = list.filter(a => a.popular);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.shortName.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q)
      );
    }
    if (sortBy === "popular") list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    if (sortBy === "year_new") list.sort((a, b) => b.year - a.year);
    if (sortBy === "year_old") list.sort((a, b) => a.year - b.year);
    if (sortBy === "az")       list.sort((a, b) => a.shortName.localeCompare(b.shortName));
    if (sortBy === "sections") list.sort((a, b) => b.sections - a.sections);
    return list;
  }, [activeCat, search, showNew, showPop, sortBy]);

  return (
    <div className="ba-page">

      {/* Header */}
      <div className="ba-header">
        <div className="ba-header-inner">
          <h1 className="ba-title">Bare Acts</h1>
          <p className="ba-subtitle">Browse, read and download Indian laws and legislation</p>
          <div className="ba-header-stats">
            <span>📚 {BARE_ACTS.length}+ Acts</span>
            <span>🆕 {BARE_ACTS.filter(a => a.isNew).length} New Acts (2023)</span>
            <span>🔥 {BARE_ACTS.filter(a => a.popular).length} Popular Acts</span>
            <span>⬇ Free PDF Download</span>
          </div>
        </div>
      </div>

      {/* New Acts banner */}
      <div className="ba-new-banner">
        <span className="ba-new-icon">🆕</span>
        <div>
          <strong>New Criminal Laws 2023 — Now Available!</strong>
          <span> BNS, BNSS and BSA have replaced IPC, CrPC and Indian Evidence Act effective July 2024.</span>
        </div>
        <button className="ba-new-btn" onClick={() => { setActiveCat("New Acts"); setShowNew(true); }}>
          View New Acts →
        </button>
      </div>

      {/* Search + filter */}
      <div className="ba-filter-bar">
        <div className="ba-search-wrap">
          <span>🔍</span>
          <input className="ba-search" placeholder="Search acts by name or keyword…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")}>✕</button>}
        </div>
        <div className="ba-filter-toggles">
          <label className="ba-toggle">
            <input type="checkbox" checked={showNew} onChange={e => setShowNew(e.target.checked)} />
            🆕 New Acts Only
          </label>
          <label className="ba-toggle">
            <input type="checkbox" checked={showPop} onChange={e => setShowPop(e.target.checked)} />
            🔥 Popular Only
          </label>
        </div>
        <select className="ba-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="popular">Popular First</option>
          <option value="year_new">Newest First</option>
          <option value="year_old">Oldest First</option>
          <option value="az">A–Z</option>
          <option value="sections">Most Sections</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="ba-cat-tabs">
        {CATEGORIES.map(cat => (
          <button key={cat} className={`ba-cat-tab ${activeCat === cat ? "active" : ""}`}
            onClick={() => setActiveCat(cat)}
            style={activeCat === cat && cat !== "All" ? { borderColor: CAT_COLORS[cat], color: CAT_COLORS[cat], background: (CAT_COLORS[cat] || "#6366f1") + "14" } : {}}>
            {cat}
          </button>
        ))}
      </div>

      <div className="ba-body">
        <div className="ba-results-bar">
          Showing <strong>{filtered.length}</strong> act{filtered.length !== 1 ? "s" : ""}
        </div>
        {filtered.length === 0 ? (
          <div className="ba-empty">
            <div style={{ fontSize: 48 }}>📚</div>
            <h3>No acts found</h3>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          <div className="ba-grid">
            {filtered.map(act => (
              <ActCard key={act.id} act={act} onRead={setReadModal} />
            ))}
          </div>
        )}
      </div>

      {readModal && (
        <ReadModal act={readModal} onClose={() => setReadModal(null)} />
      )}
    </div>
  );
}