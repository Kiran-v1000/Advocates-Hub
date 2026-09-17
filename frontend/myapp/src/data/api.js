// ============================================================
//  api.js — thin fetch wrapper for the AdvocateHub backend.
//  In dev, CRA proxies "/api" and "/uploads" to http://localhost:5000
//  (see "proxy" in package.json). Set REACT_APP_API_BASE for prod.
// ============================================================

export const API_BASE = process.env.REACT_APP_API_BASE || "";

const ADMIN_TOKEN_KEY = "law4u_admin_token";
const ADVOCATE_TOKEN_KEY = "law4u_advocate_token";

export function getAdminToken() { return sessionStorage.getItem(ADMIN_TOKEN_KEY); }
export function setAdminToken(token) {
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getAdvocateToken() {
  return localStorage.getItem(ADVOCATE_TOKEN_KEY) || sessionStorage.getItem(ADVOCATE_TOKEN_KEY);
}
export function setAdvocateToken(token, remember) {
  localStorage.removeItem(ADVOCATE_TOKEN_KEY);
  sessionStorage.removeItem(ADVOCATE_TOKEN_KEY);
  if (token) (remember ? localStorage : sessionStorage).setItem(ADVOCATE_TOKEN_KEY, token);
}

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await response.json(); } catch { /* empty body */ }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

// Avatar paths come back as "/uploads/x.png"; make them absolute when
// the API lives on another origin.
export function assetUrl(p) {
  if (!p || /^(https?:|data:)/.test(p)) return p;
  return `${API_BASE}${p}`;
}
