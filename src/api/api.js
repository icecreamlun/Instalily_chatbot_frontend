export const getAIMessage = async (userQuery) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userQuery
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching AI message:', error);
    return {
      role: "assistant",
      content: "Sorry, there was an error connecting to the AI service."
    };
  }
};