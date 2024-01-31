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

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, dataDepartmentList, location.state]);

  const [addSubtheme] = useMutation(ADD_SUBTHEME);

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
      error = "Выберите название раздела";
    } else if (selectedTheme == null) {
      error = "Выберите подтему";
    } else if (nameValue.trim() == "") {
      error = "Укажите название подтемы";
    } else if (orderNum < 0) {
      error = "Порядок сортировки не может быть отрицательным";
    } else {
      error = "Ошибка при добавлении раздела";
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
      <BackTitle title="Добавить подтему" linkPrev={linkPrev} />

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

      {selectedUnit && (
        <DropdownButton
          id="dropdown-custom-1"
          title={selectedTheme || "Тип обращения"}
          className="add-theme__dropdown"
        >
          {dataQuery
            .find((unit) => unit.name.stroke === selectedUnit)
            ?.themes.map((theme) => (
              <Dropdown.Item
                key={theme.id}
                onClick={() => handleThemeClick(theme.name.stroke, theme.id)}
                href="#"
              >
                {theme.name.stroke}
              </Dropdown.Item>
            ))}
        </DropdownButton>
      )}

      <Row className="add-curator__row">
        <Col className="add-curator__column">
          <Form.Group controlId="NameForm">
            <Form.Control
              type="text"
              placeholder="Название подтемы"
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
            placeholder="Выбрать департамент"
            className="add-curator__multiselect"
          />

          <div>
            <Form.Label className="edit-curator__field-label">
              Порядок
            </Form.Label>
            <Form.Control
              type="number"
              className="add-currator__input"
              placeholder="Порядок"
              value={orderNum}
              onChange={handleOrderNumChange}
              min={0}
            />
          </div>

          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}

          <ButtonCustom
            title="Применить"
            className={"add-curator__btn"}
            onClick={handleAddSubtheme}
          />
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Подтема создана</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Новая подтема успешно создана</p>
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

export default AddSubtheme;
