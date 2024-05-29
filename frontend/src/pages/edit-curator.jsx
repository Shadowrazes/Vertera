import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Col, Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
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
import ModalDialog from "../components/modal-dialog";
import Loader from "../pages/loading";
import NotFoundPage from "./not-found-page";

import "../css/dropdown.css";
import "../css/edit-curator.css";

import get_translation from "../helpers/translation";

function EditCurator() {
  const { curatorId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [departmentList, setDepartmentList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
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

  const [selectedAccessHelperEdit, setSelectedAccessHelperEdit] =
    useState(false);
  const [selectedAccessThemeEdit, setSelectedAccessThemeEdit] = useState(false);
  const [selectedAccessTranslationEdit, setSelectedAccessTranslationEdit] =
    useState(false);
  const [selectedAccessSendMsg, setSelectedAccessSendMsg] = useState(false);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

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
      lang: language,
    },
  });

  const {
    loading: loadingDepartmentList,
    error: errorDepartmentList,
    data: dataDepartmentsList,
  } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });
  const {
    loading: loadingJobTitleList,
    error: errorJobTitleList,
    data: dataJobTitleList,
  } = useQuery(JOB_TITLE_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });
  const {
    loading: loadingCountryList,
    error: errorCountryList,
    data: dataCountryList,
  } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const [editHelperUser, { loading: loadingEditHelper }] =
    useMutation(EDIT_HELPER_USER);

  const [disableHelperUser, { loading: loadingDisableHelperUser }] =
    useMutation(DISABLE_HELPER_USER);

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
      setSelectedAccessSendMsg(data.helperQuery.helper.permissions.sendMsg);
      setSelectedAccessHelperEdit(
        data.helperQuery.helper.permissions.helperEdit
      );
      setSelectedAccessThemeEdit(data.helperQuery.helper.permissions.themeEdit);
      setSelectedAccessTranslationEdit(
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
      setLinkPrev("/curators");
    }
  }, [
    data,
    dataDepartmentsList,
    dataJobTitleList,
    dataCountryList,
    location.state,
  ]);

  if (
    loading ||
    loadingEditHelper ||
    loadingDisableHelperUser ||
    loadingCountryList ||
    loadingDepartmentList ||
    loadingJobTitleList
  ) {
    return <Loader />;
  }

  if (error || errorCountryList || errorDepartmentList || errorJobTitleList) {
    const networkError =
      error.networkError ??
      errorCountryList.networkError ??
      errorDepartmentList.networkError ??
      errorJobTitleList.networkError;

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
    setSelectedAccessHelperEdit(e.target.checked);
  };

  const handleOnChangeAccessThemes = (e) => {
    setSelectedAccessThemeEdit(e.target.checked);
  };

  const handleOnChangeAccessTransfers = (e) => {
    setSelectedAccessTranslationEdit(e.target.checked);
  };

  const handleOnChangeAccessAnswers = (e) => {
    setSelectedAccessSendMsg(e.target.checked);
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
      error = get_translation("INTERFACE_ENTER_NAME");
    } else if (surnameValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_SURNAME");
    } else if (birthdayValue == null) {
      error = get_translation("INTERFACE_BIRTHDAY");
    } else if (selectedCountry == null) {
      error = get_translation("INTERFACE_ENTER_COUNTRY");
    } else if (selectedDepartments.length == 0) {
      error = get_translation("INTERFACE_SELECT_DEPARTMENT");
    } else if (selectedJobTitle == null) {
      error = get_translation("INTERFACE_JOB_TITLE");
    } else {
      error = get_translation("INTERFACE_ERROR_CURATOR_CHANGE");
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
          sendMsg: selectedAccessSendMsg,
          helperEdit: selectedAccessHelperEdit,
          themeEdit: selectedAccessThemeEdit,
          translationEdit: selectedAccessTranslationEdit,
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
      handleShowSuccessModal();
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
    setShowWarningModal(false);

    try {
      const result = await disableHelperUser({
        variables: {
          token: user.token,
          id: parseInt(curatorId),
          isActive: false,
        },
      });
      console.log("Куратор успешно удален:", result);
      setShowDeactivateModal(true);
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
      setShowActivateModal(true);
    } catch (error) {
      console.error("Ошибка активации куратора:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShowSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const handleShowWarning = () => {
    setShowWarningModal(true);
  };

  const handleCloseModal = () => {
    setShowWarningModal(false);
  };

  const handleCloseModalLeave = () => {
    setShowSuccessModal(false);
    setShowDeactivateModal(false);
    setShowActivateModal(false);
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
            title={`${get_translation("INTERFACE_EDIT_CURATOR")} #${curatorId}`}
            linkPrev={linkPrev}
          />
          <Row className="edit-curator__row">
            <Col className="edit-curator__column">
              <Form.Group controlId="NameForm">
                <Form.Label className="edit-curator__field-label">
                  {get_translation("INTERFACE_NAME")}
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
                  {get_translation("INTERFACE_SURNAME")}
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
                  {get_translation("INTERFACE_PATRONYMIC")}
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
                  {get_translation("INTERFACE_DATE_OF_BIRTHDAY")}
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
                        value={selectedAccessHelperEdit}
                        checked={selectedAccessHelperEdit}
                        onChange={handleOnChangeAccessCurators}
                      />
                      <span className="edit-curator__field-label">
                        {get_translation("INTERFACE_PERMS_EDIT_CURATORS")}
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
                        value={selectedAccessThemeEdit}
                        checked={selectedAccessThemeEdit}
                        onChange={handleOnChangeAccessThemes}
                      />
                      <span className="edit-curator__field-label">
                        {get_translation("INTERFACE_PERMS_EDIT_THEMES")}
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
                        value={selectedAccessTranslationEdit}
                        checked={selectedAccessTranslationEdit}
                        onChange={handleOnChangeAccessTransfers}
                      />
                      <span className="edit-curator__field-label">
                        {get_translation("INTERFACE_PERMS_EDIT_TRANSLATIONS")}
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
                        value={selectedAccessSendMsg}
                        checked={selectedAccessSendMsg}
                        onChange={handleOnChangeAccessAnswers}
                      />
                      <span className="edit-curator__field-label">
                        {get_translation("INTERFACE_PERMS_SEND_MSG")}
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
                  {get_translation("INTERFACE_COUNTRY")}
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
                  {get_translation("INTERFACE_DEPARTAMENTS")}
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
                  {get_translation("INTERFACE_JOB")}
                </Form.Label>
                <DropdownButton id="dropdown-custom-1" title={selectedJobTitle}>
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
              </Form.Group>

              <div className="edit-curator__column">
                {isErrorVisible && (
                  <span className="form__error">{errorMsg()}</span>
                )}
                <div className="edit-curator__btn-row">
                  <ButtonCustom
                    title={get_translation("INTERFACE_APPLY")}
                    className={
                      "add-curator__btn edit-curator__btn button-hover"
                    }
                    onClick={handleEditCurator}
                  />
                  {isActive ? (
                    <ButtonCustom
                      title={get_translation("INTERFACE_DEACTIVATE_CURATOR")}
                      className={
                        "add-curator__btn edit-curator__btn alltickets__button-two button-outlined"
                      }
                      onClick={handleDeleteCurator}
                    />
                  ) : (
                    <ButtonCustom
                      title={get_translation("INTERFACE_ACTIVATE_CURATOR")}
                      className={
                        "add-curator__btn edit-curator__btn alltickets__button-two button-outlined"
                      }
                      onClick={handleActivateCurator}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <ModalDialog
            show={showSuccessModal}
            onClose={handleCloseModalLeave}
            modalTitle={get_translation("INTERFACE_CURATOR_CHANGED")}
            modalBody={get_translation("INTERFACE_CURATOR_CHANGED_FULL")}
          />

          <ModalDialog
            show={showDeactivateModal}
            onClose={handleCloseModalLeave}
            modalTitle={get_translation("INTERFACE_CURATOR_DEACTIVATED")}
            modalBody={get_translation("INTERFACE_CURATOR_DEACTIVATED_FULL")}
          />

          <ModalDialog
            show={showActivateModal}
            onClose={handleCloseModalLeave}
            modalTitle={get_translation("INTERFACE_CURATOR_ACTIVATED")}
            modalBody={get_translation("INTERFACE_CURATOR_ACTIVATED_FULL")}
          />

          <ModalDialog
            show={showWarningModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirm}
            modalTitle={get_translation("INTERFACE_WARNING")}
            modalBody={get_translation("INTERFACE_WARNING_DEACTIVATE_CURATOR")}
            warning={true}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default EditCurator;
