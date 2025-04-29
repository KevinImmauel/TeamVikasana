export default function Message({ sender, text }) {
    const isUser = sender === "user";
  
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-xs md:max-w-md p-4 rounded-2xl ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
          {text}
        </div>
      </div>
    );
  }
  