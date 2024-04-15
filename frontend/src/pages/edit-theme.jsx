import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
} from "react-bootstrap";

import { THEME, THEME_LIST, HELPER_PERMS } from "../apollo/queries";
import { EDIT_THEME } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import NotFoundPage from "./not-found-page";

function EditTheme() {
  const { themeId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [dataQuery, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [visibility, setVisibility] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const visibilityItems = {
    1: "Доступно всем",
    2: "Доступно кураторам",
    3: "Не доступно",
  };

  const findKeyByValue = (obj, value) =>
    Object.keys(obj).find((key) => obj[key] === value);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const { data: dataPerms } = useQuery(HELPER_PERMS, {
    variables: {
      token: user?.token,
      id: user?.id,
    },
  });

  const isAdmin = () => {
    return (
      user.role === "system" || dataPerms?.helperQuery?.helperPerms.themeEdit
    );
  };

  const {
    loading: loadingTheme,
    error: errorTheme,
    data: dataTheme,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
    },
  });
  const { loading, error, data, refetch } = useQuery(THEME, {
    variables: {
      token: user.token,
      id: parseInt(themeId),
    },
  });

  const [editTheme, { loading: loadingEditTheme }] = useMutation(EDIT_THEME);

  const navigate = useNavigate();

  const goToAllThemes = () => {
    navigate("/themes");
  };

  useEffect(() => {
    if (dataTheme && dataTheme.clientQuery.allThemeTree) {
      setData(dataTheme.clientQuery.allThemeTree);
      // console.log(data.allThemeTree.map((unit) => unit.id));
    }

    if (data && data.helperQuery.theme) {
      setNameValue(data.helperQuery.theme.name.stroke);
      setSelectedUnit(data.helperQuery.theme.unit.name.stroke);
      setSelectedUnitId(data.helperQuery.theme.unit.id);
      setSelectedItem(data.helperQuery.theme.unit.name.stroke);
      setVisibility(data.helperQuery.theme.visibility);
      // console.log(data.theme.unit.id);
    }

    setLinkPrev("/themes");

    refetch();
  }, [data, dataTheme, location.state]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    const networkError = error.networkError;

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        } else if (errorMessage === "Forbidden") {
          return <NotFoundPage />;
        }
      }
    }

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

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleOnChangeName = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
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
          token: user.token,
          id: parseInt(themeId),
          unitId: selectedUnitId,
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: parseInt(visibility),
        },
      });

      console.log("Тема успешно обновлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении темы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleCloseLeave = () => {
    setShow(false);
    goToAllThemes();
  };

  const handleVisibilityClick = (visibility) => {
    setVisibility(findKeyByValue(visibilityItems, visibility));
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={`Редактировать тему #${themeId}`}
            linkPrev={linkPrev}
          />
          <Row style={{ marginTop: "20px" }}>
            <Col className="edit-curator__column edit-theme__column">
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedItem}
                className="add-theme__dropdown"
              >
                {dataQuery.map(
                  (unit, index) =>
                    unit.visibility !== 3 && (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          handleUnitClick(unit.name.stroke, unit.id)
                        }
                        href="#"
                      >
                        {unit.name.stroke}
                      </Dropdown.Item>
                    )
                )}
              </DropdownButton>

              <Form.Group controlId="NameForm">
                <Form.Label className="edit-curator__field-label">
                  Название темы
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input add-theme__dropdown"
                  value={nameValue}
                  onChange={handleOnChangeName}
                />

                <Form.Label
                  className="edit-curator__field-label"
                  style={{ marginTop: "20px" }}
                >
                  Порядок
                </Form.Label>
                <DropdownButton
                  id="dropdown-custom-1"
                  title={visibilityItems[visibility] || "Уровень отображения"}
                >
                  {Object.values(visibilityItems).map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleVisibilityClick(item)}
                      href="#"
                    >
                      {item}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Form.Group>

              <div className="edit-curator__column">
                {isErrorVisible && (
                  <span className="form__error">{errorMsg()}</span>
                )}
                <div className="edit-curator__btn-row">
                  <ButtonCustom
                    title="Применить"
                    className={"add-curator__btn edit-curator__btn"}
                    onClick={handleEditTheme}
                  />
                </div>
              </div>
            </Col>
          </Row>

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
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default EditTheme;
