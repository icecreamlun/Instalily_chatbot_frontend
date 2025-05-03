import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage } from "../api/api";
import { marked } from "marked";
import { AIMessageWithFeedback } from "./AIMessageWithFeedback";

function ChatWindow() {
  const defaultMessage = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const [messages, setMessages] = useState(defaultMessage);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (input) => {
    if (input.trim() !== "") {
      // Set user message
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput("");

      // Call API & set assistant message
      const newMessage = await getAIMessage(input);
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  const handleFeedback = (docId, isHelpful) => {
    console.log(`Feedback received for doc ${docId}: ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        message.role === "user" ? (
          <div key={index} className="user-message-container">
            <div className="message user-message">
              {message.content}
            </div>
          </div>
        ) : (
          <div key={index} className="assistant-message-container">
            <AIMessageWithFeedback
              message={message}
              onFeedback={handleFeedback}
            />
          </div>
        )
      ))}
      <div ref={messagesEndRef} />
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(input);
              e.preventDefault();
            }
          }}
        />
        <button className="send-button" onClick={() => handleSend(input)}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
