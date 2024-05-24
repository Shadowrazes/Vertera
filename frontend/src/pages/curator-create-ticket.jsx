import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";

import { CURATORS_LIST, HELPER_PERMS } from "../apollo/queries";
import { ADD_TICKET, CURATOR_ADD_TICKET } from "../apollo/mutations";

import Loader from "../pages/loading";
import TitleH2 from "../components/title";
import ThemeDropdowns from "../components/theme-dropdowns";
import TextEditor from "../components/text-editor";
import ButtonCustom from "../components/button";
import NotFoundPage from "./not-found-page";

import "../css/form.css";
import "../css/curator-create-ticket.css";

import get_translation from "../helpers/translation";

function CuratorCreateTicket() {
  const [dataQueryCurators, setDataQueryCurators] = useState([]);

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [selectedCurators, setSelectedCurators] = useState([]);
  const [selectedCuratorsId, setSelectedCuratorsId] = useState([]);
  const [idInputs, setIdInputs] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const [isNotificaton, setIsNotification] = useState(false);
  const [isOuterids, setIsOuterIds] = useState(false);

  const [ticketTitleValue, setTicketTitleValue] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);
  const [isCuratorsDropdownVisible, setIsCuratorsDropdownVisible] =
    useState(false);
  const [isIdFileInputVisible, setIsIdFileInputVisible] = useState(false);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [isShowInfo, setIsShowInfo] = useState(false);

  const [successfulImports, setSuccessfulImports] = useState(null);
  const [failedImports, setFailedImports] = useState(null);

  const [failedQueryImports, setFailedQueryImports] = useState(null);

  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const isBuild = import.meta.env.DEV !== "build";

  const { data: dataPerms } = useQuery(HELPER_PERMS, {
    variables: {
      token: user?.token,
      id: user?.id,
    },
  });

  const isAdmin = () => {
    return (
      (user?.role === "helper" &&
        dataPerms?.helperQuery?.helperPerms?.sendMsg) ||
      user?.role === "system"
    );
  };

  const [fileInputs, setFileInputs] = useState([
    {
      fileInput: true,
    },
  ]);

  const {
    loading: loadingCuratorsList,
    error: errorCuratorsList,
    data: dataCurators,
  } = useQuery(CURATORS_LIST, {
    variables: {
      token: user?.token,
    },
  });

  useEffect(() => {
    if (dataCurators && dataCurators.helperQuery.helperList) {
      setDataQueryCurators(dataCurators.helperQuery.helperList);
    }
  }, [dataCurators]);

  const [addTicket] = useMutation(ADD_TICKET);
  const [curatorAddTicket] = useMutation(CURATOR_ADD_TICKET);

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

  if (loadingCuratorsList) {
    return <Loader />;
  }

  if (errorCuratorsList) {
    // console.error("GraphQL Error:", error);
    const networkError = errorCuratorsList.networkError;

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
        <h2>{get_translation("INTERFACE_ERROR")}</h2>
      </>
    );
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

    setIsVisible(false);
  };

  const handleCuratorsOnChange = (curators) => {
    setSelectedCurators(curators);
    setSelectedCuratorsId(curators.map((curator) => curator.id));
  };

  const handleCuratorsDropdown = () => {
    setIsButtonsVisible(false);
    setIsCuratorsDropdownVisible(true);
  };

  const handleIdFileInput = () => {
    setIsButtonsVisible(false);
    setIsIdFileInputVisible(true);
  };

  const handleCloseClick = () => {
    setIsButtonsVisible(true);
    setIsCuratorsDropdownVisible(false);
    setIsIdFileInputVisible(false);
    setIsShowSpinner(false);
    setIsShowInfo(false);
    setSuccessfulImports(null);
    setFailedImports(null);

    setSelectedCurators([]);
    setSelectedCuratorsId([]);
    setIsOuterIds(false);
    setIdInputs([]);
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
    } else if (
      editorContent == "<p></p>" ||
      editorContent == "<p></p>\n" ||
      editorContent == ""
    ) {
      error = get_translation("INTERFACE_DESCRIBE_SITUATION");
    } else if (ticketTitleValue.trim() == "") {
      error = get_translation("INTERFACE_DESCRIBE_TITLE");
    } else if (successfulImports === null && failedImports === null) {
      error = get_translation("INTERFACE_ERROR_TICKET_CREATION");
    }

    return error;
  };

  const addTicketWithFiles = () => {
    if (selectedCuratorsId.length !== 0) {
      uploadFiles()
        .then((filePaths) => {
          curatorAddTicket({
            variables: {
              token: user.token,
              title: ticketTitleValue,
              initiatorId: user.id,
              unitId: selectedUnitId,
              themeId: selectedThemeId,
              subThemeId: selectedSubThemeId,
              senderId: user.id,
              recieverId: 1,
              ticketId: 1,
              text: editorContent,
              attachPaths: filePaths,
              notification: isNotificaton,
              idsOuter: isOuterids,
              ids: selectedCuratorsId,
            },
          })
            .then((data) => {
              setIsVisible(false);
              handleShowSuccess();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("Ошибка при загрузке файлов:", error);
        });
    } else if (successfulImports > 0) {
      uploadFiles()
        .then((filePaths) => {
          curatorAddTicket({
            variables: {
              token: user.token,
              title: ticketTitleValue,
              initiatorId: user.id,
              unitId: selectedUnitId,
              themeId: selectedThemeId,
              subThemeId: selectedSubThemeId,
              senderId: user.id,
              recieverId: 1,
              ticketId: 1,
              text: editorContent,
              attachPaths: filePaths,
              notification: isNotificaton,
              idsOuter: isOuterids,
              ids: idInputs,
            },
          })
            .then((data) => {
              // console.log(idInputs);
              // console.log(failedQueryImports);
              setFailedQueryImports(data.data.helperMutation.addTicketMass);

              if (data.data.helperMutation.addTicketMass.length !== 0) {
                handleShowError();
              } else {
                handleShowSuccess();
              }

              setIsVisible(false);
              // handleShow();
            })
            .catch((error) => {
              console.log(error);
              handleShowError();
            });
        })
        .catch((error) => {
          console.error("Ошибка при загрузке файлов:", error);
        });
    } else if (selectedCuratorsId.length == 0 && idInputs.length == 0) {
      uploadFiles()
        .then((filePaths) => {
          addTicket({
            variables: {
              token: user.token,
              title: ticketTitleValue,
              initiatorId: user.id,
              unitId: selectedUnitId,
              themeId: selectedThemeId,
              subThemeId: selectedSubThemeId,
              senderId: user.id,
              recieverId: 1,
              ticketId: 1,
              text: editorContent,
              attachPaths: filePaths,
              notification: isNotificaton,
            },
          }).then((data) => {
            console.log(data.data.addTicket);
            setIsVisible(false);
            handleShowSuccess();
          });
        })
        .catch((error) => {
          console.error("Ошибка при загрузке файлов:", error);
        });
    }
  };

  const handleNewTicket = (e) => {
    e.preventDefault();
    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(selectedTheme);
    // console.log(selectedThemeId);
    // console.log(selectedSubTheme);
    // console.log(selectedSubThemeId);
    // console.log(getContent());
    // console.log(getContent());
    // console.log(isNotificaton);
    // console.log(selectedCuratorsId);
    // console.log(idInputs);

    if (
      selectedUnitId == null ||
      selectedThemeId == null ||
      selectedSubThemeId == null ||
      ticketTitleValue.trim() == "" ||
      editorContent == "<p></p>" ||
      editorContent == "<p></p>\n" ||
      editorContent == ""
    ) {
      setIsVisible(true);
      return;
    }

    if (isIdFileInputVisible) {
      if (successfulImports === null && failedImports === null) {
        setIsVisible(true);
        return;
      }
    }

    addTicketWithFiles();
  };

  const handleToggleChange = (value) => {
    setSelectedValue(value);

    if (value === 1) {
      setIsNotification(false);
    } else if (value === 2) {
      setIsNotification(true);
    }
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

  const handleIdFileInputOnChange = (e) => {
    const file = e.target.files;

    let isFileSizeExceeded = false;

    const fileSizeInMB = file.size / (1024 * 1024);
    const maxFileSize = 10;

    if (fileSizeInMB > maxFileSize) {
      isFileSizeExceeded = true;
    }

    if (isFileSizeExceeded) {
      e.target.value = null;
      setIsFilesSizeExceeded(true);
      console.log("Размер файла не должен превышать 10 МБ");
      alert(get_translation("INTERFACE_ERROR_FILE_SIZE_EXEEDED"));
      return;
    }

    showSpinner();

    const idFileInput = document.querySelector(".idFileInput");

    if (idFileInput) {
      const file = idFileInput.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        const contents = event.target.result;
        const result = contents.split(/\s+/);

        setSuccessfulImports(
          result.filter((item) => item !== "" && !isNaN(item)).length
        );
        setFailedImports(result.filter((item) => isNaN(item)).length);

        if (
          result.filter((item) => item !== "" && !isNaN(item)).length === 0 &&
          result.filter((item) => isNaN(item)).length === 0
        ) {
          setSuccessfulImports(null);
          setFailedImports(null);
        }

        setIdInputs(
          result.filter((item) => !isNaN(item)).map((item) => parseInt(item))
        );

        // console.log(
        //   result.filter((item) => !isNaN(item)).map((item) => parseInt(item))
        // );

        if (result.filter((item) => !isNaN(item)).length !== null) {
          setIsOuterIds(true);
        }
      };
      reader.readAsText(file);
    }

    setTimeout(hideSpinner, 1000);

    setIsFilesLimitExceeded(false);
  };

  const showSpinner = () => {
    setIsShowSpinner(true);
  };

  const hideSpinner = () => {
    setIsShowSpinner(false);
    setIsShowInfo(true);
  };

  const handleShowSuccess = () => {
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.reload();
  };

  const handleShowError = () => {
    setShowError(true);
  };

  const handleCloseError = () => {
    setShowError(false);
    window.location.reload();
  };

  const newCuratorList = dataQueryCurators
    .filter((curator) => curator.user.isActive && curator.permissions.sendMsg)
    .map((curator) => ({
      name: `${curator.user.surname} ${curator.user.name} ${
        curator.user.patronymic ? ` ${curator.user.patronymic}` : ""
      }`,
      id: curator.id,
    }));

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2
            title={get_translation("INTERFACE_CREATE_TICKET")}
            className="title__heading"
          />
          <Form className="curator-create-ticket__container" method="post">
            <Row className="form__row">
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

                <ThemeDropdowns
                  onUnitIdChange={handleUnitIdChange}
                  onThemeIdChange={handleThemeIdChange}
                  onSubThemeIdChange={handleSubThemeIdChange}
                  isVisibleChange={handleIsVisibleChange}
                  onError={handleError}
                />
                <div className="curator-create-ticket__reciever-label">
                  {(isCuratorsDropdownVisible || isIdFileInputVisible) && (
                    <a onClick={handleCloseClick}>
                      <div className="chat__edit-close"></div>
                    </a>
                  )}
                  <Form.Label className="edit-curator__field-label">
                    {get_translation("INTERFACE_RECEPIENTS")}
                  </Form.Label>
                </div>
                {isButtonsVisible && (
                  <div className="chat__helper-buttons">
                    <ButtonCustom
                      title={get_translation("INTERFACE_SELECT_CURATOR")}
                      className="chat-input__button-close button-hover"
                      onClick={handleCuratorsDropdown}
                    />
                    <ButtonCustom
                      title={get_translation("INTERFACE_INPUT_LIST")}
                      className="chat-input__button-close button-hover"
                      onClick={handleIdFileInput}
                    />
                  </div>
                )}
                {isCuratorsDropdownVisible && (
                  <>
                    <MultiSelect
                      value={selectedCurators}
                      onChange={(e) => handleCuratorsOnChange(e.value)}
                      options={newCuratorList}
                      optionLabel="name"
                      className="add-curator__multiselect"
                      placeholder={get_translation("INTERFACE_CURATOR")}
                      emptyMessage={get_translation("INTERFACE_EMPTY_SELECT")}
                      filter
                    />
                  </>
                )}
                {isIdFileInputVisible && (
                  <>
                    <Form.Group className="mb-3 fileIdInput">
                      <Form.Control
                        type="file"
                        accept=".txt"
                        onChange={handleIdFileInputOnChange}
                        className="idFileInput"
                      />
                    </Form.Group>
                    {isShowSpinner && <Spinner animation="border" />}
                    {isShowInfo && (
                      <>
                        {failedImports == 0 && (
                          <Alert
                            variant="success"
                            className="curator-create-ticket__alert"
                          >
                            {get_translation("INTERFACE_SUCCESSFUL_IMPORT")}{" "}
                            <br /> <br />
                            {get_translation("INTERFACE_IMPORTED")}{" "}
                            {successfulImports}
                          </Alert>
                        )}

                        {failedImports > 0 && (
                          <Alert
                            variant="warning"
                            className="curator-create-ticket__alert"
                          >
                            {get_translation(
                              "INTERFACE_PARTLY_SUCCESSFUL_IMPORT"
                            )}{" "}
                            <br /> <br />
                            {get_translation("INTERFACE_IMPORTED")}{" "}
                            {successfulImports} <br />
                            {get_translation("INTERFACE_FAILED_IMPORT")}{" "}
                            {failedImports}
                          </Alert>
                        )}

                        {successfulImports === null &&
                          failedImports === null && (
                            <Alert
                              variant="danger"
                              className="curator-create-ticket__alert"
                            >
                              {get_translation("INTERFACE_EMPTY_FILE")}
                            </Alert>
                          )}
                      </>
                    )}
                  </>
                )}
              </Col>

              <Col className="form__column">
                <Form.Group className="custom-editor">
                  <TextEditor onGetEditorContent={handleGetEditorContent} />
                </Form.Group>
                <div className="file-inputs">
                  {fileInputs.map((fileInput, index) => (
                    <Form.Group
                      className="mb-3 fileInputForm"
                      key={fileInput.id}
                    >
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

                {isCuratorsDropdownVisible || isIdFileInputVisible ? (
                  <ToggleButtonGroup
                    type="radio"
                    name="options"
                    defaultValue={1}
                    value={selectedValue}
                    onChange={handleToggleChange}
                  >
                    <ToggleButton id="tbg-radio-1" value={1}>
                      {get_translation("INTERFACE_CREATE_TICKET")}
                    </ToggleButton>
                    <ToggleButton id="tbg-radio-2" value={2}>
                      {get_translation("INTERFACE_CREATE_NOTIFICATION")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                ) : null}

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

          <Modal show={showSuccess} onHide={handleCloseSuccess}>
            <Modal.Header closeButton>
              <Modal.Title>
                {get_translation("INTERFACE_TICKETS_CREATED")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{get_translation("INTERFACE_TICKETS_CREATED_FULL")}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseSuccess}>
                {get_translation("INTERFACE_CLOSE")}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showError} onHide={handleCloseError}>
            <Modal.Header closeButton>
              <Modal.Title>
                {get_translation("INTERFACE_TICKETS_CREATED_PARTLY")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{get_translation("INTERFACE_TICKETS_CREATED_PARTLY")}</p>
              <ul className="failed-imports">
                {failedQueryImports?.slice(0, 5).map((failedImport, index) => (
                  <li key={index}>{failedImport}</li>
                ))}
                {failedQueryImports?.length > 5 && (
                  <li>и еще {failedQueryImports.length - 5} записей</li>
                )}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseError}>
                {get_translation("INTERFACE_CLOSE")}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default CuratorCreateTicket;
