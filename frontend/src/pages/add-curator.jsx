import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
} from "react-bootstrap";

import { DatePicker } from "rsuite";
import { DEPARTMENTS_LIST, JOB_TITLE_LIST } from "../apollo/queries";
import { ADD_HELPER } from "../apollo/mutations";

import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";

import "../css/add-curator.css";

function AddCurator() {
  const [departmentList, setDepartmentList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
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
  const [phoneValue, setPhoneValue] = useState("");

  const { loading, error, data } = useQuery(DEPARTMENTS_LIST);
  const {
    loading: loadingJobTitle,
    error: errorJobTitle,
    data: dataJobTitle,
  } = useQuery(JOB_TITLE_LIST);

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.departmentList) {
      setDepartmentList(data.departmentList);
    }
    if (dataJobTitle && dataJobTitle.jobTitleList) {
      setJobTitleList(dataJobTitle.jobTitleList);
    }
    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, dataJobTitle, location.state]);

  const [addHelper] = useMutation(ADD_HELPER);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneValue(e.target.value);
  };

  const handleDepartmentClick = (department, departmentId) => {
    setSelectedItem(department);
    setSelectedDepartment(department);
    setSelectedDepartmentId(departmentId);
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

    if (selectedDepartmentId == null) {
      error = "Выберите департамент";
    } else if (selectedJobTitleId == null) {
      error = "Выберите должность";
    } else if (nameValue.trim() == "") {
      error = "Введите имя";
    } else if (phoneValue.trim() == "") {
      error = "Введите номер телефона";
    } else {
      error = "Ошибка при добавлении куратора";
    }

    return error;
  };

  const handleAddCurator = async (e) => {
    e.preventDefault();

    console.log(nameValue);
    console.log(phoneValue);
    console.log(selectedDate);
    console.log(selectedDepartment);
    console.log(selectedDepartmentId);
    console.log(selectedJobTitle);
    console.log(selectedJobTitleId);

    if (
      nameValue.trim() == "" ||
      phoneValue.trim() == "" ||
      selectedDepartmentId == null ||
      selectedJobTitleId == null
    ) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addHelper({
        variables: {
          fullName: nameValue,
          phone: phoneValue,
          departmentId: selectedDepartmentId,
          birthday: selectedDate,
          jobTitleId: selectedJobTitleId,
        },
      });

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

  return (
    <>
      <BackTitle title="Все кураторы" linkPrev={linkPrev} />
      <h2 className="add-curator__heading">Добавить куратора</h2>
      <Row className="add-curator__row">
        <Col className="add-curator__column">
          <Form.Group controlId="NameForm">
            <Form.Control
              type="text"
              placeholder="ФИО"
              value={nameValue}
              className="add-currator__input"
              onChange={handleNameChange}
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

          <DropdownButton
            id="dropdown-custom-1"
            title={selectedItem || "Выбрать департамент"}
          >
            {departmentList.map((department, index) => (
              <Dropdown.Item
                key={index}
                onClick={() =>
                  handleDepartmentClick(department.name.stroke, department.id)
                }
                href="#"
              >
                {department.name.stroke}
              </Dropdown.Item>
            ))}
          </DropdownButton>

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
