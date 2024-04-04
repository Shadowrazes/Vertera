import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  DELETE_USER,
  DISABLE_HELPER_USER,
  EDIT_HELPER_USER,
  UPDATE_CURATOR_PERMS,
} from "../apollo/mutations";
import {
  COUNTRY_LIST,
  DEPARTMENTS_LIST,
  HELPER,
  JOB_TITLE_LIST,
  HELPER_PERMS,
} from "../apollo/queries";

import { MultiSelect } from "primereact/multiselect";
import { DatePicker } from "rsuite";
import BackTitle from "../components/back-title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import NotFoundPage from "./not-found-page";

import "../css/dropdown.css";
import "../css/edit-curator.css";

function EditCurator() {
  const { curatorId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [departmentList, setDepartmentList] = useState([]);
  const [jobTltleList, setJobTitleList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [patronymicValue, setPatronymicValue] = useState("");
  const [birthdayValue, setBirthdayValue] = useState(undefined);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedJobTitleId, setSelectedJobTitleId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [isActive, setIsActive] = useState(null);

  const [selectedAccessCurators, setSelectedAccessCurators] = useState(false);
  const [selectedAccessThemes, setSelectedAccessThemes] = useState(false);
  const [selectedAccessTransfers, setSelectedAccessTransfers] = useState(false);
  const [selectedAccessToAnswers, setSelectedAccessToAnswers] = useState(false);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showThree, setShowThree] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

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
      user.role === "system" || dataPerms.helperQuery.helperPerms.helperEdit
    );
  };

  const { loading, error, data } = useQuery(HELPER, {
    variables: {
      token: user.token,
      id: parseInt(curatorId),
    },
  });

  const { data: dataDepartmentsList } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
    },
  });
  const { data: dataJobTitleList } = useQuery(JOB_TITLE_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });
  const { data: dataCountryList } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const [editHelperUser, { loading: loadingEditHelper }] =
    useMutation(EDIT_HELPER_USER);

  const [disableHelperUser, { loading: loadingDisableHelperUser }] =
    useMutation(DISABLE_HELPER_USER);

  const [deleteUser, { loading: loadingDeleteUser }] = useMutation(DELETE_USER);

  const [updateCuratorPerms] = useMutation(UPDATE_CURATOR_PERMS);

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.helperQuery.helper) {
      // console.log(data.helper.birthday);
      setBirthdayValue(new Date(data.helperQuery.helper.birthday));
    }

    if (data && data.helperQuery.helper.permissions) {
      setSelectedAccessToAnswers(data.helperQuery.helper.permissions.sendMsg);
      setSelectedAccessCurators(data.helperQuery.helper.permissions.helperEdit);
      setSelectedAccessThemes(data.helperQuery.helper.permissions.themeEdit);
      setSelectedAccessTransfers(
        data.helperQuery.helper.permissions.translationEdit
      );
    }

    if (data && data.helperQuery.helper.user) {
      // console.log(data.helper.user);
      setNameValue(data.helperQuery.helper.user.name);
      setSurnameValue(data.helperQuery.helper.user.surname);
      setPatronymicValue(data.helperQuery.helper.user.patronymic);
      setSelectedCountry(data.helperQuery.helper.user.country.name.stroke);
      setSelectedCountryId(data.helperQuery.helper.user.country.id);
      setIsActive(data.helperQuery.helper.user.isActive);
    }

    if (data && data.helperQuery.helper.departments) {
      setSelectedDepartments(
        data.helperQuery.helper.departments.map((department) => ({
          name: department.name.stroke,
          id: department.id,
        }))
      );
      setSelectedDepartmentsId(
        data.helperQuery.helper.departments.map((department) => department.id)
      );
      // console.log(data.helper.departments);
    }

    if (data && data.helperQuery.helper.jobTitle) {
      // console.log(data.helper.jobTitle.name.stroke);
      setSelectedJobTitle(data.helperQuery.helper.jobTitle.name.stroke);
      setSelectedJobTitleId(data.helperQuery.helper.jobTitle.id);
    }

    if (dataDepartmentsList && dataDepartmentsList.helperQuery.departmentList) {
      setDepartmentList(dataDepartmentsList.helperQuery.departmentList);
    }

    if (dataJobTitleList && dataJobTitleList.helperQuery.jobTitleList) {
      // console.log(dataJobTitleList.jobTitleList);
      setJobTitleList(dataJobTitleList.helperQuery.jobTitleList);
    }

    if (dataCountryList && dataCountryList.clientQuery.countryList) {
      setCountryList(dataCountryList.clientQuery.countryList);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [
    data,
    dataDepartmentsList,
    dataJobTitleList,
    dataCountryList,
    location.state,
  ]);

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

  if (loadingEditHelper) {
    return <Loader />;
  }

  if (loadingDisableHelperUser) {
    return <Loader />;
  }

  const handleOnChangeName = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleOnChangeSurname = (e) => {
    setSurnameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleOnChangePatronymic = (e) => {
    setPatronymicValue(e.target.value);
  };

  const handleCountryClick = (country, countryId) => {
    setSelectedCountry(country);
    setSelectedCountryId(countryId);
    setIsErrorVisible(false);
  };

  const handleOnChangeAccessCurators = (e) => {
    setSelectedAccessCurators(e.target.checked);
  };

  const handleOnChangeAccessThemes = (e) => {
    setSelectedAccessThemes(e.target.checked);
  };

  const handleOnChangeAccessTransfers = (e) => {
    setSelectedAccessTransfers(e.target.checked);
  };

  const handleOnChangeAccessAnswers = (e) => {
    setSelectedAccessToAnswers(e.target.checked);
  };

  const handlePeriodClick = (originalDate) => {
    const year = originalDate.getFullYear();
    const month = ("0" + (originalDate.getMonth() + 1)).slice(-2);
    const day = ("0" + originalDate.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  const handleDepartmentsOnChange = (departments) => {
    setSelectedDepartments(departments);
    setSelectedDepartmentsId(departments.map((department) => department.id));
    // console.log(departments);
    setIsErrorVisible(false);
  };

  const handleJobTitleClick = (jobTitle, jobTitleId) => {
    // setSelectedItemJobTitle(jobTitle);
    setSelectedJobTitle(jobTitle);
    setSelectedJobTitleId(jobTitleId);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Укажите имя";
    } else if (surnameValue.trim() == "") {
      error = "Укажите фамилию";
    } else if (birthdayValue == null) {
      error = "Укажите дату рождения";
    } else if (selectedCountry == null) {
      error = "Укажите страну";
    } else if (selectedDepartments.length == 0) {
      error = "Выберите департамент";
    } else if (selectedJobTitle == null) {
      error = "Выберите должность";
    } else {
      error = "Ошибка при обработке куратора";
    }

    return error;
  };

  const handleEditCurator = async (e) => {
    e.preventDefault();

    // console.log(idValue);
    // console.log(nameValue);
    // console.log(surnameValue);
    // console.log(patronymicValue);
    // console.log(birthdayValue);
    // console.log(formattedDate);
    // console.log(selectedCountry);
    // console.log(selectedCountryId);
    // console.log(selectedDepartments.map((department) => department.name));
    // console.log(selectedDepartmentsId);
    // console.log(selectedJobTitle);
    // console.log(selectedJobTitleId);

    if (
      nameValue.trim() == "" ||
      surnameValue.trim() == "" ||
      birthdayValue == null ||
      selectedCountry == null ||
      selectedDepartments.length == 0 ||
      selectedJobTitle == null
    ) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    const formattedDate = handlePeriodClick(birthdayValue);

    try {
      const result = await updateCuratorPerms({
        variables: {
          token: user.token,
          id: parseInt(curatorId),
          sendMsg: selectedAccessToAnswers,
          helperEdit: selectedAccessCurators,
          themeEdit: selectedAccessThemes,
          translationEdit: selectedAccessTransfers,
        },
      });
      console.log("Права доступа успешно обновлены:", result);
    } catch (error) {
      console.error("Ошибка при обновлении прав:", error);
      setIsErrorVisible(true);
    }

    try {
      let result;
      if (patronymicValue == null || patronymicValue.trim() == "") {
        result = await editHelperUser({
          variables: {
            token: user.token,
            id: parseInt(curatorId),
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            birthday: formattedDate,
            countryId: selectedCountryId,
            departmentId: selectedDepartmentsId,
            jobTitleId: selectedJobTitleId,
          },
        });
      } else {
        result = await editHelperUser({
          variables: {
            token: user.token,
            id: parseInt(curatorId),
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            patronymic: patronymicValue.trim(),
            birthday: formattedDate,
            countryId: selectedCountryId,
            departmentId: selectedDepartmentsId,
            jobTitleId: selectedJobTitleId,
          },
        });
      }

      console.log("Куратор успешно обновлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении куратора:", error);
      setIsErrorVisible(true);
    }
  };

  const handleDeleteCurator = (e) => {
    e.preventDefault();
    handleShowWarning();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setShowWarning(false);

    try {
      const result = await disableHelperUser({
        variables: {
          token: user.token,
          id: parseInt(curatorId),
          isActive: false,
        },
      });
      console.log("Куратор успешно удален:", result);
      setShowTwo(true);
    } catch (error) {
      console.error("Ошибка удалении куратора:", error);
      setIsErrorVisible(true);
    }
  };

  const handleActivateCurator = async (e) => {
    e.preventDefault();

    try {
      const result = await disableHelperUser({
        variables: {
          token: user.token,
          id: parseInt(curatorId),
          isActive: true,
        },
      });
      console.log("Куратор успешно активирован:", result);
      setShowThree(true);
    } catch (error) {
      console.error("Ошибка активации куратора:", error);
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
    goToAllCurators();
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
            title={`Редактировать куратора #${curatorId}`}
            linkPrev={linkPrev}
          />
          <Row className="edit-curator__row">
            <Col className="edit-curator__column">
              <Form.Group controlId="NameForm">
                <Form.Label className="edit-curator__field-label">
                  Имя
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input"
                  value={nameValue}
                  onChange={handleOnChangeName}
                />
              </Form.Group>

              <Form.Group controlId="SurnameForm">
                <Form.Label className="edit-curator__field-label">
                  Фамилия
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input"
                  value={surnameValue}
                  onChange={handleOnChangeSurname}
                />
              </Form.Group>

              <Form.Group controlId="PatronymicForm">
                <Form.Label className="edit-curator__field-label">
                  Отчество
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input"
                  value={patronymicValue}
                  onChange={handleOnChangePatronymic}
                />
              </Form.Group>

              <Form.Group
                className="edit-curator__field-column"
                controlId="BirthdayForm"
              >
                <Form.Label className="edit-curator__field-label">
                  Дата рождения
                </Form.Label>
                <DatePicker
                  id="DatePicker"
                  className="add-curator__date-picker"
                  locale={{
                    sunday: "Вс",
                    monday: "Пн",
                    tuesday: "Вт",
                    wednesday: "Ср",
                    thursday: "Чт",
                    friday: "Пн",
                    saturday: "Сб",
                    ok: "OK",
                    today: "Сегодня",
                    yesterday: "Вчера",
                  }}
                  format="dd.MM.yyyy"
                  value={birthdayValue}
                  onChange={(date) => setBirthdayValue(date)}
                />
              </Form.Group>

              {user.role === "system" && (
                <>
                  <Form.Group
                    className="edit-curator__field-column"
                    controlId="CountryForm"
                  >
                    <div className="edit-curator__checkbox-block">
                      <Form.Check
                        className=""
                        type="checkbox"
                        id="custom-switch"
                        value={selectedAccessCurators}
                        checked={selectedAccessCurators}
                        onChange={handleOnChangeAccessCurators}
                      />
                      <span className="edit-curator__field-label">
                        Редактирование кураторов
                      </span>
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="edit-curator__field-column"
                    controlId="CountryForm"
                  >
                    <div className="edit-curator__checkbox-block">
                      <Form.Check
                        type="checkbox"
                        id="custom-switch"
                        value={selectedAccessThemes}
                        checked={selectedAccessThemes}
                        onChange={handleOnChangeAccessThemes}
                      />
                      <span className="edit-curator__field-label">
                        Редактирование тем
                      </span>
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="edit-curator__field-column"
                    controlId="CountryForm"
                  >
                    <div className="edit-curator__checkbox-block">
                      <Form.Check
                        type="checkbox"
                        id="custom-switch"
                        value={selectedAccessTransfers}
                        checked={selectedAccessTransfers}
                        onChange={handleOnChangeAccessTransfers}
                      />
                      <span className="edit-curator__field-label">
                        Редактирование переводов
                      </span>
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="edit-curator__field-column"
                    controlId="CountryForm"
                  >
                    <div className="edit-curator__checkbox-block">
                      <Form.Check
                        type="checkbox"
                        id="custom-switch"
                        value={selectedAccessToAnswers}
                        checked={selectedAccessToAnswers}
                        onChange={handleOnChangeAccessAnswers}
                      />
                      <span className="edit-curator__field-label">
                        Возможность отвечать на обращения
                      </span>
                    </div>
                  </Form.Group>
                </>
              )}
            </Col>

            <Col className="edit-curator__column">
              <Form.Group
                className="edit-curator__field-column"
                controlId="CountryForm"
              >
                <Form.Label className="edit-curator__field-label">
                  Страна
                </Form.Label>
                <DropdownButton id="dropdown-custom-1" title={selectedCountry}>
                  {countryList.map((country, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() =>
                        handleCountryClick(country.name.stroke, country.id)
                      }
                      href="#"
                    >
                      {country.name.stroke}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Form.Group>

              <Form.Group
                className="edit-curator__field-column"
                controlId="DepartmentsForm"
              >
                <Form.Label className="edit-curator__field-label">
                  Департаменты
                </Form.Label>

                <MultiSelect
                  value={selectedDepartments}
                  onChange={(e) => handleDepartmentsOnChange(e.value)}
                  options={newDepartmentList}
                  optionLabel="name"
                  className="add-curator__multiselect"
                />
              </Form.Group>

              <Form.Group
                className="edit-curator__field-column"
                controlId="JobTitleForm"
              >
                <Form.Label className="edit-curator__field-label">
                  Должность
                </Form.Label>
                <DropdownButton id="dropdown-custom-1" title={selectedJobTitle}>
                  {jobTltleList.map((jobTitle, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() =>
                        handleJobTitleClick(jobTitle.name.stroke, jobTitle.id)
                      }
                      href="#"
                    >
                      {jobTitle.name.stroke}
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
                    onClick={handleEditCurator}
                  />
                  {isActive ? (
                    <ButtonCustom
                      title="Деактивировать куратора"
                      className={
                        "add-curator__btn edit-curator__btn alltickets__button-two"
                      }
                      onClick={handleDeleteCurator}
                    />
                  ) : (
                    <ButtonCustom
                      title="Активировать куратора"
                      className={
                        "add-curator__btn edit-curator__btn alltickets__button-two"
                      }
                      onClick={handleActivateCurator}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <Modal show={show} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Куратор обновлен</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Данные куратора успешно обновлены</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseLeave}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showTwo} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Куратор деактивирован</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Куратор успешно деактивирован</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseLeave}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showThree} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Куратор активирован</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Куратор успешно активирован</p>
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
              <p>Вы уверены, что хотите деактивировать куратора?</p>
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
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default EditCurator;
