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

import { THEME_LIST, DEPARTMENTS_LIST } from "../apollo/queries";
import { ADD_TICKET } from "../apollo/mutations";

import Loader from "../pages/loading";
import DropdownBT from "./dropdown";
import TitleH2 from "./title";

import "../css/form.css";

function FormComponent() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");

  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isVisible, setIsVisible] = useState(false);

  const [dataQuery, setData] = useState([]);
  const [dataQueryTheme, setDataTheme] = useState([]);

  const { loading, error, data } = useQuery(DEPARTMENTS_LIST);
  const {
    loading: themeLoading,
    error: themeError,
    data: themeData,
  } = useQuery(THEME_LIST);

  useEffect(() => {
    if (themeData && themeData.subThemeList) {
      setDataTheme(themeData.subThemeList);
    }

    if (data && data.departmentList) {
      setData(data.departmentList);
    }
  }, [data, themeData, selectedDepartment, selectedItem]);

  const [addTicket] = useMutation(ADD_TICKET);

  const handleNewTicket = (e) => {
    e.preventDefault();
    // console.log(selectedDepartment);
    // console.log(selectedTheme);
    // console.log(selectedSubTheme);
    // console.log(textareaValue);

    const selectedDepartmentId = findDepartmentIdByName(selectedDepartment);
    //console.log(selectedDepartmentId);
    const selectedThemeId = findThemeIdByName(selectedTheme);
    //console.log(selectedThemeId);
    const selectedSubThemeId = findSubThemeIdByName(selectedSubTheme);
    //console.log(selectedSubThemeId);

    if (
      selectedDepartment == null ||
      selectedTheme == null ||
      selectedSubTheme == null
    ) {
      console.log("xdd");
      setIsVisible(true);
      return;
    }

    addTicket({
      variables: {
        clientId: 1,
        unitId: selectedDepartmentId,
        themeId: selectedThemeId,
        subThemeId: selectedSubThemeId,
        senderId: 1,
        recieverId: 2,
        ticketId: 1,
        type: "common",
        text: textareaValue,
      },
    });

    setIsVisible(false);
    handleShow();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (themeLoading) {
    return <Loader />;
  }

  if (themeError) {
    return <h2>Что-то пошло не так</h2>;
  }

  const departments = dataQuery.map((department) => department.name.stroke);
  const themes = dataQueryTheme.map((theme) => theme.theme.id);
  const subThemes = dataQueryTheme.map((theme) => theme.name.stroke);

  // console.log(themes);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSelectedDepartment(item);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const findDepartmentIdByName = (departmentName) => {
    const department = dataQuery.find(
      (item) => item.name.stroke === departmentName
    );
    return department ? department.id : null;
  };

  const findThemeIdByName = (themeName) => {
    const theme = dataQueryTheme.find(
      (item) => item.theme.name.stroke === themeName
    );
    return theme ? theme.theme.id : null;
  };

  const findSubThemeIdByName = (subThemeName) => {
    const subTheme = dataQueryTheme.find(
      (item) => item.name.stroke === subThemeName
    );
    return subTheme ? subTheme.id : null;
  };

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
              {departments.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleItemClick(item)}
                  href="#"
                >
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            {selectedDepartment && (
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedTheme || "Тип обращения"}
              >
                {Array.from(
                  new Set(
                    dataQueryTheme
                      .filter((subTheme) =>
                        subTheme.departments.some(
                          (department) =>
                            department.name.stroke === selectedDepartment
                        )
                      )
                      .map((subTheme) => subTheme.theme.name.stroke)
                  )
                ).map((theme, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setSelectedTheme(theme)}
                    href="#"
                  >
                    {theme}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            )}

            {selectedTheme && (
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedSubTheme || "Выберите подтему"}
              >
                {dataQueryTheme
                  .filter(
                    (subTheme) =>
                      subTheme.theme.name.stroke === selectedTheme &&
                      subTheme.departments.some(
                        (department) =>
                          department.name.stroke === selectedDepartment
                      )
                  )
                  .map((subTheme) => (
                    <Dropdown.Item
                      key={subTheme.id}
                      onClick={() => setSelectedSubTheme(subTheme.name.stroke)}
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
