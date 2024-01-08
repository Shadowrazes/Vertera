import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { LOGIN, USER } from "../apollo/queries";

import Logo from "../assets/logo.svg";
import headerBtn from "../assets/header_exit.svg";
import "../css/header.css";

function Header({ user }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isError, setIsError] = useState(false);

  const [loginVariables, setLoginVariables] = useState({
    login: "",
    password: "",
  });

  const { data, refetch } = useQuery(LOGIN);

  const handleClose = () => {
    setShowLoginModal(false);
    setShowLogoutModal(false);
  };

  const handleShow = () => {
    if (user) {
      setShowLogoutModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleInput = (event) => {
    setLoginVariables({
      ...loginVariables,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (user) {
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      document.location.href = "/";
    }

    setIsLoad(true);
    setIsError(false);
    try {
      const { data: loginData } = await refetch(loginVariables);
      if (loginData) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: loginData.login.userId,
            login: loginVariables.login,
            token: loginData.login.token,
          })
        );
        document.location.href = "/all-tickets";
      }
    } catch (error) {
      setTimeout(() => {
        setIsError(true);
      }, 1000);
    } finally {
      setTimeout(() => {
        setIsLoad(false);
      }, 1000);
    }
  };

  const userInLocalStorage = JSON.parse(localStorage.getItem("user"));

  if (userInLocalStorage !== null) {
    const { error: loadingUser, data: dataUser } = useQuery(USER, {
      variables: {
        id: userInLocalStorage.id,
      },
    });

    useEffect(() => {
      if (data) {
        // console.log(data);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.login.userId,
            login: loginVariables.login,
            token: data.login.token,
          })
        );
        document.location.href = "/all-tickets";
      }

      if (dataUser && dataUser.user) {
        const userRole = dataUser.user.role;
        localStorage.setItem(
          "userRole",
          JSON.stringify({
            role: userRole,
          })
        );
      }
      //console.log(JSON.parse(localStorage.getItem("userRole")).role);
    }, [data, dataUser, loginVariables]);
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul>
          <li>Все обращения</li>
          <li>Все кураторы</li>
          <li>Выйти</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <section className="header">
        <div className="header__container container">
          <a href="/">
            <img className="header__logo" src={Logo} alt=""></img>
          </a>
          <div className="header__btn-group">
            <a className="header__exit" href="#" onClick={handleShow}>
              {user ? user.login : "Войти"}
            </a>
            <a href="#" className="header__button" onClick={handleShow}>
              <img src={headerBtn} alt="" className="header__button-svg" />
            </a>
          </div>
        </div>
      </section>

      {/* Попап авторизации */}
      <Modal show={showLoginModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Авторизация в системе VERTERA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="">
            <Form.Group controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Логин
              </Form.Label>
              <Col sm="12">
                <Form.Control
                  placeholder="Логин"
                  name="login"
                  onChange={handleInput}
                />
              </Col>
            </Form.Group>

            <Form.Group controlId="formPlaintextPassword" className="mt-2">
              <Form.Label column sm="2">
                Пароль
              </Form.Label>
              <Col sm="12">
                <Form.Control
                  type="password"
                  placeholder="Пароль"
                  name="password"
                  onChange={handleInput}
                />
              </Col>
            </Form.Group>
          </Form>

          {isError && (
            <Alert variant="danger" className="mt-3">
              Неверный логин или пароль
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="loginCancel" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            disabled={isLoad}
            id="loginSubmit"
            onClick={handleSubmit}
          >
            {isLoad ? <Spinner animation="border" size="sm" /> : "Войти"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Попап выхода */}
      <Modal show={showLogoutModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Авторизация в системе VERTERA</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" id="loginCancel" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            disabled={isLoad}
            id="loginSubmit"
            onClick={handleSubmit}
          >
            Выйти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
