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
  Tab,
  Tabs,
} from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";

import { MESSAGES_CHAT, THEME_LIST, CURATORS_LIST } from "../apollo/queries";
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
  const [dataQueryCurators, setDataQueryCurators] = useState([]);
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

  const [newTicketsCount, setNewTicketsCount] = useState(undefined);
  const [inputValues, setInputValues] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedUnitEdit, setSelectedUnitEdit] = useState(null);
  const [selectedUnitIdEdit, setSelectedUnitIdEdit] = useState(null);
  const [selectedThemeEdit, setSelectedThemeEdit] = useState(null);
  const [selectedThemeIdEdit, setSelectedThemeIdEdit] = useState(null);
  const [selectedSubThemeEdit, setSelectedSubThemeEdit] = useState(null);
  const [selectedSubThemeIdEdit, setSelectedSubThemeIdEdit] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedCurator, setSelectedCurator] = useState(null);
  const [selectedCuratorId, setSelectedCuratorId] = useState(null);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);

  const [isVisibleError, setIsVisibleError] = useState(false);
  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);
  const [isErrorVisibleSplit, setIsErrorVisibleSplit] = useState(false);
  const [isErrorVisibleNewFields, setIsErrorVisibleNewFields] = useState(false);
  const [isVisibleEditTicketView, setIsVisibleEditTicketView] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleSplit, setIsVisibleSplit] = useState(false);
  const [isVisibleEdit, setIsVisibleEdit] = useState(false);
  const [isVisibleSplitFields, setisVisibleSplitFields] = useState(false);
  const [isSubThemeDropdownVisible, setIsSubThemeDropdownVisible] =
    useState(true);
  const [isSubThemeDropdownVisibleEdit, setIsSubThemeDropdownVisibleEdit] =
    useState(true);
  const [isErrorVisibleEdit, setIsErrorVisibleEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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

  const {
    loading: loadingCurators,
    error: errorCurators,
    data: dataCurators,
  } = useQuery(CURATORS_LIST, {
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
      setSelectedUnitEdit(
        data.clientQuery.ticket.subTheme.theme.unit.name.stroke
      );
      setSelectedUnitIdEdit(data.clientQuery.ticket.subTheme.theme.unit.id);
      setSelectedThemeEdit(data.clientQuery.ticket.subTheme.theme.name.stroke);
      setSelectedThemeIdEdit(data.clientQuery.ticket.subTheme.theme.id);
      setSelectedSubThemeEdit(data.clientQuery.ticket.subTheme.name.stroke);
      setSelectedSubThemeIdEdit(data.clientQuery.ticket.subTheme.id);
      setSelectedCurator(
        `${data.clientQuery.ticket.helper.user.surname} ${
          data.clientQuery.ticket.helper.user.name
        } ${
          data.clientQuery.ticket.helper.user.patronymic
            ? ` ${data.clientQuery.ticket.helper.user.patronymic}`
            : ""
        }`
      );
      setSelectedCuratorId(data.clientQuery.ticket.helper.id);
      setSelectedDepartmentsId(
        data.clientQuery.ticket.subTheme.departments.map(
          (department) => department.id
        )
      );

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

      if (dataCurators && dataCurators.helperQuery.helperList) {
        setDataQueryCurators(dataCurators.helperQuery.helperList);
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
  }, [data, dataThemeList, dataCurators, location.state, newTicketsCount]);

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
    setIsVisibleEditTicketView(false);
    setIsVisibleEdit(false);
  };

  const handleOnChangeNewTicketsCount = (e) => {
    setNewTicketsCount(e.target.value);
    setIsErrorVisibleNewFields(false);
  };

  const errorMsgNewFields = () => {
    let error = "";

    if (newTicketsCount < 2) {
      error = "Минимальное число деления тикетов 2";
    }

    return error;
  };

  const handleSplitTicketFields = () => {
    if (newTicketsCount < 2) {
      setIsErrorVisibleNewFields(true);
      return;
    }
    setIsVisibleSplit(false);
    setisVisibleSplitFields(true);
  };

  const handleInputChange = (id, value) => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === id ? { ...input, title: value } : input
    );

    setIsErrorVisibleSplit(false);
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

    setIsErrorVisibleSplit(false);
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

    setIsErrorVisibleSplit(false);
    setSelectedTheme(theme);
    setInputValues(updatedInputValues);
  };

  const handleSubThemeClick = (subtheme, subthemeId) => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? { ...input, subtheme: subtheme, subthemeId: subthemeId }
        : input
    );

    setIsErrorVisibleSplit(false);
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

    setIsErrorVisibleSplit(false);
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
    let errors = [];

    inputValues.forEach((input) => {
      if (input.title.trim() === "") {
        errors.push(`Укажите тему нового тикета #${input.id}`);
      } else if (input.unitId === null) {
        errors.push(`Укажите раздел нового тикета #${input.id}`);
      } else if (input.themeId === null) {
        errors.push(`Укажите тему нового тикета #${input.id}`);
      } else if (input.subthemeId === null) {
        errors.push(`Укажите подтему нового тикета #${input.id}`);
      } else if (input.text.trim() === "") {
        errors.push(`Опишите проблему нового тикета #${input.id}`);
      } else {
        errors.push("Ошибка при разделении тикета");
      }
    });

    const errorMessages = errors.join("\n");

    return errorMessages;
  };

  const handleMutationSplitTicket = async () => {
    console.log(inputValues);
    let senderId;
    let hasError = false;

    if (userId == clientId) {
      senderId = helperId;
    } else {
      senderId = clientId;
    }

    inputValues.forEach((input) => {
      if (
        input.title == "" ||
        input.unitId == null ||
        input.themeId == null ||
        input.subthemeId == null ||
        input.text == ""
      ) {
        setIsErrorVisibleSplit(true);
        hasError = true;
        return;
      }
    });

    if (hasError) {
      return;
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
    setShowEdit(false);
    goToAllTickets();
  };

  const handleEditTicketView = () => {
    setIsVisibleEditTicketView(true);
    setIsVisibleEdit(true);
    setIsVisibleSplit(false);
    setisVisibleSplitFields(false);
  };

  const handleUnitClickEdit = (unit, unitId) => {
    setSelectedUnitEdit(unit);
    setSelectedUnitIdEdit(unitId);

    if (unit !== selectedUnit) {
      setSelectedThemeEdit(null);
      setSelectedSubThemeEdit(null);
      setIsSubThemeDropdownVisibleEdit(true);

      setSelectedCurator(null);
      setSelectedCuratorId(null);

      setIsErrorVisibleEdit(false);
    }

    // console.log(unitId);
  };

  const handleThemeClickEdit = (theme, themeId) => {
    setSelectedThemeEdit(theme);
    setSelectedThemeIdEdit(themeId);

    if (theme !== selectedThemeEdit) {
      setSelectedSubThemeEdit(null);
      setIsSubThemeDropdownVisibleEdit(true);

      setSelectedCurator(null);
      setSelectedCuratorId(null);

      setIsErrorVisibleEdit(false);

      switch ((selectedUnitId, themeId)) {
        case (1, 14):
          setSelectedSubThemeIdEdit(73);
          setIsSubThemeDropdownVisibleEdit(false);
          break;
        case (2, 15):
          setSelectedSubThemeIdEdit(74);
          setIsSubThemeDropdownVisibleEdit(false);
          break;
        case (2, 16):
          setSelectedSubThemeIdEdit(75);
          setIsSubThemeDropdownVisibleEdit(false);
          break;
        case (2, 22):
          setSelectedSubThemeIdEdit(102);
          setIsSubThemeDropdownVisibleEdit(false);
          break;
        case (2, 23):
          setSelectedSubThemeIdEdit(103);
          setIsSubThemeDropdownVisibleEdit(false);
          break;
        default:
      }
    }

    // console.log(unitId);
  };

  const handleSubThemeClickEdit = (subTheme, subThemeId, departmentsId) => {
    setSelectedSubThemeEdit(subTheme);
    setSelectedSubThemeIdEdit(subThemeId);

    setSelectedDepartmentsId(departmentsId);

    setSelectedCurator(null);
    setSelectedCuratorId(null);

    setIsErrorVisibleEdit(false);
    // console.log(subThemeId);
  };

  const handleCuratorClick = (
    curatorName,
    curatorSurname,
    curatorPatronymic,
    curatorId
  ) => {
    let fullName = `${curatorSurname} ${curatorName} ${
      curatorPatronymic ? ` ${curatorPatronymic}` : ""
    }`;
    setSelectedCurator(fullName);
    setSelectedCuratorId(curatorId);

    setIsErrorVisibleEdit(false);
  };

  const errorMsgEdit = () => {
    let error = "";

    if (selectedUnitEdit == null) {
      error = "Выберите раздел";
    } else if (selectedThemeEdit == null) {
      error = "Выберите тему";
    } else if (selectedSubThemeIdEdit == null) {
      error = "Выберите подтему";
    } else if (selectedCurator == null) {
      error = "Выберите куратора";
    } else {
      error = "Ошибка изменение данных тикета";
    }

    return error;
  };

  const handleEditTicket = async () => {
    if (
      selectedUnitEdit == null ||
      selectedThemeEdit == null ||
      selectedSubThemeIdEdit == null ||
      selectedCurator == null
    ) {
      setIsErrorVisibleEdit(true);
      return;
    }
    setIsErrorVisibleEdit(false);

    try {
      const result = await editTicket({
        variables: {
          token: user.token,
          id: ticketId,
          helperId: selectedCuratorId,
          unitId: selectedUnitIdEdit,
          themeId: selectedThemeIdEdit,
          subThemeId: selectedSubThemeIdEdit,
          departmentId: selectedDepartmentsId[0],
        },
      });

      console.log("Тикет успешно обновлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении тикета:", error);
      setIsErrorVisible(true);
    }
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
              <h3>Разделение тикета</h3>
              <Form.Control
                type="number"
                className="add-currator__input"
                placeholder="Количество новых тикетов"
                value={newTicketsCount}
                onChange={handleOnChangeNewTicketsCount}
                min={2}
                id="splitTicket"
              />
              {isErrorVisibleNewFields && (
                <span className="form__error">{errorMsgNewFields()}</span>
              )}
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
                  editorState={input.editorContent}
                  onEditorStateChange={(newEditorState) =>
                    handleSplitEditorChange(newEditorState, input.id)
                  }
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
              {isErrorVisibleSplit && (
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

        {isVisibleEditTicketView && (
          <>
            <Tabs
              defaultActiveKey="theme"
              id="justify-tab-example"
              className="mb-3 edit-ticket__tabs"
              justify
            >
              <Tab eventKey="theme" title="Редактирова тему">
                <div className="edit-subtheme__field">
                  <Form.Label className="edit-curator__field-label">
                    Раздел
                  </Form.Label>

                  <DropdownButton
                    id="dropdown-custom-1"
                    title={selectedUnitEdit}
                    className="themes__dropdown"
                  >
                    {dataQuery.map((unit, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          handleUnitClickEdit(unit.name.stroke, unit.id)
                        }
                        href="#"
                      >
                        {unit.name.stroke}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>

                {selectedUnitEdit && (
                  <div className="edit-subtheme__field">
                    <Form.Label className="edit-curator__field-label">
                      Тема
                    </Form.Label>
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={selectedThemeEdit || "Тип обращения"}
                      className="themes__dropdown"
                    >
                      {dataQuery
                        .find((unit) => unit.name.stroke === selectedUnitEdit)
                        ?.themes.map((theme) => (
                          <Dropdown.Item
                            key={theme.id}
                            onClick={() =>
                              handleThemeClickEdit(theme.name.stroke, theme.id)
                            }
                            href="#"
                          >
                            {theme.name.stroke}
                          </Dropdown.Item>
                        ))}
                    </DropdownButton>
                  </div>
                )}

                {isSubThemeDropdownVisibleEdit && selectedThemeEdit && (
                  <div className="edit-subtheme__field">
                    <Form.Label className="edit-curator__field-label">
                      Подтема
                    </Form.Label>
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={selectedSubThemeEdit || "Подтема"}
                      className="themes__dropdown"
                    >
                      {dataQuery
                        .find((unit) => unit.name.stroke === selectedUnitEdit)
                        ?.themes.find(
                          (theme) => theme.name.stroke === selectedThemeEdit
                        )
                        ?.subThemes.map((subTheme) => (
                          <Dropdown.Item
                            key={subTheme.id}
                            onClick={() =>
                              handleSubThemeClickEdit(
                                subTheme.name.stroke,
                                subTheme.id,
                                subTheme.departments.map(
                                  (department) => department.id
                                )
                              )
                            }
                            href="#"
                          >
                            {subTheme.name.stroke}
                          </Dropdown.Item>
                        ))}
                    </DropdownButton>
                  </div>
                )}
              </Tab>
              <Tab eventKey="curator" title="Изменить куратора">
                <div className="edit-subtheme__field">
                  <Form.Label className="edit-curator__field-label">
                    Куратор
                  </Form.Label>
                  <DropdownButton
                    id="dropdown-custom-1"
                    title={selectedCurator || "Куратор"}
                    className="themes__dropdown"
                  >
                    {dataQueryCurators
                      .filter((curator) =>
                        curator.departments.some((department) =>
                          selectedDepartmentsId.includes(department.id)
                        )
                      )
                      .map((curator, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            handleCuratorClick(
                              curator.user.name,
                              curator.user.surname,
                              curator.user.patronymic,
                              curator.id
                            )
                          }
                          href="#"
                        >
                          {`${curator.user.surname} ${curator.user.name} ${
                            curator.user.patronymic
                              ? ` ${curator.user.patronymic}`
                              : ""
                          }`}
                        </Dropdown.Item>
                      ))}
                  </DropdownButton>
                </div>
              </Tab>
            </Tabs>

            <div className="edit-curator__column chat__edit-button">
              {isErrorVisibleEdit && (
                <span className="form__error">{errorMsgEdit()}</span>
              )}
              <ButtonCustom
                title="Применить изменения"
                className={"add-curator__btn"}
                onClick={handleEditTicket}
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

              <>
                {isAdmin() && !isVisibleEdit && currentStatus !== "Закрыт" && (
                  <a className="alltickets__link">
                    <ButtonCustom
                      title="Изменить тикет"
                      className="chat-input__button-close single"
                      onClick={handleEditTicketView}
                    />
                  </a>
                )}
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

              <>
                {isAdmin() && !isVisibleEdit && currentStatus !== "Закрыт" && (
                  <a className="alltickets__link">
                    <ButtonCustom
                      title="Изменить тикет"
                      className="chat-input__button-close single"
                      onClick={handleEditTicketView}
                    />
                  </a>
                )}
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

      <Modal show={showWarning} onHide={handleCloseWarning}>
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

      <Modal show={showEdit} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Тикет обновлен</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Данные тикета успешно обновлены</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Chat;
