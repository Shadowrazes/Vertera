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
import ButtonCustom from "../components/button";

import "../css/form.css";

import get_translation from "../helpers/translation";

function FormComponent() {
  const [dataQuery, setData] = useState([]);

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

  const [isVisible, setIsVisible] = useState(false);

  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isBuild = import.meta.env.DEV !== "build";

  const isAdmin = () => {
    return user?.role === "helper" || user?.role === "system";
  };

  let userId = user ? user.id : 999;

  const [fileInputs, setFileInputs] = useState([
    {
      fileInput: true,
    },
  ]);

  const { loading, error, data } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
    },
  });

  useEffect(() => {
    if (isAdmin()) {
      document.location.href = "/all-tickets";
    }

    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }
  }, [data]);

  const [addTicket] = useMutation(ADD_TICKET);

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    // console.error("GraphQL Error:", error);
    const networkError = error.networkError;

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        }
      }
    }

    return (
      <>
        {userId == 999 ||
        error.networkError.message ==
          "Response not successful: Received status code 500" ? (
          <>
            <div className="auth">
              <h2>{get_translation("INTERFACE_MUST_AUTH")}</h2>
              <a href="https://id.boss.vertera.org/?service=TICKET_SYSTEM&return=https%3A%2F%2Fhelp.vertera.org%2F">
                <ButtonCustom
                  title={get_translation("INTERFACE_PARTNER_AUTH")}
                />
              </a>
            </div>
          </>
        ) : (
          <h2>{get_translation("INTERFACE_ERROR")}</h2>
        )}
      </>
    );
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
      error = get_translation("INTERFACE_ERROR_MAX_FILE_SIZE");
    } else if (isFilesLimitExceeded) {
      error = get_translation("INTERFACE_ERROR_FILES_LIMIT");
    } else if (selectedUnitId == null) {
      error = get_translation("INTERFACE_SELECT_UNIT");
    } else if (selectedThemeId == null) {
      error = get_translation("INTERFACE_SELECT_THEME");
    } else if (selectedSubThemeId == null) {
      error = get_translation("INTERFACE_SELECT_SUBTHEME");
    } else if (textareaValue.trim() == "<p></p>") {
      error = get_translation("INTERFACE_DESCRIBE_SITUATION");
    } else if (ticketTitleValue.trim() == "") {
      error = get_translation("INTERFACE_DESCRIBE_TITLE");
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
            initiatorId: userId,
            unitId: selectedUnitId,
            themeId: selectedThemeId,
            subThemeId: selectedSubThemeId,
            senderId: userId,
            recieverId: 1,
            ticketId: 1,
            text: getContent(),
            attachPaths: filePaths,
            notification: false,
          },
        }).then((data) => {
          // console.log(data.data.addTicket);
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
      getContent() == "<p></p>"
    ) {
      // console.log("xdd");
      setIsVisible(true);
      return;
    }

    addTicketWithFiles();
  };

  const handleAddFileInput = () => {
    if (fileInputs.length >= 5) {
      alert(get_translation("INTERFACE_ERROR_FILES_LIMIT"));
      return;
    }
    setFileInputs(
      fileInputs.concat([
        {
          fileInput: true,
          id: generateUniqueId(),
        },
      ])
    );
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleRemoveFileInput = (idToRemove) => {
    setFileInputs((prevFileInputs) =>
      prevFileInputs.filter((fileInput) => fileInput.id !== idToRemove)
    );
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    let isFileSizeExceeded = false;

    if (files.length > 5) {
      e.target.value = null;
      setIsVisible(true);
      setIsFilesLimitExceeded(true);
      console.log("Вы можете загрузить не более 5 файлов");
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
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  return (
    <>
      <TitleH2
        title={get_translation("INTERFACE_CREATE_TICKET")}
        className="title__heading"
      />
      <Form method="post">
        <Row className="form__row">
          <Col className="form__column">
            <DropdownButton
              id="dropdown-custom-1"
              title={selectedItem || get_translation("INTERFACE_SELECT_UNIT")}
            >
              {dataQuery.map(
                (unit, index) =>
                  unit.visibility !== 3 && (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleUnitClick(unit.name.stroke, unit.id)}
                      href="#"
                    >
                      {unit.name.stroke}
                    </Dropdown.Item>
                  )
              )}
            </DropdownButton>

            {selectedUnit && (
              <DropdownButton
                id="dropdown-custom-1"
                title={
                  selectedTheme || get_translation("INTERFACE_TYPE_APPEALS")
                }
              >
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
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

            {isSubThemeDropdownVisible && selectedTheme && (
              <DropdownButton
                id="dropdown-custom-1"
                title={
                  selectedSubTheme || get_translation("INTERFACE_SUBTHEME")
                }
              >
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
                  ?.themes.find((theme) => theme.name.stroke === selectedTheme)
                  ?.subThemes.map(
                    (subTheme) =>
                      subTheme.visibility !== 3 && (
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
                      )
                  )}
              </DropdownButton>
            )}
          </Col>

          <Col className="form__column">
            <Form.Group controlId="TicketTitleForm">
              <Form.Control
                type="text"
                placeholder={get_translation("INTERFACE_TICKET_TITLE")}
                className="form__input"
                value={ticketTitleValue}
                onChange={handleTicketTitleChange}
              />
            </Form.Group>
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
                  heigth: "250px",
                }}
                placeholder={get_translation("INTERFACE_ENTER_MSG")}
                toolbar={{
                  options: ["inline", "list", "emoji", "remove", "history"],
                  inline: {
                    options: ["bold", "italic", "underline", "strikethrough"],
                  },
                  list: {
                    options: ["unordered", "ordered"],
                  },
                }}
              />
            </Form.Group>
            <div className="file-inputs">
              {fileInputs.map((fileInput, index) => (
                <Form.Group className="mb-3 fileInputForm" key={fileInput.id}>
                  <Form.Control
                    type="file"
                    accept=".jpg, .jpeg, .png, .gif, .pdf, .txt, .rtf, .doc, .docx, .zip, .rar, .tar"
                    onChange={handleFileChange}
                  />
                  {index > 0 && (
                    <Button
                      variant="outline-danger"
                      onClick={() => handleRemoveFileInput(fileInput.id)}
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

            {isVisible && <span className="form__error">{errorMsg()}</span>}

            <Button
              variant="primary"
              id="ButtonForm"
              type="submit"
              onClick={handleNewTicket}
            >
              {get_translation("INTERFACE_SEND")}
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {get_translation("INTERFACE_MESSAGE_CREATION_TICKET")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{get_translation("INTERFACE_MESSAGE_CREATION_TICKET_FULL")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {get_translation("INTERFACE_CLOSE")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FormComponent;
