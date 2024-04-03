import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";

import { UNIT } from "../apollo/queries";
import { EDIT_UNIT, DELETE_UNIT, ACTIVATE_UNIT } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import NotFoundPage from "./not-found-page";

function EditUnit() {
  const { unitId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [nameValue, setNameValue] = useState("");
  const [visibility, setVisibility] = useState(null);
  const [orderNum, setOrderNum] = useState(0);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showThree, setShowThree] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
  };

  const { loading, error, data, refetch } = useQuery(UNIT, {
    variables: {
      token: user.token,
      id: parseInt(unitId),
    },
  });

  const [editUnit, { loading: loadingEditUnit }] = useMutation(EDIT_UNIT);
  const [deleteUnit, { loading: loadingDeleteUnit }] = useMutation(DELETE_UNIT);
  const [activateUnit, { loading: loadingActivateUnit }] =
    useMutation(ACTIVATE_UNIT);

  const navigate = useNavigate();

  const goToAllUnits = () => {
    navigate("/units");
  };

  useEffect(() => {
    if (data && data.helperQuery.unit) {
      setNameValue(data.helperQuery.unit.name.stroke);
      setVisibility(data.helperQuery.unit.visibility);
      setOrderNum(data.helperQuery.unit.orderNum);
      // console.log(data.helperQuery.unit.name.stroke);
    }

    setLinkPrev("/units");

    refetch();
  }, [data, location.state]);

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
    setIsErrorVisible(false);
  };

  const handleOnChangeOrderNum = (e) => {
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
      error = "Ошибка при обработке раздела";
    }

    return error;
  };

  const handleEditUnit = async (e) => {
    e.preventDefault();

    if (nameValue.trim() == "" || orderNum < 0) {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      const result = await editUnit({
        variables: {
          token: user.token,
          id: parseInt(unitId),
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: 1,
          orderNum: orderNum,
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
          token: user.token,
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

  const handleActivateUnit = async (e) => {
    e.preventDefault();

    try {
      const result = await activateUnit({
        variables: {
          token: user.token,
          id: parseInt(unitId),
        },
      });
      console.log("Раздел успешно активирован:", result);
      setShowThree(true);
    } catch (error) {
      console.error("Ошибка активации раздела:", error);
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
      {isAdmin() ? (
        <>
          <BackTitle
            title={`Редактировать раздел #${unitId}`}
            linkPrev={linkPrev}
          />
          <Row>
            <Col className="edit-unit__column">
              <Form.Group controlId="NameForm">
                <Form.Label className="edit-curator__field-label">
                  Название раздела
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input add-theme__dropdown"
                  value={nameValue}
                  onChange={handleOnChangeName}
                />
                <Form.Label className="edit-curator__field-label">
                  Порядок
                </Form.Label>
                <Form.Control
                  type="number"
                  className="add-curator__input edit-unit__input-order"
                  value={orderNum}
                  onChange={handleOnChangeOrderNum}
                  min={0}
                />
              </Form.Group>

              <div className="edit-unit__column">
                {isErrorVisible && (
                  <span className="form__error">{errorMsg()}</span>
                )}
                <div className="edit-curator__btn-row">
                  <ButtonCustom
                    title="Применить"
                    className={"add-curator__btn edit-curator__btn"}
                    onClick={handleEditUnit}
                  />
                  {visibility === 3 ? (
                    <ButtonCustom
                      title="Активировать раздел"
                      className={
                        "add-curator__btn edit-curator__btn alltickets__button-two"
                      }
                      onClick={handleActivateUnit}
                    />
                  ) : (
                    <ButtonCustom
                      title="Деактивировать раздел"
                      className={
                        "add-curator__btn edit-curator__btn alltickets__button-two"
                      }
                      onClick={handleDeleteUnit}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>

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
              <Modal.Title>Раздел деактивирован</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Раздел успешно деактивирован</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseLeave}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showThree} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Раздел активирован</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Раздел успешно активирован</p>
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
                Вы уверены, что хотите деактивировать этот раздел, а также все
                темы и подтемы, соответствующие ему?
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
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default EditUnit;
