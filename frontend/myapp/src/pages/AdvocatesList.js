import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAdvocates } from "../data/Advocatesstore";
import "./AdvocatesList.css";

const CITIES = [
  // =========================
  // A
  // =========================
  "Afzalpur",
  "Alur",
  "Aland",
  "Ankola",
  "Arakalgud",
  "Arasikere",
  "Athani",
  "Aurad",
  "Anekal",

  // =========================
  // B
  // =========================
  "Bagepalli",
  "Bagalkot",
  "Bailhongal",
  "Baindur",
  "Banahatti",
  "Bangarapet",
  "Bantwal",
  "Basavana Bagewadi",
  "Basavakalyan",
  "Belagavi",
  "Belthangady",
  "Belur",
  "Bhadravati",
  "Bhalki",
  "Bhatkal",
  "Bilagi",
  "Byadgi",
  "Bengaluru",
  "Bengaluru Rural",

  // =========================
  // C
  // =========================
  "Challakere",
  "Chamarajanagar",
  "Channagiri",
  "Channapatna",
  "Channarayapatna",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chikkodi",
  "Chiknayakanhalli",
  "Chincholi",
  "Chintamani",
  "Chitapur",
  "Chitradurga",

  // =========================
  // D
  // =========================
  "Dandeli",
  "Davangere",
  "Devanahalli",
  "Devadurga",
  "Dharwad",
  "Doddaballapur",

  // =========================
  // G
  // =========================
  "Gadag",
  "Gangavathi",
  "Gauribidanur",
  "Gokak",
  "Gudibande",
  "Gubbi",
  "Gundlupet",

  // =========================
  // H
  // =========================
  "H.D. Kote",
  "Hagaribommanahalli",
  "Haliyal",
  "Hanagal",
  "Harihar",
  "Hassan",
  "Haveri",
  "Holenarasipura",
  "Holalkere",
  "Honnavar",
  "Hosanagara",
  "Hospete",
  "Hosadurga",
  "Hoskote",
  "Humnabad",
  "Hukeri",
  "Hunsur",
  "Hungund",
  "Hirekerur",

  // =========================
  // I
  // =========================
  "Ilkal",
  "Indi",

  // =========================
  // J
  // =========================
  "Jamkhandi",
  "Jevargi",
  "Jagalur",

  // =========================
  // K
  // =========================
  "Kadur",
  "Kagwad",
  "Kalaburagi",
  "Kalghatgi",
  "Kanakapura",
  "Karwar",
  "Karkala",
  "Khanapur",
  "Kittur",
  "Kolar",
  "Kollegal",
  "Koppa",
  "Koratagere",
  "Krishnarajanagara",
  "Krishnarajapete",
  "Kundapura",
  "Kundgol",
  "Kumta",
  "Kushalnagar",
  "Kushtagi",
  "Kudachi",
  "Kudligi",
  "KGF",

  // =========================
  // L
  // =========================
  "Lakshmeshwar",
  "Lingasugur",

  // =========================
  // M
  // =========================
  "Maddur",
  "Madikeri",
  "Magadi",
  "Malavalli",
  "Malur",
  "Manvi",
  "Mangaluru",
  "Mandya",
  "Muddebihal",
  "Mudhol",
  "Mudigere",
  "Mudalagi",
  "Mundagod",
  "Mundargi",
  "Mulbagal",
  "Mysuru",

  // =========================
  // N
  // =========================
  "Nagamangala",
  "Nanjangud",
  "Narasimharajapura",
  "Navalgund",
  "Nelamangala",
  "Nippani",
  "Nargund",

  // =========================
  // P
  // =========================
  "Pandavapura",
  "Pavagada",
  "Periyapatna",
  "Ponnampet",
  "Puttur",

  // =========================
  // R
  // =========================
  "Raibag",
  "Raichur",
  "Ramanagara",
  "Ramdurg",
  "Ranebennur",
  "Ron",

  // =========================
  // S
  // =========================
  "Sagara",
  "Sakleshpur",
  "Sandalaga",
  "Sandur",
  "Sankeshwar",
  "Savanur",
  "Sedam",
  "Shahabad",
  "Shahapur",
  "Shiggaon",
  "Shikaripura",
  "Shivamogga",
  "Shorapur",
  "Shirsi",
  "Siddapur",
  "Sindagi",
  "Sindhanur",
  "Sira",
  "Siruguppa",
  "Sirsi",
  "Somwarpet",
  "Srinivaspur",
  "Sringeri",
  "Srirangapatna",
  "Sullia",

  // =========================
  // T
  // =========================
  "Tarikere",
  "Thirthahalli",
  "Tiptur",
  "Tirumakudalu Narasipura",
  "Tumakuru",
  "Turuvekere",

  // =========================
  // U
  // =========================
  "Udupi",

  // =========================
  // V
  // =========================
  "Vijayapura",
  "Virajpet",

  // =========================
  // Y
  // =========================
  "Yadgir",
  "Yaragatti",
  "Yellapur",
  "Yelburga"
];
const PRACTICE_AREAS = ["Divorce","Criminal","Property","Cheque Bounce","Civil","GST","Tax","Corporate","Family","Labour","Consumer","Cyber","Immigration","Banking","Intellectual Property"];
const POPULAR = ["Divorce","Criminal","Property","Cheque Bounce","Civil","GST","Tax"];
const CATEGORY_PRACTICES = {
  family: ["Family", "Divorce"],
  criminal: ["Criminal", "Cyber"],
  property: ["Property"],
  civil: ["Civil", "Cheque Bounce", "Banking"],
  corporate: ["Corporate", "GST", "Tax", "Intellectual Property"],
};

// Read through advocatesStore (not raw advocates.json) so the id
// used for profile links always matches the id AdvocateDashboard.js
// and Login.js look up by. Only "approved" advocates are shown to
// the public — pending/rejected signups stay hidden from clients.
const ADVOCATES = getAdvocates().filter((a) => a.status === "approved");

const normalize = (value = "") => (value ?? "").toString().trim().toLowerCase();

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const getAvatarColor = (name = "") => {
  const palette = ["#2563eb", "#16a34a", "#7c3aed", "#dc2626", "#ea580c", "#0891b2", "#0f766e", "#9333ea"];
  const sum = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
};

const matchesPractice = (person, practices) => {
  if (!practices.length) return true;
  const personPractice = normalize(person.practiceArea || person.speciality || "");
  return practices.some((practice) => personPractice === normalize(practice));
};

function AdvocateAvatar({ advocate }) {
  const [imagePath, setImagePath] = useState(advocate.avatar || "");
  const [failed, setFailed] = useState(false);

  const handleImageError = () => {
    if (!imagePath || !advocate.avatar) {
      setFailed(true);
      return;
    }

    const basePath = advocate.avatar.replace(/\.(png|jpe?g|webp)$/i, "");
    const candidates = [`${basePath}.jpg`, `${basePath}.jpeg`, `${basePath}.png`, `${basePath}.webp`];
    const nextPath = candidates.find((candidate) => candidate !== imagePath);
    if (nextPath) setImagePath(nextPath);
    else setFailed(true);
  };

  return (
    <div
      className="lw-adv-avatar"
      style={{ background: !failed && imagePath ? "transparent" : getAvatarColor(advocate.name) }}
    >
      {!failed && imagePath ? (
        <img
          src={imagePath}
          alt={advocate.name}
          className="lw-adv-avatar-img"
          onError={handleImageError}
        />
      ) : getInitials(advocate.name)}
    </div>
  );
}

export default function AdvocatesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = normalize(searchParams.get("cat"));
  const categoryPractices = useMemo(() => CATEGORY_PRACTICES[category] || [], [category]);
  const queryCity = searchParams.get("city") || "";
  const queryPractice = searchParams.get("area") || "";
  const [city, setCity] = useState(queryCity);
  const [practice, setPractice] = useState(queryPractice);
  const [showAllAdvocates, setShowAllAdvocates] = useState(false);

  // Keep track of all items that match the filters
  const [filteredResults, setFilteredResults] = useState(() =>
    ADVOCATES.filter((person) => {
      const cityMatch = !queryCity || normalize(person.city) === normalize(queryCity);
      const practices = queryPractice ? [queryPractice] : categoryPractices;
      return cityMatch && matchesPractice(person, practices);
    })
  );

  useEffect(() => {
    setCity(queryCity);
    setPractice(queryPractice);
    setFilteredResults(ADVOCATES.filter((person) => {
      const cityMatch = !queryCity || normalize(person.city) === normalize(queryCity);
      const practices = queryPractice ? [queryPractice] : categoryPractices;
      return cityMatch && matchesPractice(person, practices);
    }));
    setShowAllAdvocates(false);
  }, [category, categoryPractices, queryCity, queryPractice]);

  const filterAdvocates = (selectedCity = "", selectedPractice = "") => {
    return ADVOCATES.filter((person) => {
      const cityMatch = !selectedCity || normalize(person.city) === normalize(selectedCity);
      const personPractice = person.practiceArea || person.speciality || "";
      const practiceMatch = selectedPractice
        ? normalize(personPractice) === normalize(selectedPractice)
        : matchesPractice(person, categoryPractices);
      return cityMatch && practiceMatch;
    });
  };

  const handleSearch = () => {
    const results = filterAdvocates(city, practice);
    setShowAllAdvocates(false); // Reset to collapsed view on a new search
    setFilteredResults(results);
  };

  const handlePopularClick = (value) => {
    setPractice(value);
    const results = filterAdvocates(city, value);
    setShowAllAdvocates(false); // Reset to collapsed view on a new filter tag click
    setFilteredResults(results);
  };

  const handleSeeMoreAdvocates = () => {
    setShowAllAdvocates((prev) => !prev);
  };

  // Only show more than 6 if there are more than 6 total matches AND the user clicked "See More"
  const displayedList = showAllAdvocates ? filteredResults : filteredResults.slice(0, 6);

  return (
    <div className="home-page">
      {/* ── Search Bar Section ── */}
      <section className="lw-search-section">
  <p className="lw-search-headline">
    Hire India's best and most trusted lawyers for District Court, High Court, and Supreme Court cases with Advocates Hub
  </p>
  <div className="lw-search-bar">
    <div className="lw-search-field">
      <span className="lw-search-field-icon">📍</span>
      <select
        value={city}
        onChange={e => setCity(e.target.value)} // Only updates state now
        className="lw-select"
      >
        <option value="">Select City</option>
        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div className="lw-search-field">
      <span className="lw-search-field-icon">🏛️</span>
      <select
        value={practice}
        onChange={e => setPractice(e.target.value)} // Only updates state now
        className="lw-select"
      >
        <option value="">Select Practice Areas</option>
        {PRACTICE_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
    <button className="lw-search-btn" onClick={handleSearch}>SEARCH</button>
  </div>
  <div className="lw-popular-searches">
    <strong>Popular Searches: </strong>
    {POPULAR.map((p, i) => (
      <span key={p}>
        <span className="lw-popular-tag" onClick={() => handlePopularClick(p)}>{p}</span>
        {i < POPULAR.length - 1 && " , "}
      </span>
    ))}
  </div>
</section>

      {/* ── Advocates List Section ── */}
      <section className="lw-section">
        <div className="lw-section-inner">
          <div className="lw-section-head lw-flex-between">
            <div>
              <h2 className="lw-section-title">Meet Our Advocates</h2>
            </div>
            {/* Show button ONLY if there are more than 6 matches in total */}
            {filteredResults.length > 6 && (
              <button className="lw-btn-primary" onClick={handleSeeMoreAdvocates}>
                {showAllAdvocates ? "See Less Advocates" : "See More Advocates"} ›
              </button>
            )}
          </div>

          {displayedList.length === 0 ? (
            <div className="lw-no-results">
              No advocates found for the selected city and practice area.
            </div>
          ) : (
            <div className="lw-advocates-grid">
              {displayedList.map((adv) => (
                <div
                  key={adv.id}
                  className="lw-adv-card"
                  onClick={() => navigate(`/profile/${adv.id}`)}
                >
                  <div className="lw-adv-top">
                    <AdvocateAvatar advocate={adv} />
                    <div className="lw-adv-info">
                      <div className="lw-adv-name">{adv.name}</div>
                      <div className="lw-adv-spec">{adv.speciality || adv.practiceArea}</div>
                      <div className="lw-adv-meta">{adv.city} · {adv.experience}</div>
                    </div>
                  </div>

                  <div className="lw-adv-stats">
                    <span className="lw-adv-rating">⭐ {adv.rating}</span>
                    <span className="lw-adv-cases">{adv.cases} cases</span>
                  </div>

                  <button
                    className="lw-adv-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${adv.id}`);
                    }}
                  >
                    Consult Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}