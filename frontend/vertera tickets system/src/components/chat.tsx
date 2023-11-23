import { useState } from "react";
import ChatMessageSender from "./chat_message_sender";
import ChatMessageRecepient from "./chat_message_recipient";
import ChatInput from "./chat_input";

interface Message {
  message: string;
  time: string;
}

const timeFormatter = () => {
  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;

  const formatter = new Intl.DateTimeFormat("ru-RU", options);
  let formattedDate = formatter.format(currentDate);

  formattedDate = formattedDate.slice(0, -3);

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
  } as Intl.DateTimeFormatOptions;

  const timeFormatter = new Intl.DateTimeFormat("ru-RU", timeOptions);
  const formattedTime = timeFormatter.format(currentDate);

  return `${formattedDate}, ${formattedTime}`;
};

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  function sendMessage(message: string): void {
    const newMessage: Message = {
      message: message,
      time: timeFormatter(),
    };
    setMessages([...messages, newMessage]);
  }

  return (
    <>
      <div>
        {messages.map((msg, index) => (
          // <ChatMessageSender
          //   key={index}
          //   message={msg.message}
          //   time={msg.time}
          // />
          <ChatMessageRecepient
            key={index}
            message={msg.message}
            time={msg.time}
          />
        ))}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </>
  );
}

export default Chat;
