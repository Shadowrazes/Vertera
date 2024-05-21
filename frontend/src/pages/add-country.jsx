import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { LANGUAGE_LIST, HELPER_PERMS } from "../apollo/queries";
import { ADD_COUNTRY } from "../apollo/mutations";

import { MultiSelect } from "primereact/multiselect";
import BackTitle from "../components/back-title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import "../css/edit-ticket.css";

function AddCountry() {
  const [langs, setLangs] = useState([]);
  const [codeValue, setCodeValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [selectedLangsId, setSelectedLangsId] = useState([]);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [linkPrev, setLinkPrev] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const modalTitle = "Страна добавлена";
  const modalBody = "Страна успешно добавлена";

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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
    },
  });

  const navigate = useNavigate();

  const goToCountries = () => {
    navigate("/countries");
  };

  useEffect(() => {
    if (data && data.clientQuery.langList) {
      setLangs(data.clientQuery.langList);
    }

    setLinkPrev("/countries");
  }, [data, location.state]);

  const [addCountry] = useMutation(ADD_COUNTRY);

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

    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
  }

  const handleCodeChange = (e) => {
    setCodeValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleLangsChange = (langs) => {
    setSelectedLangs(langs);
    setSelectedLangsId(langs.map((lang) => lang.id));
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
      error = "Ошибка при добавлении страны";
    }

    return error;
  };

  const handleAddCountry = async (e) => {
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
      const result = await addCountry({
        variables: {
          token: user.token,
          stroke: nameValue.trim(),
          code: codeValue.trim(),
          langIds: selectedLangsId,
        },
      });

      console.log("Страна успешно добавлена:", result);
      handleShowModal();
    } catch (error) {
      console.error("Ошибка при добавлении страны:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    goToCountries();
  };

  const newLangs = langs.map((lang) => ({
    name: lang.name,
    id: lang.id,
  }));

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle title="Добавить страну" linkPrev={linkPrev} />
          <Row className="add-curator__row" style={{ marginTop: "20px" }}>
            <Col className="add-curator__column add-subtheme__column">
              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder="Введите название страны"
                  value={nameValue}
                  className="add-currator__input"
                  onChange={handleNameChange}
                />
              </Form.Group>
              <Form.Group controlId="CodeForm">
                <Form.Control
                  type="text"
                  placeholder="Введите код страны"
                  value={codeValue}
                  className="add-currator__input"
                  onChange={handleCodeChange}
                />
              </Form.Group>
              <MultiSelect
                value={selectedLangs}
                onChange={(e) => handleLangsChange(e.value)}
                options={newLangs}
                optionLabel="name"
                placeholder="Выберите языки"
                className="add-curator__multiselect"
              />
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}

              <ButtonCustom
                title="Применить"
                className={"add-curator__btn button-hover"}
                onClick={handleAddCountry}
              />
            </Col>
          </Row>

          <ModalDialog
            show={showModal}
            onClose={handleCloseModal}
            modalTitle={modalTitle}
            modalBody={modalBody}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default AddCountry;
