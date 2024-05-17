import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";

import { ADD_TICKET } from "../apollo/mutations";

import TitleH2 from "./title";
import ThemeDropdowns from "./theme-dropdowns";
import TextEditor from "./text-editor";
import ModalDialog from "./modal-dialog";
import ButtonCustom from "./button";

import "../css/form.css";

import get_translation from "../helpers/translation";

function FormComponent() {
  const [editorContent, setEditorContent] = useState("");

  const [ticketTitleValue, setTicketTitleValue] = useState("");

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [error, setError] = useState(null);

  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const modalTitle = get_translation("INTERFACE_MESSAGE_CREATION_TICKET");
  const modalBody =
    "Ваше обращение принято в обработку, пожалуйста, ожидайте ответа (срок обработки заявки до 24 часов)";

  const [isVisible, setIsVisible] = useState(false);

  const [fileInputs, setFileInputs] = useState([
    {
      fileInput: true,
    },
  ]);

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
            text: editorContent,
            attachPaths: filePaths,
            notification: false,
          },
        }).then((data) => {
          // console.log(data.data.addTicket);
          setIsVisible(false);
          handleShowModal();
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
      editorContent === "" ||
      editorContent === "<p></p>" ||
      editorContent === "<p></p>\n"
    ) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);

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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

      <ModalDialog
        show={showModal}
        onClose={handleCloseModal}
        modalTitle={modalTitle}
        modalBody={modalBody}
      />
    </>
  );
}

export default FormComponent;
