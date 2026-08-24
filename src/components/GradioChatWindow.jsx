import React, { useState } from "react";
import { Terminal, RefreshCw } from "lucide-react";

const GRADIO_URL = import.meta.env.VITE_GRADIO_URL || "http://localhost:7860";

export default function GradioChatWindow() {
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div style={{ width: "100%", height: "440px", background: "#0a0e14", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "#0d1420", borderBottom: "1px solid #1f2c3d", fontSize: "11px", color: "#64748b" }}>
        <Terminal size={12} color="#ffb000" />
        <span style={{ color: "#ffb000", fontWeight: 600 }}>python3 backend/app.py</span>
        <span style={{ marginLeft: "auto", color: "#6bcf7f" }}>● Live</span>
        <button
          type="button"
          onClick={() => setIframeKey((k) => k + 1)}
          style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center" }}
          title="Reconnect Python Server"
        >
          <RefreshCw size={11} />
        </button>
      </div>

      <iframe
        key={iframeKey}
        src={GRADIO_URL}
        title="Python Gradio Digital Twin Backend"
        style={{
          width: "100%",
          height: "410px",
          border: "none",
          background: "#0a0e14",
        }}
      />
    </div>
  );
}
