// ============================================================
//  Clientsstore.js — Client registration (API-backed)
//  Clients are created via POST /api/clients/register; the backend
//  hashes the password and keeps the record in backend/data/clients.json.
// ============================================================

import { api } from "./api";

export function registerClient(client) {
  return api("/api/clients/register", { method: "POST", body: client });
}
