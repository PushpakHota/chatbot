"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WELCOME = {
  en: `Welcome! I’m the Chhattisgarh Industrial Investment Assistant.

I can help with:
- Industrial Policy 2024-30 guidance
- Incentive and subsidy estimation
- Sector-specific packages
- Land, approvals, and single-window guidance
- Special-category benefits (women, SC/ST, exporters, etc.)

How can I assist you today?`,
  hi: `नमस्ते! मैं छत्तीसगढ़ औद्योगिक निवेश सहायक हूँ।

मैं इन विषयों में सहायता कर सकता हूँ:
- औद्योगिक नीति 2024-30 की जानकारी
- सब्सिडी और प्रोत्साहन का अनुमान
- सेक्टर-विशेष पैकेज
- भूमि, अनुमोदन और सिंगल-विंडो मार्गदर्शन
- विशेष श्रेणी लाभ (महिला, SC/ST, निर्यातक आदि)

मैं आपकी कैसे सहायता करूँ?`,
};

const SUGGESTIONS = {
  en: [
    "Estimate subsidies for a food processing MSME in Group 3.",
    "What benefits are available for women entrepreneurs?",
    "How do I start a factory in Chhattisgarh?",
    "What incentives exist for IT/ITeS or data centers?",
  ],
  hi: [
    "Group 3 में food processing MSME के लिए सब्सिडी का अनुमान लगाइए।",
    "महिला उद्यमियों के लिए कौन-कौन से लाभ हैं?",
    "छत्तीसगढ़ में फैक्ट्री शुरू करने की प्रक्रिया क्या है?",
    "IT/ITeS या data center के लिए कौन से प्रोत्साहन हैं?",
  ],
};

function BuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 20h20" />
      <path d="M5 20V8l5 4V8l5 4V4h3v16" />
      <path d="M18 8h2v4h-2z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22 11 13 2 9 22 2z" />
    </svg>
  );
}

function MessageBubble({ role, content }) {
  return (
    <div className={`message-row ${role}`}>
      <div className={`message-bubble ${role}`}>
        {content}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestions = useMemo(() => {
    if (!language) return [];
    return SUGGESTIONS[language];
  }, [language]);

  function startChat(lang) {
    setLanguage(lang);
    setError("");
    setInput("");
    setMessages([
      {
        role: "assistant",
        content: WELCOME[lang],
      },
    ]);
  }

  async function sendMessage(textOverride) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || (language === "hi" ? "कोई उत्तर प्राप्त नहीं हुआ।" : "No response received."),
        },
      ]);
    } catch (err) {
      setError(
        err?.message ||
          (language === "hi"
            ? "उत्तर प्राप्त करने में त्रुटि हुई।"
            : "There was an error getting a response.")
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  if (!language) {
    return (
      <main className="page-shell center-stage">
        <section className="card">
          <div className="hero-logo">
            <BuildingIcon />
          </div>
          <div className="kicker">Investor support · Secure deployable build</div>
          <h1 className="hero-title">CG Industrial Investment Assistant</h1>
          <p className="hero-subtitle">
            A safe, GitHub-to-Vercel version of the chatbot you analyzed.
            The Anthropic key stays on the server, not in the browser.
          </p>

          <div className="button-row">
            <button className="button" onClick={() => startChat("en")}>English</button>
            <button className="button-secondary" onClick={() => startChat("hi")}>हिन्दी</button>
          </div>

          <div className="hero-note">
            This is an independent assistant template for Chhattisgarh industrial investment guidance.
            Final eligibility and approvals always depend on official verification via the Invest Chhattisgarh portal.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="app-shell">
        <section className="app-panel">
          <header className="topbar">
            <div className="topbar-left">
              <div className="hero-logo" style={{ width: 48, height: 48, borderRadius: 16, marginBottom: 0 }}>
                <BuildingIcon />
              </div>
              <div>
                <h1 className="topbar-title">CG Industrial Investment Assistant</h1>
                <div className="topbar-subtitle">Chhattisgarh Policy 2024–30 · Secure backend proxy</div>
              </div>
            </div>
            <div className="topbar-actions">
              <button className="icon-button" onClick={() => setLanguage((current) => current === "en" ? "hi" : "en")}>
                {language === "en" ? "हिन्दी" : "English"}
              </button>
              <button className="icon-button" onClick={() => startChat(language)}>
                {language === "hi" ? "नई चैट" : "New chat"}
              </button>
            </div>
          </header>

          <div className="chat-scroll">
            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
            ))}

            {messages.length === 1 && !loading ? (
              <div className="suggestions">
                {suggestions.map((prompt) => (
                  <button key={prompt} className="chip" onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {loading ? (
              <div className="message-row assistant">
                <div className="message-bubble assistant typing" aria-label="Assistant is typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            ) : null}

            <div ref={endRef} />
          </div>

          {error ? <div className="error-banner">{error}</div> : null}

          <footer className="composer">
            <div className="composer-row">
              <textarea
                className="textarea"
                value={input}
                rows={3}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "hi" ? "अपना प्रश्न यहाँ लिखें..." : "Ask about industrial investment in Chhattisgarh..."}
              />
              <button className="send-button" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                <SendIcon />
              </button>
            </div>
            <div className="footer-note">
              Independent template · Official verification recommended at{" "}
              <a href="https://invest.cg.gov.in" target="_blank" rel="noreferrer">invest.cg.gov.in</a>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
