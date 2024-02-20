import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";

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
  const [orderNum, setOrderNum] = useState(0);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const isAdmin = () => {
    return user.role === "system";
  };

  const navigate = useNavigate();

  const goToAllUnits = () => {
    navigate("/units");
  };

  useEffect(() => {
    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [location.state]);

  const [addUnit] = useMutation(ADD_UNIT);

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleOrderNumChange = (e) => {
    setOrderNum(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Укажите название раздела";
    } else if (orderNum < 0) {
      error = "Порядок сортировки не может быть отрицательным";
    } else {
      error = "Ошибка при добавлении раздела";
    }

    return error;
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();

    // console.log(nameValue);

    if (nameValue.trim() == "" || orderNum < 0) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addUnit({
        variables: {
          // token: user.token,
          token: "123",
          stroke: nameValue.trim(),
          lang: "ru",
          orderNum: parseInt(orderNum),
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
          <Row className="add-curator__row">
            <Col className="add-curator__column">
              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder="Название раздела"
                  value={nameValue}
                  className="add-currator__input add-theme__dropdown"
                  onChange={handleNameChange}
                />
                <Form.Label className="edit-curator__field-label">
                  Порядок
                </Form.Label>
                <Form.Control
                  type="number"
                  className="add-currator__input"
                  placeholder="Порядок"
                  value={orderNum}
                  onChange={handleOrderNumChange}
                  min={0}
                />
              </Form.Group>
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <ButtonCustom
                title="Применить"
                className={"add-curator__btn"}
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
