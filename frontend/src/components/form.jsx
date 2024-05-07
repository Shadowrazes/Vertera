import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import { useMutation } from "@apollo/client";

import { ADD_TICKET } from "../apollo/mutations";

import { Editor } from "react-draft-wysiwyg";
import TitleH2 from "./title";
import ThemeDropdowns from "./theme-dropdowns";
import TextEditor from "./text-editor";
import FileInput from "./file-input";
import ButtonCustom from "./button";

import "../css/form.css";

import get_translation from "../helpers/translation";

function FormComponent() {
  const [textareaValue, setTextareaValue] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const [ticketTitleValue, setTicketTitleValue] = useState("");

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [uploadedFilesList, setUploadedFilesList] = useState([]);

  const [error, setError] = useState(null);

  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [show, setShow] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const isBuild = import.meta.env.DEV !== "build";

  const isAdmin = () => {
    return user?.role === "helper" || user?.role === "system";
  };

  let userId = user ? user.id : 999;

  useEffect(() => {
    if (isAdmin()) {
      document.location.href = "/all-tickets";
    }
  }, []);

  const [addTicket] = useMutation(ADD_TICKET);

  if ((user?.role && user?.role === "helper") || user?.role === "system") {
    // console.log(132);
    return <></>;
  }

  const handleUnitIdChange = (unit) => {
    setSelectedUnitId(unit);
  };

  const handleThemeIdChange = (theme) => {
    setSelectedThemeId(theme);
  };

  const handleSubThemeIdChange = (subTheme) => {
    setSelectedSubThemeId(subTheme);
  };

  const handleIsVisibleChange = (isVisible) => {
    setIsVisible(isVisible);
  };

  const handleError = (error) => {
    setError(error);
  };

  const handleFileUploadResult = (filePaths) => {
    setUploadedFilesList(filePaths);
  };

  const handleIsFilesSizeExceeded = (isFilesSizeExceeded) => {
    setIsFilesSizeExceeded(isFilesSizeExceeded);
  };

  const handleIsFilesLimitExceeded = (isFilesLimitExceeded) => {
    setIsFilesLimitExceeded(isFilesLimitExceeded);
  };

  const handleGetEditorContent = (content) => {
    setEditorContent(content);
  };

  const handleTicketTitleChange = (e) => {
    setTicketTitleValue(e.target.value);
    setIsVisible(false);
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
    } else if (ticketTitleValue.trim() == "") {
      error = get_translation("INTERFACE_DESCRIBE_TITLE");
    } else if (
      editorContent == "" ||
      editorContent == "<p></p>" ||
      editorContent === "<p></p>\n"
    ) {
      error = get_translation("INTERFACE_DESCRIBE_SITUATION");
    }

    return error;
  };

  const addTicketWithFiles = () => {
    // uploadFiles()
    //   .then((filePaths) => {
    //     addTicket({
    //       variables: {
    //         token: user.token,
    //         title: ticketTitleValue,
    //         initiatorId: userId,
    //         unitId: selectedUnitId,
    //         themeId: selectedThemeId,
    //         subThemeId: selectedSubThemeId,
    //         senderId: userId,
    //         recieverId: 1,
    //         ticketId: 1,
    //         text: textareaValue,
    //         attachPaths: filePaths,
    //         notification: false,
    //       },
    //     }).then((data) => {
    //       // console.log(data.data.addTicket);
    //       setIsVisible(false);
    //       handleShow();
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Ошибка при загрузке файлов:", error);
    //   });
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

    console.log(editorContent);

    if (
      selectedUnitId == null ||
      selectedThemeId == null ||
      selectedSubThemeId == null ||
      ticketTitleValue.trim() == "" ||
      editorContent === "" ||
      editorContent === "<p></p>" ||
      editorContent === "<p></p>\n"
    ) {
      console.log(1);
      setIsVisible(true);
      return;
    }

    setIsVisible(false);

    addTicketWithFiles();
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

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
        {user?.id == 999 ||
        error.networkError.message ==
          "Response not successful: Received status code 500" ? (
          <>
            <div className="auth">
              <h2>{get_translation("INTERFACE_MUST_AUTH")}</h2>
              <a href="https://id.boss.vertera.org/?service=TICKET_SYSTEM&return=https%3A%2F%2Fhelp.vertera.org%2F">
                <ButtonCustom
                  title={get_translation("INTERFACE_PARTNER_AUTH")}
                  className={"button-hover"}
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

  return (
    <>
      <TitleH2
        title={get_translation("INTERFACE_CREATE_TICKET")}
        className="title__heading"
      />
      <Form method="post">
        <Row className="form__row">
          <ThemeDropdowns
            onUnitIdChange={handleUnitIdChange}
            onThemeIdChange={handleThemeIdChange}
            onSubThemeIdChange={handleSubThemeIdChange}
            isVisibleChange={handleIsVisibleChange}
            onError={handleError}
          />

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

            <TextEditor onGetEditorContent={handleGetEditorContent} />

            <FileInput
              onFileUploadResult={handleFileUploadResult}
              onFilesSizeExceeded={handleIsFilesSizeExceeded}
              onFilesLimitExceeded={handleIsFilesLimitExceeded}
            />

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
          <p>
            Ваше обращение принято в обработку, пожалуйста, ожидайте ответа
            (срок обработки заявки до 24 часов)
          </p>
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
