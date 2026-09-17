// ============================================================
//  Chatbot.js  —  AdvocateHub Floating Chatbot
//  Place: frontend/myapp/src/pages/Chatbot.js
//  Shows floating icon on all pages
//  Opens chat window with full advocate search, nav, FAQ
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Chatbot.css";

const CHAT_API = "http://localhost:5001/chat";

const QUICK_ACTIONS = [
  { label: "🔍 Find Advocates",        msg: "Show all advocates"            },
  { label: "⚖️ Criminal Lawyers",      msg: "Show criminal lawyers"         },
  { label: "👨‍👩‍👧 Family Lawyers",    msg: "Show family lawyers"           },
  { label: "🏠 Property Lawyers",      msg: "Show property lawyers"         },
  { label: "📋 Bare Acts",             msg: "Go to Bare Acts"               },
  { label: "❓ Legal Documents",       msg: "Go to Legal Documents"         },
  { label: "💬 Ask a Question",        msg: "Go to Ask Question"            },
  { label: "ℹ️ What is bail?",         msg: "What is bail?"                 },
];

// ── Advocate result card inside chat ──────────────────────────
function ChatAdvocateCard({ adv, onOpen }) {
  return (
    <div className="cb-adv-card" onClick={() => onOpen(adv)}>
      <div className="cb-adv-avatar">
        {(adv.name || "?").replace(/^Adv\.\s*/i, "").split(" ").map(n => n[0]).join("").slice(0, 2)}
      </div>
      <div className="cb-adv-info">
        <div className="cb-adv-name">{adv.name}</div>
        <div className="cb-adv-spec">{adv.speciality} · {adv.city}</div>
        <div className="cb-adv-meta">
          ⭐ {adv.rating} · {adv.experience} · {adv.fee}
        </div>
        {adv.availability && (
          <div className="cb-adv-avail">🟢 {adv.availability}</div>
        )}
      </div>
      <button className="cb-adv-view" onClick={e => { e.stopPropagation(); onOpen(adv); }}>
        View →
      </button>
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────
function MessageBubble({ msg, onAdvocateOpen, onNavigate }) {
  const isBot = msg.role === "bot";

  // Render markdown-like bold (**text**)
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  return (
    <div className={`cb-msg-row ${isBot ? "bot" : "user"}`}>
      {isBot && <div className="cb-bot-icon">⚖️</div>}
      <div className={`cb-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        {/* Text */}
        {msg.text && (
          <div className="cb-bubble-text">
            {msg.text.split("\n").map((line, i) => (
              <div key={i}>{renderText(line)}</div>
            ))}
          </div>
        )}

        {/* Advocate cards */}
        {msg.advocates && msg.advocates.length > 0 && (
          <div className="cb-adv-list">
            {msg.advocates.map(adv => (
              <ChatAdvocateCard
                key={adv.id || adv.name}
                adv={adv}
                onOpen={onAdvocateOpen}
              />
            ))}
          </div>
        )}

        {/* Navigate button */}
        {msg.navigate && msg.type === "navigate" && (
          <button
            className="cb-nav-btn"
            onClick={() => onNavigate(msg.navigate)}
          >
            Go Now →
          </button>
        )}

        {/* View all advocates button */}
        {msg.advocates && msg.advocates.length > 0 && msg.navigate && msg.type !== "navigate" && (
          <button
            className="cb-see-all-btn"
            onClick={() => onNavigate(msg.navigate)}
          >
            See All →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="cb-msg-row bot">
      <div className="cb-bot-icon">⚖️</div>
      <div className="cb-bubble bot-bubble cb-typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//   MAIN CHATBOT COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Chatbot() {
  const navigate = useNavigate();

  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [unread,    setUnread]    = useState(0);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // ── Welcome message on first open ────────────────────────
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setUnread(0);
      const welcome = {
        id:   Date.now(),
        role: "bot",
        text: "👋 Hi! I'm the AdvocateHub Assistant.\n\nI can help you:\n• 🔍 **Find advocates** by name, city or speciality\n• 🧭 **Navigate** to any page\n• 👤 **Open advocate profiles**\n• ⚖️ **Answer legal questions**\n\nWhat can I help you with?",
        type: "text",
      };
      setMessages([welcome]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (isOpen) setUnread(0);
  }, [isOpen, hasOpened]);

  // ── Scroll to bottom ──────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: msg, type: "text" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res  = await fetch(CHAT_API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      const botMsg = {
        id:        Date.now() + 1,
        role:      "bot",
        text:      data.text      || "",
        type:      data.type      || "text",
        advocates: data.advocates || null,
        navigate:  data.navigate  || null,
        profileId: data.profileId || null,
      };
      setMessages(prev => [...prev, botMsg]);

      // Auto-navigate
      if (data.type === "navigate" && data.navigate) {
        setTimeout(() => {
          navigate(data.navigate);
          setIsOpen(false);
        }, 1000);
      }

      // Auto-open profile
      if (data.type === "profile" && data.navigate) {
        setTimeout(() => {
          navigate(data.navigate);
          setIsOpen(false);
        }, 1000);
      }

    } catch {
      setMessages(prev => [
        ...prev,
        {
          id:   Date.now() + 1,
          role: "bot",
          text: "⚠️ Cannot connect to chatbot server. Make sure the Python server is running:\n```\ncd chatbot\npython app.py\n```",
          type: "text",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // ── Navigate from bot response ────────────────────────────
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // ── Open advocate profile ─────────────────────────────────
  const handleAdvocateOpen = (adv) => {
    if (adv.profileUrl || adv.id) {
      navigate(adv.profileUrl || `/profile/${adv.id}`);
      setIsOpen(false);
    }
  };

  // ── Quick action click ────────────────────────────────────
  const handleQuickAction = (msg) => {
    sendMessage(msg);
  };

  // ── Key handler ───────────────────────────────────────────
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat ────────────────────────────────────────────
  const clearChat = () => {
    setMessages([]);
    setHasOpened(false);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        className={`cb-fab ${isOpen ? "cb-fab-open" : ""}`}
        onClick={() => setIsOpen(p => !p)}
        title="Chat with AdvocateHub Assistant"
        aria-label="Open chatbot"
      >
        {isOpen ? "✕" : "⚖️"}
        {!isOpen && unread > 0 && (
          <span className="cb-fab-badge">{unread}</span>
        )}
        {!isOpen && (
          <span className="cb-fab-label">Ask me anything</span>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="cb-window">

          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-header-icon">⚖️</div>
              <div>
                <div className="cb-header-title">AdvocateHub Assistant</div>
                <div className="cb-header-sub">
                  <span className="cb-online-dot" /> Online · Ask me anything
                </div>
              </div>
            </div>
            <div className="cb-header-actions">
              <button className="cb-header-btn" onClick={clearChat} title="Clear chat">🗑</button>
              <button className="cb-header-btn" onClick={() => setIsOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* Quick actions (only shown when no messages or just welcome) */}
          {messages.length <= 1 && (
            <div className="cb-quick-actions">
              <div className="cb-quick-label">Quick Actions</div>
              <div className="cb-quick-grid">
                {QUICK_ACTIONS.map(qa => (
                  <button
                    key={qa.msg}
                    className="cb-quick-btn"
                    onClick={() => handleQuickAction(qa.msg)}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="cb-messages">
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onAdvocateOpen={handleAdvocateOpen}
                onNavigate={handleNavigate}
              />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="cb-input-area">
            <textarea
              ref={inputRef}
              className="cb-input"
              rows={1}
              placeholder="Ask me about advocates, laws, navigation..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="cb-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>

          {/* Footer */}
          <div className="cb-footer">
            ⚖️ AdvocateHub AI · Not legal advice
          </div>
        </div>
      )}
    </>
  );
}