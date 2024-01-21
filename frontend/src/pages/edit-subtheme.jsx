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

import { SUBTHEME, THEME_LIST, DEPARTMENTS_LIST } from "../apollo/queries";
import { EDIT_SUBTHEME, DELETE_SUBTHEME } from "../apollo/mutations";

import { MultiSelect } from "primereact/multiselect";
import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

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
  const [selectedItem, setSelectedItem] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const {
    loading: loadingTheme,
    error: errorTheme,
    data: dataTheme,
  } = useQuery(THEME_LIST);
  const {
    loading: loadingDepartmentList,
    error: errorDepartmentList,
    data: dataDepartmentList,
  } = useQuery(DEPARTMENTS_LIST);
  const { loading, error, data, refetch } = useQuery(SUBTHEME, {
    variables: {
      id: parseInt(subthemeId),
    },
  });

  const [editSubtheme, { loading: loadingEditSubtheme }] =
    useMutation(EDIT_SUBTHEME);
  const [deleteSubtheme, { loading: loadingDeleteSubtheme }] =
    useMutation(DELETE_SUBTHEME);

  const navigate = useNavigate();

  const goToAllSubthemes = () => {
    navigate("/subthemes");
  };

  useEffect(() => {
    if (dataTheme && dataTheme.allThemeTree) {
      setData(dataTheme.allThemeTree);
    }

    if (data && data.subTheme) {
      setNameValue(data.subTheme.name.stroke);
      setSelectedUnit(data.subTheme.theme.unit.name.stroke);
      setSelectedUnitId(data.subTheme.theme.unit.id);
      setSelectedItem(data.subTheme.theme.unit.name.stroke);
      setSelectedTheme(data.subTheme.theme.name.stroke);
      setSelectedThemeId(data.subTheme.theme.id);
      // console.log(data.subTheme.theme.unit.id);
    }

    if (dataDepartmentList && dataDepartmentList.departmentList) {
      setDepartmentList(dataDepartmentList.departmentList);
    }

    if (data && data.subTheme.departments) {
      setSelectedDepartments(
        data.subTheme.departments.map((department) => ({
          name: department.name.stroke,
          id: department.id,
        }))
      );
      setSelectedDepartmentsId(
        data.subTheme.departments.map((department) => department.id)
      );
      // console.log(data.subTheme.departments);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }

    refetch();
  }, [data, dataTheme, dataDepartmentList, location.state]);

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

  if (loadingDepartmentList) {
    return <Loader />;
  }

  if (errorDepartmentList) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingEditSubtheme) {
    return <Loader />;
  }

  if (loadingDeleteSubtheme) {
    return <Loader />;
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

    console.log(selectedUnit);
    console.log(selectedUnitId);
    console.log(selectedTheme);
    console.log(selectedThemeId);
    console.log(nameValue);
    console.log(selectedDepartments);
    console.log(selectedDepartmentsId);

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
          id: parseInt(subthemeId),
          themeId: selectedThemeId,
          stroke: nameValue.trim(),
          lang: "ru",
          departmentIds: selectedDepartmentsId,
        },
      });

      console.log("Подтема успешно обновлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении подтемы:", error);
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
      const result = await deleteSubtheme({
        variables: {
          id: parseInt(subthemeId),
        },
      });
      console.log("Подтема успешно удалена:", result);
      setShowTwo(true);
    } catch (error) {
      console.error("Ошибка удалении подтемы:", error);
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
    goToAllSubthemes();
  };

  const newDepartmentList = departmentList.map((department) => ({
    name: department.name.stroke,
    id: department.id,
  }));

  return (
    <>
      <BackTitle
        title={`Редактировать подтему #${subthemeId}`}
        linkPrev={linkPrev}
      />
      <Col className="edit-curator__column">
        <div className="edit-subtheme__field">
          <Form.Label className="edit-curator__field-label">Раздел</Form.Label>

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
        </div>

        {selectedUnit && (
          <div className="edit-subtheme__field">
            <Form.Label className="edit-curator__field-label">Тема</Form.Label>
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

        <div className="edit-curator__column">
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <div className="edit-curator__btn-row">
            <ButtonCustom
              title="Применить"
              className={"add-curator__btn edit-curator__btn"}
              onClick={handleEditSubtheme}
            />
            <ButtonCustom
              title="Удалить подтему"
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
          <p>Название подтемы успешно обновлено</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLeave}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTwo} onHide={handleCloseLeave}>
        <Modal.Header closeButton>
          <Modal.Title>Подтема удалена</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Подтема успешно удалена</p>
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
          <p>Вы уверены, что хотите удалить эту подтему?</p>
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

export default EditSubtheme;