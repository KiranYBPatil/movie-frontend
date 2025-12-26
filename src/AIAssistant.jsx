import { useState } from "react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setTyping(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userMessage.text }),
    });

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: data.answer },
    ]);
  } catch (error) {
    // 🔕 Silent fail (no ugly message)
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: "⚠️ Please try again..." },
    ]);
  }

  setTyping(false);
};


  return (
    <div style={{ padding: "20px", background: "#121212", minHeight: "100vh" }}>
      <h2 style={{ color: "#e50914", textAlign: "center" }}>
        🎬 Movie AI Assistant
      </h2>

      <iframe
        src="https://patilkiran-movie-rag-ai.hf.space"
        width="100%"
        height="600"
        style={{
          border: "none",
          borderRadius: "10px",
          marginTop: "20px",
          background: "#fff",
        }}
        title="Movie RAG AI"
      />
    </div>
  );
}



const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#121212",
    color: "#fff",
    fontFamily: "Arial",
  },
  header: {
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#e50914",
    fontSize: "18px",
    fontWeight: "bold",
  },
  chatArea: {
    flex: 1,
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },
  message: {
    maxWidth: "70%",
    padding: "12px",
    borderRadius: "18px",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  typing: {
    backgroundColor: "#333",
    fontStyle: "italic",
    alignSelf: "flex-start",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #333",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#e50914",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
