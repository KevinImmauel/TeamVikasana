
import { useState } from "react";

export default function ChatInput({ onSend }) {
    const [input, setInput] = useState('');
  
    const handleSend = () => {
      if (input.trim() !== '') {
        onSend(input); // <-- MUST pass input
        setInput('');
      }
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    };
  
    return (
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    );
  }
  