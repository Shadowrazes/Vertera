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
  Tab,
  Tabs,
} from "react-bootstrap";

import { MESSAGES_CHAT, THEME_LIST, CURATORS_LIST } from "../apollo/queries";
import { EDIT_TICKET } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "./loading";
import ButtonCustom from "../components/button";

import "../css/edit-ticket.css";

function EditTicket() {
  const { itemId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [dataQuery, setData] = useState([]);
  const [dataQueryCurators, setDataQueryCurators] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);
  const [selectedCurator, setSelectedCurator] = useState(null);
  const [selectedCuratorId, setSelectedCuratorId] = useState(null);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const { loading, error, data } = useQuery(MESSAGES_CHAT, {
    variables: {
      id: parseInt(itemId),
    },
  });

  const {
    loading: loadingTheme,
    error: errorTheme,
    data: dataTheme,
  } = useQuery(THEME_LIST);

  const {
    loading: loadingCurators,
    error: errorCurators,
    data: dataCurators,
  } = useQuery(CURATORS_LIST);

  const [editTicket, { loading: loadingEditTicket }] = useMutation(EDIT_TICKET);

  useEffect(() => {
    if (data && data.ticket) {
      setSelectedItem(data.ticket.subTheme.theme.unit.name.stroke);
      setSelectedUnit(data.ticket.subTheme.theme.unit.name.stroke);
      setSelectedUnitId(data.ticket.subTheme.theme.unit.id);
      setSelectedTheme(data.ticket.subTheme.theme.name.stroke);
      setSelectedThemeId(data.ticket.subTheme.theme.id);
      setSelectedSubTheme(data.ticket.subTheme.name.stroke);
      setSelectedSubThemeId(data.ticket.subTheme.id);
      setSelectedCurator(
        `${data.ticket.helper.user.surname} ${data.ticket.helper.user.name} ${
          data.ticket.helper.user.patronymic
            ? ` ${data.ticket.helper.user.patronymic}`
            : ""
        }`
      );
      setSelectedCuratorId(data.ticket.helper.id);
      setSelectedDepartmentsId(
        data.ticket.subTheme.departments.map((department) => department.id)
      );
      // console.log(selectedDepartmentsId);

      if (location.state && location.state.linkPrev) {
        setLinkPrev(location.state.linkPrev);
      }
    }

    if (dataTheme && dataTheme.allThemeTree) {
      setData(dataTheme.allThemeTree);
    }

    if (dataCurators && dataCurators.helperList) {
      setDataQueryCurators(dataCurators.helperList);
    }
  }, [data, dataTheme, dataCurators, location.state]);

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

  if (loadingCurators) {
    return <Loader />;
  }

  if (errorCurators) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingEditTicket) {
    return <Loader />;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    if (unit !== selectedUnit) {
      setSelectedTheme(null);
      setSelectedSubTheme(null);
      setSubThemeDropdownVisible(true);

      setSelectedCurator(null);
      setSelectedCuratorId(null);

      setIsErrorVisible(false);
    }

    // console.log(unitId);
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);

    if (theme !== selectedTheme) {
      setSelectedSubTheme(null);
      setSubThemeDropdownVisible(true);

      setSelectedCurator(null);
      setSelectedCuratorId(null);

      setIsErrorVisible(false);

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
    }

    // console.log(unitId);
  };

  const handleSubThemeClick = (subTheme, subThemeId, departmentsId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);

    setSelectedDepartmentsId(departmentsId);

    setSelectedCurator(null);
    setSelectedCuratorId(null);

    setIsErrorVisible(false);
    // console.log(subThemeId);
  };

  const handleCuratorClick = (
    curatorName,
    curatorSurname,
    curatorPatronymic,
    curatorId
  ) => {
    let fullName = `${curatorSurname} ${curatorName} ${
      curatorPatronymic ? ` ${curatorPatronymic}` : ""
    }`;
    setSelectedCurator(fullName);
    setSelectedCuratorId(curatorId);

    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (selectedUnit == null) {
      error = "Выберите раздел";
    } else if (selectedTheme == null) {
      error = "Выберите тему";
    } else if (selectedSubThemeId == null) {
      error = "Выберите подтему";
    } else if (selectedCurator == null) {
      error = "Выберите куратора";
    } else {
      error = "Ошибка изменение данных тикета";
    }

    return error;
  };

  const handleEditTicket = async (e) => {
    e.preventDefault();

    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(selectedTheme);
    // console.log(selectedThemeId);
    // console.log(selectedSubTheme);
    // console.log(selectedSubThemeId);
    // console.log(selectedCurator);
    // console.log(selectedCuratorId);
    // console.log(selectedDepartmentsId);

    if (
      selectedUnit == null ||
      selectedTheme == null ||
      selectedSubThemeId == null ||
      selectedCurator == null
    ) {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      const result = await editTicket({
        variables: {
          id: parseInt(itemId),
          helperId: selectedCuratorId,
          unitId: selectedUnitId,
          themeId: selectedThemeId,
          subThemeId: selectedSubThemeId,
          departmentId: selectedDepartmentsId[0],
        },
      });

      console.log("Тикет успешно обновлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении тикета:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    window.location.href = linkPrev;
  };

  return (
    <>
      <BackTitle title={`Редактировать тикет #${itemId}`} linkPrev={linkPrev} />

      <Tabs
        defaultActiveKey="theme"
        id="justify-tab-example"
        className="mb-3 edit-ticket__tabs"
        justify
      >
        <Tab eventKey="theme" title="Редактирова тему">
          <div className="edit-subtheme__field">
            <Form.Label className="edit-curator__field-label">
              Раздел
            </Form.Label>

            <DropdownButton
              id="dropdown-custom-1"
              title={selectedItem}
              className="themes__dropdown"
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
              <Form.Label className="edit-curator__field-label">
                Тема
              </Form.Label>
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedTheme || "Тип обращения"}
                className="themes__dropdown"
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

          {isSubThemeDropdownVisible && selectedTheme && (
            <div className="edit-subtheme__field">
              <Form.Label className="edit-curator__field-label">
                Подтема
              </Form.Label>
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedSubTheme || "Подтема"}
                className="themes__dropdown"
              >
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
                  ?.themes.find((theme) => theme.name.stroke === selectedTheme)
                  ?.subThemes.map((subTheme) => (
                    <Dropdown.Item
                      key={subTheme.id}
                      onClick={() =>
                        handleSubThemeClick(
                          subTheme.name.stroke,
                          subTheme.id,
                          subTheme.departments.map(
                            (department) => department.id
                          )
                        )
                      }
                      href="#"
                    >
                      {subTheme.name.stroke}
                    </Dropdown.Item>
                  ))}
              </DropdownButton>
            </div>
          )}
        </Tab>
        <Tab eventKey="curator" title="Изменить куратора">
          <div className="edit-subtheme__field">
            <Form.Label className="edit-curator__field-label">
              Куратор
            </Form.Label>
            <DropdownButton
              id="dropdown-custom-1"
              title={selectedCurator || "Куратор"}
              className="themes__dropdown"
            >
              {dataQueryCurators
                .filter((curator) =>
                  curator.departments.some((department) =>
                    selectedDepartmentsId.includes(department.id)
                  )
                )
                .map((curator, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() =>
                      handleCuratorClick(
                        curator.user.name,
                        curator.user.surname,
                        curator.user.patronymic,
                        curator.id
                      )
                    }
                    href="#"
                  >
                    {`${curator.user.surname} ${curator.user.name} ${
                      curator.user.patronymic
                        ? ` ${curator.user.patronymic}`
                        : ""
                    }`}
                  </Dropdown.Item>
                ))}
            </DropdownButton>
          </div>
        </Tab>
      </Tabs>

      <div className="edit-curator__column">
        {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
        <ButtonCustom
          title="Применить изменения"
          className={"add-curator__btn"}
          onClick={handleEditTicket}
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Тикет обновлен</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Данные тикета успешно обновлены</p>
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

export default EditTicket;
