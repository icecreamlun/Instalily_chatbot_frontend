export const getAIMessage = async (userQuery) => {
  try {
    const payload = {
      input_value: userQuery,
      output_type: "chat",
      input_type: "chat"
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    console.log('Sending request with payload:', JSON.stringify(payload, null, 2));
    console.log('Request options:', JSON.stringify(options, null, 2));

    const response = await fetch('https://d76c-158-106-193-162.ngrok-free.app/api/v1/run/d095b2a5-e240-4b6c-a701-e6d3b79b3f2e', options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', JSON.stringify(data, null, 2));

    if (!data.outputs || !Array.isArray(data.outputs) || data.outputs.length === 0) {
      console.error('Invalid response format:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response format');
    }

    // 获取第一个输出
    const firstOutput = data.outputs[0];
    console.log('First output:', JSON.stringify(firstOutput, null, 2));

    // 尝试从不同位置提取消息
    let message = '';

    // 1. 尝试从 outputs[0].outputs[0].results.message.text 获取
    if (firstOutput.outputs && 
        firstOutput.outputs[0] && 
        firstOutput.outputs[0].results && 
        firstOutput.outputs[0].results.message && 
        firstOutput.outputs[0].results.message.text) {
      message = firstOutput.outputs[0].results.message.text;
    }
    // 2. 尝试从 outputs[0].outputs[0].artifacts.message 获取
    else if (firstOutput.outputs && 
             firstOutput.outputs[0] && 
             firstOutput.outputs[0].artifacts && 
             firstOutput.outputs[0].artifacts.message) {
      message = firstOutput.outputs[0].artifacts.message;
    }
    // 3. 尝试从 outputs[0].outputs[0].outputs.message.message 获取
    else if (firstOutput.outputs && 
             firstOutput.outputs[0] && 
             firstOutput.outputs[0].outputs && 
             firstOutput.outputs[0].outputs.message && 
             firstOutput.outputs[0].outputs.message.message) {
      message = firstOutput.outputs[0].outputs.message.message;
    }
    // 4. 尝试从 outputs[0].outputs[0].messages[0].message 获取
    else if (firstOutput.outputs && 
             firstOutput.outputs[0] && 
             firstOutput.outputs[0].messages && 
             firstOutput.outputs[0].messages[0] && 
             firstOutput.outputs[0].messages[0].message) {
      message = firstOutput.outputs[0].messages[0].message;
    }

    if (message) {
      // 清理消息格式
      message = message.replace(/\n\s*\n/g, '\n').trim();
      return { content: message };
    }

    console.error('Could not find message in response');
    return {
      content: "The mystical connection has been disrupted. Please try again, brave adventurer."
    };
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      content: "The mystical connection has been disrupted. Please try again, brave adventurer."
    };
  }
};
