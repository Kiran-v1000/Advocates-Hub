// ============================================================
//  messagesStore.js — Shared inquiry/message data layer
//  Backed by localStorage. Used by Contact.js and Partners.js
//  to save submissions, and by AdminPage.js to display them.
//
//  Message shape:
//  {
//    id, type: "contact" | "partner",
//    read: boolean, createdAt: ISOString,
//    // contact-type fields:
//    name, email, phone, subject, message,
//    // partner-type fields:
//    orgName, contactName, email, partnershipType, message
//  }
// ============================================================

const STORE_KEY = "law4u_messages";

function persist(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

export function getMessages() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMessage(msg) {
  const list = getMessages();
  const nextId = list.length ? Math.max(...list.map((m) => m.id)) + 1 : 1;
  const newMsg = {
    id: nextId,
    read: false,
    createdAt: new Date().toISOString(),
    ...msg,
  };
  // newest first
  persist([newMsg, ...list]);
  return newMsg;
}

export function markAsRead(id) {
  const list = getMessages();
  const updated = list.map((m) => (m.id === id ? { ...m, read: true } : m));
  persist(updated);
}

export function deleteMessage(id) {
  const list = getMessages();
  persist(list.filter((m) => m.id !== id));
}