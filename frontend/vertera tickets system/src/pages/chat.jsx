import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Row } from "react-bootstrap";

import { MESSAGES_CHAT } from "../apollo/queries";
import { ADD_MESSAGE } from "../apollo/mutations";

import Loader from "../pages/loading";
import TicketTitle from "../components/ticket-title";
import ChatMessageSender from "../components/chat-message-sender";
import ChatMessageRecepient from "../components/chat-message-recipient";
import ChatMessageSystem from "../components/chat-message-system";
import ButtonCustom from "../components/button";

import "../css/chat-input.css";

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
  const [message, setMessage] = useState("");
  const { itemId } = useParams();
  const location = useLocation();
  const status = location.state && location.state.status;
  // const [status, setStatus] = useState(statusInitial);

  const [ticketId, setTicketId] = useState(null);
  const [messagesQuery, setMessagesQuery] = useState([]);

  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  let userId;

  if (user === null) {
    userId = 1;
  } else {
    userId = user.id;
  }

  const { loading, error, data } = useQuery(MESSAGES_CHAT, {
    variables: {
      id: parseInt(itemId),
    },
  });

  useEffect(() => {
    if (data && data.ticket) {
      setTicketId(data.ticket.id);
      setMessagesQuery(data.ticket.messages);
      // setStatus(data.ticket.status.name.stroke);
      console.log(status);

      if (status !== "Закрыт") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (status == "Закрыт" && data.ticket.messages.length > 1) {
        setIsClosed(true);
      }
    }
  }, [data, status]);

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  const [addMessage, { loader: loaderAddMsg, error: errorAddMsg }] =
    useMutation(ADD_MESSAGE, {
      refetchQueries: [
        { query: MESSAGES_CHAT, variables: { id: parseInt(itemId) } },
      ],
    });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const sendMsg = (e) => {
    e.preventDefault();
    if (loaderAddMsg) {
      return <Loader />;
    }
    if (errorAddMsg) {
      return <h2>Что-то пошло не так</h2>;
    }

    addMessage({
      variables: {
        fields: {
          senderId: userId,
          recieverId: 46,
          ticketId: parseInt(itemId),
          type: "message",
          text: message,
        },
      },
    });
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = () => {
    setIsVisible(false);
    // setStatus("Закрыт");
  };

  return (
    <>
      <div>
        {status !== "Закрыт" ? (
          <TicketTitle title={`Обращение #${itemId}`} state="Открыта" />
        ) : (
          <TicketTitle title={`Обращение #${itemId}`} state="Закрыта" />
        )}
        {/* {messagesQuery.map((msg) => (
          <pre key={msg.id}>
            {msg.sender.role === "client" ? (
              <ChatMessageSender
                message={msg.text}
                time={msg.date.replace(/T|-/g, (match) =>
                  match === "T" ? " " : "."
                )}
              />
            ) : msg.sender.role === "helper" ? (
              <ChatMessageRecepient
                message={msg.text}
                time={msg.date.replace(/T|-/g, (match) =>
                  match === "T" ? " " : "."
                )}
              />
            ) : (
              <ChatMessageSystem
                message={msg.text}
                time={msg.date.replace(/T|-/g, (match) =>
                  match === "T" ? " " : "."
                )}
              />
            )}
          </pre>
        ))} */}

        {messagesQuery.map((msg) => (
          <pre key={msg.id}>
            {msg.sender.id === userId ? (
              <ChatMessageSender
                message={msg.text}
                time={msg.date.replace(/T|-/g, (match) =>
                  match === "T" ? " " : "."
                )}
              />
            ) : msg.sender.role === "system" ? (
              <ChatMessageSystem
                message={msg.text}
                time={msg.date.replace(/T|-/g, (match) =>
                  match === "T" ? " " : "."
                )}
              />
            ) : (
              <ChatMessageRecepient
                message={msg.text}
                time={msg.date.replace(/T|-/g, (match) =>
                  match === "T" ? " " : "."
                )}
              />
            )}
          </pre>
        ))}
      </div>

      {isVisible && (
        <div className="chat-input__container">
          <Form className="chat-input__form" onSubmit={sendMsg}>
            <Row className="chat-input__row">
              <Form.Group controlId="TextareaForm">
                <Form.Control
                  as="textarea"
                  placeholder="Текст сообщения"
                  rows={3}
                  value={message}
                  onChange={handleChange}
                  className="chat-input__textarea"
                />
              </Form.Group>
              <Form.Group controlId="FileInputForm">
                <Form.Control
                  type="file"
                  multiple
                  // onChange={handleFileChange}
                />
              </Form.Group>
              <div className="chat-input__button-row">
                <ButtonCustom
                  title="Отправить"
                  className="chat-input__button-send"
                  type="submit"
                />
                <ButtonCustom
                  title="Закрыть заявку"
                  className="chat-input__button-close"
                  onClick={handleClose}
                />
              </div>
            </Row>
          </Form>
        </div>
      )}
      {!isVisible && (
        <div className="chat-input__close-container">
          <div className="chat-input__close-box">
            <span className="chat-input__close-text">Заявка закрыта</span>
          </div>
          <ButtonCustom
            title="Создать новую заявку"
            className="chat-input__button-close"
            onClick={goToCreateTicket}
          />
        </div>
      )}
    </>
  );
}

export default Chat;
