import { useMutation, useQuery } from "@apollo/client";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";

import {
  ADD_MESSAGE,
  EDIT_TICKET,
  SPLIT_TICKET,
  UPDATE_REACTION,
  UPDATE_TICKET,
  SEND_TO_MENTOR,
  MENTOR_LEAVE,
} from "../apollo/mutations";
import {
  CURATORS_LIST,
  MESSAGES_CHAT,
  MESSAGES_CHAT_CLIENT,
  THEME_LIST,
  HELPER_PERMS,
} from "../apollo/queries";

import { Editor } from "react-draft-wysiwyg";
import ButtonCustom from "../components/button";
import TicketTitle from "../components/chat_components/ticket-title";
import InfoTable from "../components/chat_components/info-table";
import MessageList from "../components/chat_components/message-list";
import Counter from "../components/chat_components/counter";
import Reaction from "../components/chat_components/reaction";
import Logs from "../components/chat_components/logs";
import Loader from "../pages/loading";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import "../css/all-tickets.css";
import "../css/chat-input.css";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import get_translation from "../helpers/translation";

function Chat() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [dataQuery, setData] = useState([]);
  const [dataQueryCurators, setDataQueryCurators] = useState([]);
  const [dataLogQuery, setDataLogQuery] = useState([]);
  const [message, setMessage] = useState("");
  const { itemId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);
  const [currentStatusId, setCurrentStatusId] = useState(null);

  const [helperId, setHelperId] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(1);
  const [mentorId, setMentorId] = useState(null);

  const [reaction, setReaction] = useState(null);

  const [isLoadingClose, setIsLoadingClose] = useState(false);

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
  const [titleValue, setTitleValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedCurator, setSelectedCurator] = useState(null);
  const [selectedCuratorId, setSelectedCuratorId] = useState(null);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [selectedCuratorChat, setSelectedCuratorChat] = useState(null);
  const [selectedCuratorIdChat, setSelectedCuratorIdChat] = useState(null);

  const [isVisibleError, setIsVisibleError] = useState(false);
  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);
  const [isErrorVisibleSplit, setIsErrorVisibleSplit] = useState(false);
  const [isVisibleHelperButtons, setIsVisibleHelperButtons] = useState(true);
  const [isErrorVisibleNewFields, setIsErrorVisibleNewFields] = useState(false);
  const [isVisibleEditTicketView, setIsVisibleEditTicketView] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleSplit, setIsVisibleSplit] = useState(false);
  const [isVisibleSplitFields, setisVisibleSplitFields] = useState(false);
  const [isVisibleCuratorsChat, setIsVisibleCuratorsChat] = useState(false);
  const [isVisibleMentor, setIsVisibleMentor] = useState(false);
  const [isSubThemeDropdownVisible, setIsSubThemeDropdownVisible] =
    useState(true);
  const [isSubThemeDropdownVisibleEdit, setIsSubThemeDropdownVisibleEdit] =
    useState(true);
  const [isErrorVisibleEdit, setIsErrorVisibleEdit] = useState(false);
  const [isErrorVisibleCuratorChat, setIsErrorVisibleCuratorChat] =
    useState(false);
  const [isErrorVisibleMentor, setIsErrorVisibleMentor] = useState(false);

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCuratorChat, setShowCuratorChat] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [showEditTicketError, setShowEditTicketErorr] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));
  const isBuild = import.meta.env.DEV !== "build";

  const inputRef = useRef(null);

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  const adminRequest = () => {
    return useQuery(MESSAGES_CHAT, {
      variables: {
        token: user.token,
        link: itemId,
        lang: language,
      },
    });
  };

  const clientRequest = () => {
    return useQuery(MESSAGES_CHAT_CLIENT, {
      variables: {
        token: user.token,
        link: itemId,
        lang: language,
      },
    });
  };

  const { loading, error, data, refetch } = isAdmin()
    ? adminRequest()
    : clientRequest();

  const { data: dataPerms } = useQuery(HELPER_PERMS, {
    variables: {
      token: user?.token,
      id: user?.id,
    },
  });

  const {
    loading: loadingThemeList,
    error: errorThemeList,
    data: dataThemeList,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
      lang: language,
    },
  });

  const {
    loading: loadingCuratorsList,
    error: errorCuratorsList,
    data: dataCurators,
  } = useQuery(CURATORS_LIST, {
    variables: {
      token: user.token,
    },
  });

  const [fileInputs, setFileInputs] = useState([
    {
      fileInput: true,
    },
  ]);

  const handleAddFileInput = () => {
    if (fileInputs.length >= 5) {
      alert(get_translation("INTERFACE_ERROR_FILES_LIMIT"));
      return;
    }
    setFileInputs(
      fileInputs.concat([
        {
          fileInput: true,
        },
      ])
    );
  };

  const handleRemoveFileInput = (indexToRemove) => {
    setFileInputs((prevFileInputs) =>
      prevFileInputs.filter((_, index) => index !== indexToRemove)
    );
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

  useEffect(() => {
    if (isAdmin()) {
      if (data && data.clientQuery.ticket) {
        setDataLogQuery(data.clientQuery.ticket.log);
      }

      if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
        setData(dataThemeList.clientQuery.allThemeTree);
      }

      if (dataCurators && dataCurators.helperQuery.helperList) {
        setDataQueryCurators(dataCurators.helperQuery.helperList);
      }
    }
    if (data && data.clientQuery.ticket) {
      setTicketId(data.clientQuery.ticket.id);
      setMessagesQuery([...data.clientQuery.ticket.messages].reverse());
      setCurrentStatusId(data.clientQuery.ticket.status.id);
      setHelperId(data.clientQuery.ticket.recipient.id);
      setClientId(data.clientQuery.ticket.initiator.id);
      setSelectedUnitEdit(
        data.clientQuery.ticket.subTheme.theme.unit.name.stroke
      );
      setSelectedUnitIdEdit(data.clientQuery.ticket.subTheme.theme.unit.id);
      setSelectedThemeEdit(data.clientQuery.ticket.subTheme.theme.name.stroke);
      setSelectedThemeIdEdit(data.clientQuery.ticket.subTheme.theme.id);
      handleThemeClickEdit(
        data.clientQuery.ticket.subTheme.theme.name.stroke,
        data.clientQuery.ticket.subTheme.theme.id
      );
      setTitleValue(data.clientQuery.ticket.title);

      setSelectedCurator(
        `${data.clientQuery.ticket.recipient.surname} ${
          data.clientQuery.ticket.recipient.name
        } ${
          data.clientQuery.ticket.recipient.patronymic
            ? ` ${data.clientQuery.ticket.recipient.patronymic}`
            : ""
        }`
      );
      setSelectedCuratorId(data.clientQuery.ticket.recipient.id);
      setSelectedDepartmentsId(
        data.clientQuery.ticket.subTheme.departments.map(
          (department) => department.id
        )
      );

      if (data.clientQuery.ticket.status.id !== 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (data.clientQuery.ticket.reaction == 1) {
        setReaction("like");
      } else if (data.clientQuery.ticket.reaction == 0) {
        setReaction("dislike");
      } else {
        setReaction(null);
      }

      if (newTicketsCount !== undefined) {
        let _theme = data.clientQuery.ticket.subTheme.theme.name.stroke;
        let _themeId = data.clientQuery.ticket.subTheme.theme.id;

        const inputs = Array.from({ length: newTicketsCount }, (_, index) => ({
          id: index + 1,
          title: "",
          unit: data.clientQuery.ticket.subTheme.theme.unit.name.stroke,
          unitId: data.clientQuery.ticket.subTheme.theme.unit.id,
          theme: data.clientQuery.ticket.subTheme.theme.name.stroke,
          themeId: data.clientQuery.ticket.subTheme.theme.id,
          subtheme: data.clientQuery.ticket.subTheme.name.stroke,
          subthemeId: data.clientQuery.ticket.subTheme.id,
          recepient: null,
          recepientId: null,
          departmentsId: data.clientQuery.ticket.subTheme.departments.map(
            (department) => department.id
          ),
          editorContent: EditorState.createEmpty(),
          text: "",
          isVisibleButton: true,
          isVisibleDropdown: false,
        }));
        handleThemeClick(_theme, _themeId);
        setInputValues(inputs);
      }
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, dataThemeList, dataCurators, location.state, newTicketsCount]);

  const goToAllTickets = () => {
    navigate("/all-tickets");
  };

  const [addMessage, { loader: loaderAddMsg }] = useMutation(ADD_MESSAGE, {
    refetchQueries: [
      {
        query: isAdmin() ? MESSAGES_CHAT : MESSAGES_CHAT_CLIENT,
        variables: { token: user.token, link: itemId, lang: language },
      },
    ],
  });

  const [
    updateTicket,
    { loading: loaderUpdateStatus, error: errorUpdateStatus },
  ] = useMutation(UPDATE_TICKET);

  const [updateReaction] = useMutation(UPDATE_REACTION);

  const [editTicket, { loading: loadingEditTicket }] = useMutation(EDIT_TICKET);

  const [splitTicket, { loading: loadingSplitTicket }] =
    useMutation(SPLIT_TICKET);

  const [sendToMentor, { loading: loadingSendToMentor }] =
    useMutation(SEND_TO_MENTOR);

  const [mentorLeave, { loading: loadingMentorLeave }] =
    useMutation(MENTOR_LEAVE);

  if (
    loading ||
    loadingThemeList ||
    loadingThemeList ||
    loadingEditTicket ||
    loadingSplitTicket ||
    loadingSendToMentor ||
    loadingMentorLeave ||
    loadingCuratorsList
  ) {
    return <Loader />;
  }

  if (error || errorCuratorsList || errorThemeList) {
    const networkError =
      error.networkError ??
      errorCuratorsList.networkError ??
      errorThemeList.networkError;

    if (!isAdmin() && error.message === "Forbidden") {
      return <NotFoundPage />;
    }

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        } else if (errorMessage === "Forbidden") {
          return <NotFoundPage />;
        }
      }
    }
    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
  }

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);

    setMessage(draftToHtml(rawContent));

    // console.log(draftToHtml(rawContent));
    return draftToHtml(rawContent);
  };

  const errorMsg = () => {
    let error = "";

    if (isFilesSizeExceeded) {
      error = get_translation("INTERFACE_ERROR_FILE_SIZE_EXEEDED");
    } else if (isFilesLimitExceeded) {
      error = get_translation("INTERFACE_ERROR_FILES_LIMIT");
    } else if (textareaValue.trim() == "<p></p>\n") {
      error = get_translation("INTERFACE_ENTER_MSG_TEXT");
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
              ? "https://help.vertera.org:4444/upload"
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

    // console.log(getContent());

    if (loaderAddMsg) {
      return <Loader />;
    }

    // console.log(message);

    if (message == "<p></p>" || message == "<p></p>\n") {
      return;
    }

    if (isAdmin() && currentStatusId !== 4 && selectedValue == 1) {
      try {
        const result = await updateTicket({
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
        const result = await updateTicket({
          variables: {
            token: user.token,
            id: ticketId,
            fields: {
              statusId: 5,
            },
          },
        });

        console.log("Статус успешно обновлен:", result);
      } catch (error) {
        console.error("Ошибка при обновлении статуса:", error);
      }
    }

    let senderId;

    if (user.id == clientId) {
      senderId = helperId;
    } else {
      senderId = clientId;
    }

    // console.log(senderId);

    uploadFiles()
      .then((filePaths) => {
        addMessage({
          variables: {
            token: user.token,
            senderId: user.id,
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
    handleShowMsg();
    setMessage("");
    setEditorState(EditorState.createEmpty());

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleClose = async () => {
    setIsVisible(false);
    handleCloseWarning();

    if (loaderUpdateStatus) {
      return <Loader />;
    }
    if (errorUpdateStatus) {
      return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
    }

    try {
      setIsLoadingClose(true);

      await updateTicket({
        variables: {
          token: user.token,
          id: ticketId,
          fields: {
            statusId: 2,
          },
        },
      });
      setCurrentStatusId(2);
      // console.log(ticketStatus);
      setIsLoadingClose(false);
    } catch (error) {
      console.error("Ошибка при закрытии заявки:", error);

      setIsLoadingClose(false);
    }
  };

  const handleShowMsg = () => {
    setShowMsg(true);
  };

  const handleCloseMsg = () => {
    setShowMsg(false);
  };

  const handleOpen = async () => {
    if (loaderUpdateStatus) {
      return <Loader />;
    }
    if (errorUpdateStatus) {
      return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
    }

    try {
      setIsLoadingClose(true);

      await updateTicket({
        variables: {
          token: user.token,
          id: ticketId,
          fields: {
            statusId: 3,
          },
        },
      });
      setCurrentStatusId(3);
      setIsLoadingClose(false);
    } catch (error) {
      console.error("Ошибка при открытии заявки:", error);

      setIsLoadingClose(false);
    }
  };

  const handleInProgress = async () => {
    if (loaderUpdateStatus) {
      return <Loader />;
    }
    if (errorUpdateStatus) {
      return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
    }

    try {
      setIsLoadingClose(true);

      await updateTicket({
        variables: {
          token: user.token,
          id: ticketId,
          fields: {
            statusId: 3,
          },
        },
      });
      setCurrentStatusId(3);
      setIsLoadingClose(false);
    } catch (error) {
      console.error("Ошибка при смене статуса:", error);

      setIsLoadingClose(false);
    }

    try {
      if (user.id !== helperId) {
        await editTicket({
          variables: {
            token: user.token,
            id: ticketId,
            recipientId: user.id,
          },
        });
      }
    } catch (error) {
      handleShowEditTicketError();
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
    updateReaction({
      variables: {
        token: user.token,
        id: ticketId,
        reaction: 1,
      },
    });
    setReaction("like");
    // console.log(reaction);
  };

  const handleDislike = (e) => {
    e.preventDefault();
    updateReaction({
      variables: {
        token: user.token,
        id: ticketId,
        reaction: 0,
      },
    });
    setReaction("dislike");
    // console.log(reaction);
  };

  const handleSplitTicket = () => {
    setIsVisibleHelperButtons(false);
    setIsVisibleSplit(true);

    setNewTicketsCount(undefined);
    setIsErrorVisibleSplit(false);
  };

  const handleOnChangeNewTicketsCount = (e) => {
    setNewTicketsCount(e.target.value);
    setIsErrorVisibleNewFields(false);
  };

  const errorMsgNewFields = () => {
    let error = "";

    if (newTicketsCount < 2) {
      error = get_translation("INTERFACE_ERROR_MIN_SPLIT");
    } else if (newTicketsCount == undefined) {
      error = get_translation("INTERFACE_ENTER_NUMBER_SPLIT");
    }

    return error;
  };

  const handleSplitTicketFields = () => {
    if (newTicketsCount < 2 || newTicketsCount == undefined) {
      setIsErrorVisibleNewFields(true);
      return;
    }
    setIsVisibleHelperButtons(false);
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
    let theme, themeId, subtheme, subthemeId, recepient, recepientId;

    if (unit !== selectedUnit) {
      theme = null;
      themeId = null;
      subtheme = null;
      subthemeId = null;
      recepient = null;
      recepientId = null;
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
            recepient: recepient,
            recepientId: recepientId,
          }
        : input
    );

    setIsErrorVisibleSplit(false);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);
    setInputValues(updatedInputValues);
  };

  const handleThemeClick = (theme, themeId) => {
    let subtheme;
    let subthemeId;
    let recepient;
    let recepientId;

    if (theme !== selectedTheme) {
      subtheme = null;
      recepient = null;
      recepientId = null;
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
        ? {
            ...input,
            theme: theme,
            themeId: themeId,
            subtheme: subtheme,
            subthemeId: subthemeId,
            recepient: recepient,
            recepientId: recepientId,
          }
        : input
    );

    setIsErrorVisibleSplit(false);
    setSelectedTheme(theme);
    setInputValues(updatedInputValues);
  };

  const handleSubThemeClick = (subtheme, subthemeId, departmentsId) => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? {
            ...input,
            subtheme: subtheme,
            subthemeId: subthemeId,
            departmentsId: departmentsId,
            recepient: null,
            recepientId: null,
          }
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
        errors.push(
          `${get_translation("INTERFACE_ENTER_NEW_TICKET_TITLE")} #${input.id}`
        );
      } else if (input.unitId === null) {
        errors.push(
          `${get_translation("INTERFACE_ENTER_NEW_TICKET_UNIT")} #${input.id}`
        );
      } else if (input.themeId === null) {
        errors.push(
          `${get_translation("INTERFACE_ENTER_NEW_TICKET_THEME")} #${input.id}`
        );
      } else if (input.subthemeId === null) {
        errors.push(
          `${get_translation("INTERFACE_ENTER_NEW_TICKET_SUBTHEME")} #${
            input.id
          }`
        );
      } else if (input.text.trim() === "") {
        errors.push(
          `${get_translation(
            "INTERFACE_ENTER_NEW_TICKET_DESCRIBE_SITUATION"
          )} #${input.id}`
        );
      } else {
        errors.push(get_translation("INTERFACE_ERROR_SPLIT"));
      }
    });

    const errorMessages = errors.join("\n");

    return errorMessages;
  };

  const handleMutationSplitTicket = async () => {
    console.log(inputValues);
    let senderId;
    let hasError = false;

    if (user.id == clientId) {
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
              initiatorId: clientId,
              recipientId: input.recepientId,
              unitId: input.unitId,
              themeId: input.themeId,
              subThemeId: input.subthemeId,
            },
            messageFields: {
              senderId: clientId,
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
      handleShowEditTicketError();
      console.error("Ошибка при разделении тикета:", error);
    }
  };

  const handleShowModal = () => {
    setShowSplitModal(true);
  };

  const handleCloseModal = () => {
    setShowSplitModal(false);
    setShowEdit(false);
    setShowMentor(false);
    setShowCuratorChat(false);
    goToAllTickets();
  };

  const handleEditTicketView = () => {
    setIsVisibleEditTicketView(true);
    setIsVisibleHelperButtons(false);

    setSelectedUnitEdit(
      data.clientQuery.ticket.subTheme.theme.unit.name.stroke
    );
    setSelectedUnitIdEdit(data.clientQuery.ticket.subTheme.theme.unit.id);
    setSelectedThemeEdit(data.clientQuery.ticket.subTheme.theme.name.stroke);
    setSelectedThemeIdEdit(data.clientQuery.ticket.subTheme.theme.id);
    setSelectedSubThemeEdit(data.clientQuery.ticket.subTheme.name.stroke);
    setSelectedSubThemeIdEdit(data.clientQuery.ticket.subTheme.id);
    setSelectedCurator(
      `${data.clientQuery.ticket.recipient.surname} ${
        data.clientQuery.ticket.recipient.name
      } ${
        data.clientQuery.ticket.recipient.patronymic
          ? ` ${data.clientQuery.ticket.recipient.patronymic}`
          : ""
      }`
    );
    setSelectedCuratorId(data.clientQuery.ticket.recipient.id);
    setSelectedDepartmentsId(
      data.clientQuery.ticket.subTheme.departments.map(
        (department) => department.id
      )
    );
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

  const handleSubThemeClickEdit = (subTheme, subThemeId, departmentsId) => {
    setSelectedSubThemeEdit(subTheme);
    setSelectedSubThemeIdEdit(subThemeId);

    setSelectedDepartmentsId(departmentsId);

    if (subTheme !== selectedSubThemeEdit) {
      setSelectedCurator(null);
      setSelectedCuratorId(null);
    }

    setIsErrorVisibleEdit(false);
    // console.log(subThemeId);
  };

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value);
    setIsErrorVisibleEdit(false);
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

    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? {
            ...input,
            recepient: fullName,
            recepientId: curatorId,
          }
        : input
    );

    setSelectedCurator(fullName);
    setSelectedCuratorId(curatorId);

    setIsErrorVisibleEdit(false);
    setInputValues(updatedInputValues);
  };

  const errorMsgEdit = () => {
    let error = "";

    if (selectedUnitEdit == null) {
      error = get_translation("INTERFACE_SELECT_UNIT");
    } else if (selectedThemeEdit == null) {
      error = get_translation("INTERFACE_SELECT_THEME");
    } else if (selectedSubThemeIdEdit == null) {
      error = get_translation("INTERFACE_SELECT_SUBTHEME");
    } else if (titleValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_TITLE");
    } else if (selectedCurator == null) {
      error = get_translation("INTERFACE_SELECT_CURATOR");
    } else {
      error = get_translation("INTERFACE_ERROR_EDIT_TICKET");
    }

    return error;
  };

  const handleEditTicket = async () => {
    if (
      selectedUnitEdit == null ||
      selectedThemeEdit == null ||
      selectedSubThemeIdEdit == null ||
      titleValue.trim() == "" ||
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
          recipientId: selectedCuratorId,
          title: titleValue,
          unitId: selectedUnitIdEdit,
          themeId: selectedThemeIdEdit,
          subThemeId: selectedSubThemeIdEdit,
          departmentId: selectedDepartmentsId[0],
        },
      });

      console.log("Тикет успешно обновлен:", result);
      handleShow();
    } catch (error) {
      handleShowEditTicketError();
      console.error("Ошибка при обновлении тикета:", error);
    }
  };

  const handleEditCloseClick = () => {
    setIsVisibleHelperButtons(true);
    setIsVisibleEditTicketView(false);
    setIsVisibleCuratorsChat(false);
    setIsVisibleSplit(false);
    setisVisibleSplitFields(false);
    setIsVisibleMentor(false);

    setNewTicketsCount(undefined);

    setMentorId(null);
  };

  const handleCloseSplitAddCurator = () => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? {
            ...input,
            isVisibleButton: true,
            isVisibleDropdown: false,
          }
        : input
    );

    setInputValues(updatedInputValues);
  };

  const handleShow = () => {
    setShowEdit(true);
  };

  const handleCuratorsChat = () => {
    setIsVisibleCuratorsChat(true);
    setIsVisibleHelperButtons(false);

    setSelectedCuratorChat(null);
  };

  const handleCuratorChatClick = (
    curatorName,
    curatorSurname,
    curatorPatronymic,
    curatorId
  ) => {
    let fullName = `${curatorSurname} ${curatorName} ${
      curatorPatronymic ? ` ${curatorPatronymic}` : ""
    }`;
    setSelectedCuratorChat(fullName);
    setSelectedCuratorIdChat(curatorId);

    setIsErrorVisibleCuratorChat(false);
  };

  const errorMsgCuratorChat = () => {
    let error = "";

    if (selectedCuratorChat == null) {
      error = get_translation("INTERFACE_SELECT_CURATOR");
    } else {
      error = get_translation("INTERFACE_ERROR_ADD_CURATOR");
    }

    return error;
  };

  const handleAddCuratorChat = async () => {
    if (selectedCuratorChat == null) {
      setIsErrorVisibleCuratorChat(true);
      return;
    }
    setIsErrorVisibleCuratorChat(false);

    try {
      const result = await editTicket({
        variables: {
          token: user.token,
          id: ticketId,
          assistantId: selectedCuratorIdChat,
        },
      });

      console.log("Куратор успешно добавлен:", result);
      handleShowAddCurator();
    } catch (error) {
      handleShowEditTicketError();
      console.error("Ошибка при добавлении куратора:", error);
    }
  };

  const handleShowAddCurator = () => {
    setShowCuratorChat(true);
  };

  const handleOnChangeMentorId = (e) => {
    setMentorId(parseInt(e.target.value));
    setIsErrorVisibleMentor(false);
  };

  const errorMsgMentor = () => {
    let error = "";

    if (mentorId == null) {
      error = get_translation("INTERFACE_ENTER_MENTOR_ID");
    } else if (mentorId < 0) {
      error = get_translation("INTERFACE_ERROR_NEGATIVE_MENTOR_ID");
    } else {
      error = get_translation("INTERFACE_ERROR_ADD_MENTOR");
    }

    return error;
  };

  const handleSendToMentor = () => {
    setIsVisibleHelperButtons(false);
    setIsVisibleMentor(true);
  };

  const handleSendToMentorQuery = async () => {
    if (mentorId == null || mentorId < 0) {
      setIsErrorVisibleMentor(true);
      return;
    }
    setIsErrorVisibleMentor(false);

    try {
      const result = await sendToMentor({
        variables: {
          token: user.token,
          id: ticketId,
          mentorId: mentorId,
        },
      });

      console.log("Ментор успешно добавлен:", result);
      handleShowMentor();
    } catch (error) {
      handleShowEditTicketError();
      console.error("Ошибка при добавлении Ментора:", error);
    }
  };

  const handleShowMentor = () => {
    setShowMentor(true);
  };

  const handleEndCuratorChat = async () => {
    try {
      const result = await editTicket({
        variables: {
          token: user.token,
          id: ticketId,
          assistantId: -1,
        },
      });

      console.log("Диалог с куратором успешно завершен:", result);
      goToAllTickets();
    } catch (error) {
      console.error("Ошибка при завершении диалога с куратором:", error);
    }
  };

  const handleEndMentor = async () => {
    try {
      const result = await mentorLeave({
        variables: {
          token: user.token,
          id: ticketId,
        },
      });

      console.log("Диалог с ментором успешно завершен:", result);
      goToAllTickets();
    } catch (error) {
      console.error("Ошибка при завершении диалога с ментором:", error);
    }
  };

  const handleShowEditTicketError = () => {
    setShowEditTicketErorr(true);
  };

  const handleHideEditTicketError = () => {
    setShowEditTicketErorr(false);
  };

  const handleSelectCuratorVisible = () => {
    const updatedInputValues = inputValues.map((input) =>
      input.id === currentIndex + 1
        ? {
            ...input,
            isVisibleButton: false,
            isVisibleDropdown: true,
          }
        : input
    );

    setInputValues(updatedInputValues);
  };

  const handleRefetch = () => {
    refetch();
  };

  if (isLoadingClose || !data?.clientQuery?.ticket) {
    refetch();
    return <Loader />;
  }

  return (
    <>
      <div className={currentStatusId == 2 ? "" : "chat-messages__container"}>
        {currentStatusId !== null && currentStatusId !== 2 ? (
          <div className="alltickets__container">
            <TicketTitle
              title={`${data.clientQuery.ticket.title}`}
              state={get_translation("INTERFACE_TICKET_OPENED")}
              linkPrev={linkPrev}
            />
          </div>
        ) : (
          <div className="alltickets__container">
            <TicketTitle
              title={`${data?.clientQuery?.ticket.title}`}
              state={get_translation("INTERFACE_TICKET_CLOSED")}
              linkPrev={linkPrev}
            />
          </div>
        )}

        {isAdmin() &&
          isVisibleHelperButtons &&
          currentStatusId !== 6 &&
          dataPerms?.helperQuery?.helperPerms?.sendMsg && (
            <>
              <div className="chat__helper-buttons">
                {isAdmin() &&
                  currentStatusId !== 2 &&
                  user.id !== data?.clientQuery?.ticket.assistant?.id && (
                    <a className="alltickets__link">
                      <ButtonCustom
                        title={get_translation("INTERFACE_EDIT_TICKET")}
                        className="chat-input__button-close button-hover"
                        onClick={handleEditTicketView}
                      />
                    </a>
                  )}

                {isAdmin() &&
                  currentStatusId !== 2 &&
                  currentStatusId !== 1 &&
                  currentStatusId !== 4 &&
                  currentStatusId !== 7 &&
                  !isVisibleCuratorsChat && (
                    <>
                      <a className="alltickets__link">
                        <ButtonCustom
                          title={get_translation("INTERFACE_CURATOR_DIALOG")}
                          className="chat-input__button-close button-hover"
                          onClick={handleCuratorsChat}
                        />
                      </a>
                    </>
                  )}

                {isAdmin() &&
                  currentStatusId == 4 &&
                  user.id == data.clientQuery.ticket.assistant.id && (
                    <>
                      <a className="alltickets__link">
                        <ButtonCustom
                          title={get_translation(
                            "INTERFACE_CURATOR_DIALOG_END"
                          )}
                          className="chat-input__button-close button-hover"
                          onClick={handleEndCuratorChat}
                        />
                      </a>
                    </>
                  )}

                {currentStatusId == 7 &&
                  user.id === data?.clientQuery?.ticket.assistant?.id && (
                    <>
                      <a className="alltickets__link">
                        <ButtonCustom
                          title={get_translation("INTERFACE_MENTOR_DIALOG_END")}
                          className="chat-input__button-close button-hover"
                          onClick={handleEndMentor}
                        />
                      </a>
                    </>
                  )}

                {isAdmin() && currentStatusId == 1 && !isVisibleSplit && (
                  <a className="alltickets__link">
                    <ButtonCustom
                      title={get_translation("INTERFACE_SPLIT_TICKET")}
                      className="chat-input__button-close button-hover"
                      onClick={handleSplitTicket}
                    />
                  </a>
                )}

                {currentStatusId === 2 && isAdmin() && (
                  <>
                    <ButtonCustom
                      title={get_translation("INTERFACE_OPEN_TICKET")}
                      className="chat-input__button-close button-hover"
                      onClick={handleOpen}
                    />
                  </>
                )}

                {isAdmin() && currentStatusId === 3 && (
                  <a className="alltickets__link">
                    <ButtonCustom
                      title={get_translation("INTERFACE_SEND_MENTOR")}
                      className="chat-input__button-close button-hover"
                      onClick={handleSendToMentor}
                    />
                  </a>
                )}
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
              <Tab
                className="chat__tab-wrapper"
                eventKey="theme"
                title={get_translation("INTERFACE_EDIT_THEME")}
              >
                <a onClick={handleEditCloseClick}>
                  <div className="chat__edit-close"></div>
                </a>
                <div className="edit-subtheme__field">
                  <Form.Label className="edit-curator__field-label">
                    {get_translation("INTERFACE_UNIT")}
                  </Form.Label>

                  <DropdownButton
                    id="dropdown-custom-1"
                    title={selectedUnitEdit}
                    className="themes__dropdown"
                  >
                    {dataQuery.map(
                      (unit, index) =>
                        unit.visibility !== 3 && (
                          <Dropdown.Item
                            key={index}
                            onClick={() =>
                              handleUnitClickEdit(unit.name.stroke, unit.id)
                            }
                            href="#"
                          >
                            {unit.name.stroke}
                          </Dropdown.Item>
                        )
                    )}
                  </DropdownButton>
                </div>

                {selectedUnitEdit && (
                  <div className="edit-subtheme__field">
                    <Form.Label className="edit-curator__field-label">
                      {get_translation("INTERFACE_THEME")}
                    </Form.Label>
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={
                        selectedThemeEdit || get_translation("INTERFACE_THEME")
                      }
                      className="themes__dropdown"
                    >
                      {dataQuery
                        .find((unit) => unit.name.stroke === selectedUnitEdit)
                        ?.themes.map(
                          (theme) =>
                            theme.visibility !== 3 && (
                              <Dropdown.Item
                                key={theme.id}
                                onClick={() =>
                                  handleThemeClickEdit(
                                    theme.name.stroke,
                                    theme.id
                                  )
                                }
                                href="#"
                              >
                                {theme.name.stroke}
                              </Dropdown.Item>
                            )
                        )}
                    </DropdownButton>
                  </div>
                )}

                {isSubThemeDropdownVisibleEdit && selectedThemeEdit && (
                  <div className="edit-subtheme__field">
                    <Form.Label className="edit-curator__field-label">
                      {get_translation("INTERFACE_SUBTHEME")}
                    </Form.Label>
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={
                        selectedSubThemeEdit ||
                        get_translation("INTERFACE_SUBTHEME")
                      }
                      className="themes__dropdown"
                    >
                      {dataQuery
                        .find((unit) => unit.name.stroke === selectedUnitEdit)
                        ?.themes.find(
                          (theme) => theme.name.stroke === selectedThemeEdit
                        )
                        ?.subThemes.map(
                          (subTheme) =>
                            subTheme.visibility !== 3 && (
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
                            )
                        )}
                    </DropdownButton>
                  </div>
                )}
                <Form.Label className="edit-curator__field-label">
                  {get_translation("INTERFACE_TICKET_TITLE")}
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input add-theme__dropdown"
                  value={titleValue}
                  onChange={handleTitleChange}
                />
              </Tab>
              <Tab
                eventKey="curator"
                className="chat__tab-wrapper"
                title={get_translation("INTERFACE_CHANGE_CURATOR")}
              >
                <a onClick={handleEditCloseClick}>
                  <div className="chat__edit-close"></div>
                </a>
                <div className="edit-subtheme__field">
                  <Form.Label className="edit-curator__field-label">
                    {get_translation("INTERFACE_CURATOR")}
                  </Form.Label>
                  <DropdownButton
                    id="dropdown-custom-1"
                    title={
                      selectedCurator || get_translation("INTERFACE_CURATOR")
                    }
                    className="themes__dropdown"
                  >
                    {dataQueryCurators
                      .filter((curator) =>
                        curator.departments.some((department) =>
                          selectedDepartmentsId.includes(department.id)
                        )
                      )
                      .map(
                        (curator, index) =>
                          curator.user.isActive &&
                          curator.permissions.sendMsg && (
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
                          )
                      )}
                  </DropdownButton>
                </div>
              </Tab>
            </Tabs>

            <div className=" chat__edit-button">
              {isErrorVisibleEdit && (
                <span className="form__error">{errorMsgEdit()}</span>
              )}
              <ButtonCustom
                title={get_translation("INTERFACE_APPLY_CHANGE")}
                className={"add-curator__btn button-hover"}
                onClick={handleEditTicket}
              />
            </div>
          </>
        )}

        {isVisibleMentor && (
          <>
            <div style={{ position: "relative" }}>
              <a onClick={handleEditCloseClick}>
                <div className="chat__edit-close"></div>
              </a>

              <div className="sendId_field">
                <div className="edit-subtheme__field">
                  <Form.Control
                    type="number"
                    className="add-currator__input"
                    placeholder={get_translation("INTERFACE_ENTER_MENTOR_ID")}
                    value={mentorId}
                    onChange={handleOnChangeMentorId}
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div className=" chat__edit-button">
              {isErrorVisibleMentor && (
                <span className="form__error">{errorMsgMentor()}</span>
              )}
              <ButtonCustom
                title={get_translation("INTERFACE_SEND")}
                className={"add-curator__btn button-hover"}
                onClick={handleSendToMentorQuery}
              />
            </div>
          </>
        )}

        {isVisibleCuratorsChat && (
          <>
            <div className="chat__split-ticket">
              <h3>{get_translation("INTERFACE_SELECT_CURATOR_DIALOG")}</h3>
              <a onClick={handleEditCloseClick}>
                <div className="chat__edit-close"></div>
              </a>
              <DropdownButton
                id="dropdown-custom-1"
                title={
                  selectedCuratorChat || get_translation("INTERFACE_CURATOR")
                }
                className="themes__dropdown"
              >
                {dataQueryCurators.map(
                  (curator, index) =>
                    data.clientQuery.ticket.recipient.id !== curator.id && (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          handleCuratorChatClick(
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
                    )
                )}
              </DropdownButton>
              {isErrorVisibleCuratorChat && (
                <span className="form__error">{errorMsgCuratorChat()}</span>
              )}
              <ButtonCustom
                title={get_translation("INTERFACE_ADD_CURATOR")}
                className={"add-curator__btn button-hover"}
                onClick={handleAddCuratorChat}
              />
            </div>
          </>
        )}

        {isVisibleSplit && (
          <>
            <div className="chat__split-ticket">
              <h3>{get_translation("INTERFACE_TICKET_SPLIT")}</h3>
              <a onClick={handleEditCloseClick}>
                <div className="chat__edit-close"></div>
              </a>
              <Form.Control
                type="number"
                className="add-currator__input"
                placeholder={get_translation("INTERFACE_AMOUNT_NEW_TICKETS")}
                value={newTicketsCount}
                onChange={handleOnChangeNewTicketsCount}
                min={2}
                id="splitTicket"
              />
              {isErrorVisibleNewFields && (
                <span className="form__error">{errorMsgNewFields()}</span>
              )}
              <ButtonCustom
                title={get_translation("INTERFACE_CREATE_NEW_TICKET")}
                className="chat-input__button-close button-hover"
                onClick={handleSplitTicketFields}
              />
            </div>
          </>
        )}

        {isVisibleSplitFields && (
          <>
            <div className="chat__tab-wrapper">
              <a onClick={handleEditCloseClick}>
                <div className="chat__edit-close"></div>
              </a>
              {inputValues.map((input, index) => (
                <Form.Group
                  key={input.id}
                  controlId={`TicketTitleForm_${input.id}`}
                  style={{ display: index === currentIndex ? "flex" : "none" }}
                  className="chat__new-fields"
                >
                  <h3>
                    {get_translation("INTERFACE_NEW_TICKET")} #{input.id}
                  </h3>
                  <Form.Control
                    type="text"
                    placeholder={get_translation("INTERFACE_TICKET_TITLE")}
                    className="form__input"
                    value={input.title}
                    onChange={(e) =>
                      handleInputChange(input.id, e.target.value)
                    }
                  />
                  <DropdownButton
                    id="dropdown-custom-1"
                    title={
                      input.unit || get_translation("INTERFACE_SELECT_UNIT")
                    }
                  >
                    {dataQuery.map(
                      (unit, index) =>
                        unit.visibility !== 3 && (
                          <Dropdown.Item
                            key={index}
                            onClick={() =>
                              handleUnitClick(unit.name.stroke, unit.id)
                            }
                            href="#"
                          >
                            {unit.name.stroke}
                          </Dropdown.Item>
                        )
                    )}
                  </DropdownButton>
                  {input.unit && (
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={
                        input.theme || get_translation("INTERFACE_SELECT_THEME")
                      }
                    >
                      {dataQuery
                        .find((unit) => unit.name.stroke === input.unit)
                        ?.themes.map(
                          (theme) =>
                            theme.visibility !== 3 && (
                              <Dropdown.Item
                                key={theme.id}
                                onClick={() =>
                                  handleThemeClick(theme.name.stroke, theme.id)
                                }
                                href="#"
                              >
                                {theme.name.stroke}
                              </Dropdown.Item>
                            )
                        )}
                    </DropdownButton>
                  )}
                  {isSubThemeDropdownVisible && input.theme && (
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={
                        input.subtheme ||
                        get_translation("INTERFACE_SELECT_SUBTHEME")
                      }
                    >
                      {dataQuery
                        .find((unit) => unit.name.stroke === input.unit)
                        ?.themes.find(
                          (theme) => theme.name.stroke === input.theme
                        )
                        ?.subThemes.map(
                          (subTheme) =>
                            subTheme.visibility !== 3 && (
                              <Dropdown.Item
                                key={subTheme.id}
                                onClick={() =>
                                  handleSubThemeClick(
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
                            )
                        )}
                    </DropdownButton>
                  )}
                  {input.isVisibleButton && (
                    <ButtonCustom
                      title={get_translation("INTERFACE_SELECT_CURATOR")}
                      className="button-hover"
                      onClick={handleSelectCuratorVisible}
                    />
                  )}
                  {input.isVisibleDropdown && (
                    <>
                      <div style={{ position: "relative" }}>
                        <a onClick={handleCloseSplitAddCurator}>
                          <div className="chat__edit-close"></div>
                        </a>
                      </div>
                      <DropdownButton
                        id="dropdown-custom-1"
                        title={
                          input.recepient ||
                          get_translation("INTERFACE_CURATOR")
                        }
                        className="themes__dropdown"
                      >
                        {dataQueryCurators
                          .filter((curator) =>
                            curator.departments.some((department) =>
                              input.departmentsId.includes(department.id)
                            )
                          )
                          .map(
                            (curator, index) =>
                              curator.user.isActive &&
                              curator.permissions.sendMsg && (
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
                                  {`${curator.user.surname} ${
                                    curator.user.name
                                  } ${
                                    curator.user.patronymic
                                      ? ` ${curator.user.patronymic}`
                                      : ""
                                  }`}
                                </Dropdown.Item>
                              )
                          )}
                      </DropdownButton>
                    </>
                  )}
                  <Editor
                    editorState={input.editorContent}
                    onEditorStateChange={(newEditorState) =>
                      handleSplitEditorChange(newEditorState, input.id)
                    }
                    stripPastedStyles
                    toolbarStyle={{
                      border: "1px solid #dee2e6",
                      borderRadius: "6px 6px 0 0",
                    }}
                    editorStyle={{
                      border: "1px solid #dee2e6",
                      borderRadius: "0 0 6px 6px",
                      padding: "10px",
                    }}
                    placeholder={get_translation("INTERFACE_ENTER_MSG")}
                    toolbar={{
                      options: ["inline", "list", "emoji", "remove", "history"],
                      inline: {
                        options: [
                          "bold",
                          "italic",
                          "underline",
                          "strikethrough",
                        ],
                      },
                      list: {
                        options: ["unordered", "ordered"],
                      },
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
                    {get_translation("INTERFACE_PREVIOUS")}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === inputValues.length - 1}
                    className="alltickets__page-btn"
                  >
                    {get_translation("INTERFACE_NEXT")}
                  </button>
                </div>
                {isErrorVisibleSplit && (
                  <span className="form__error">{errorMsgSplit()}</span>
                )}
                <ButtonCustom
                  title={get_translation("INTERFACE_CREATE_NEW_TICKET")}
                  className="chat-input__button-send button-hover"
                  onClick={handleMutationSplitTicket}
                />
              </div>
            </div>
          </>
        )}

        <InfoTable data={data} currentStatus={currentStatusId} />

        {!isVisible && (
          <Reaction
            reaction={reaction}
            handleLike={handleLike}
            handleDislike={handleDislike}
          />
        )}

        {isVisible &&
        currentStatusId !== 6 &&
        (user.id == data.clientQuery.ticket.initiator.id ||
          user.id == data.clientQuery.ticket.recipient.id ||
          user.id == data.clientQuery.ticket?.assistant?.id ||
          user.role == "system") &&
        (user.role === "helper"
          ? dataPerms?.helperQuery?.helperPerms?.sendMsg &&
            currentStatusId !== 1
          : currentStatusId === 1 ||
            currentStatusId === 5 ||
            (currentStatusId === 7 &&
              user.id === data?.clientQuery?.ticket.assistant?.id)) ? (
          <div className="chat-input__container">
            <Form className="chat-input__form1 container" onSubmit={sendMsg}>
              <Row className="chat-input__row">
                <Col className="chat-input__row">
                  <Form.Group className="custom-editor">
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={handleEditorChange}
                      stripPastedStyles
                      toolbarStyle={{
                        border: "1px solid #dee2e6",
                        borderRadius: "6px 6px 0 0",
                      }}
                      editorStyle={{
                        border: "1px solid #dee2e6",
                        borderRadius: "0 0 6px 6px",
                        padding: "10px",
                        height: "150px",
                      }}
                      placeholder={get_translation("INTERFACE_ENTER_MSG")}
                      toolbar={{
                        options: [
                          "inline",
                          "list",
                          "emoji",
                          "remove",
                          "history",
                        ],
                        inline: {
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                          ],
                        },
                        list: {
                          options: ["unordered", "ordered"],
                        },
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
                        {index > 0 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => handleRemoveFileInput(index)}
                          >
                            {get_translation("INTERFACE_DELETE")}
                          </Button>
                        )}
                      </Form.Group>
                    ))}

                    <Button
                      variant="outline-primary"
                      id="AddFileButton"
                      onClick={handleAddFileInput}
                    >
                      {get_translation("INTERFACE_ADD_FILE")}
                    </Button>
                  </div>

                  {isVisibleError && (
                    <span className="form__error">{errorMsg()}</span>
                  )}
                  {isAdmin() && currentStatusId !== 4 && (
                    <ToggleButtonGroup
                      type="radio"
                      name="options"
                      defaultValue={1}
                      value={selectedValue}
                      onChange={handleToggleChange}
                    >
                      <ToggleButton id="tbg-radio-1" value={1}>
                        {get_translation("INTERFACE_DENY_WRITE")}
                      </ToggleButton>
                      <ToggleButton id="tbg-radio-2" value={2}>
                        {get_translation("INTERFACE_ACCESS_WRITE")}
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                  <div
                    className={
                      currentStatusId == 3 || currentStatusId == 5
                        ? "chat-input__button-row chat-input__button-row-gap"
                        : "chat-input__button-row"
                    }
                  >
                    <ButtonCustom
                      title={get_translation("INTERFACE_SEND")}
                      className="chat-input__button-send button-hover single"
                      type="submit"
                      onClick={handleSubmit}
                    />
                    {isAdmin() &&
                      (currentStatusId == 3 || currentStatusId == 5) &&
                      dataPerms.helperQuery.helperPerms.sendMsg && (
                        <ButtonCustom
                          title={get_translation("INTERFACE_CLOSE_TICKET")}
                          type="button"
                          className="chat-input__button-close button-outlined"
                          onClick={handleShowWarning}
                        />
                      )}
                  </div>
                  {isAdmin() &&
                    currentStatusId == 1 &&
                    dataPerms.helperQuery.helperPerms.sendMsg && (
                      <>
                        <div className="chat-input__button-row">
                          <ButtonCustom
                            title={get_translation("INTERFACE_START_WORK")}
                            className="chat-input__button-send button-hover single"
                            onClick={handleInProgress}
                          />
                        </div>
                      </>
                    )}
                </Col>
              </Row>
            </Form>
          </div>
        ) : (
          <div className="chat-input__container">
            <Form className="chat-input__form" onSubmit={sendMsg}>
              <Row className="chat-input__row">
                <div
                  className={
                    currentStatusId == 3
                      ? "chat-input__button-row chat-input__button-row-gap"
                      : "chat-input__button-row"
                  }
                >
                  {isAdmin() &&
                    (currentStatusId == 3 || currentStatusId == 5) &&
                    dataPerms.helperQuery.helperPerms.sendMsg && (
                      <ButtonCustom
                        title={get_translation("INTERFACE_CLOSE_TICKET")}
                        type="button"
                        className="chat-input__button-close button-outlined"
                        onClick={handleShowWarning}
                      />
                    )}
                </div>
                {isAdmin() &&
                  currentStatusId == 1 &&
                  dataPerms.helperQuery.helperPerms.sendMsg && (
                    <>
                      <div className="chat-input__button-row">
                        <ButtonCustom
                          title={get_translation("INTERFACE_START_WORK")}
                          className="chat-input__button-send button-hover single"
                          onClick={handleInProgress}
                        />
                      </div>
                    </>
                  )}
              </Row>
            </Form>
          </div>
        )}

        <MessageList
          messagesQuery={messagesQuery}
          userId={user.id}
          currentStatus={currentStatusId}
          handleRefetch={handleRefetch}
        />

        <Counter
          currentStatus={currentStatusId}
          messagesQuery={messagesQuery}
          data={data}
        />
      </div>

      {isAdmin() && (
        <Logs currentStatus={currentStatusId} logs={dataLogQuery} />
      )}

      <ModalDialog
        show={showSplitModal}
        onClose={handleCloseModal}
        modalTitle={get_translation("INTERFACE_TICKET_SPLITED")}
        modalBody={get_translation("INTERFACE_TICKET_SPLITED_FULL")}
      />

      <ModalDialog
        show={showWarning}
        onClose={handleCloseWarning}
        onConfirm={handleClose}
        modalTitle={get_translation("INTERFACE_WARNING")}
        modalBody={get_translation("INTERFACE_WARNING_CLOSE_TICKET")}
        warning={true}
      />

      <ModalDialog
        show={showEdit}
        onClose={handleCloseModal}
        modalTitle={get_translation("INTERFACE_TICKET_CHANGED")}
        modalBody={get_translation("INTERFACE_TICKET_CHANGED_FULL")}
      />

      <ModalDialog
        show={showCuratorChat}
        onClose={handleCloseModal}
        modalTitle={get_translation("INTERFACE_ADD_CURATOR_DIALOG")}
        modalBody={get_translation("INTERFACE_ADD_CURATOR_DIALOG_FULL")}
      />

      <ModalDialog
        show={showMentor}
        onClose={handleCloseModal}
        modalTitle={get_translation("INTERFACE_ADD_MENTOR_DIALOG")}
        modalBody={get_translation("INTERFACE_ADD_MENTOR_DIALOG_FULL")}
      />

      <ModalDialog
        show={showEditTicketError}
        onClose={handleHideEditTicketError}
        modalTitle={get_translation("INTERFACE_ERROR_EDIT_TICKET")}
        modalBody={get_translation("INTERFACE_ERROR_EDIT_TICKET_FULL")}
      />

      <ModalDialog
        show={showMsg}
        onClose={handleCloseMsg}
        modalTitle={get_translation("INTERFACE_MSG_SEND")}
        modalBody={get_translation("INTERFACE_MSG_SEND")}
      />
    </>
  );
}

export default Chat;
