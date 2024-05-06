import { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { LANGUAGE_LIST, COUNTRY, HELPER_PERMS } from "../apollo/queries";
import { EDIT_COUNTRY, DELETE_COUNTRY } from "../apollo/mutations";

import { MultiSelect } from "primereact/multiselect";
import BackTitle from "../components/back-title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import NotFoundPage from "./not-found-page";

import "../css/edit-ticket.css";
import "../css/edit-curator.css";

function EditCountry() {
  const { countryId } = useParams();
  const [langs, setLangs] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [selectedLangsId, setSelectedLangsId] = useState([]);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [linkPrev, setLinkPrev] = useState(null);

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
      user.role === "system" ||
      dataPerms?.helperQuery?.helperPerms.translationEdit
    );
  };

  const { loading, error, data } = useQuery(LANGUAGE_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });
  const { data: dataCountry } = useQuery(COUNTRY, {
    variables: {
      token: user.token,
      id: parseInt(countryId),
    },
  });

  const navigate = useNavigate();

  const goToCountries = () => {
    navigate("/countries");
  };

  useEffect(() => {
    if (dataCountry && dataCountry.clientQuery.country) {
      setNameValue(dataCountry.clientQuery.country.name.stroke);
      setCodeValue(dataCountry.clientQuery.country.code);
      setSelectedLangs(
        dataCountry.clientQuery.country.langs.map((lang) => ({
          name: lang.name,
          id: lang.id,
        }))
      );
      setSelectedLangsId(
        dataCountry.clientQuery.country.langs.map((lang) => lang.id)
      );
    }

    if (data && data.clientQuery.langList) {
      setLangs(data.clientQuery.langList);
    }

    setLinkPrev("/countries");
  }, [data, dataCountry, location.state]);

  const [editCountry] = useMutation(EDIT_COUNTRY);
  const [deleteCountry] = useMutation(DELETE_COUNTRY);

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleCodeChange = (e) => {
    setCodeValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Укажите название страны";
    } else if (codeValue.trim() == "") {
      error = "Укажите код страны";
    } else if (selectedLangsId.length == 0) {
      error = "Выберите язык";
    } else {
      error = "Ошибка при изменении страны";
    }

    return error;
  };

  const handleEditCountry = async (e) => {
    e.preventDefault();

    if (
      nameValue.trim() == "" ||
      codeValue.trim() == "" ||
      selectedLangsId.length == 0
    ) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await editCountry({
        variables: {
          token: user.token,
          id: parseInt(countryId),
          stroke: nameValue.trim(),
          code: codeValue.trim(),
          langIds: selectedLangsId,
        },
      });

      console.log("Страна успешно обновлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении страны:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShowTwo = () => {
    setShowTwo(true);
  };

  const handleCloseLeave = () => {
    setShow(false);
    setShowTwo(false);
    goToCountries();
  };

  const handleClose = () => {
    setShowWarning(false);
  };

  const handleDeleteCountry = (e) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    setShowWarning(false);

    try {
      const result = await deleteCountry({
        variables: {
          token: user.token,
          id: parseInt(countryId),
        },
      });

      console.log("Страна успешно удалена:", result);
      handleShowTwo();
    } catch (error) {
      console.error("Ошибка при удалении страны:", error);
      setIsErrorVisible(true);
    }
  };

  const newLangs = langs.map((lang) => ({
    name: lang.name,
    id: lang.id,
  }));

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={`Редактировать страну #${countryId}`}
            linkPrev={linkPrev}
          />
          <Row
            className="add-curator__row edit-country__container"
            style={{ marginTop: "20px" }}
          >
            <Col className="add-curator__column add-subtheme__column">
              <div className="edit-subtheme__field">
                <Form.Label className="edit-curator__field-label">
                  Название
                </Form.Label>
                <Form.Group controlId="NameForm">
                  <Form.Control
                    type="text"
                    placeholder="Введите название страны"
                    value={nameValue}
                    className="add-currator__input"
                    onChange={handleNameChange}
                  />
                </Form.Group>
              </div>
              <div className="edit-subtheme__field">
                <Form.Label className="edit-curator__field-label">
                  Код
                </Form.Label>
                <Form.Group controlId="CodeForm">
                  <Form.Control
                    type="text"
                    placeholder="Введите код страны"
                    value={codeValue}
                    className="add-currator__input"
                    onChange={handleCodeChange}
                  />
                </Form.Group>
              </div>
              <div className="edit-subtheme__field">
                <Form.Label className="edit-curator__field-label">
                  Языки
                </Form.Label>
                <MultiSelect
                  value={selectedLangs}
                  onChange={(e) => handleLangsChange(e.value)}
                  options={newLangs}
                  optionLabel="name"
                  placeholder="Выберите языки"
                  className="add-curator__multiselect"
                />
              </div>
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <div className="edit-curator__btn-row">
                <ButtonCustom
                  title="Применить"
                  className={"edit-curator__btn button-hover"}
                  onClick={handleEditCountry}
                />
                <ButtonCustom
                  title="Удалить страну"
                  className={
                    "add-curator__btn edit-curator__btn alltickets__button-two button-outlined"
                  }
                  onClick={handleDeleteCountry}
                />
              </div>
            </Col>
          </Row>

          <Modal show={show} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Страна обновлена</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Страна успешно обновлена</p>
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
              <p>Вы уверены, что хотите удалить страну?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Отмена
              </Button>
              <Button variant="primary" onClick={handleConfirmDelete}>
                Продолжить
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showTwo} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Страна удалена</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Страна успешно удалена</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseLeave}>
                Закрыть
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

export default EditCountry;
