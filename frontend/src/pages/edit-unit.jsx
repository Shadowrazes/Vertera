import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, Col, Modal, Button } from "react-bootstrap";

import { UNIT } from "../apollo/queries";
import { EDIT_UNIT, DELETE_UNIT } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

function EditUnit() {
  const { unitId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [nameValue, setNameValue] = useState("");

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const { loading, error, data, refetch } = useQuery(UNIT, {
    variables: {
      id: parseInt(unitId),
    },
  });

  const [editUnit, { loading: loadingEditUnit }] = useMutation(EDIT_UNIT);
  const [deleteUnit, { loading: loadingDeleteUnit }] = useMutation(DELETE_UNIT);

  const navigate = useNavigate();

  const goToAllUnits = () => {
    navigate("/units");
  };

  useEffect(() => {
    if (data && data.unit) {
      setNameValue(data.unit.name.stroke);
      console.log(data.unit.name.stroke);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }

    refetch();
  }, [data, location.state]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  if (loadingEditUnit) {
    return <Loader />;
  }

  if (loadingDeleteUnit) {
    return <Loader />;
  }

  const handleOnChangeName = (e) => {
    setNameValue(e.target.value);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = "Укажите название раздела";
    } else {
      error = "Ошибка при обработке раздела";
    }

    return error;
  };

  const handleEditUnit = async (e) => {
    e.preventDefault();

    if (nameValue.trim() == "") {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      const result = await editUnit({
        variables: {
          id: parseInt(unitId),
          stroke: nameValue.trim(),
          lang: "ru",
        },
      });

      console.log("Раздел успешно обновлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении раздела:", error);
      setIsErrorVisible(true);
    }
  };

  const handleDeleteUnit = (e) => {
    e.preventDefault();
    handleShowWarning();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setShowWarning(false);

    try {
      const result = await deleteUnit({
        variables: {
          id: parseInt(unitId),
        },
      });
      console.log("Раздел успешно удален:", result);
      setShowTwo(true);
    } catch (error) {
      console.error("Ошибка удалении раздела:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShowWarning = () => {
    setShowWarning(true);
  };

  const handleClose = () => {
    setShow(false);
    setShowTwo(false);
    setShowWarning(false);
  };

  const handleCloseLeave = () => {
    setShow(false);
    setShowTwo(false);
    setShowWarning(false);
    goToAllUnits();
  };

  return (
    <>
      <BackTitle
        title={`Редактировать раздел #${unitId}`}
        linkPrev={linkPrev}
      />
      <Col className="edit-curator__column">
        <Form.Group controlId="NameForm">
          <Form.Label className="edit-curator__field-label">
            Название раздела
          </Form.Label>
          <Form.Control
            type="text"
            className="add-currator__input"
            value={nameValue}
            onChange={handleOnChangeName}
          />
        </Form.Group>

        <div className="edit-curator__column">
          {isErrorVisible && <span className="form__error">{errorMsg()}</span>}
          <div className="edit-curator__btn-row">
            <ButtonCustom
              title="Применить"
              className={"add-curator__btn edit-curator__btn"}
              onClick={handleEditUnit}
            />
            <ButtonCustom
              title="Удалить раздел"
              className={
                "add-curator__btn edit-curator__btn alltickets__button-two"
              }
              onClick={handleDeleteUnit}
            />
          </div>
        </div>
      </Col>

      <Modal show={show} onHide={handleCloseLeave}>
        <Modal.Header closeButton>
          <Modal.Title>Раздел обновлен</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Название раздела успешно обновлено</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLeave}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTwo} onHide={handleCloseLeave}>
        <Modal.Header closeButton>
          <Modal.Title>Раздел удален</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Раздел успешно удален</p>
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
          <p>
            Вы уверены, что хотите удалить этот раздел, а также все темы и
            подтемы, соответствующие ему?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Продолжить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditUnit;
