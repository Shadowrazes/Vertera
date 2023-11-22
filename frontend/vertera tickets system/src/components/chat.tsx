import { useState } from "react";
import ChatMessage from "./chat_message";
import ChatInput from "./chat_input";

interface Message {
  sender: string;
  message: string;
}

function Chat(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage(message: string): void {
    const newMessage: Message = {
      sender: "User",
      message: message,
    };
    setMessages([...messages, newMessage]);
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <ChatMessage key={index} sender={msg.sender} message={msg.message} />
        ))}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}

export default Chat;
