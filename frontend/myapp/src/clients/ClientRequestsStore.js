const REQUESTS_KEY = "law4u_requests";

function readAll() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function getRequestsForAdvocate(advocateId) {
  const all = readAll();
  return Array.isArray(all[advocateId]) ? all[advocateId] : [];
}

export function addClientRequest(advocateId, request) {
  const all = readAll();
  const existing = Array.isArray(all[advocateId]) ? all[advocateId] : [];
  all[advocateId] = [request, ...existing];
  writeAll(all);
  return request;
}

export function updateClientRequest(advocateId, request) {
  const all = readAll();
  const existing = Array.isArray(all[advocateId]) ? all[advocateId] : [];
  all[advocateId] = existing.map(item => item.id === request.id ? request : item);
  writeAll(all);
  return request;
}
