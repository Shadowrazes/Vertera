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

import { DEPARTMENTS_LIST, JOB_TITLE_LIST } from "../apollo/queries";
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
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [selectedJobTitleId, setSelectedJobTitleId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemJobTitle, setSelectedItemJobTitle] = useState(null);
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

  const { loading, error, data } = useQuery(DEPARTMENTS_LIST);
  const { data: dataJobTitle } = useQuery(JOB_TITLE_LIST);

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.adminQuery.departmentList) {
      setDepartmentList(data.adminQuery.departmentList);
    }

    if (dataJobTitle && dataJobTitle.adminQuery.jobTitleList) {
      setJobTitleList(dataJobTitle.adminQuery.jobTitleList);
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

  const handleDepartmentsOnChange = (departments) => {
    setSelectedDepartments(departments);
    setSelectedDepartmentsId(departments.map((department) => department.id));
    // console.log(departments);
  };

  const handleJobTitleClick = (jobTitle, jobTitleId) => {
    setSelectedItemJobTitle(jobTitle);
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
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            phone: phoneValue.trim(),
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
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            patronymic: patronymicValue.trim(),
            phone: phoneValue.trim(),
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
        </Col>

        <Col className="add-curator__column">
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
            title={selectedItemJobTitle || "Должность"}
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
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <ButtonCustom
            title="Применить"
            className={"add-curator__btn"}
            onClick={handleAddCurator}
          />
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ваше обращение создано</Modal.Title>
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
