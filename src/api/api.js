export const getAIMessage = async (userQuery) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userQuery
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      role: "assistant",
      content: data.answer,
      docs: data.docs,
      doc_ids: data.docs.map(doc => doc.doc_id),
      query: userQuery
    };
  } catch (error) {
    console.error('Error fetching AI message:', error);
    return {
      role: "assistant",
      content: "Sorry, there was an error connecting to the AI service."
    };
  }
};

export const sendFeedback = async (query, docId, isHelpful) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        doc_id: docId,
        is_helpful: isHelpful,
        metadata: {
          timestamp: new Date().toISOString(),
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending feedback:', error);
    return { status: 'error', message: 'Failed to send feedback' };
  }
};