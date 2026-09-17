// Usage: node hash-password.js "YourPassword"  → prints a value for ADMIN_PASSWORD_HASH
const crypto = require("crypto");
const password = process.argv[2];
if (!password) { console.error("Usage: node hash-password.js <password>"); process.exit(1); }
const salt = crypto.randomBytes(16).toString("hex");
console.log(`scrypt$${salt}$${crypto.scryptSync(password, salt, 64).toString("hex")}`);
