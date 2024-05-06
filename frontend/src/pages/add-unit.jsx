import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Modal,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import { HELPER_PERMS } from "../apollo/queries";
import { ADD_UNIT } from "../apollo/mutations";

import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";
import NotFoundPage from "./not-found-page";

function addUnit() {
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [nameValue, setNameValue] = useState("");

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
      user.role === "system" || dataPerms?.helperQuery?.helperPerms.themeEdit
    );
  };

  const navigate = useNavigate();

  const goToAllUnits = () => {
    navigate("/units");
  };

  useEffect(() => {
    setLinkPrev("/units");
  }, [location.state]);

  const [addUnit] = useMutation(ADD_UNIT);

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Укажите название раздела";
    } else {
      error = "Ошибка при добавлении раздела";
    }

    return error;
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();

    // console.log(nameValue);

    if (nameValue.trim() == "") {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addUnit({
        variables: {
          token: user.token,
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: 1,
        },
      });

      console.log("Раздел успешно добавлен:", result);
      handleShow();
    } catch (error) {
      // console.error("Ошибка при добавлении раздела:", error);

      const networkError = error.networkError;

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        }
      }
      // console.log(networkError);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    goToAllUnits();
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle title="Добавить раздел" linkPrev={linkPrev} />
          <Row className="add-curator__row add-unit__row">
            <Col className="add-curator__column">
              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder="Название раздела"
                  value={nameValue}
                  className="add-currator__input add-theme__dropdown"
                  onChange={handleNameChange}
                />
              </Form.Group>
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <ButtonCustom
                title="Применить"
                className={"add-curator__btn button-hover"}
                onClick={handleAddUnit}
              />
            </Col>
          </Row>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Раздел создан</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Новый раздел успешно создан</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
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

export default addUnit;
