import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
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
  const [selectedVisibility, setSelectedVisibility] = useState(null);

  const visibilityItems = ["Все", "Куратор", "Админ"];

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
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
          token: user.token,
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: 1,
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

  // const handleVisibilityClick = (visibility) => {
  //   if (visibility === "Все") {
  //     setSelectedVisibility(2);
  //   } else if (visibility === "Куратор") {
  //     setSelectedVisibility(3);
  //   } else if (visibility === "Админ") {
  //     setSelectedVisibility(4);
  //   }
  // };

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
                {/* <Form.Label
                  className="edit-curator__field-label"
                  style={{ marginTop: "20px" }}
                >
                  Отображение
                </Form.Label>
                <DropdownButton
                  id="dropdown-custom-1"
                  title={selectedVisibility || "Выберите для кого отображать"}
                >
                  {visibilityItems.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      // onClick={}
                      href="#"
                    >
                      {item}
                    </Dropdown.Item>
                  ))}
                </DropdownButton> */}
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
