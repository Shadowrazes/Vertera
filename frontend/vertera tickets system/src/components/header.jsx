import Logo from "../assets/logo.svg";
import headerBtn from "../assets/header_exit.svg";
import "../css/header.css";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Modal, Button, Form, Row, Col, Spinner, Alert  } from 'react-bootstrap';
import { LOGIN } from "../apollo/queries";

function Header({user, setUser}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isError, setIsError] = useState(false);

  const [loginVariables, setLoginVariables] = useState({
    login: "",
    password: ""
  })

  const { loading, error, data, refetch } = useQuery(LOGIN, loginVariables);

  const handleClose = () => {
    setShowLoginModal(false);
    setShowLogoutModal(false);
  };

  const handleShow = () => {
    if(user) {
      setShowLogoutModal(true);
    }
    else {
      setShowLoginModal(true);
    }
    
  };

  const handleInput = (event) => {
    let lastLoginVariables = loginVariables;
    lastLoginVariables[event.target.name] = event.target.value;
    setLoginVariables(lastLoginVariables);
  }

  async function handleSubmit (event) {
    if(user) {
      localStorage.removeItem('user');
      document.location.href = '/';
    }
    
    setIsLoad(true);
    setIsError(false);
    try {
      await refetch(loginVariables);
    }
    catch (error) {
      setTimeout(() => {
        setIsError(true);
      }, 1000);
    }
    setTimeout(() => {
      setIsLoad(false);
    }, 1000);
    
  }

  useEffect(() => {
    if(data) {
      console.log(loginVariables);
      localStorage.setItem('user', JSON.stringify({
        login: loginVariables.login,
        token: data.login
      }))
      document.location.href = '/admin';
    }
  }, [data])

  return (
    <>
      
      <section className="header">
        <div className="header__container container">
          <a href="/">
            <img className="header__logo" src={Logo} alt=""></img>
          </a>
          <div className="header__btn-group">
            <a className="header__exit" href="#" onClick={handleShow}>
              {user ? user.login : 'Войти'}
            </a>
            <a href="#" className="header__button" onClick={handleShow}>
              <img src={headerBtn} alt="" className="header__button-svg" />
            </a>
          </div>
        </div>
      </section>

      {/* Попап авторизации */}
      <Modal show={showLoginModal} onHide={handleClose} >
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
                <Form.Control placeholder="Логин" name="login" onChange={handleInput}/>
              </Col>
            </Form.Group>

            <Form.Group controlId="formPlaintextPassword" className="mt-2">
              <Form.Label column sm="2">
                Пароль
              </Form.Label>
              <Col sm="12">
                <Form.Control type="password" placeholder="Пароль" name="password" onChange={handleInput}/>
              </Col>
            </Form.Group>
          </Form>

          {isError && (
            <Alert variant='danger' className="mt-3">Неверный логин или пароль</Alert>
          )}
          

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="loginCancel" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" disabled={isLoad} id="loginSubmit" onClick={handleSubmit}>
            {isLoad ? (
              <Spinner animation="border" size="sm" />
            ) : "Войти"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Попап авторизации */}
      <Modal show={showLogoutModal} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Авторизация в системе VERTERA</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" id="loginCancel" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="primary" disabled={isLoad} id="loginSubmit" onClick={handleSubmit}>
            Выйти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
