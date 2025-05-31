import React, { useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";

function App() {

  return (
    <div className="App">
      <div className="animated-bg"></div>
      <div className="heading">
        <span className="title-text">Chronicles of Fate</span>
        <span className="subtitle">RPG Storytelling Multi-Agent System</span>
      </div>
      <ChatWindow/>
    </div>
  );
}

export default App;
