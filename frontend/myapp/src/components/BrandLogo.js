// ============================================================
//  BrandLogo.js — AdvocatesHub mark + optional wordmark.
//  The mark lives at public/brand/logo-mark.svg (also used for the
//  favicon / PWA icons), so every surface shares one asset.
// ============================================================

import React from "react";

const MARK = `${process.env.PUBLIC_URL || ""}/brand/logo-mark.svg`;

export default function BrandLogo({ size = 32, wordmark = true, dark = false, style }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.3), ...style }}>
      <img src={MARK} width={size} height={size} alt={wordmark ? "" : "AdvocatesHub"} style={{ display: "block", borderRadius: size * 0.25 }} />
      {wordmark && (
        <span style={{ fontWeight: 800, fontSize: Math.round(size * 0.62), letterSpacing: "-0.01em", color: dark ? "#ffffff" : "#0f172a", whiteSpace: "nowrap" }}>
          Advocates<span style={{ color: dark ? "#5eead4" : "#0f766e" }}>Hub</span>
        </span>
      )}
    </span>
  );
}
