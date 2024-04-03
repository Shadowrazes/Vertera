import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  DropdownButton,
  Dropdown,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import { useQuery, useMutation } from "@apollo/client";

import { THEME_LIST, CURATORS_LIST } from "../apollo/queries";
import { ADD_TICKET, CURATOR_ADD_TICKET } from "../apollo/mutations";

import { Editor } from "react-draft-wysiwyg";
import { MultiSelect } from "primereact/multiselect";
import Loader from "../pages/loading";
import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";

import "../css/form.css";
import "../css/curator-create-ticket.css";

import get_translation from "../helpers/translation";

function CuratorCreateTicket() {
  const [dataQuery, setData] = useState([]);
  const [dataQueryCurators, setDataQueryCurators] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [selectedCurators, setSelectedCurators] = useState([]);
  const [selectedCuratorsId, setSelectedCuratorsId] = useState([]);
  const [idInputs, setIdInputs] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  const [isNotificaton, setIsNotification] = useState(false);
  const [isOuterids, setIsOuterIds] = useState(false);

  const [ticketTitleValue, setTicketTitleValue] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);
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

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isBuild = import.meta.env.DEV !== "build";

  const isAdmin = () => {
    return user?.role === "helper" || user?.role === "system";
  };

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
  const { data: dataCurators } = useQuery(CURATORS_LIST, {
    variables: {
      token: user?.token,
    },
  });

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }

    if (dataCurators && dataCurators.helperQuery.helperList) {
      setDataQueryCurators(dataCurators.helperQuery.helperList);
    }
  }, [data, dataCurators]);

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
        <h2>{get_translation("INTERFACE_ERROR")}</h2>
      </>
    );
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

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);

    setIsVisible(false);
  };

  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);

    // setTextareaValue(draftToHtml(rawContent));

    // console.log(draftToHtml(rawContent));

    return draftToHtml(rawContent);
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
    } else if (getContent() == "<p></p>" || getContent() == "<p></p>\n") {
      error = get_translation("INTERFACE_DESCRIBE_SITUATION");
    } else if (ticketTitleValue.trim() == "") {
      error = get_translation("INTERFACE_DESCRIBE_TITLE");
    } else if (successfulImports === null && failedImports === null) {
      error = "Невозможно отправить обращения";
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
              text: getContent(),
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
              text: getContent(),
              attachPaths: filePaths,
              notification: isNotificaton,
              idsOuter: isOuterids,
              ids: idInputs,
            },
          })
            .then((data) => {
              console.log(data.data.helperMutation.addTicketMass);
              setFailedQueryImports(data.data.helperMutation.addTicketMass);
              // handleShowSuccess();
              handleShowError();
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
              text: getContent(),
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
      getContent() == "<p></p>" ||
      getContent() == "<p></p>\n"
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
      alert("Размер файла не должен превышать 10 МБ");
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
    .filter((curator) => curator.user.isActive == true)
    .map((curator) => ({
      name: `${curator.user.surname} ${curator.user.name} ${
        curator.user.patronymic ? ` ${curator.user.patronymic}` : ""
      }`,
      id: curator.id,
    }));

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
            <div className="curator-create-ticket__reciever-label">
              {(isCuratorsDropdownVisible || isIdFileInputVisible) && (
                <a onClick={handleCloseClick}>
                  <div className="chat__edit-close"></div>
                </a>
              )}
              <Form.Label className="edit-curator__field-label">
                Получатели
              </Form.Label>
            </div>
            {isButtonsVisible && (
              <div className="chat__helper-buttons">
                <ButtonCustom
                  title="Выбрать куратора"
                  className="chat-input__button-close"
                  onClick={handleCuratorsDropdown}
                />
                <ButtonCustom
                  title="Вставить список"
                  className="chat-input__button-close"
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
                  emptyMessage="Нет доступных опций"
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
                        Успешный импорт <br /> <br />
                        Импортировано {successfulImports} записей
                      </Alert>
                    )}

                    {failedImports > 0 && (
                      <Alert
                        variant="warning"
                        className="curator-create-ticket__alert"
                      >
                        Застично успешный импорт <br /> <br />
                        Импортировано {successfulImports} записей <br />
                        Не удалось импортировать {failedImports} записей <br />
                      </Alert>
                    )}

                    {successfulImports === null && failedImports === null && (
                      <Alert
                        variant="danger"
                        className="curator-create-ticket__alert"
                      >
                        Записей в файле не найдено
                      </Alert>
                    )}
                  </>
                )}
              </>
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

            {isCuratorsDropdownVisible || isIdFileInputVisible ? (
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={1}
                value={selectedValue}
                onChange={handleToggleChange}
              >
                <ToggleButton id="tbg-radio-1" value={1}>
                  Создать обращение
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2}>
                  Создать уведомление
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
            {isNotificaton ? "Уведомления " : "Обращения "}
            созданы
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {isNotificaton ? "Уведомления " : "Обращения "} успешно созданы и
            отправлены получателям
          </p>
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
            {isNotificaton ? "Уведомления " : "Обращения "}
            были созданы частично
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Часть {isNotificaton ? " уведомлений " : " обращений "} успешно
            отправлена. Следующие ID не удалось найти:
          </p>
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
  );
}

export default CuratorCreateTicket;
