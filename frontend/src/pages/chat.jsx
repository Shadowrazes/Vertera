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
  DropdownButton,
  Dropdown,
  Modal,
  Button,
} from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import { MESSAGES_CHAT, THEME_LIST } from "../apollo/queries";
import {
  ADD_MESSAGE,
  UPDATE_STATUS,
  EDIT_TICKET,
  SPLIT_TICKET,
} from "../apollo/mutations";

import { Editor } from "react-draft-wysiwyg";
import Loader from "../pages/loading";
import TicketTitle from "../components/ticket-title";
import ChatMessageSender from "../components/chat-message-sender";
import ChatMessageRecepient from "../components/chat-message-recipient";
import ChatMessageSystem from "../components/chat-message-system";
import ButtonCustom from "../components/button";

import "../css/chat-input.css";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../css/all-tickets.css";

function Chat() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [dataQuery, setData] = useState([]);
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

  const [newTicketsCount, setNewTicketsCount] = useState(undefined);
  const [inputValues, setInputValues] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleSplit, setIsVisibleSplit] = useState(false);
  const [isVisibleSplitFields, setisVisibleSplitFields] = useState(false);
  const [isSubThemeDropdownVisible, setIsSubThemeDropdownVisible] =
    useState(true);
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

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
    loading: loadingThemeList,
    error: errorThemeList,
    data: dataThemeList,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
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

  const [fileInputs, setFileInputs] = useState([{
    'fileInput': true
  }])

  const handleAddFileInput = () => {
    if(fileInputs.length >= 5) {
      alert("Вы можете загрузить не более 5 файлов");
      return;
    }
    setFileInputs(fileInputs.concat([{
      'fileInput': true
    }]));
  }

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

      if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
        setData(dataThemeList.clientQuery.allThemeTree);
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

      if (newTicketsCount !== undefined) {
        const inputs = Array.from({ length: newTicketsCount }, (_, index) => ({
          id: index + 1,
          title: "",
          unit: null,
          unitId: null,
          theme: null,
          themeId: null,
          subtheme: null,
          subthemeId: null,
          editorContent: EditorState.createEmpty(),
          text: "",
        }));
        setInputValues(inputs);
      }
    }
  }, [data, dataThemeList, location.state, newTicketsCount]);

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  const goToAllTickets = () => {
    navigate("/all-tickets");
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

  const [splitTicket, { loading: loadingSplitTicket }] =
    useMutation(SPLIT_TICKET);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingThemeList) {
    return <Loader />;
  }

  if (errorThemeList) {
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

  if (loadingSplitTicket) {
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
    const fileInputs = document.querySelectorAll(".fileInputForm input");
    let filePaths = [];
    let files = [];

    for (let fileInput of fileInputs) {
      if (fileInput.files.length > 0) {
        files.push(fileInput.files[0]);
      }
    }
    
    if (files.length > 0) {
      let formdata = new FormData();
      let filesValid = true;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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

  // const handleChange = (e) => {
  //   setMessage(e.target.value);
  // };

  const handleClose = async () => {
    setIsVisible(false);
    setShowWarning(false);

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

  const handleSplitTicket = () => {
    setIsVisibleSplit(true);
  };

  const handleOnChangeNewTicketsCount = (e) => {
    setNewTicketsCount(e.target.value);
  };

  const handleSplitTicketFields = () => {
    setIsVisibleSplit(false);
    setisVisibleSplitFields(true);
  };

  const handleInputChange = (id, value) => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === id ? { ...input, title: value } : input
    );

    setInputValues(updatedInputValues);
  };

  const handleUnitClick = (unit, unitId) => {
    let theme, themeId, subtheme, subthemeId;

    if (unit !== selectedUnit) {
      theme = null;
      themeId = null;
      subtheme = null;
      subthemeId = null;
      setIsSubThemeDropdownVisible(true);
    }

    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? {
            ...input,
            unit: unit,
            unitId: unitId,
            theme: theme,
            themeId: themeId,
            subtheme: subtheme,
            subthemeId: subthemeId,
          }
        : input
    );

    setSelectedUnit(unit);
    setSelectedUnitId(unitId);
    setInputValues(updatedInputValues);
  };

  const handleThemeClick = (theme, themeId) => {
    let subthemeId;

    if (theme !== selectedTheme) {
      setIsSubThemeDropdownVisible(true);

      switch ((selectedUnitId, themeId)) {
        case (1, 14):
          subthemeId = 73;
          setIsSubThemeDropdownVisible(false);
          break;
        case (2, 15):
          subthemeId = 74;
          setIsSubThemeDropdownVisible(false);
          break;
        case (2, 16):
          subthemeId = 75;
          setIsSubThemeDropdownVisible(false);
          break;
        case (2, 22):
          subthemeId = 102;
          setIsSubThemeDropdownVisible(false);
          break;
        case (2, 23):
          subthemeId = 103;
          setIsSubThemeDropdownVisible(false);
          break;
        default:
      }
    }

    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? { ...input, theme: theme, themeId: themeId, subthemeId: subthemeId }
        : input
    );

    setSelectedTheme(theme);
    setInputValues(updatedInputValues);
  };

  const handleSubThemeClick = (subtheme, subthemeId) => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? { ...input, subtheme: subtheme, subthemeId: subthemeId }
        : input
    );
    setInputValues(updatedInputValues);
  };

  const handleSplitEditorChange = (newEditorState, inputId) => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === inputId
        ? {
            ...input,
            editorContent: newEditorState,
            text: draftToHtml(convertToRaw(newEditorState.getCurrentContent())),
          }
        : input
    );

    setInputValues(updatedInputValues);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, inputValues.length - 1)
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleToggleChange = (value) => {
    setSelectedValue(value);
  };

  const handleShowWarning = () => {
    setShowWarning(true);
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const errorMsgSplit = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Введите имя";
    } else if (surnameValue.trim() == "") {
      error = "Введите Фамилию";
    } else {
      error = "Ошибка делении тикета";
    }

    return error;
  };

  const handleMutationSplitTicket = async () => {
    console.log(inputValues);
    let senderId;

    if (userId == clientId) {
      senderId = helperId;
    } else {
      senderId = clientId;
    }

    try {
      const result = await splitTicket({
        variables: {
          token: user.token,
          id: ticketId,
          argsList: inputValues.map((input) => ({
            ticketFields: {
              title: input.title,
              clientId: clientId,
              unitId: input.unitId,
              themeId: input.themeId,
              subThemeId: input.subthemeId,
            },
            messageFields: {
              senderId: userId,
              recieverId: senderId,
              ticketId: ticketId,
              text: input.text,
              attachPaths: [],
            },
          })),
        },
      });
      handleShowModal();
      console.log("Тикет успешно разделен:", result);
    } catch (error) {
      console.error("Ошибка при разделении тикета:", error);
    }
  };

  const handleShowModal = () => {
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    goToAllTickets();
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

        {isVisibleSplit && (
          <>
            <div className="chat__split-ticket">
              <Form.Control
                type="number"
                className="add-currator__input"
                placeholder="Количество новых тикетов"
                value={newTicketsCount}
                onChange={handleOnChangeNewTicketsCount}
                min={0}
                id="splitTicket"
              />
              <ButtonCustom
                title="Создать новые тикеты"
                className="chat-input__button-close"
                onClick={handleSplitTicketFields}
              />
            </div>
          </>
        )}

        {isVisibleSplitFields && (
          <>
            {inputValues.map((input, index) => (
              <Form.Group
                key={input.id}
                controlId={`TicketTitleForm_${input.id}`}
                style={{ display: index === currentIndex ? "flex" : "none" }}
                className="chat__new-fields"
              >
                <h3>Новый тикет #{input.id}</h3>
                <Form.Control
                  type="text"
                  placeholder="Тема обращения"
                  className="form__input"
                  value={input.title}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                />
                <DropdownButton
                  id="dropdown-custom-1"
                  title={input.unit || "Выберите подразделение"}
                >
                  {dataQuery.map((unit, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleUnitClick(unit.name.stroke, unit.id)}
                      href="#"
                    >
                      {unit.name.stroke}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                {input.unit && (
                  <DropdownButton
                    id="dropdown-custom-1"
                    title={input.theme || "Тип обращения"}
                  >
                    {dataQuery
                      .find((unit) => unit.name.stroke === input.unit)
                      ?.themes.map((theme) => (
                        <Dropdown.Item
                          key={theme.id}
                          onClick={() =>
                            handleThemeClick(theme.name.stroke, theme.id)
                          }
                          href="#"
                        >
                          {theme.name.stroke}
                        </Dropdown.Item>
                      ))}
                  </DropdownButton>
                )}
                {isSubThemeDropdownVisible && input.theme && (
                  <DropdownButton
                    id="dropdown-custom-1"
                    title={input.subtheme || "Подтема"}
                  >
                    {dataQuery
                      .find((unit) => unit.name.stroke === input.unit)
                      ?.themes.find(
                        (theme) => theme.name.stroke === input.theme
                      )
                      ?.subThemes.map((subTheme) => (
                        <Dropdown.Item
                          key={subTheme.id}
                          onClick={() =>
                            handleSubThemeClick(
                              subTheme.name.stroke,
                              subTheme.id
                            )
                          }
                          href="#"
                        >
                          {subTheme.name.stroke}
                        </Dropdown.Item>
                      ))}
                  </DropdownButton>
                )}
                <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    toolbarStyle={{border: "1px solid #dee2e6", borderRadius: "6px 6px 0 0"}}
                    editorStyle={{border: "1px solid #dee2e6", borderRadius: "0 0 6px 6px", padding: "10px"}}
                    placeholder={"Введите здесь ваше сообщение"}
                    toolbar={{
                      options: ['inline', 'list', 'emoji', 'remove', 'history'],
                      inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough'],
                      },
                      list: {
                        options: ['unordered', 'ordered']
                      }
                    }}
                  />
              </Form.Group>
            ))}
            <div className="chat__new-fields-buttons">
              <div className="chat__new-fields-buttons-pagination">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="alltickets__page-btn"
                >
                  Предыдущий
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === inputValues.length - 1}
                  className="alltickets__page-btn"
                >
                  Следующий
                </button>
              </div>
              {isErrorVisible && (
                <span className="form__error">{errorMsgSplit()}</span>
              )}
              <ButtonCustom
                title="Создать новые обращения"
                className="chat-input__button-send"
                onClick={handleMutationSplitTicket}
              />
            </div>
          </>
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
              <Form.Group className="custom-editor">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleEditorChange}
                  toolbarStyle={{border: "1px solid #dee2e6", borderRadius: "6px 6px 0 0"}}
                  editorStyle={{border: "1px solid #dee2e6", borderRadius: "0 0 6px 6px", padding: "10px"}}
                  placeholder={"Введите здесь ваше сообщение"}
                  toolbar={{
                    options: ['inline', 'list', 'emoji', 'remove', 'history'],
                    inline: {
                      options: ['bold', 'italic', 'underline', 'strikethrough'],
                    },
                    list: {
                      options: ['unordered', 'ordered']
                    }
                  }}
                />
              </Form.Group>
              <div className="file-inputs">
                {fileInputs.map((fileInput, index) => (
                  <Form.Group key={index} className="mb-3 fileInputForm">
                    <Form.Control
                      type="file"
                      accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                ))}
                
                <Button
                  variant="outline-primary"
                  id="AddFileButton"
                  onClick={handleAddFileInput}
                >
                  Добавить файл
                </Button>
              </div>

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
                    onClick={handleShowWarning}
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
                <>
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
                  {isAdmin() && currentStatus == "Новый" && !isVisibleSplit && (
                    <a className="alltickets__link">
                      <ButtonCustom
                        title="Разделить тикет"
                        className="chat-input__button-close single"
                        onClick={handleSplitTicket}
                      />
                    </a>
                  )}
                </>
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
                    onClick={handleShowWarning}
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
                <>
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
                  {isAdmin() && currentStatus == "Новый" && !isVisibleSplit && (
                    <a className="alltickets__link">
                      <ButtonCustom
                        title="Разделить тикет"
                        className="chat-input__button-close single"
                        onClick={handleSplitTicket}
                      />
                    </a>
                  )}
                </>
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
            <Row>
              <Col className="chat-input__row">
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
                    toolbarStyle={{border: "1px solid #dee2e6", borderRadius: "6px 6px 0 0"}}
                    editorStyle={{border: "1px solid #dee2e6", borderRadius: "0 0 6px 6px", padding: "10px"}}
                    placeholder={"Введите здесь ваше сообщение"}
                    toolbar={{
                      options: ['inline', 'list', 'emoji', 'remove', 'history'],
                      inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough'],
                      },
                      list: {
                        options: ['unordered', 'ordered']
                      }
                    }}
                  />
                </Form.Group>

                <div className="file-inputs">
                  {fileInputs.map((fileInput, index) => (
                    <Form.Group key={index} className="mb-3 fileInputForm">
                      <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                        onChange={handleFileChange}
                      />
                    </Form.Group>
                  ))}
                  
                  <Button
                    variant="outline-primary"
                    id="AddFileButton"
                    onClick={handleAddFileInput}
                  >
                    Добавить файл
                  </Button>
                </div>

                <ButtonCustom
                  title="Отправить"
                  className="chat-input__button-send single"
                  type="submit"
                  onClick={handleSubmit}
                />
              </Col>
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

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Обращение разделено</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Тикет успешно разделен</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWarning} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Предупреждение</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите закрыть это обращение?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWarning}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Продолжить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Chat;
