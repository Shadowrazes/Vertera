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

import { THEME_LIST, THEME_LIST_OLD } from "../apollo/queries";
import { ADD_TICKET } from "../apollo/mutations";

import Loader from "../pages/loading";
import DropdownBT from "./dropdown";
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
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isVisible, setIsVisible] = useState(false);

  const [dataQuery, setData] = useState([]);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const { loading, error, data } = useQuery(THEME_LIST);
  // const { loading, error, data } = useQuery(THEME_LIST_OLD);

  useEffect(() => {
    if (data && data.allThemeTree) {
      setData(data.allThemeTree);
    }
  }, [data, selectedUnit, selectedItem]);

  const [addTicket] = useMutation(ADD_TICKET);

  const resetState = () => {
    setSelectedUnit(null);
    setSelectedTheme(null);
    setSelectedSubTheme(null);
    setSelectedItem(null);
    setTextareaValue("");
    setSelectedUnitId(null);
    setSelectedThemeId(null);
    setSelectedSubThemeId(null);
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

    // if (
    //   selectedDepartment == null ||
    //   selectedTheme == null ||
    //   selectedSubTheme == null
    // ) {
    //   console.log("xdd");
    //   setIsVisible(true);
    //   return;
    // }

    //console.log(user);
    let userId = null;

    if (user === null) {
      userId = 1;
    } else {
      userId = user.id;
    }

    addTicket({
      variables: {
        clientId: 1,
        unitId: selectedUnitId,
        themeId: selectedThemeId,
        subThemeId: selectedSubThemeId,
        senderId: userId,
        recieverId: 46,
        ticketId: 1,
        type: "message",
        text: textareaValue,
      },
    });

    setIsVisible(false);
    handleShow();

    resetState();
  };

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
    console.log(unitId);

    setSelectedTheme(null);
    setSelectedSubTheme(null);
    setSubThemeDropdownVisible(true);
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);
    console.log(themeId);

    setSelectedSubTheme(null);
    setSubThemeDropdownVisible(true);

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
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);
    console.log(subThemeId);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  // const findDepartmentIdByName = (departmentName) => {
  //   const department = dataQuery.find(
  //     (item) => item.name.stroke === departmentName
  //   );
  //   return department ? department.id : null;
  // };

  // const findThemeIdByName = (themeName) => {
  //   const theme = dataQueryTheme.find(
  //     (item) => item.theme.name.stroke === themeName
  //   );
  //   return theme ? theme.theme.id : null;
  // };

  // const findSubThemeIdByName = (subThemeName) => {
  //   const subTheme = dataQueryTheme.find(
  //     (item) => item.name.stroke === subThemeName
  //   );
  //   return subTheme ? subTheme.id : null;
  // };

  return (
    <>
      <TitleH2 title="Создать обращение" className="title__heading" />
      <Form>
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
              <Form.Control type="file" multiple />
            </Form.Group>
            {isVisible && <span className="form__error">Выберите раздел</span>}
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
