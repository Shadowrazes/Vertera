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

import {
  COUNTRY_LIST,
  DEPARTMENTS_LIST,
  JOB_TITLE_LIST,
} from "../apollo/queries";
import { ADD_HELPER_USER } from "../apollo/mutations";

import { DatePicker } from "rsuite";
import { MultiSelect } from "primereact/multiselect";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";

import "../css/add-curator.css";

function AddCurator() {
  const [departmentList, setDepartmentList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [selectedJobTitleId, setSelectedJobTitleId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [patronymicValue, setPatronymicValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const { loading, error, data } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
    },
  });

  const {
    loading: loadingCountryList,
    error: errorCountryList,
    data: dataCountryList,
  } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
    },
  });

  const {
    loading: loadingJobTitleList,
    error: errorJobTitleList,
    data: dataJobTitle,
  } = useQuery(JOB_TITLE_LIST, {
    variables: {
      token: user.token,
    },
  });

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.helperQuery.departmentList) {
      setDepartmentList(data.helperQuery.departmentList);
    }

    if (dataJobTitle && dataJobTitle.adminQuery.jobTitleList) {
      setJobTitleList(dataJobTitle.adminQuery.jobTitleList);
    }

    if (dataCountryList && dataCountryList.clientQuery.countryList) {
      setCountryList(dataCountryList.clientQuery.countryList);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, dataJobTitle, location.state]);

  const [addHelperUser] = useMutation(ADD_HELPER_USER);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingCountryList) {
    return <Loader />;
  }

  if (errorCountryList) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingJobTitleList) {
    return <Loader />;
  }

  if (errorJobTitleList) {
    return <h2>Что-то пошло не так</h2>;
  }

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
  };

  const handleSurnameChange = (e) => {
    setSurnameValue(e.target.value);
  };

  const handlePatronymicChange = (e) => {
    setPatronymicValue(e.target.value);
  };

  const handleLoginChange = (e) => {
    setLoginValue(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneValue(e.target.value);
  };

  const handleCountryClick = (country, countryId) => {
    setSelectedCountry(country);
    setSelectedCountryId(countryId);
  };

  const handleDepartmentsOnChange = (departments) => {
    setSelectedDepartments(departments);
    setSelectedDepartmentsId(departments.map((department) => department.id));
    // console.log(departments);
  };

  const handleJobTitleClick = (jobTitle, jobTitleId) => {
    setSelectedJobTitle(jobTitle);
    setSelectedJobTitleId(jobTitleId);
  };

  const handlePeriodClick = (originalDate) => {
    const year = originalDate.getFullYear();
    const month = ("0" + (originalDate.getMonth() + 1)).slice(-2);
    const day = ("0" + originalDate.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);

    // console.log(formattedDate);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Введите имя";
    } else if (surnameValue.trim() == "") {
      error = "Введите Фамилию";
    } else if (phoneValue.trim() == "") {
      error = "Введите номер телефона";
    } else if (selectedDate == null) {
      error = "Выберите дату рождения";
    } else if (selectedCountryId == null) {
      error = "Выберите страну";
    } else if (loginValue.trim() == "") {
      error = "Укажите логин";
    } else if (passwordValue.trim() == "") {
      error = "Укажите пароль";
    } else if (passwordValue.trim().length < 6) {
      error = "Плохой пароль";
    } else if (selectedDepartmentsId == []) {
      error = "Выберите департамент";
    } else if (selectedJobTitleId == null) {
      error = "Выберите должность";
    } else {
      error = "Ошибка при добавлении куратора";
    }

    return error;
  };

  const handleAddCurator = async (e) => {
    e.preventDefault();

    // console.log(nameValue);
    // console.log(surnameValue);
    // console.log(patronymicValue);
    // console.log(phoneValue);
    // console.log(selectedDate);
    // console.log(loginValue);
    // console.log(passwordValue);
    // console.log(selectedDepartmentsId);
    // console.log(selectedJobTitle);
    // console.log(selectedJobTitleId);

    if (
      nameValue.trim() == "" ||
      surnameValue.trim() == "" ||
      phoneValue.trim() == "" ||
      selectedDate == null ||
      selectedCountryId == null ||
      loginValue.trim() == "" ||
      passwordValue.trim() == "" ||
      passwordValue.trim().length < 6 ||
      selectedDepartmentsId == [] ||
      selectedJobTitleId == null
    ) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      let result;
      if (patronymicValue.trim() == "") {
        result = await addHelperUser({
          variables: {
            token: user.token,
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            phone: phoneValue.trim(),
            countryId: selectedCountryId,
            login: loginValue.trim(),
            password: passwordValue.trim(),
            departmentId: selectedDepartmentsId,
            birthday: selectedDate.trim(),
            jobTitleId: selectedJobTitleId,
          },
        });
      } else {
        result = await addHelperUser({
          variables: {
            token: user.token,
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            patronymic: patronymicValue.trim(),
            phone: phoneValue.trim(),
            countryId: selectedCountryId,
            login: loginValue.trim(),
            password: passwordValue.trim(),
            departmentId: selectedDepartmentsId,
            birthday: selectedDate.trim(),
            jobTitleId: selectedJobTitleId,
          },
        });
      }

      console.log("Куратор успешно добавлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при добавлении куратора:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    goToAllCurators();
  };

  const newDepartmentList = departmentList.map((department) => ({
    name: department.name.stroke,
    id: department.id,
  }));

  return (
    <>
      <BackTitle title="Добавить куратора" linkPrev={linkPrev} />
      <Row className="add-curator__row">
        <Col className="add-curator__column">
          <Form.Group controlId="NameForm">
            <Form.Control
              type="text"
              placeholder="Имя"
              value={nameValue}
              className="add-currator__input"
              onChange={handleNameChange}
            />
          </Form.Group>

          <Form.Group controlId="SurNameForm">
            <Form.Control
              type="text"
              placeholder="Фамилия"
              value={surnameValue}
              className="add-currator__input"
              onChange={handleSurnameChange}
            />
          </Form.Group>

          <Form.Group controlId="PatronymicForm">
            <Form.Control
              type="text"
              placeholder="Отчество (при наличии)"
              value={patronymicValue}
              className="add-currator__input"
              onChange={handlePatronymicChange}
            />
          </Form.Group>

          <Form.Group controlId="PhoneForm">
            <Form.Control
              type="phone"
              placeholder="Номер телефона"
              value={phoneValue}
              className="add-currator__input"
              onChange={handlePhoneChange}
            />
          </Form.Group>

          <DatePicker
            id="DatePicker"
            placeholder="Дата рождения"
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
            onChange={handlePeriodClick}
          />

          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <ButtonCustom
            title="Применить"
            className={"add-curator__btn"}
            onClick={handleAddCurator}
          />
        </Col>

        <Col className="add-curator__column">
          <DropdownButton
            id="dropdown-custom-1"
            title={selectedCountry || "Страна"}
          >
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

          <Form.Group controlId="LoginForm">
            <Form.Control
              type="text"
              placeholder="Логин"
              value={loginValue}
              className="add-currator__input"
              onChange={handleLoginChange}
            />
          </Form.Group>

          <Form.Group controlId="PasswordForm">
            <Form.Control
              type="text"
              placeholder="Пароль"
              value={passwordValue}
              className="add-currator__input"
              onChange={handlePasswordChange}
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

          <DropdownButton
            id="dropdown-custom-1"
            title={selectedJobTitle || "Должность"}
          >
            {jobTitleList.map((jobTitle, index) => (
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
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Куратор создан</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Новый куратор успешно добавлен</p>
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

export default AddCurator;
