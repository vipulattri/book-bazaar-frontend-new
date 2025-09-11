"use client";

import React, { useState } from "react";

const StudyAssistant: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      setResponse(data.reply || "No response.");
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>📚 Books Bazaar Study Assistant</h2>

      <textarea
        style={styles.textarea}
        placeholder="Ask your study question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button style={styles.button} onClick={askQuestion} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      <div style={styles.responseBox}>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 5,
    border: "1px solid #aaa",
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  responseBox: {
    marginTop: 20,
    background: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
};

export default StudyAssistant;
