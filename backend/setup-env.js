// Usage: node setup-env.js <admin-email> <admin-password>
// Writes backend/.env with a fresh AUTH_SECRET and a correctly hashed
// admin password. Safe to re-run — it overwrites the previous .env.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: node setup-env.js <admin-email> <admin-password>\n  e.g. node setup-env.js admin@law4u.in "Admin@123"');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const hash = `scrypt$${salt}$${crypto.scryptSync(password, salt, 64).toString("hex")}`;

const env = [
  "PORT=5000",
  "CORS_ORIGINS=http://localhost:3000,http://localhost:3001",
  `AUTH_SECRET=${crypto.randomBytes(32).toString("hex")}`,
  `ADMIN_EMAIL=${email.trim().toLowerCase()}`,
  `ADMIN_PASSWORD_HASH=${hash}`,
  "",
].join("\n");

const file = path.join(__dirname, ".env");
fs.writeFileSync(file, env, { encoding: "utf8" });
console.log(`Wrote ${file}\nAdmin login: ${email.trim().toLowerCase()} / (the password you provided)\nRestart the backend (node server.js) for it to take effect.`);
