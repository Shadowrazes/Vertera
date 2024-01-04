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
import { useQuery, useMutation } from "@apollo/client";

import { THEME_LIST } from "../apollo/queries";
import { ADD_TICKET } from "../apollo/mutations";

import Loader from "../pages/loading";
import TitleH2 from "./title";

import "../css/form.css";

function FormComponent() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleShow = () => setShow(true);

  const [isVisible, setIsVisible] = useState(false);

  const [isFilesSizeExceeded, setIsFilesSizeExceeded] = useState(false);
  const [isFilesLimitExceeded, setIsFilesLimitExceeded] = useState(false);

  const [dataQuery, setData] = useState([]);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const { loading, error, data } = useQuery(THEME_LIST);

  useEffect(() => {
    if (data && data.allThemeTree) {
      setData(data.allThemeTree);
    }
  }, [data]);

  const [addTicket] = useMutation(ADD_TICKET);

  async function uploadFiles() {
    const fileInput = document.getElementById("FileInputForm");
    let fileNames = [];

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
            "http://localhost:4444/upload",
            requestOptions
          );
          const result = await response.json();

          console.log(result);
          fileNames = result.data.map((file) => file.name);
          // console.log(fileNames);

          return fileNames;
        } catch (error) {
          console.log("error", error);
          throw error;
        }
      }
    }

    return fileNames;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);
    // console.log(unitId);

    setSelectedTheme(null);
    setSelectedSubTheme(null);
    setSubThemeDropdownVisible(true);
    setIsVisible(false);
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);
    // console.log(themeId);

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
  };

  const handleSubThemeClick = (subTheme, subThemeId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);
    // console.log(subThemeId);

    setIsVisible(false);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const resetState = (e) => {
    setSelectedUnit(null);
    setSelectedTheme(null);
    setSelectedSubTheme(null);
    setSelectedItem(null);
    setTextareaValue("");
    setSelectedUnitId(null);
    setSelectedThemeId(null);
    setSelectedSubThemeId(null);
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
    } else if (textareaValue.trim() == "") {
      error = "Опишите Вашу проблему";
    }

    return error;
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
    // console.log(imageUrl);

    if (
      selectedUnitId == null ||
      selectedThemeId == null ||
      selectedSubThemeId == null ||
      textareaValue.trim() == ""
    ) {
      // console.log("xdd");
      setIsVisible(true);
      return;
    }

    let userId = null;

    if (user === null) {
      userId = 1;
    } else {
      userId = user.id;
    }

    uploadFiles()
      .then((fileNames) => {
        // console.log(fileNames);
        addTicket({
          variables: {
            clientId: userId,
            unitId: selectedUnitId,
            themeId: selectedThemeId,
            subThemeId: selectedSubThemeId,
            senderId: userId,
            recieverId: 1,
            ticketId: 1,
            type: "message",
            text: textareaValue,
            attachPaths: fileNames,
          },
        }).then((data) => {
          console.log(data);
        });
        
      })
      .catch((error) => {
        console.error("Ошибка при загрузке файлов:", error);
      });

    setIsVisible(false);
    handleShow();

    resetState();
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

  return (
    <>
      <TitleH2 title="Создать обращение" className="title__heading" />
      <Form method="post">
        <Row>
          <Col md={4} className="form__column">
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

          <Col md={8} className="form__column">
            {!user && 
              <Form.Group controlId="NameForm">
                <Form.Control type="text" placeholder="Ваше имя"/>
              </Form.Group>
            }
            {!user && 
              <Form.Group controlId="EmailForm">
                <Form.Control type="email" placeholder="Ваш email"/>
              </Form.Group>
            }
            <Form.Group controlId="TextareaForm">
              <Form.Control
                as="textarea"
                placeholder="Текст сообщения"
                rows={3}
                value={textareaValue}
                onChange={handleTextareaChange}
              />
            </Form.Group>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ваше обращение создано</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ожидайте ответа от помощника</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FormComponent;
