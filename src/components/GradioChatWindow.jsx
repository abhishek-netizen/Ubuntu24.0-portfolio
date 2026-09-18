import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, RefreshCw } from "lucide-react";
import profile from "../../profile.json";

const SAMPLE_QUESTIONS = [
  "What is your full stack experience?",
  "What AWS & Frontend tools do you use?",
  "How can I get in touch?",
];

export default function GradioChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm ${profile.shortName || "Abhishek"}'s AI Digital Twin. Ask me anything about my software engineering experience, cloud architecture, skills, or projects!`,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim() || loading) return;

    const userMsg = { role: "user", content: query.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputVal("");
    setLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = updatedMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server status ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "No response received." },
      ]);
    } catch (err) {
      console.error("AI Twin Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Note: ${err.message || "Failed to connect to AI backend"}. Make sure OPENAI_API_KEY is configured in Vercel.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "440px",
        background: "#0d1117",
        color: "#c9d1d9",
        display: "flex",
        flexDirection: "column",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "#161b22",
          borderBottom: "1px solid #30363d",
          fontSize: "12px",
        }}
      >
        <Bot size={15} color="#e36049" />
        <span style={{ color: "#f0f6fc", fontWeight: 600 }}>
          {profile.shortName.toUpperCase()}-OS AI Digital Twin
        </span>
        <span style={{ fontSize: "10px", color: "#8b949e", marginLeft: "4px" }}>
          (Vercel Serverless & OpenAI)
        </span>
        <span style={{ marginLeft: "auto", color: "#3fb950", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
          <Sparkles size={11} /> Online
        </span>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          padding: "14px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#e36049",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <Bot size={16} />
              </div>
            )}

            <div
              style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                background: msg.role === "user" ? "#1f6feb" : "#21262d",
                color: "#f0f6fc",
                fontSize: "13px",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#30363d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8b949e",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#e36049",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Bot size={16} />
            </div>
            <div style={{ padding: "8px 12px", background: "#21262d", borderRadius: "12px", fontSize: "12px", color: "#8b949e" }}>
              {profile.shortName} AI is thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Sample question chips */}
      {messages.length <= 2 && (
        <div style={{ padding: "0 14px 8px 14px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              style={{
                background: "rgba(56, 139, 253, 0.1)",
                border: "1px solid rgba(56, 139, 253, 0.3)",
                color: "#58a6ff",
                borderRadius: "16px",
                padding: "4px 10px",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              💬 {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        style={{
          padding: "10px 14px",
          background: "#161b22",
          borderTop: "1px solid #30363d",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${profile.shortName} AI a question...`}
          disabled={loading}
          style={{
            flex: 1,
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#f0f6fc",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputVal.trim()}
          style={{
            background: inputVal.trim() && !loading ? "#238636" : "#21262d",
            color: inputVal.trim() && !loading ? "#fff" : "#8b949e",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            cursor: inputVal.trim() && !loading ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
}
