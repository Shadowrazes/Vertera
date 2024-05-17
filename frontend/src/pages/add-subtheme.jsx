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

import { THEME_LIST, DEPARTMENTS_LIST, HELPER_PERMS } from "../apollo/queries";
import { ADD_SUBTHEME } from "../apollo/mutations";

import { MultiSelect } from "primereact/multiselect";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import get_translation from "../helpers/translation";

function AddSubtheme() {
  const [dataQuery, setData] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const modalTitle = get_translation("INTERFACE_MESSAGE_SUBTHEME_CREATION");
  const modalBody = get_translation("INTERFACE_MESSAGE_SUBTHEME_CREATION_FULL");

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);

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

  const { loading, error, data } = useQuery(THEME_LIST, {
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

  const navigate = useNavigate();

  const goToAllSubthemes = () => {
    navigate("/subthemes");
  };

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }

    if (dataDepartmentList && dataDepartmentList.helperQuery.departmentList) {
      setDepartmentList(dataDepartmentList.helperQuery.departmentList);
    }

    setLinkPrev("/subthemes");
  }, [data, dataDepartmentList, location.state]);

  const [addSubtheme] = useMutation(ADD_SUBTHEME);

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

    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);

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
      error = get_translation("INTERFACE_SELECT_UNIT");
    } else if (selectedTheme == null) {
      error = get_translation("INTERFACE_SELECT_THEME");
    } else if (nameValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_SUBTHEME_TITLE");
    } else {
      error = get_translation("INTERFACE_ERROR_ADD_SUBTHEME");
    }

    return error;
  };

  const handleDepartmentsOnChange = (departments) => {
    setSelectedDepartments(departments);
    setSelectedDepartmentsId(departments.map((department) => department.id));
    // console.log(departments);
  };

  const handleAddSubtheme = async (e) => {
    e.preventDefault();

    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(selectedTheme);
    // console.log(selectedThemeId);
    // console.log(selectedDepartments);
    // console.log(selectedDepartmentsId);
    // console.log(nameValue);

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
      const result = await addSubtheme({
        variables: {
          token: user.token,
          themeId: selectedThemeId,
          stroke: nameValue.trim(),
          lang: "ru",
          departmentIds: selectedDepartmentsId,
          visibility: 1,
        },
      });

      console.log("Подтема успешно добавлена:", result);
      handleShowModal();
    } catch (error) {
      console.error("Ошибка при добавлении подтемы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    goToAllSubthemes();
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
            title={get_translation("INTERFACE_ADD_SUBTHEME")}
            linkPrev={linkPrev}
          />
          <Row className="add-curator__row" style={{ marginTop: "20px" }}>
            <Col className="add-curator__column add-subtheme__column">
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedItem || get_translation("INTERFACE_SELECT_UNIT")}
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

              {selectedUnit && (
                <DropdownButton
                  id="dropdown-custom-1"
                  title={
                    selectedTheme || get_translation("INTERFACE_SELECT_THEME")
                  }
                  className="add-theme__dropdown"
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

              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_SUBTHEME_TITLE")}
                  value={nameValue}
                  className="add-currator__input"
                  onChange={handleNameChange}
                />
              </Form.Group>

              <MultiSelect
                value={selectedDepartments}
                onChange={(e) => handleDepartmentsOnChange(e.value)}
                options={newDepartmentList}
                optionLabel="name"
                placeholder={get_translation("INTERFACE_SELECT_DEPARTMENT")}
                className="add-curator__multiselect"
              />

              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}

              <ButtonCustom
                title={get_translation("INTERFACE_APPLY")}
                className={"add-curator__btn button-hover"}
                onClick={handleAddSubtheme}
              />
            </Col>
          </Row>

          <ModalDialog
            show={showModal}
            onClose={handleCloseModal}
            modalTitle={modalTitle}
            modalBody={modalBody}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default AddSubtheme;
