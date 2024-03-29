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

import { THEME_LIST, DEPARTMENTS_LIST } from "../apollo/queries";
import { ADD_SUBTHEME } from "../apollo/mutations";

import { MultiSelect } from "primereact/multiselect";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";
import NotFoundPage from "./not-found-page";

import get_translation from "../helpers/translation";

function AddSubtheme() {
  const [dataQuery, setData] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [orderNum, setOrderNum] = useState(0);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
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

  const handleOrderNumChange = (e) => {
    setOrderNum(e.target.value);
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
    } else if (orderNum < 0) {
      error = get_translation("INTERFACE_ERROR_NEGATIVE_SORT");
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

    console.log(selectedUnit);
    console.log(selectedUnitId);
    console.log(selectedTheme);
    console.log(selectedThemeId);
    console.log(selectedDepartments);
    console.log(selectedDepartmentsId);
    console.log(nameValue);

    if (
      nameValue.trim() == "" ||
      selectedUnit == null ||
      selectedTheme == null ||
      orderNum < 0
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
          orderNum: orderNum,
        },
      });

      console.log("Подтема успешно добавлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при добавлении подтемы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
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
          <Row className="add-curator__row">
            <Col className="add-curator__column add-subtheme__column">
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedItem || get_translation("INTERFACE_SELECT_UNIT")}
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

              <div>
                <Form.Label className="edit-curator__field-label">
                  {get_translation("INTERFACE_ORDER")}
                </Form.Label>
                <Form.Control
                  type="number"
                  className="add-currator__input"
                  placeholder={get_translation("INTERFACE_ORDER")}
                  value={orderNum}
                  onChange={handleOrderNumChange}
                  min={0}
                />
              </div>

              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}

              <ButtonCustom
                title={get_translation("INTERFACE_APPLY")}
                className={"add-curator__btn"}
                onClick={handleAddSubtheme}
              />
            </Col>
          </Row>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {get_translation("INTERFACE_MESSAGE_SUBTHEME_CREATION")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {get_translation("INTERFACE_MESSAGE_SUBTHEME_CREATION_FULL")}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
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

export default AddSubtheme;
