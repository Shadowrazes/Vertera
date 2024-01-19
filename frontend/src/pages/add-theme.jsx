import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
} from "react-bootstrap";

import { THEME_LIST } from "../apollo/queries";
import { ADD_THEME } from "../apollo/mutations";

import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";

import "../css/add-theme.css";

function AddTheme() {
  const [dataQuery, setData] = useState([]);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nameValue, setNameValue] = useState("");

  const { loading, error, data } = useQuery(THEME_LIST);

  const navigate = useNavigate();

  const goToAllThemes = () => {
    navigate("/themes");
  };

  useEffect(() => {
    if (data && data.allThemeTree) {
      setData(data.allThemeTree);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, location.state]);

  const [addTheme] = useMutation(ADD_THEME);

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

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (selectedUnit == null) {
      error = "Выберите название раздела";
    } else if (nameValue.trim() == "") {
      error = "Укажите название темы";
    } else {
      error = "Ошибка при добавлении раздела";
    }

    return error;
  };

  const handleAddTheme = async (e) => {
    e.preventDefault();

    console.log(selectedUnit);
    console.log(selectedUnitId);
    console.log(nameValue);

    if (nameValue.trim() == "" || selectedUnit == null) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addTheme({
        variables: {
          unitId: selectedUnitId,
          stroke: nameValue.trim(),
          lang: "ru",
        },
      });

      console.log("Тема успешно добавлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при добавлении темы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    goToAllThemes();
  };

  return (
    <>
      <BackTitle title="Добавить тему" linkPrev={linkPrev} />

      <DropdownButton
        id="dropdown-custom-1"
        title={selectedItem || "Выберите подразделение"}
        className="add-theme__dropdown"
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

      <Row className="add-curator__row">
        <Col className="add-curator__column">
          <Form.Group controlId="NameForm">
            <Form.Control
              type="text"
              placeholder="Название раздела"
              value={nameValue}
              className="add-currator__input"
              onChange={handleNameChange}
            />
          </Form.Group>
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <ButtonCustom
            title="Применить"
            className={"add-curator__btn"}
            onClick={handleAddTheme}
          />
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Тема создана</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Новая тема успешно создана</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTheme;
