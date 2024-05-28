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

import get_translation from "../helpers/translation";

function AddCountry() {
  const [langs, setLangs] = useState([]);
  const [codeValue, setCodeValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [selectedLangsId, setSelectedLangsId] = useState([]);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [linkPrev, setLinkPrev] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));

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
      error = get_translation("INTERFACE_ENTER_COUNTRY_NAME");
    } else if (codeValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_COUNTRY_CODE");
    } else if (selectedLangsId.length == 0) {
      error = get_translation("INTERFACE_SELECT_LANG");
    } else {
      error = get_translation("INTERFACE_ERROR_ADD_COUNTRY");
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
          <BackTitle
            title={get_translation("INTERFACE_ADD_COUNTRY")}
            linkPrev={linkPrev}
          />
          <Row className="add-curator__row" style={{ marginTop: "20px" }}>
            <Col className="add-curator__column add-subtheme__column">
              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_ENTER_COUNTRY_NAME")}
                  value={nameValue}
                  className="add-currator__input"
                  onChange={handleNameChange}
                />
              </Form.Group>
              <Form.Group controlId="CodeForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_ENTER_COUNTRY_CODE")}
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
                placeholder={get_translation("INTERFACE_SELECT_LANGS")}
                className="add-curator__multiselect"
              />
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}

              <ButtonCustom
                title={get_translation("INTERFACE_APPLY")}
                className={"add-curator__btn button-hover"}
                onClick={handleAddCountry}
              />
            </Col>
          </Row>

          <ModalDialog
            show={showModal}
            onClose={handleCloseModal}
            modalTitle={get_translation("INTERFACE_MESSAGE_COUNTRY_ADDED")}
            modalBody={get_translation("INTERFACE_MESSAGE_COUNTRY_ADDED_FULL")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default AddCountry;
