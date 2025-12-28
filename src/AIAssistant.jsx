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
    background: "#0f0f0f",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    background: "#e50914",
    padding: "16px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "0.5px"
  },
  chatArea: {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto"
  },
  message: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "15px",
    lineHeight: "1.4"
  },
  inputBar: {
    display: "flex",
    padding: "12px",
    borderTop: "1px solid #333",
    background: "#0f0f0f"
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "none",
    outline: "none",
    fontSize: "15px"
  },
  button: {
    marginLeft: "10px",
    padding: "12px 20px",
    borderRadius: "24px",
    border: "none",
    background: "#e50914",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};
