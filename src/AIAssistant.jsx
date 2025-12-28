import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi 👋 I’m your Movie Booking Assistant. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setMessages(m => [...m, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText })
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages(m => [...m, { role: "ai", text: data.answer }]);
    } catch {
      setMessages(m => [
        ...m,
        { role: "ai", text: "⚠️ AI is temporarily unavailable. Please try again." }
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        🎬 Movie AI Assistant
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#e50914" : "#2a2a2a"
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, background: "#2a2a2a" }}>
            Typing...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={styles.inputBar}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about booking, seats, snacks..."
          style={styles.input}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(180deg, #0b0b0b, #121212)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', Arial, sans-serif"
  },

  header: {
    background: "linear-gradient(90deg, #e50914, #b20710)",
    padding: "18px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
  },

  chatArea: {
    flex: 1,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    overflowY: "auto"
  },

  message: {
    maxWidth: "70%",
    padding: "14px 18px",
    borderRadius: "20px",
    fontSize: "15px",
    lineHeight: "1.5",
    boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
    backdropFilter: "blur(6px)"
  },

  inputBar: {
    display: "flex",
    padding: "14px",
    borderTop: "1px solid #2a2a2a",
    background: "rgba(15,15,15,0.95)",
    backdropFilter: "blur(8px)"
  },

  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "30px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "#1f1f1f",
    color: "#fff"
  },

  button: {
    marginLeft: "12px",
    padding: "14px 24px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(135deg, #e50914, #ff2a2a)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(229,9,20,0.5)"
  }
};

