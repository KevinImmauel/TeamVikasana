'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Messages from '../../components/Messages';
import ChatInput from '../../components/ChatInput';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you?' }
  ]);
  const bottomRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => {
      const updated = [...prev, userMessage];
      console.log('Updated after user message:', updated);
      return updated;
    });

    try {
      const res = await axios.post('http://localhost:5000/chat', { message: text });
      const botReply = { sender: 'bot', text: res.data.reply || res.data.response
      };
      setMessages((prev) => {
        const updated = [...prev, botReply];
        console.log('Updated after bot reply:', updated);
        return updated;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorReply = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mt-16 bg-gray-100 p-4">
      <div className="flex-1 overflow-y-auto">
        <Messages messages={messages} />
        <div ref={bottomRef} />
      </div>
      <div className="pt-2">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}