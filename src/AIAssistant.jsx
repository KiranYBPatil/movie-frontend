import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

const API_URL = import.meta.env.VITE_API_URL;

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const question = input;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((m) => [...m, { role: "ai", text: data.answer }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "⚠️ Sorry, AI is currently unavailable." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0b] via-[#121212] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-4xl h-[88vh] bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="relative px-6 py-5 text-center text-white bg-gradient-to-r from-purple-700 via-pink-600 to-red-500">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            <BsStars className="text-yellow-300" />
            Movie AI Assistant
          </div>
          <p className="text-sm text-white/90 mt-1">
            Ask about movies, shows, seats & bookings 🍿
          </p>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-3 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg
                  ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                      : "bg-white/10 text-gray-100 rounded-bl-none"
                  }`}
              >
                {m.text}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">
                  👤
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div className="bg-white/10 text-gray-300 px-5 py-3 rounded-2xl rounded-bl-none text-sm animate-pulse">
                AI is typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something about movies..."
            className="flex-1 bg-white/10 text-white placeholder-gray-400 px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600
                       flex items-center justify-center text-white shadow-lg
                       hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
