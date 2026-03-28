import { useState } from 'react';

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);

  const sendToOpenAI = async (messages) => {
    setIsProcessing(true);
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      setIsProcessing(false);
      return { error: 'Please set your VITE_OPENAI_API_KEY in the .env file and restart the server.' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Fast and capable model
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to fetch from OpenAI');
      }

      const data = await response.json();
      setIsProcessing(false);
      return data.choices[0].message.content;
    } catch (error) {
      setIsProcessing(false);
      return { error: error.message };
    }
  };

  return { isProcessing, sendToOpenAI };
}
