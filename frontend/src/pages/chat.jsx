import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { DateTime } from "luxon";
import {
  Form,
  Row,
  Col,
  Table,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import { MESSAGES_CHAT, THEME_LIST } from "../apollo/queries";
import { ADD_MESSAGE, UPDATE_STATUS, EDIT_TICKET } from "../apollo/mutations";

import { Editor } from "react-draft-wysiwyg";
import Loader from "../pages/loading";
import TicketTitle from "../components/ticket-title";
import ChatMessageSender from "../components/chat-message-sender";
import ChatMessageRecepient from "../components/chat-message-recipient";
import ChatMessageSystem from "../components/chat-message-system";
import ButtonCustom from "../components/button";

import "../css/chat-input.css";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function Chat() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [message, setMessage] = useState("");
  const [messageDate, setMessageDate] = useState(null);
  const { itemId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);

  const [helperId, setHelperId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(1);

  const [reaction, setReaction] = useState(null);

  const [isLoadingClose, setIsLoadingClose] = useState(false);

  const [isHideMessages, setIsHideMessages] = useState(false);

  const [ticketId, setTicketId] = useState(null);
  const [messagesQuery, setMessagesQuery] = useState([]);

  const [isVisibleError, setIsVisibleError] = useState(false);
  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isBuild = import.meta.env.DEV !== "build";

  const inputRef = useRef(null);

  let userId = null;

  if (user === null) {
    userId = 999;
  } else {
    userId = user.id;
  }

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  const { loading, error, data } = useQuery(MESSAGES_CHAT, {
    variables: {
      token: user.token,
      link: itemId,
    },
  });

  const {
    loading: loadingTheme,
    error: errorTheme,
    data: dataTheme,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
    },
  });

  useEffect(() => {
    if (data && data.clientQuery.ticket) {
      setTicketId(data.clientQuery.ticket.id);
      setMessagesQuery(data.clientQuery.ticket.messages);
      setCurrentStatus(data.clientQuery.ticket.status.name.stroke);
      setHelperId(data.clientQuery.ticket.helper.id);
      setClientId(data.clientQuery.ticket.client.id);

      //console.log(data.ticket.status.name.stroke);
      //console.log(data.ticket.id);
      //console.log(data.ticket.subTheme.theme.unit.name.stroke);

      if (data.clientQuery.ticket.status.name.stroke !== "Закрыт") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (location.state && location.state.linkPrev) {
        setLinkPrev(location.state.linkPrev);
      }

      if (data.clientQuery.ticket.reaction == "like") {
        setReaction("like");
      } else if (data.clientQuery.ticket.reaction == "dislike") {
        setReaction("dislike");
      } else {
        setReaction(null);
      }
    }
  }, [data, location.state]);

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  const [addMessage, { loader: loaderAddMsg, error: errorAddMsg }] =
    useMutation(ADD_MESSAGE, {
      refetchQueries: [
        {
          query: MESSAGES_CHAT,
          variables: { token: user.token, link: itemId },
        },
      ],
    });

  const [
    updateStatus,
    { loading: loaderUpdateStatus, error: errorUpdateStatus },
  ] = useMutation(UPDATE_STATUS);

  const [editTicket, { loading: loadingEditTicket }] = useMutation(EDIT_TICKET);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingTheme) {
    return <Loader />;
  }

  if (errorTheme) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingEditTicket) {
    return <Loader />;
  }

  // const handleMoreMessages = (e) => {
  //   e.preventDefault();
  //   setIsHideMessages(false);
  // };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);

    setMessage(draftToHtml(rawContent));

    console.log(draftToHtml(rawContent));
    return draftToHtml(rawContent);
  };

  const errorMsg = () => {
    let error = "";

    if (isFilesSizeExceeded) {
      error = "Максимальный размер файла - 10 Мб";
    } else if (isFilesLimitExceeded) {
      error = "Вы можете загружать до 5 файлов";
    } else if (textareaValue.trim() == "<p></p>") {
      error = "Введите текст сообщения";
    }

    return error;
  };

  async function uploadFiles() {
    const fileInput = document.getElementById("FileInputForm");
    let filePaths = [];

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
            isBuild
              ? "https://vticket.yasanyabeats.ru:4444/upload"
              : "http://localhost:4444/upload",
            requestOptions
          );
          const result = await response.json();

          console.log(result);
          filePaths = result.data.map((file) => file.path);
          console.log(filePaths);

          return filePaths;
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      }
    }

    return filePaths;
  }

  const sendMsg = async (e) => {
    e.preventDefault();

    if (loaderAddMsg) {
      return <Loader />;
    }
    if (errorAddMsg) {
      return <h2>Что-то пошло не так</h2>;
    }

    if (message.trim() == "") {
      return;
    }

    if (isAdmin() && selectedValue == 1) {
      try {
        const result = await updateStatus({
          variables: {
            token: user.token,
            id: ticketId,
            fields: {
              statusId: 3,
            },
          },
        });

        console.log("Статус успешно обновлен:", result);
      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
      }
    } else if (isAdmin() && selectedValue == 2) {
      try {
        const result = await updateStatus({
          variables: {
            token: user.token,
            id: ticketId,
            fields: {
              statusId: 4,
            },
          },
        });

        console.log("Статус успешно обновлен:", result);
      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
      }
    }

    let senderId;

    if (userId == clientId) {
      senderId = helperId;
    } else {
      senderId = clientId;
    }

    // console.log(senderId);

    uploadFiles()
      .then((filePaths) => {
        setMessageDate(new Date());
        addMessage({
          variables: {
            token: user.token,
            senderId: userId,
            recieverId: senderId,
            ticketId: ticketId,
            text: getContent(),
            attachPaths: filePaths,
          },
        });
      })
      .catch((error) => {
        console.error("Ошибка при загрузке файлов:", error);
      });

    setMessage("");
    setEditorState(EditorState.createEmpty());
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = async () => {
    setIsVisible(false);

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
          token: user.token,
          id: ticketId,
          fields: {
            statusId: 2,
          },
        },
      });
      // setTicketStatus("Закрыт");
      setCurrentStatus("Закрыт");
      // console.log(ticketStatus);
      setIsLoadingClose(false);
    } catch (error) {
      console.error("Ошибка при закрытии заявки:", error);

      setIsLoadingClose(false);
    }
  };

  const handleInProgress = async () => {
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
          token: user.token,
          id: ticketId,
          fields: {
            statusId: 3,
          },
        },
      });
      setCurrentStatus("В процессе");
      setIsLoadingClose(false);
    } catch (error) {
      console.error("Ошибка при смене статуса:", error);

      setIsLoadingClose(false);
    }
    try {
      if (userId !== helperId) {
        await editTicket({
          variables: {
            id: parseInt(itemId),
            helperId: userId,
          },
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Ошибка при смене куратора:", error);
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
    if (getContent().trim() == "") {
      setIsVisibleError(true);
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    updateStatus({
      variables: {
        token: user.token,
        id: ticketId,
        fields: {
          reaction: "like",
        },
      },
    });
    setReaction("like");
    // console.log(reaction);
  };

  const handleDislike = (e) => {
    e.preventDefault();
    updateStatus({
      variables: {
        token: user.token,
        id: ticketId,
        fields: {
          reaction: "dislike",
        },
      },
    });
    setReaction("dislike");
    // console.log(reaction);
  };

  const getFullName = (userData) => {
    let result = "";
    // console.log(userData);
    if (userData?.surname) {
      result += userData?.surname + " ";
    }
    if (userData?.name) {
      result += userData?.name + " ";
    }
    if (userData?.patronymic) {
      result += userData?.patronymic;
    }
    return result;
  };

  const handleToggleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <>
      {isLoadingClose && <Loader />}
      <div
        className={currentStatus == "Закрыт" ? "" : "chat-messages__container"}
      >
        {currentStatus !== null && currentStatus !== "Закрыт" ? (
          <TicketTitle
            title={`${data.clientQuery.ticket.title}`}
            state="Открыто"
            linkPrev={linkPrev}
          />
        ) : (
          <TicketTitle
            title={`${data.clientQuery.ticket.title}`}
            state="Закрыто"
            linkPrev={linkPrev}
          />
        )}

        <Row>
          <Col md={6}>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>
                    <b>Создатель обращения:</b>
                  </td>
                  <td>
                    {getFullName(data?.clientQuery.ticket?.client?.user)} |{" "}
                    <a
                      href={"mailto:" + data?.clientQuery.ticket?.client?.email}
                    >
                      {data?.clientQuery.ticket?.client?.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Текущий куратор:</b>
                  </td>
                  <td>{getFullName(data?.clientQuery.ticket?.helper?.user)}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* {isHideMessages && (
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
        )} */}

        {!isHideMessages &&
          messagesQuery.map(
            (msg) =>
              msg.text !== "" && (
                <div key={msg.id}>
                  {msg.sender.id === userId ? (
                    <ChatMessageSender
                      message={msg.text}
                      sender={msg.sender}
                      time={DateTime.fromISO(msg.date, { zone: "utc" })
                        .toLocal()
                        .toFormat("yyyy.MM.dd HH:mm:ss")}
                      attachs={msg.attachs}
                    />
                  ) : msg.sender.role === "system" ? (
                    <>
                      {isAdmin() ? (
                        <ChatMessageSystem
                          message={msg.text}
                          time={DateTime.fromISO(msg.date, { zone: "utc" })
                            .toLocal()
                            .toFormat("yyyy.MM.dd HH:mm:ss")}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <ChatMessageRecepient
                      message={msg.text}
                      sender={msg.sender}
                      time={DateTime.fromISO(msg.date, { zone: "utc" })
                        .toLocal()
                        .toFormat("yyyy.MM.dd HH:mm:ss")}
                      attachs={msg.attachs}
                    />
                  )}
                </div>
              )
          )}
      </div>
      <div className="chat-input__container">
        {isVisible && isAdmin() && currentStatus !== "Новый" ? (
          <Form className="chat-input__form" onSubmit={sendMsg}>
            <Row className="chat-input__row">
              {/* <Form.Group controlId="TextareaForm">
                <Form.Control
                  as="textarea"
                  placeholder="Текст сообщения"
                  rows={3}
                  value={message}
                  onChange={handleChange}
                  className="chat-input__textarea"
                />
              </Form.Group> */}
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
              />
              <Form.Group controlId="FileInputForm">
                <Form.Control
                  type="file"
                  multiple
                  accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                  onChange={handleFileChange}
                  ref={inputRef}
                />
              </Form.Group>
              {isVisibleError && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={1}
                value={selectedValue}
                onChange={handleToggleChange}
              >
                <ToggleButton id="tbg-radio-1" value={1}>
                  Запретить писать клиенту
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2}>
                  Разрешить писать клиенту
                </ToggleButton>
              </ToggleButtonGroup>
              <div
                className={
                  currentStatus == "В процессе"
                    ? "chat-input__button-row chat-input__button-row-gap"
                    : "chat-input__button-row"
                }
              >
                <ButtonCustom
                  title="Отправить"
                  className={
                    isAdmin()
                      ? "chat-input__button-send single"
                      : "chat-input__button-send single"
                  }
                  type="submit"
                  onClick={handleSubmit}
                />
                {isAdmin() && currentStatus == "В процессе" ? (
                  <ButtonCustom
                    title="Закрыть заявку"
                    className="chat-input__button-close"
                    onClick={handleClose}
                  />
                ) : (
                  <></>
                )}
              </div>
              {isAdmin() && currentStatus == "Новый" ? (
                <div className="chat-input__button-row">
                  <ButtonCustom
                    title="Начать работу"
                    className="chat-input__button-send single"
                    onClick={handleInProgress}
                  />
                </div>
              ) : (
                <></>
              )}
              {isAdmin() && currentStatus !== "Закрыт" && (
                <Link
                  to={`/edit-ticket/${itemId}`}
                  state={{
                    linkPrev: window.location.href,
                  }}
                  className="alltickets__link"
                >
                  <ButtonCustom
                    title="Изменить тикет"
                    className="chat-input__button-close single"
                  />
                </Link>
              )}
            </Row>
          </Form>
        ) : (
          <Form className="chat-input__form" onSubmit={sendMsg}>
            <Row className="chat-input__row">
              <div
                className={
                  currentStatus == "В процессе"
                    ? "chat-input__button-row chat-input__button-row-gap"
                    : "chat-input__button-row"
                }
              >
                {isAdmin() && currentStatus == "В процессе" ? (
                  <ButtonCustom
                    title="Закрыть заявку"
                    className="chat-input__button-close"
                    onClick={handleClose}
                  />
                ) : (
                  <></>
                )}
              </div>
              {isAdmin() && currentStatus == "Новый" ? (
                <div className="chat-input__button-row">
                  <ButtonCustom
                    title="Начать работу"
                    className="chat-input__button-send single"
                    onClick={handleInProgress}
                  />
                </div>
              ) : (
                <></>
              )}
              {isAdmin() && currentStatus !== "Закрыт" && (
                <Link
                  to={`/edit-ticket/${itemId}`}
                  state={{
                    linkPrev: window.location.href,
                  }}
                  className="alltickets__link"
                >
                  <ButtonCustom
                    title="Изменить тикет"
                    className="chat-input__button-close single"
                  />
                </Link>
              )}
            </Row>
          </Form>
        )}
      </div>

      <div className="chat-input__container">
        {isVisible &&
        !isAdmin() &&
        (currentStatus === "Новый" || currentStatus === "На уточнении") ? (
          <Form className="chat-input__form" onSubmit={sendMsg}>
            <Row className="chat-input__row">
              <Form.Group controlId="TextareaForm">
                {/* <Form.Control
                  as="textarea"
                  placeholder="Текст сообщения"
                  rows={3}
                  value={message}
                  onChange={handleChange}
                  className="chat-input__textarea"
                /> */}
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                />
              </Form.Group>
              <Form.Group controlId="FileInputForm">
                <Form.Control
                  type="file"
                  multiple
                  accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                  onChange={handleFileChange}
                  ref={inputRef}
                />
              </Form.Group>
              <ButtonCustom
                title="Отправить"
                className="chat-input__button-send single"
                type="submit"
                onClick={handleSubmit}
              />
            </Row>
          </Form>
        ) : (
          <></>
        )}
      </div>

      {!isVisible && (
        <div className="chat-input__close-container">
          <div className="chat-input__close-box">
            <span className="chat-input__close-text">Заявка закрыта</span>
            <div className="chat-message-recepient__separator"></div>
            {!isAdmin() && (
              <div className="chat-message-recepient__rate-container">
                {!reaction ? (
                  <span className="chat-message-recepient__rate-title">
                    Оцените ответ
                  </span>
                ) : (
                  <span className="chat-message-recepient__rate-title">
                    Ответ оценен
                  </span>
                )}

                <div className="chat-message-recepient__rate">
                  {!reaction && (
                    <>
                      <a href="#" onClick={handleDislike}>
                        <span className="chat-message-recepient__rate-icon-dislike">
                          <img src="/dislike.svg" alt="" />
                        </span>
                      </a>
                      <a href="#" onClick={handleLike}>
                        <span className="chat-message-recepient__rate-icon-like">
                          <img src="/like.svg" alt="" />
                        </span>
                      </a>
                    </>
                  )}

                  {reaction === "dislike" && (
                    <a href="#" className="disabled">
                      <span className="chat-message-recepient__rate-icon-dislike">
                        <img src="/dislike.svg" alt="" />
                      </span>
                    </a>
                  )}

                  {reaction === "like" && (
                    <a href="#" className="disabled">
                      <span className="chat-message-recepient__rate-icon-like">
                        <img src="/like.svg" alt="" />
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {isAdmin() && (
              <div className="chat-message-recepient__rate-container">
                <span className="chat-message-recepient__rate-title">
                  Оценка тикета
                </span>

                {!reaction && (
                  <span className="chat-message-recepient__rate chat-message-recepient__text">
                    Тикет еще не оценен
                  </span>
                )}

                {reaction === "dislike" && (
                  <a href="#" className="disabled">
                    <span className="chat-message-recepient__rate-icon-dislike">
                      <img src="/dislike.svg" alt="" />
                    </span>
                  </a>
                )}

                {reaction === "like" && (
                  <a href="#" className="disabled">
                    <span className="chat-message-recepient__rate-icon-like">
                      <img src="/like.svg" alt="" />
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>
          {!isAdmin() && (
            <ButtonCustom
              title="Создать новую заявку"
              className="chat-input__button-close"
              onClick={goToCreateTicket}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Chat;
