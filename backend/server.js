// ============================================================
//  server.js — AdvocateHub API (dependency-free Node)
//  Port 5000. Owns advocates/clients data + uploaded avatars.
//
//  Security model:
//   • Passwords are stored only as scrypt hashes (never returned).
//   • Admin credentials come from backend/.env, not the frontend.
//   • Every write endpoint requires a signed Bearer token.
//   • Request bodies are capped at MAX_BODY bytes.
//   • Uploads are written under backend/uploads with a safe name.
// ============================================================

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ── Config ────────────────────────────────────────────────────
loadDotEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 5000;
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const ADVOCATES_FILE = path.join(DATA_DIR, "advocates.json");
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");
const MAX_BODY = 5 * 1024 * 1024; // 5 MB (base64 avatars)
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001")
  .split(",").map((s) => s.trim()).filter(Boolean);

const AUTH_SECRET = process.env.AUTH_SECRET;
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!AUTH_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
  console.error("Missing AUTH_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD_HASH in backend/.env (see .env.example)");
  process.exit(1);
}

const PUBLIC_FIELDS = [
  "id", "name", "city", "practiceArea", "speciality", "experience", "rating", "cases", "fee",
  "phone", "email", "languages", "availability", "bio", "avatar", "status", "court",
  "barCouncil", "barId", "lastBookingAt",
];

// ── Tiny helpers ──────────────────────────────────────────────
function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// ── Password hashing (scrypt) ─────────────────────────────────
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return false;
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const candidate = crypto.scryptSync(String(password), salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

// ── Signed tokens (HMAC, no external deps) ────────────────────
function signToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload.exp > Date.now() ? payload : null;
  } catch { return null; }
}

function authFromRequest(request) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  return verifyToken(token);
}

function requireAdmin(request) {
  const auth = authFromRequest(request);
  if (!auth || auth.role !== "admin") throw new HttpError(401, "Admin login required");
  return auth;
}

function requireAdminOrSelf(request, advocateId) {
  const auth = authFromRequest(request);
  if (!auth) throw new HttpError(401, "Login required");
  if (auth.role === "admin") return auth;
  if (auth.role === "advocate" && Number(auth.sub) === Number(advocateId)) return auth;
  throw new HttpError(403, "Not allowed");
}

// ── Data access ───────────────────────────────────────────────
function loadAdvocates() { return readJson(ADVOCATES_FILE, []); }
function saveAdvocates(list) { writeJson(ADVOCATES_FILE, list); }
function loadClients() { return readJson(CLIENTS_FILE, []); }
function saveClients(list) { writeJson(CLIENTS_FILE, list); }

function toPublic(advocate) {
  const out = {};
  for (const key of PUBLIC_FIELDS) if (advocate[key] !== undefined) out[key] = advocate[key];
  return out;
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function normalizeEmail(email) { return String(email || "").trim().toLowerCase(); }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

// One-time migration: any legacy plain-text `password` → `passwordHash`.
function migratePasswords() {
  const list = loadAdvocates();
  let changed = false;
  for (const a of list) {
    if (a.password !== undefined) {
      if (a.password && !a.passwordHash) a.passwordHash = hashPassword(a.password);
      delete a.password;
      changed = true;
    }
    if (!a.status) { a.status = "approved"; changed = true; }
  }
  if (changed) {
    saveAdvocates(list);
    console.log(`Migrated ${list.length} advocate records: plain-text passwords replaced with hashes`);
  }
}

// ── Avatars ───────────────────────────────────────────────────
function saveAvatar(name, avatarData, id) {
  if (!String(avatarData || "").startsWith("data:image/")) return null;
  const match = String(avatarData).match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!match) throw new HttpError(400, "Unsupported avatar image format");

  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  const slug = String(name || "advocate")
    .replace(/^adv\.\s*/i, "").trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "advocate";
  const filename = path.basename(`${slug}-${id}.${extension}`);

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), Buffer.from(match[2], "base64"));
  return `/uploads/${filename}`;
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

function serveUpload(request, response, urlPath) {
  const filename = path.basename(decodeURIComponent(urlPath.replace(/^\/uploads\//, "")));
  const file = path.join(UPLOAD_DIR, filename);
  if (!file.startsWith(UPLOAD_DIR) || !fs.existsSync(file)) {
    return send(request, response, 404, { error: "Not found" });
  }
  response.writeHead(200, {
    "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "public, max-age=86400",
    ...corsHeaders(request),
  });
  fs.createReadStream(file).pipe(response);
}

// ── HTTP plumbing ─────────────────────────────────────────────
function corsHeaders(request) {
  const origin = request.headers.origin;
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Vary": "Origin",
  };
}

function send(request, response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json", ...corsHeaders(request) });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    const onData = (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        request.removeListener("data", onData);
        request.resume(); // drain so the 413 can be written, then drop the socket
        reject(new HttpError(413, "Request body too large"));
        return;
      }
      chunks.push(chunk);
    };
    request.on("data", onData);
    request.on("end", () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(new HttpError(400, "Invalid JSON body")); }
    });
    request.on("error", reject);
  });
}

// ── Route handlers ────────────────────────────────────────────
function buildAdvocateRecord(payload, id, status) {
  const email = normalizeEmail(payload.email);
  return {
    id,
    name: String(payload.name || "").trim(),
    city: payload.city || "",
    practiceArea: payload.practiceArea || payload.speciality || "",
    speciality: payload.speciality || "",
    court: payload.court || "",
    barCouncil: payload.barCouncil || "",
    barId: payload.barId || "",
    experience: payload.experience || "",
    rating: Number(payload.rating) || 0,
    cases: Number(payload.cases) || 0,
    fee: payload.fee || "Not specified",
    phone: payload.phone || "",
    email,
    languages: Array.isArray(payload.languages) ? payload.languages : [],
    availability: payload.availability || "Not available",
    bio: payload.bio || "",
    avatar: payload.avatar || "",
    status,
  };
}

// Public: advocate self-registration → pending until admin approves.
async function registerAdvocate(request, payload, { status = "pending", byAdmin = false } = {}) {
  const email = normalizeEmail(payload.email);
  if (!String(payload.name || "").trim()) throw new HttpError(400, "Name is required");
  if (!isValidEmail(email)) throw new HttpError(400, "A valid email is required");
  if (!byAdmin && String(payload.password || "").length < 6) throw new HttpError(400, "Password must be at least 6 characters");

  const list = loadAdvocates();
  if (list.some((a) => normalizeEmail(a.email) === email)) throw new HttpError(409, "An account with this email already exists");

  const id = nextId(list);
  const record = buildAdvocateRecord(payload, id, status);
  // Admin-created accounts without a password can't log in until one is set.
  record.passwordHash = payload.password ? hashPassword(payload.password) : null;
  const avatar = saveAvatar(record.name, payload.avatarData, id);
  if (avatar) record.avatar = avatar;
  else if (!byAdmin && !record.avatar) throw new HttpError(400, "Profile image is required");

  list.push(record);
  saveAdvocates(list);
  return toPublic(record);
}

async function registerClient(payload) {
  const email = normalizeEmail(payload.email);
  if (!String(payload.name || "").trim()) throw new HttpError(400, "Name is required");
  if (!isValidEmail(email)) throw new HttpError(400, "A valid email is required");
  if (String(payload.password || "").length < 6) throw new HttpError(400, "Password must be at least 6 characters");

  const list = loadClients();
  if (list.some((c) => normalizeEmail(c.email) === email)) throw new HttpError(409, "An account with this email already exists");

  const record = {
    id: nextId(list),
    name: String(payload.name).trim(),
    email,
    phone: payload.phone || "",
    city: payload.city || "",
    passwordHash: hashPassword(payload.password),
    createdAt: new Date().toISOString(),
  };
  list.push(record);
  saveClients(list);
  const { passwordHash, ...safe } = record;
  return safe;
}

function advocateLogin(payload) {
  const email = normalizeEmail(payload.email);
  const advocate = loadAdvocates().find((a) => normalizeEmail(a.email) === email);
  if (!advocate || !verifyPassword(payload.password, advocate.passwordHash)) {
    throw new HttpError(401, "Incorrect email or password");
  }
  if (advocate.status !== "approved") {
    const err = new HttpError(403, advocate.status === "rejected"
      ? "Your advocate application was not approved. Contact support for details."
      : "Your account is awaiting admin approval. Please check back later.");
    err.extra = { status: advocate.status };
    throw err;
  }
  return { token: signToken({ sub: advocate.id, role: "advocate" }), advocate: toPublic(advocate) };
}

function adminLogin(payload) {
  const ok = normalizeEmail(payload.email) === ADMIN_EMAIL && verifyPassword(payload.password, ADMIN_PASSWORD_HASH);
  if (!ok) throw new HttpError(401, "Invalid admin email or password");
  return { token: signToken({ sub: "admin", role: "admin" }), email: ADMIN_EMAIL };
}

function updateAdvocate(id, payload) {
  const list = loadAdvocates();
  const index = list.findIndex((a) => Number(a.id) === Number(id));
  if (index === -1) throw new HttpError(404, "Advocate not found");
  const current = list[index];

  const email = payload.email !== undefined ? normalizeEmail(payload.email) : current.email;
  if (!isValidEmail(email)) throw new HttpError(400, "A valid email is required");
  if (list.some((a, i) => i !== index && normalizeEmail(a.email) === email)) throw new HttpError(409, "Email already in use");

  const merged = { ...current, ...buildAdvocateRecord({ ...current, ...payload, email }, current.id, payload.status || current.status) };
  merged.passwordHash = payload.password ? hashPassword(payload.password) : current.passwordHash;
  const avatar = saveAvatar(merged.name, payload.avatarData, current.id);
  if (avatar) merged.avatar = avatar;
  if (payload.lastBookingAt) merged.lastBookingAt = payload.lastBookingAt;

  list[index] = merged;
  saveAdvocates(list);
  return toPublic(merged);
}

function setAdvocateStatus(id, status) {
  if (!["pending", "approved", "rejected"].includes(status)) throw new HttpError(400, "Invalid status");
  return updateAdvocate(id, { status });
}

function deleteAdvocate(id) {
  const list = loadAdvocates();
  const remaining = list.filter((a) => Number(a.id) !== Number(id));
  if (remaining.length === list.length) throw new HttpError(404, "Advocate not found");
  saveAdvocates(remaining);
  return { ok: true };
}

// ── Router ────────────────────────────────────────────────────
async function route(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { method } = request;
  const p = url.pathname;

  if (method === "OPTIONS") { response.writeHead(204, corsHeaders(request)); return response.end(); }
  if (method === "GET" && p.startsWith("/uploads/")) return serveUpload(request, response, p);

  if (method === "GET" && p === "/api/health") return send(request, response, 200, { ok: true });

  // Advocates (read)
  if (method === "GET" && p === "/api/advocates") {
    const list = loadAdvocates();
    if (url.searchParams.get("all") === "1") {
      requireAdmin(request);
      return send(request, response, 200, list.map(toPublic));
    }
    return send(request, response, 200, list.filter((a) => a.status === "approved").map(toPublic));
  }

  // Auth
  if (method === "POST" && p === "/api/auth/advocate/login") return send(request, response, 200, advocateLogin(await readBody(request)));
  if (method === "POST" && p === "/api/auth/admin/login") return send(request, response, 200, adminLogin(await readBody(request)));
  if (method === "GET" && p === "/api/auth/me") {
    const auth = authFromRequest(request);
    if (!auth) throw new HttpError(401, "Not logged in");
    if (auth.role === "admin") return send(request, response, 200, { role: "admin", email: ADMIN_EMAIL });
    const advocate = loadAdvocates().find((a) => Number(a.id) === Number(auth.sub));
    if (!advocate) throw new HttpError(401, "Account no longer exists");
    return send(request, response, 200, { role: "advocate", advocate: toPublic(advocate) });
  }

  // Registration (public)
  if (method === "POST" && p === "/api/advocates/register") return send(request, response, 201, await registerAdvocate(request, await readBody(request)));
  if (method === "POST" && p === "/api/clients/register") return send(request, response, 201, await registerClient(await readBody(request)));

  // Admin-only writes
  if (method === "POST" && p === "/api/advocates") {
    requireAdmin(request);
    const body = await readBody(request);
    return send(request, response, 201, await registerAdvocate(request, body, { status: body.status || "approved", byAdmin: true }));
  }

  const idMatch = p.match(/^\/api\/advocates\/(\d+)(\/status)?$/);
  if (idMatch) {
    const id = Number(idMatch[1]);
    if (idMatch[2] && method === "POST") { requireAdmin(request); return send(request, response, 200, setAdvocateStatus(id, (await readBody(request)).status)); }
    if (method === "PUT") {
      const auth = requireAdminOrSelf(request, id);
      const body = await readBody(request);
      if (auth.role !== "admin") { delete body.status; delete body.rating; delete body.cases; } // self-edits can't self-approve
      return send(request, response, 200, updateAdvocate(id, body));
    }
    if (method === "DELETE") { requireAdmin(request); return send(request, response, 200, deleteAdvocate(id)); }
  }

  throw new HttpError(404, "Not found");
}

const server = http.createServer((request, response) => {
  route(request, response).catch((error) => {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error(error);
    send(request, response, status, { error: status === 500 ? "Internal server error" : error.message, ...(error.extra || {}) });
    if (status === 413) response.once("finish", () => request.destroy());
  });
});

migratePasswords();
server.listen(PORT, () => {
  console.log(`AdvocateHub API running at http://localhost:${PORT}`);
});
