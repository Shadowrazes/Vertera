import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  DropdownButton,
  Dropdown,
  Modal,
} from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import { useQuery, useMutation } from "@apollo/client";

import { THEME_LIST } from "../apollo/queries";
import { ADD_TICKET } from "../apollo/mutations";

import { Editor } from "react-draft-wysiwyg";
import Loader from "../pages/loading";
import TitleH2 from "./title";

import "../css/form.css";
import "/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function FormComponent() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");

  const [ticketTitleValue, setTicketTitleValue] = useState("");

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const [show, setShow] = useState(false);

  const [newTicketLink, setNewTicketLink] = useState(null);

  const [isCopy, setIsCopy] = useState(false);

  //const [popupTicketLink, setpopupTicketLink] = useState(null);
  //const [popupUserID, setPopupUserID] = useState(null);

  let popupTicketLink = null;
  let popupUserID = null;

  const [isVisible, setIsVisible] = useState(false);

  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [dataQuery, setData] = useState([]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isBuild = import.meta.env.DEV !== "build";

  const { loading, error, data } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
    },
  });

  let userId = user ? user.id : 999;

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }
  }, [data]);

  const [addTicket] = useMutation(ADD_TICKET);

  async function uploadFiles() {
    const fileInput = document.getElementById("FileInputForm");
    let filePaths = [];

    if (fileInput.files.length > 0) {
      let formdata = new FormData();
      let filesValid = true;

      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if ((user.role && user.role === "helper") || user.role === "system") {
    // console.log(132);
    return <></>;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);
    // console.log(unitId);

    if (unit !== selectedUnit) {
      setSelectedTheme(null);
      setSelectedSubTheme(null);
      setSubThemeDropdownVisible(true);
      setIsVisible(false);
    }
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);
    // console.log(themeId);

    if (theme !== selectedTheme) {
      setSelectedSubTheme(null);
      setSubThemeDropdownVisible(true);
      setIsVisible(false);

      switch ((selectedUnitId, themeId)) {
        case (1, 14):
          setSelectedSubThemeId(73);
          setSubThemeDropdownVisible(false);
          break;
        case (2, 15):
          setSelectedSubThemeId(74);
          setSubThemeDropdownVisible(false);
          break;
        case (2, 16):
          setSelectedSubThemeId(75);
          setSubThemeDropdownVisible(false);
          break;
        case (2, 22):
          setSelectedSubThemeId(102);
          setSubThemeDropdownVisible(false);
          break;
        case (2, 23):
          setSelectedSubThemeId(103);
          setSubThemeDropdownVisible(false);
          break;
        default:
      }
    }
  };

  const handleSubThemeClick = (subTheme, subThemeId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);
    // console.log(subThemeId);

    setIsVisible(false);
  };

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);

    setTextareaValue(draftToHtml(rawContent));

    console.log(draftToHtml(rawContent));
    return draftToHtml(rawContent);
  };

  const handleTicketTitleChange = (e) => {
    setTicketTitleValue(e.target.value);
  };

  const errorMsg = () => {
    let error = "";

    if (isFilesSizeExceeded) {
      error = "Максимальный размер файла - 10 Мб";
    } else if (isFilesLimitExceeded) {
      error = "Вы можете загружать до 5 файлов";
    } else if (selectedUnitId == null) {
      error = "Выберите подразделение";
    } else if (selectedThemeId == null) {
      error = "Выберите тип обращения";
    } else if (selectedSubThemeId == null) {
      error = "Выберите подтему";
    } else if (textareaValue.trim() == "<p></p>") {
      error = "Опишите ситуацию";
    } else if (ticketTitleValue.trim() == "") {
      error = "Укажите тему вышей проблемы";
    }

    return error;
  };

  const addTicketWithFiles = () => {
    uploadFiles()
      .then((filePaths) => {
        addTicket({
          variables: {
            token: user.token,
            title: ticketTitleValue,
            clientId: userId,
            unitId: selectedUnitId,
            themeId: selectedThemeId,
            subThemeId: selectedSubThemeId,
            senderId: userId,
            recieverId: 1,
            ticketId: 1,
            text: getContent(),
            attachPaths: filePaths,
          },
        }).then((data) => {
          console.log(data.data.addTicket);
          popupTicketLink = data.data.clientMutation.addTicket.link;
          popupUserID = data.data.clientMutation.addTicket.clientId;
          //setpopupTicketLink(data.data.addTicket.id);
          //setPopupUserID(data.data.addTicket.clientId);
          setIsVisible(false);
          handleShow();
          //resetState();
        });
      })
      .catch((error) => {
        console.error("Ошибка при загрузке файлов:", error);
      });
  };

  const handleNewTicket = (e) => {
    e.preventDefault();
    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(selectedTheme);
    // console.log(selectedThemeId);
    // console.log(selectedSubTheme);
    // console.log(selectedSubThemeId);
    // console.log(textareaValue);

    if (
      selectedUnitId == null ||
      selectedThemeId == null ||
      selectedSubThemeId == null ||
      ticketTitleValue.trim() == "" ||
      textareaValue.trim() == "<p></p>"
    ) {
      // console.log("xdd");
      setIsVisible(true);
      return;
    }

    // if (user === null) {
    //   if (patronymicValue.trim() == "") {
    //     addClientUser({
    //       variables: {
    //         name: nameValue.trim(),
    //         surname: surnameValue.trim(),
    //         login: emailValue.split("@")[0],
    //         password: "crown12345",
    //         phone: "+79991112233",
    //         email: emailValue.trim(),
    //       },
    //     }).then((newUserId) => {
    //       // console.log(newUserId);
    //       userId = newUserId.data.addClientUser;
    //       addTicketWithFiles();
    //     });
    //   } else {
    //     addClientUser({
    //       variables: {
    //         name: nameValue.trim(),
    //         surname: surnameValue.trim(),
    //         patronymic: patronymicValue.trim(),
    //         login: emailValue.split("@")[0],
    //         password: "crown12345",
    //         phone: "+79991112233",
    //         email: emailValue.trim(),
    //       },
    //     }).then((newUserId) => {
    //       // console.log(newUserId);
    //       userId = newUserId.data.addClientUser;
    //       addTicketWithFiles();
    //     });
    //   }
    // } else {
    //   userId = user.id;
    //
    // }

    addTicketWithFiles();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    let isFileSizeExceeded = false;

    if (files.length > 5) {
      e.target.value = null;
      setIsVisible(true);
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
      setIsVisible(true);
      setIsFilesSizeExceeded(true);
      console.log("Размер файла не должен превышать 10 МБ");
      return;
    }

    setIsFilesLimitExceeded(false);
    setIsVisible(false);
  };

  const handleShow = () => {
    setNewTicketLink(popupTicketLink);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newTicketLink);
    setIsCopy(true);
  };

  return (
    <>
      <TitleH2 title="Создать обращение" className="title__heading" />
      <Form method="post">
        <Row className="form__row">
          <Col className="form__column">
            <DropdownButton
              id="dropdown-custom-1"
              title={selectedItem || "Выберите подразделение"}
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

            {selectedUnit && (
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedTheme || "Тип обращения"}
              >
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
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

            {isSubThemeDropdownVisible && selectedTheme && (
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedSubTheme || "Подтема"}
              >
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
                  ?.themes.find((theme) => theme.name.stroke === selectedTheme)
                  ?.subThemes.map((subTheme) => (
                    <Dropdown.Item
                      key={subTheme.id}
                      onClick={() =>
                        handleSubThemeClick(subTheme.name.stroke, subTheme.id)
                      }
                      href="#"
                    >
                      {subTheme.name.stroke}
                    </Dropdown.Item>
                  ))}
              </DropdownButton>
            )}
          </Col>

          <Col className="form__column">
            {/* {!user && (
              <>
                <Form.Group controlId="NameForm">
                  <Form.Control
                    type="text"
                    placeholder="Ваше имя"
                    className="form__input"
                    value={nameValue}
                    onChange={handleNameChange}
                  />
                </Form.Group>
                <Form.Group controlId="SurnameForm">
                  <Form.Control
                    type="text"
                    placeholder="Ваша фамилия"
                    className="form__input"
                    value={surnameValue}
                    onChange={handleSurnameChange}
                  />
                </Form.Group>
                <Form.Group controlId="panronymicForm">
                  <Form.Control
                    type="text"
                    placeholder="Ваше отчество (при наличии)"
                    className="form__input"
                    value={patronymicValue}
                    onChange={handlePatronymicChange}
                  />
                </Form.Group>
              </>
            )} */}
            {/* {!user && (
              <Form.Group controlId="EmailForm">
                <Form.Control
                  type="email"
                  placeholder="Ваш email"
                  className="form__input"
                  value={emailValue}
                  onChange={handleEmailChange}
                />
              </Form.Group>
            )} */}
            <Form.Group controlId="TicketThemeForm">
              <Form.Control
                type="text"
                placeholder="Тема обращения"
                className="form__input"
                value={ticketTitleValue}
                onChange={handleTicketTitleChange}
              />
            </Form.Group>
            {/* <Form.Group controlId="TextareaForm">
              <Form.Control
                as="textarea"
                placeholder="Текст обращения"
                rows={3}
                value={textareaValue}
                onChange={handleTextareaChange}
              />
            </Form.Group> */}
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
            />
            <Form.Group className="mb-3" controlId="FileInputForm">
              <Form.Control
                type="file"
                multiple
                accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                onChange={handleFileChange}
              />
            </Form.Group>
            {isVisible && <span className="form__error">{errorMsg()}</span>}
            <Button
              variant="primary"
              id="ButtonForm"
              type="submit"
              onClick={handleNewTicket}
            >
              Отправить обращение
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Ваше обращение создано</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ваше обращение в техподдержку VERTERA принято в обработку. В
            ближайшее время вы получите ответ.
          </p>
          <p>
            Отслеживать статус обращения вы можете{" "}
            <a href={newTicketLink}>по ссылке:</a>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCopy}>
            {!isCopy ? "Скопировать ссылку" : "Ссылка скопирована"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FormComponent;
