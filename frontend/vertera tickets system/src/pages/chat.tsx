import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import TicketTitle from "../components/ticket-title";
import ChatMessageSender from "../components/chat-message-sender";
import ChatMessageRecepient from "../components/chat-message-recipient";
import ChatInput from "../components/chat-input";

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
  const { itemId } = useParams();
  const location = useLocation();
  const status = location.state && location.state.status;

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
        {status !== "Закрыт" ? (
          <TicketTitle title={`Обращение #${itemId}`} state="Открыта" />
        ) : (
          <TicketTitle title={`Обращение #${itemId}`} state="Закрыта" />
        )}
        {messages.map((msg, index) => (
          <pre>
            <ChatMessageSender
              key={index}
              message={msg.message}
              time={msg.time}
            />
          </pre>
          // <ChatMessageRecepient
          //   key={index}
          //   message={msg.message}
          //   time={msg.time}
          // />
        ))}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </>
  );
}

export default Chat;
