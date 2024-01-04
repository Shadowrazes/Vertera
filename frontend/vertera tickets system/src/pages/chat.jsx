import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Row } from "react-bootstrap";

import { MESSAGES_CHAT } from "../apollo/queries";
import { ADD_MESSAGE, UPDATE_STATUS } from "../apollo/mutations";

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
  // const linkPrev = location.state && location.state.linkPrev;
  const [linkPrev, setLinkPrev] = useState(null);
  
  console.log(linkPrev);

  const [isLoadingClose, setIsLoadingClose] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(
    location.state && location.state.status
  );

  const [isHideMessages, setIsHideMessages] = useState(true);

  const [ticketId, setTicketId] = useState(null);
  const [messagesQuery, setMessagesQuery] = useState([]);

  const [isVisibleError, setIsVisibleError] = useState(false);
  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
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
      // console.log(data.ticket.status.name.stroke);
      //console.log(data.ticket.id);

      if (data.ticket.status.name.stroke !== "Закрыт") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (location.state && location.state.linkPrev) {
        setLinkPrev(location.state.linkPrev);
      }

      // if (status == "Закрыт" && data.ticket.messages.length > 1) {
      //   setIsClosed(true);
      // }
    }
  }, [data, location.state]);

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

  const [
    updateStatus,
    { loader: loaderUpdateStatus, error: errorUpdateStatus },
  ] = useMutation(UPDATE_STATUS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const handleMoreMessages = (e) => {
    e.preventDefault();
    setIsHideMessages(false);
  };

  const errorMsg = () => {
    let error = "";

    if (isFilesSizeExceeded) {
      error = "Максимальный размер файла - 10 Мб";
    } else if (isFilesLimitExceeded) {
      error = "Вы можете загружать до 5 файлов";
    } else if (message.trim() == "") {
      error = "Введите текст сообщения";
    }

    return error;
  };

  async function uploadFiles() {
    const fileInput = document.getElementById("FileInputForm");
    let fileNames = [];

    if (fileInput.files.length > 0) {
      const maxFileSize = 10 * 1024 * 1024;
      let formdata = new FormData();
      let filesValid = true;

      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];

        if (file.size > maxFileSize) {
          console.log(`Файл ${file.name} превышает максимальный размер (10MB)`);
          filesValid = false;
          setIsVisibleError(true);
          setIsFilesSizeExceeded(false);
          break;
        }

        formdata.append(`fileFields`, file);
      }

      if (filesValid) {
        try {
          let requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow",
          };

          const response = await fetch(
            "http://localhost:4444/upload",
            requestOptions
          );
          const result = await response.json();

          //console.log(result);
          fileNames = result.data.map((file) => file.name);
          // console.log(fileNames);

          return fileNames;
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      }
    }

    return fileNames;
  }

  const sendMsg = (e) => {
    e.preventDefault();

    if (loaderAddMsg) {
      return <Loader />;
    }
    if (errorAddMsg) {
      return <h2>Что-то пошло не так</h2>;
    }

    uploadFiles()
      .then((fileNames) => {
        addMessage({
          variables: {
            fields: {
              senderId: userId,
              recieverId: 46,
              ticketId: ticketId,
              type: "message",
              text: message,
              attachPaths: fileNames,
            },
          },
        });
      })
      .catch((error) => {
        console.error("Ошибка при загрузке файлов:", error);
      });
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = async () => {
    setIsVisible(false);
    // setStatus("Закрыт");

    if (loaderUpdateStatus) {
      return <Loader />;
    }
    if (errorUpdateStatus) {
      return <h2>Что-то пошло не так</h2>;
    }

    try {
      setIsLoadingClose(true);

      await updateStatus({
        variables: {
          id: ticketId,
          fields: {
            statusId: 2,
          },
        },
      });
      setTicketStatus("Закрыт");
      // console.log(ticketStatus);
      setIsLoadingClose(false);
    } catch (error) {
      console.error("Ошибка при закрытии заявки:", error);

      setIsLoadingClose(false);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    let isFileSizeExceeded = false;

    if (files.length > 5) {
      e.target.value = null;
      setIsVisibleError(true);
      setIsFilesLimitExceeded(true);
      console.log("Вы можете загружать до 5 файлов");
      return;
    }

    Array.from(files).forEach((file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      const maxFileSize = 10;

      if (fileSizeInMB > maxFileSize) {
        isFileSizeExceeded = true;
      }
    });

    if (isFileSizeExceeded) {
      e.target.value = null;
      setIsVisibleError(true);
      setIsFilesSizeExceeded(true);
      console.log("Размер файла не должен превышать 10 МБ");
      return;
    }

    setIsFilesLimitExceeded(false);
    setIsVisibleError(false);
  };

  const handleSubmit = () => {
    if (message.trim() == "") {
      setIsVisibleError(true);
    }
  };

  return (
    <>
      {isLoadingClose && <Loader />}
      <div
        className={ticketStatus == "Закрыт" ? "" : "chat-messages__container"}
      >
        {ticketStatus !== null && ticketStatus !== "Закрыт" ? (
          <TicketTitle title={`Обращение #${itemId}`} state="Открыта" linkPrev={linkPrev} />
        ) : (
          <TicketTitle title={`Обращение #${itemId}`} state="Закрыта" linkPrev={linkPrev} />
        )}

        {isHideMessages &&
          messagesQuery.map(
            (msg, index) =>
              index === 0 &&
              msg.text !== "" && (
                <pre key={msg.id}>
                  {msg.sender.id === userId ? (
                    <ChatMessageSender
                      message={msg.text}
                      time={msg.date.replace(/T|-/g, (match) =>
                        match === "T" ? " " : "."
                      )}
                      attachs={msg.attachs}
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
                      attachs={msg.attachs}
                    />
                  )}
                </pre>
              )
          )}

        {isHideMessages && (
          <div className="chat-input__more">
            <span className="chat-input__more-text">
              <a
                href="#"
                onClick={handleMoreMessages}
                className="chat-input__more-link"
              >
                Показать {messagesQuery.length - 1} скрытых сообщения
              </a>
            </span>
          </div>
        )}

        {!isHideMessages &&
          messagesQuery.map(
            (msg) =>
              msg.text !== "" && (
                <pre key={msg.id}>
                  {msg.sender.id === userId ? (
                    <ChatMessageSender
                      message={msg.text}
                      time={msg.date.replace(/T|-/g, (match) =>
                        match === "T" ? " " : "."
                      )}
                      attachs={msg.attachs}
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
                      attachs={msg.attachs}
                    />
                  )}
                </pre>
              )
          )}
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
                  accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                  onChange={handleFileChange}
                />
              </Form.Group>
              {isVisibleError && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <div className="chat-input__button-row">
                <ButtonCustom
                  title="Отправить"
                  className="chat-input__button-send"
                  type="submit"
                  onClick={handleSubmit}
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
