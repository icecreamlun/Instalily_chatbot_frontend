import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage } from "../api/api";

function ChatWindow() {
  const defaultMessage = [{
    role: "assistant",
    content: "Welcome, brave adventurer, to the Chronicles of Fate. I am the Dungeon Master, your guide through this mystical realm. What tale shall we weave together today?"
  }];

  const [messages, setMessages] = useState(defaultMessage);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const typewriterEffect = (text, callback) => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        callback(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30);
  };

  const handleSend = async (input) => {
    if (input.trim() !== "" && !isTyping) {
      // Set user message
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput("");
      setIsTyping(true);

      // Show typing indicator
      setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "...", isTyping: true }]);

      // Call API & set assistant message
      const newMessage = await getAIMessage(input);
      
      // Remove typing indicator and add real message with typewriter effect
      setMessages(prevMessages => {
        const withoutTyping = prevMessages.slice(0, -1);
        return [...withoutTyping, { role: "assistant", content: "", isFinal: false }];
      });

      typewriterEffect(newMessage.content, (typedText) => {
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.role === "assistant" && !lastMessage.isFinal) {
            return [...prevMessages.slice(0, -1), { role: "assistant", content: typedText, isFinal: typedText === newMessage.content }];
          }
          return prevMessages;
        });
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          message.role === "user" ? (
            <div key={index} className="user-message-container">
              <div className="message-wrapper">
                <div className="character-icon user-icon">🗡️</div>
                <div className="message user-message">
                  <div className="message-header">Adventurer</div>
                  {message.content}
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="assistant-message-container">
              <div className="message-wrapper">
                <div className="character-icon dm-icon">🎲</div>
                <div className="message assistant-message">
                  <div className="message-header">Dungeon Master</div>
                  {message.isTyping ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          )
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak your action, adventurer..."
          disabled={isTyping}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSend(input);
              e.preventDefault();
            }
          }}
        />
        <button className="send-button" onClick={() => handleSend(input)} disabled={isTyping}>
          <span className="button-text">Cast</span>
          <span className="button-icon">✨</span>
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
