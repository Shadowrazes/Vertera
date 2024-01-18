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
import { EDIT_HELPER_USER } from "../apollo/mutations";

import { DatePicker } from "rsuite";
import { MultiSelect } from "primereact/multiselect";
import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

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
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const { loading, error, data } = useQuery(HELPER, {
    variables: {
      id: parseInt(curatorId),
    },
  });

  const { data: dataDepartmentsList } = useQuery(DEPARTMENTS_LIST);
  const { data: dataJobTitleList } = useQuery(JOB_TITLE_LIST);
  const { data: dataCountryList } = useQuery(COUNTRY_LIST);

  const [editHelperUser, { loading: loadingEditHelper }] =
    useMutation(EDIT_HELPER_USER);

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.helper) {
      // console.log(data.helper.birthday);
      setBirthdayValue(new Date(data.helper.birthday));
    }

    if (data && data.helper.user) {
      // console.log(data.helper.user);
      setNameValue(data.helper.user.name);
      setSurnameValue(data.helper.user.surname);
      setPatronymicValue(data.helper.user.patronymic);
      setSelectedCountry(data.helper.user.country.name.stroke);
      setSelectedCountryId(data.helper.user.country.id);
    }

    if (data && data.helper.departments) {
      setSelectedDepartments(
        data.helper.departments.map((department) => ({
          name: department.name.stroke,
          id: department.id,
        }))
      );
      setSelectedDepartmentsId(
        data.helper.departments.map((department) => department.id)
      );
      // console.log(data.helper.departments);
    }

    if (data && data.helper.jobTitle) {
      // console.log(data.helper.jobTitle.name.stroke);
      setSelectedJobTitle(data.helper.jobTitle.name.stroke);
      setSelectedJobTitleId(data.helper.jobTitle.id);
    }

    if (dataDepartmentsList && dataDepartmentsList.departmentList) {
      setDepartmentList(dataDepartmentsList.departmentList);
    }

    if (dataJobTitleList && dataJobTitleList.jobTitleList) {
      // console.log(dataJobTitleList.jobTitleList);
      setJobTitleList(dataJobTitleList.jobTitleList);
    }

    if (dataCountryList && dataCountryList.countryList) {
      setCountryList(dataCountryList.countryList);
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

  const handleOnChangeName = (e) => {
    setNameValue(e.target.value);
  };

  const handleOnChangeSurname = (e) => {
    setSurnameValue(e.target.value);
  };

  const handleOnChangePatronymic = (e) => {
    setPatronymicValue(e.target.value);
  };

  const handleCountryClick = (country, countryId) => {
    setSelectedCountry(country);
    setSelectedCountryId(countryId);
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
  };

  const handleJobTitleClick = (jobTitle, jobTitleId) => {
    // setSelectedItemJobTitle(jobTitle);
    setSelectedJobTitle(jobTitle);
    setSelectedJobTitleId(jobTitleId);
  };

  const errorMsg = () => {
    let error = "";

    if (selectedDepartmentsId.length == 0) {
      error = "Выберите департамент";
    }

    return error;
  };

  const handleEditCurator = async (e) => {
    e.preventDefault();

    const formattedDate = handlePeriodClick(birthdayValue);

    // console.log(idValue);
    // console.log(nameValue);
    // console.log(surnameValue);
    // console.log(patronymicValue);
    // console.log(formattedDate);
    // console.log(selectedCountry);
    // console.log(selectedCountryId);
    // console.log(selectedDepartments.map((department) => department.name));
    // console.log(selectedDepartmentsId);
    // console.log(selectedJobTitle);
    // console.log(selectedJobTitleId);

    if (selectedDepartmentsId.length == 0) {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      let result;
      if (patronymicValue == null || patronymicValue.trim() == "") {
        result = await editHelperUser({
          variables: {
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
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <ButtonCustom
            title="Применить"
            className={"add-curator__btn edit-curator__btn"}
            onClick={handleEditCurator}
          />
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ваше обращение создано</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Данные куратора успешно обновлены</p>
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

export default EditCurator;
