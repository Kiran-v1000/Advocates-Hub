import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAdvocates } from "../data/Advocatesstore";
import "./TalkToAdvocate.css";

const ADVOCATES = getAdvocates().filter((advocate) => advocate.status === "approved");

const getInitials = (name = "") => name
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join("")
  .toUpperCase();

function AdvocateDetails({ advocate }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="tta-card">
      <div className="tta-card-header">
        <div className="tta-avatar">
          {advocate.avatar && !imageFailed ? (
            <img
              src={advocate.avatar}
              alt={advocate.name}
              onError={() => setImageFailed(true)}
            />
          ) : (
            getInitials(advocate.name)
          )}
        </div>
        <div>
          <h2>{advocate.name}</h2>
          <p>{advocate.speciality || advocate.practiceArea}</p>
          <span>{advocate.city} · {advocate.experience}</span>
        </div>
      </div>

      <div className="tta-summary">
        <div><small>Rating</small><strong>⭐ {advocate.rating}</strong></div>
        <div><small>Cases</small><strong>{advocate.cases}</strong></div>
        <div><small>Fee</small><strong>{advocate.fee}</strong></div>
        <div><small>Availability</small><strong>{advocate.availability}</strong></div>
      </div>

      <p className="tta-bio">{advocate.bio}</p>

      <div className="tta-contact">
        <a href={`tel:${advocate.phone}`}>☎ {advocate.phone}</a>
        <a href={`mailto:${advocate.email}`}>✉ {advocate.email}</a>
      </div>

      <Link to={`/profile/${advocate.id}`} className="tta-profile-link">View Full Profile</Link>
    </article>
  );
}

export default function TalkToAdvocate() {
  return (
    <main className="tta-page">
      <header className="tta-hero">
        <p className="tta-eyebrow">Advocates Hub</p>
        <h1>Talk to a Lawyer</h1>
        <p>Connect with a verified advocate and get help with your legal matter.</p>
      </header>

      <section className="tta-content">
        <div className="tta-section-heading">
          <h2>Our Verified Advocates</h2>
          <span>{ADVOCATES.length} advocates available</span>
        </div>
        <div className="tta-grid">
          {ADVOCATES.map((advocate) => (
            <AdvocateDetails key={advocate.id} advocate={advocate} />
          ))}
        </div>
      </section>
    </main>
  );
}
