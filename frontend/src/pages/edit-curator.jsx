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

import {
  HELPER,
  DEPARTMENTS_LIST,
  JOB_TITLE_LIST,
  COUNTRY_LIST,
} from "../apollo/queries";
import {
  DELETE_USER,
  EDIT_HELPER_USER,
  DISABLE_HELPER_USER,
} from "../apollo/mutations";

import { DatePicker } from "rsuite";
import { MultiSelect } from "primereact/multiselect";
import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

import "../css/edit-curator.css";
import "../css/dropdown.css";

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

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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
    },
  });
  const { data: dataCountryList } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
    },
  });

  const [editHelperUser, { loading: loadingEditHelper }] =
    useMutation(EDIT_HELPER_USER);

  const [disableHelperUser, { loading: loadingDisableHelperUser }] =
    useMutation(DISABLE_HELPER_USER);

  const [deleteUser, { loading: loadingDeleteUser }] = useMutation(DELETE_USER);

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.helperQuery.helper) {
      // console.log(data.helper.birthday);
      setBirthdayValue(new Date(data.helperQuery.helper.birthday));
    }

    if (data && data.helperQuery.helper.user) {
      // console.log(data.helper.user);
      setNameValue(data.helperQuery.helper.user.name);
      setSurnameValue(data.helperQuery.helper.user.surname);
      setPatronymicValue(data.helperQuery.helper.user.patronymic);
      setSelectedCountry(data.helperQuery.helper.user.country.name.stroke);
      setSelectedCountryId(data.helperQuery.helper.user.country.id);
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

    if (dataJobTitleList && dataJobTitleList.adminQuery.jobTitleList) {
      // console.log(dataJobTitleList.jobTitleList);
      setJobTitleList(dataJobTitleList.adminQuery.jobTitleList);
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
      <BackTitle
        title={`Редактировать куратора #${curatorId}`}
        linkPrev={linkPrev}
      />
      <Row className="edit-curator__row">
        <Col className="edit-curator__column">
          <Form.Group controlId="NameForm">
            <Form.Label className="edit-curator__field-label">Имя</Form.Label>
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
              <ButtonCustom
                title="Удалить куратора"
                className={
                  "add-curator__btn edit-curator__btn alltickets__button-two"
                }
                onClick={handleDeleteCurator}
              />
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
          <Modal.Title>Куратор удален</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Куратор успешно удален</p>
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
          <p>Вы уверены, что хотите удалить куратора?</p>
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

export default EditCurator;
