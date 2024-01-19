import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
} from "react-bootstrap";

import { THEME, THEME_LIST } from "../apollo/queries";
import { EDIT_THEME, DELETE_THEME } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

function EditTheme() {
  const { themeId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [dataQuery, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [nameValue, setNameValue] = useState("");

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const {
    loading: loadingTheme,
    error: errorTheme,
    data: dataTheme,
  } = useQuery(THEME_LIST);
  const { loading, error, data, refetch } = useQuery(THEME, {
    variables: {
      id: parseInt(themeId),
    },
  });

  const [editTheme, { loading: loadingEditTheme }] = useMutation(EDIT_THEME);
  const [deleteTheme, { loading: loadingDeleteTheme }] =
    useMutation(DELETE_THEME);

  const navigate = useNavigate();

  const goToAllThemes = () => {
    navigate("/themes");
  };

  useEffect(() => {
    if (dataTheme && dataTheme.allThemeTree) {
      setData(dataTheme.allThemeTree);
      // console.log(data.allThemeTree.map((unit) => unit.id));
    }

    if (data && data.theme) {
      setNameValue(data.theme.name.stroke);
      setSelectedUnit(data.theme.unit.name.stroke);
      setSelectedUnitId(data.theme.unit.id);
      setSelectedItem(data.theme.unit.name.stroke);
      // console.log(data.theme.unit.id);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }

    refetch();
  }, [data, dataTheme, location.state]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingTheme) {
    return <Loader />;
  }

  if (errorTheme) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingEditTheme) {
    return <Loader />;
  }

  if (loadingDeleteTheme) {
    return <Loader />;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleOnChangeName = (e) => {
    setNameValue(e.target.value);
  };

  const errorMsg = () => {
    let error = "";

    if (selectedUnit == null) {
      error = "Выберите раздел";
    } else if (nameValue.trim() == "") {
      error = "Укажите название темы";
    } else {
      error = "Ошибка при обработке темы";
    }

    return error;
  };

  const handleEditTheme = async (e) => {
    e.preventDefault();

    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(nameValue);

    if (nameValue.trim() == "" || selectedUnit == null) {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      const result = await editTheme({
        variables: {
          id: parseInt(themeId),
          unitId: selectedUnitId,
          stroke: nameValue.trim(),
          lang: "ru",
        },
      });

      console.log("Тема успешно обновлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении темы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleDeleteTheme = (e) => {
    e.preventDefault();
    handleShowWarning();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setShowWarning(false);

    try {
      const result = await deleteTheme({
        variables: {
          id: parseInt(themeId),
        },
      });
      console.log("Тема успешно удалена:", result);
      setShowTwo(true);
    } catch (error) {
      console.error("Ошибка удалении темы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShowWarning = () => {
    setShowWarning(true);
  };

  const handleClose = () => {
    setShow(false);
    setShowTwo(false);
    setShowWarning(false);
  };

  const handleCloseLeave = () => {
    setShow(false);
    setShowTwo(false);
    setShowWarning(false);
    goToAllThemes();
  };

  return (
    <>
      <BackTitle title={`Редактировать тему #${themeId}`} linkPrev={linkPrev} />
      <DropdownButton
        id="dropdown-custom-1"
        title={selectedItem}
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
      <Col className="edit-curator__column">
        <Form.Group controlId="NameForm">
          <Form.Label className="edit-curator__field-label">
            Название темы
          </Form.Label>
          <Form.Control
            type="text"
            className="add-currator__input"
            value={nameValue}
            onChange={handleOnChangeName}
          />
        </Form.Group>

        <div className="edit-curator__column">
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <div className="edit-curator__btn-row">
            <ButtonCustom
              title="Применить"
              className={"add-curator__btn edit-curator__btn"}
              onClick={handleEditTheme}
            />
            <ButtonCustom
              title="Удалить тему"
              className={
                "add-curator__btn edit-curator__btn alltickets__button-two"
              }
              onClick={handleDeleteTheme}
            />
          </div>
        </div>
      </Col>

      <Modal show={show} onHide={handleCloseLeave}>
        <Modal.Header closeButton>
          <Modal.Title>Тема обновлена</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Название темы успешно обновлено</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLeave}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTwo} onHide={handleCloseLeave}>
        <Modal.Header closeButton>
          <Modal.Title>Тема удалена</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Тема успешно удалена</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLeave}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWarning} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Предупреждение</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Вы уверены, что хотите удалить эту тему, а также все подтемы,
            соответствующие ей?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Продолжить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditTheme;
