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

import {
  SUBTHEME,
  THEME_LIST,
  DEPARTMENTS_LIST,
  HELPER_PERMS,
} from "../apollo/queries";
import { EDIT_SUBTHEME } from "../apollo/mutations";

import { MultiSelect } from "primereact/multiselect";
import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import NotFoundPage from "./not-found-page";

function EditSubtheme() {
  const { subthemeId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [dataQuery, setData] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
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
  const [language, setLanguage] = useState(localStorage.getItem("language"));

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
  const {
    loading: loadingDepartmentList,
    error: errorDepartmentList,
    data: dataDepartmentList,
  } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });
  const { loading, error, data, refetch } = useQuery(SUBTHEME, {
    variables: {
      token: user.token,
      id: parseInt(subthemeId),
    },
  });

  const [editSubtheme, { loading: loadingEditSubtheme }] =
    useMutation(EDIT_SUBTHEME);

  const navigate = useNavigate();

  const goToAllSubthemes = () => {
    navigate("/subthemes");
  };

  useEffect(() => {
    if (dataTheme && dataTheme.clientQuery.allThemeTree) {
      setData(dataTheme.clientQuery.allThemeTree);
    }

    if (data && data.helperQuery.subTheme) {
      setNameValue(data.helperQuery.subTheme.name.stroke);
      setSelectedUnit(data.helperQuery.subTheme.theme.unit.name.stroke);
      setSelectedUnitId(data.helperQuery.subTheme.theme.unit.id);
      setSelectedTheme(data.helperQuery.subTheme.theme.name.stroke);
      setSelectedThemeId(data.helperQuery.subTheme.theme.id);
      setVisibility(data.helperQuery.subTheme.visibility);
      // console.log(data.subTheme.theme.unit.id);
    }

    if (dataDepartmentList && dataDepartmentList.helperQuery.departmentList) {
      setDepartmentList(dataDepartmentList.helperQuery.departmentList);
    }

    if (data && data.helperQuery.subTheme.departments) {
      setSelectedDepartments(
        data.helperQuery.subTheme.departments.map((department) => ({
          name: department.name.stroke,
          id: department.id,
        }))
      );
      setSelectedDepartmentsId(
        data.helperQuery.subTheme.departments.map((department) => department.id)
      );
      // console.log(data.subTheme.departments);
    }

    setLinkPrev("/subthemes");

    refetch();
  }, [data, dataTheme, dataDepartmentList, location.state]);

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

  if (loadingDepartmentList) {
    return <Loader />;
  }

  if (errorDepartmentList) {
    const networkError = errorDepartmentList.networkError;

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

  if (loadingEditSubtheme) {
    return <Loader />;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    if (unit !== selectedUnit) {
      setSelectedTheme(null);
      setSelectedThemeId(null);
    }

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);

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
    } else if (selectedTheme == null) {
      error = "Выберите тему";
    } else if (nameValue.trim() == "") {
      error = "Укажите название подтемы";
    } else {
      error = "Ошибка при обработке подтемы";
    }

    return error;
  };

  const handleEditSubtheme = async (e) => {
    e.preventDefault();

    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(selectedTheme);
    // console.log(selectedThemeId);
    // console.log(nameValue);
    // console.log(selectedDepartments);
    // console.log(selectedDepartmentsId);

    if (
      nameValue.trim() == "" ||
      selectedUnit == null ||
      selectedTheme == null
    ) {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      const result = await editSubtheme({
        variables: {
          token: user.token,
          id: parseInt(subthemeId),
          themeId: selectedThemeId,
          stroke: nameValue.trim(),
          lang: "ru",
          departmentIds: selectedDepartmentsId,
          visibility: parseInt(visibility),
        },
      });

      console.log("Подтема успешно обновлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении подтемы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleCloseLeave = () => {
    setShow(false);
    goToAllSubthemes();
  };

  const handleVisibilityClick = (visibility) => {
    setVisibility(findKeyByValue(visibilityItems, visibility));
  };

  const newDepartmentList = departmentList.map((department) => ({
    name: department.name.stroke,
    id: department.id,
  }));

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={`Редактировать подтему #${subthemeId}`}
            linkPrev={linkPrev}
          />
          <Col className="edit-curator__column edit-subtheme__column">
            <div className="edit-subtheme__field">
              <Form.Label className="edit-curator__field-label">
                Раздел
              </Form.Label>

              <DropdownButton
                id="dropdown-custom-1"
                title={selectedUnit}
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
            </div>

            {selectedUnit && (
              <div className="edit-subtheme__field">
                <Form.Label className="edit-curator__field-label">
                  Тема
                </Form.Label>
                <DropdownButton
                  id="dropdown-custom-1"
                  title={selectedTheme || "Тип обращения"}
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
              </div>
            )}

            <div className="edit-subtheme__field">
              <Form.Label className="edit-curator__field-label">
                Название подтемы
              </Form.Label>
              <Form.Control
                type="text"
                className="add-currator__input"
                value={nameValue}
                onChange={handleOnChangeName}
              />
            </div>

            <div className="edit-subtheme__field">
              <Form.Label className="edit-curator__field-label">
                Департамент
              </Form.Label>

              <MultiSelect
                value={selectedDepartments}
                onChange={(e) => handleDepartmentsOnChange(e.value)}
                options={newDepartmentList}
                optionLabel="name"
                placeholder="Выбрать департамент"
                className="add-curator__multiselect"
              />
            </div>

            <div className="edit-subtheme__field">
              <Form.Label className="edit-curator__field-label">
                Отображение
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
            </div>

            <div className="edit-curator__column">
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <div className="edit-curator__btn-row">
                <ButtonCustom
                  title="Применить"
                  className={"add-curator__btn edit-curator__btn"}
                  onClick={handleEditSubtheme}
                />
              </div>
            </div>
          </Col>

          <Modal show={show} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Тема обновлена</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Название подтемы успешно обновлено</p>
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

export default EditSubtheme;
