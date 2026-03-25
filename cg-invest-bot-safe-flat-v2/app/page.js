"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WELCOME = {
  en: `Welcome to the CG Investment Assistant.

I can help you with:
- Industrial Development Policy 2024–30
- Incentives and subsidy guidance
- Focus sectors and special packages
- Startup, export, logistics, and One Click support
- Investor process, land, approvals, and next steps

Please ask your question, or select one of the quick topics below.`,
  hi: `CG Investment Assistant में आपका स्वागत है।

मैं आपकी इन विषयों में सहायता कर सकता हूँ:
- औद्योगिक विकास नीति 2024–30
- प्रोत्साहन और सब्सिडी मार्गदर्शन
- फोकस सेक्टर और विशेष पैकेज
- स्टार्टअप, निर्यात, लॉजिस्टिक्स और One Click सहायता
- निवेश प्रक्रिया, भूमि, अनुमोदन और अगले कदम

कृपया अपना प्रश्न लिखें या नीचे दिए गए त्वरित विषयों में से एक चुनें।`,
};

const SUGGESTIONS = {
  en: [
    {
      title: "How to set up a factory in Chhattisgarh?",
      subtitle: "Approvals, land, and investor process",
      prompt: "How do I set up a factory in Chhattisgarh under the current industrial policy?",
      emoji: "🏭",
    },
    {
      title: "Estimate subsidies for my project",
      subtitle: "Get a structured estimate checklist",
      prompt: "Estimate subsidies for my project and tell me what inputs you need first.",
      emoji: "₹",
    },
    {
      title: "What special packages are available?",
      subtitle: "Focus sectors and policy benefits",
      prompt: "What special incentive packages are available under the current Chhattisgarh policy?",
      emoji: "🎁",
    },
    {
      title: "Benefits for women entrepreneurs",
      subtitle: "Category-based support and top-ups",
      prompt: "What benefits are available for women entrepreneurs under the current policy?",
      emoji: "👩",
    },
  ],
  hi: [
    {
      title: "छत्तीसगढ़ में फैक्ट्री कैसे शुरू करें?",
      subtitle: "अनुमोदन, भूमि और निवेश प्रक्रिया",
      prompt: "वर्तमान औद्योगिक नीति के अंतर्गत छत्तीसगढ़ में फैक्ट्री शुरू करने की प्रक्रिया बताइए।",
      emoji: "🏭",
    },
    {
      title: "मेरी परियोजना के लिए सब्सिडी का अनुमान",
      subtitle: "संरचित अनुमान हेतु आवश्यक इनपुट",
      prompt: "मेरी परियोजना के लिए सब्सिडी का अनुमान लगाइए और पहले बताइए कि कौन-कौन से इनपुट चाहिए।",
      emoji: "₹",
    },
    {
      title: "कौन-कौन से विशेष पैकेज उपलब्ध हैं?",
      subtitle: "फोकस सेक्टर और नीति लाभ",
      prompt: "वर्तमान छत्तीसगढ़ नीति के अंतर्गत कौन-कौन से विशेष प्रोत्साहन पैकेज उपलब्ध हैं?",
      emoji: "🎁",
    },
    {
      title: "महिला उद्यमियों के लिए लाभ",
      subtitle: "श्रेणी-आधारित अतिरिक्त सहायता",
      prompt: "वर्तमान नीति के अनुसार महिला उद्यमियों को कौन-कौन से लाभ उपलब्ध हैं?",
      emoji: "👩",
    },
  ],
};

function LogoMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span className="brand-mark-ring" />
      <span className="brand-mark-center" />
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

function InlineRichText({ text }) {
  if (!text) return null;
  const nodes = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }

    const token = match[0];

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(<code key={key++} className="inline-code">{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (linkMatch) {
        nodes.push(
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return <>{nodes}</>;
}

function RichMessage({ text }) {
  if (!text) return null;

  const lines = text.replace(/\r/g, "").split("\n");
  const blocks = [];
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length < 2) {
      tableRows = [];
      return;
    }

    const header = tableRows[0];
    const body = tableRows.slice(1).filter((row) => !row.every((cell) => /^[-:\s]+$/.test(cell)));

    blocks.push(
      <div className="table-wrap" key={`table-${blocks.length}`}>
        <table className="rich-table">
          <thead>
            <tr>
              {header.map((cell, idx) => (
                <th key={idx}><InlineRichText text={cell.trim()} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}><InlineRichText text={cell.trim()} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableRows = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const cells = line.split("|").slice(1, -1);
      tableRows.push(cells);
      return;
    }

    if (tableRows.length) {
      flushTable();
    }

    const trimmed = line.trim();

    if (!trimmed) {
      blocks.push(<div className="spacer" key={`space-${index}`} />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push(<h4 className="rich-h4" key={`h4-${index}`}><InlineRichText text={trimmed.slice(4)} /></h4>);
      return;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(<h3 className="rich-h3" key={`h3-${index}`}><InlineRichText text={trimmed.slice(3)} /></h3>);
      return;
    }

    if (trimmed.startsWith("# ")) {
      blocks.push(<h2 className="rich-h2" key={`h2-${index}`}><InlineRichText text={trimmed.slice(2)} /></h2>);
      return;
    }

    if (/^\*\*.+:\*\*$/.test(trimmed) || /^\*\*.+\*\*$/.test(trimmed)) {
      blocks.push(<h5 className="rich-label" key={`label-${index}`}><InlineRichText text={trimmed} /></h5>);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      blocks.push(
        <div className="rich-list-item" key={`bullet-${index}`}>
          <span className="bullet-dot">•</span>
          <span><InlineRichText text={trimmed.replace(/^[-*]\s+/, "")} /></span>
        </div>
      );
      return;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
      blocks.push(
        <div className="rich-list-item ordered" key={`ordered-${index}`}>
          <span className="bullet-number">{match?.[1]}.</span>
          <span><InlineRichText text={match?.[2] || trimmed} /></span>
        </div>
      );
      return;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(<hr className="rich-divider" key={`divider-${index}`} />);
      return;
    }

    blocks.push(<p className="rich-paragraph" key={`p-${index}`}><InlineRichText text={line} /></p>);
  });

  if (tableRows.length) {
    flushTable();
  }

  return <div className="rich-content">{blocks}</div>;
}

function MessageBubble({ role, content }) {
  const isAssistant = role === "assistant";
  return (
    <div className={`message-row ${role}`}>
      <div className={`message-bubble ${role}`}>
        {isAssistant ? <RichMessage text={content} /> : <div className="user-text">{content}</div>}
      </div>
    </div>
  );
}

function SuggestionCard({ item, onClick }) {
  return (
    <button className="suggestion-card" onClick={() => onClick(item.prompt)}>
      <div className="suggestion-icon">{item.emoji}</div>
      <div className="suggestion-body">
        <div className="suggestion-title">{item.title}</div>
        <div className="suggestion-subtitle">{item.subtitle}</div>
      </div>
    </button>
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const textareaRef = useRef(null);

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
    setMessages([{ role: "assistant", content: WELCOME[lang] }]);
  }

  async function sendMessage(textOverride) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          (language === "hi" ? "उत्तर प्राप्त करने में त्रुटि हुई।" : "There was an error getting a response.")
      );
    } finally {
      setLoading(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleTextareaChange(event) {
    setInput(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`;
  }

  if (!language) {
    return (
      <main className="landing-shell">
        <div className="landing-gradient" />
        <section className="landing-card">
          <div className="landing-topline">Chhattisgarh · Business Made Easy</div>
          <div className="landing-brand-row">
            <LogoMark />
            <div>
              <h1 className="landing-title">CG Investment Assistant</h1>
              <p className="landing-subtitle">
                Structured industrial policy guidance, subsidy support, and investor assistance for Chhattisgarh.
              </p>
            </div>
          </div>

          <div className="landing-actions">
            <button className="primary-button" onClick={() => startChat("en")}>Continue in English</button>
            <button className="secondary-button" onClick={() => startChat("hi")}>हिन्दी में शुरू करें</button>
          </div>

          <div className="landing-grid">
            <div className="landing-info-card">
              <div className="landing-info-title">What this assistant can do</div>
              <div className="landing-info-list">
                <span>Industrial policy guidance</span>
                <span>Subsidy readiness and structured estimates</span>
                <span>Sector and package discovery</span>
                <span>Startup, export, logistics, and One Click support</span>
              </div>
            </div>
            <div className="landing-info-card muted">
              <div className="landing-info-title">Important note</div>
              <p>
                This is an independent AI assistant. Final eligibility, sanction, reimbursement, and approvals depend on official notifications and department verification.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="chat-page">
      <div className="chat-backdrop" />
      <div className="chat-shell">
        <header className="chat-header">
          <div className="chat-brand">
            <LogoMark />
            <div>
              <div className="chat-title">CG Investment Assistant</div>
              <div className="chat-subtitle">Chhattisgarh Industrial Policy · Investor Support</div>
            </div>
          </div>

          <div className="chat-header-actions">
            <button className="header-button" onClick={() => setLanguage((current) => (current === "en" ? "hi" : "en"))}>
              <GlobeIcon />
              <span>{language === "en" ? "हिन्दी" : "English"}</span>
            </button>
            <button className="header-button" onClick={() => startChat(language)}>
              {language === "hi" ? "नई चैट" : "New chat"}
            </button>
          </div>
        </header>

        <section className="hero-strip">
          <div>
            <div className="hero-kicker">Independent industrial investment assistant</div>
            <h2 className="hero-headline">Namaste! How can I assist you today?</h2>
            <p className="hero-copy">
              Ask about policy, incentives, sectors, startup support, export support, logistics, land, and investor process.
            </p>
          </div>
        </section>

        <section className="chat-panel">
          <div className="suggestion-grid">
            {messages.length <= 1 && !loading
              ? suggestions.map((item) => <SuggestionCard key={item.title} item={item} onClick={sendMessage} />)
              : null}
          </div>

          <div className="chat-scroll">
            {messages.map((message, index) => (
              <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
            ))}

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

          <footer className="composer-panel">
            <div className="composer-box">
              <textarea
                ref={textareaRef}
                className="composer-textarea"
                value={input}
                rows={1}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={language === "hi" ? "छत्तीसगढ़ औद्योगिक निवेश के बारे में पूछें..." : "Ask about CG industrial investment..."}
              />
              <button className="composer-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                <SendIcon />
              </button>
            </div>
            <div className="composer-note">
              Official verification recommended at <a href="https://invest.cg.gov.in" target="_blank" rel="noreferrer">invest.cg.gov.in</a>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
