import React from 'react';
import { sendFeedback } from '../api/api';
import './AIMessageWithFeedback.css';

export const AIMessageWithFeedback = ({ message, onFeedback }) => {
  const handleFeedback = async (docId, isHelpful) => {
    try {
      await sendFeedback(message.query, docId, isHelpful);
      onFeedback && onFeedback(docId, isHelpful);
    } catch (error) {
      console.error('Error handling feedback:', error);
    }
  };

  return (
    <div className="ai-message">
      <div className="message-content">
        {message.content}
      </div>
      {message.docs && message.docs.length > 0 && (
        <div className="docs-section">
          <h4>Related Contractors:</h4>
          {message.docs.map((doc, index) => (
            <div key={index} className="doc-item">
              <div className="doc-content">
                <h5>{doc.name}</h5>
                <p>{doc.about_us}</p>
                <p>Address: {doc.address}</p>
                <p>Phone: {doc.phone}</p>
                {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer">Visit Website</a>}
              </div>
              <div className="feedback-buttons">
                <button 
                  onClick={() => handleFeedback(doc.doc_id, true)}
                  className="feedback-button helpful"
                >
                  👍 Helpful
                </button>
                <button 
                  onClick={() => handleFeedback(doc.doc_id, false)}
                  className="feedback-button not-helpful"
                >
                  👎 Not Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 