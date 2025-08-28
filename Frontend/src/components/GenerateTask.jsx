import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function GenerateTask() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const userId = "devesh123";

  // 🔹 Load history when page loads
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/tasks/chat/${userId}`);
        if (res.data.history) {
          const formatted = res.data.history.map((msg, index) => ({
            id: index,
            text: msg.text,
            sender: msg.role === "user" ? "user" : "ai",
          }));
          setMessages(formatted);
        }
      } catch (error) {
        console.error("Error loading history", error);
      }
    };

    loadHistory();
  }, [userId]);

  // 🔹 Send new message
  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt");

    const userMessage = { id: Date.now(), text: prompt, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      setLoading(true);
      setTyping(true);

      const res = await axios.post("http://localhost:5000/tasks/generate", {
        prompt,
        userId,
      });

      const aiMessage = {
        id: Date.now() + 1,
        text: res.data.reply, // ✅ now only returns reply
        sender: "ai",
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
        setTyping(false);
      }, 1200);
    } catch (error) {
      console.error(error);
      setTyping(false);
      const errorMessage = {
        id: Date.now() + 2,
        text: "AI failed to generate task",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="chat-container">
      <div className="chat-header">AI Task Generator</div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}

        {typing && (
          <div className="chat-bubble ai typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={prompt}
          placeholder="Ask AI to generate tasks..."
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button onClick={handleGenerate} disabled={loading || typing}>
          {loading || typing ? "Generating..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default GenerateTask;
