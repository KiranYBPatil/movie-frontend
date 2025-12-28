import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;

    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userText })
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.answer }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "⚠️ AI is temporarily unavailable" }
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={styles.box}>
      <div style={styles.header}>🎬 Movie AI Assistant</div>

      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#e50914" : "#333"
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.msg, background: "#333" }}>
            Typing...
          </div>
        )}
      </div>

      <div style={styles.inputBar}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about booking, seats, snacks..."
          style={styles.input}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.btn}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  box: {
    width: 360,
    height: 520,
    background: "#121212",
    color: "#fff",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
  },
  header: {
    background: "#e50914",
    padding: 12,
    textAlign: "center",
    fontWeight: "bold",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  chat: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto"
  },
  msg: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: "1.4"
  },
  inputBar: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #222"
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "none",
    outline: "none"
  },
  btn: {
    marginLeft: 8,
    background: "#e50914",
    color: "#fff",
    borderRadius: 20,
    border: "none",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
