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

import {} from "../apollo/queries";
import { ADD_UNIT } from "../apollo/mutations";

import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";

function addUnit() {
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [nameValue, setNameValue] = useState("");

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
          stroke: nameValue.trim(),
          lang: "ru",
        },
      });

      console.log("Раздел успешно добавлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при добавлении раздела:", error);
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
      <BackTitle title="Добавить раздел" linkPrev={linkPrev} />
      <Row className="add-curator__row">
        <Col className="add-curator__column">
          <Form.Group controlId="NameForm">
            <Form.Control
              type="text"
              placeholder="Название раздела"
              value={nameValue}
              className="add-currator__input"
              onChange={handleNameChange}
            />
          </Form.Group>
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
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
  );
}

export default addUnit;
