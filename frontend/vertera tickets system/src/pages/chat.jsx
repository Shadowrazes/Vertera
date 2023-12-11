import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { MESSAGES_CHAT } from "../apollo/queries";
import Loader from "../pages/loading";
import TicketTitle from "../components/ticket-title";
import ChatMessageSender from "../components/chat-message-sender";
import ChatMessageRecepient from "../components/chat-message-recipient";
import ChatInput from "../components/chat-input";

const timeFormatter = () => {
  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("ru-RU", options);
  let formattedDate = formatter.format(currentDate);

  formattedDate = formattedDate.slice(0, -3);

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  const timeFormatter = new Intl.DateTimeFormat("ru-RU", timeOptions);
  const formattedTime = timeFormatter.format(currentDate);

  return `${formattedDate}, ${formattedTime}`;
};

function Chat() {
  const [messages, setMessages] = useState([]);
  const { itemId } = useParams();
  const location = useLocation();
  const status = location.state && location.state.status;

  let messagesQuery = [];
  let ticketId;

  const { loading, error, data, refetch } = useQuery(MESSAGES_CHAT, {
    variables: {
      id: parseInt(itemId),
    },
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (data && data.ticket) {
    // Данные доступны, теперь вы можете работать с ними
    ticketId = data.ticket.id;
    messagesQuery = data.ticket.messages;

    // Ваш код для обработки данных
    console.log(ticketId, messagesQuery);
  }

  function sendMessage(message) {
    const newMessage = {
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
        {messagesQuery.map((msg) => (
          <pre>
            <ChatMessageSender
              key={ticketId}
              message={msg.text}
              time={msg.date}
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
