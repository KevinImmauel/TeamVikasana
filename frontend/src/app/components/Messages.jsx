'use client';

export default function Messages({ messages }) {
  console.log('Messages received:', messages);

  return (
    <div className="flex flex-col space-y-4 px-2">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet</p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-xl ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-black self-start'
            }`}
          >
            {message.text}
          </div>
        ))
      )}
    </div>
  );
}
