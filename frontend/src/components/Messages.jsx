'use client';

export default function Messages({ messages }) {
  console.log('Messages received:', messages);

  const formatText = (text) => {
    return { __html: text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') };
  };

  return (
    <div className="flex flex-col space-y-4 px-2">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet</p>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-4 rounded-xl ${message.sender === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-black self-start'
              }`}
          >
            <div
              className="text-content"
              dangerouslySetInnerHTML={formatText(message.text)}
            />
          </div>
        ))
      )}
    </div>
  );
}
