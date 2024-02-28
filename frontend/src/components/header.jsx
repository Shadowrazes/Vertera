import { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import {
  Modal,
  Button,
  Form,
  Col,
  Spinner,
  Alert,
  Overlay,
  Popover,
  OverlayTrigger,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import { LOGIN, LOGIN_OUTER } from "../apollo/queries";
import { TRANSLATE } from "../apollo/queries";

import Logo from "../assets/logo.svg";
import headerBtn from "../assets/header_exit.svg";
import "../css/header.css";

import get_translation from "../helpers/translation";

async function Header({ user }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuTarget, setMenuTarget] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [isError, setIsError] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language"));
  const ref = useRef(null);

  const {
    loading: languageLoading,
    error: languageError,
    data: languageData,
  } = useQuery(TRANSLATE, {
    variables: {
      token: user?.token,
      lang: language,
    },
  });

  useEffect(() => {
    if (languageData?.clientQuery?.translationList) {
      let translateList = {};
      languageData.clientQuery.translationList.map((translate) => {
        translateList[translate.code] = translate.stroke;
      });
      localStorage.setItem("translation", JSON.stringify(translateList));
    }
  }, [languageData]);

  const languagesList = [
    {
      title: "Русский",
      code: "RU",
    },
    {
      title: "English",
      code: "EN",
    },
    {
      title: "Español",
      code: "ES",
    },
    {
      title: "Čeština",
      code: "CS",
    },
    {
      title: "Български",
      code: "BG",
    },
    {
      title: "Deutsch",
      code: "DE",
    },
    {
      title: "Magyar",
      code: "HU",
    },
    {
      title: "Қазақша",
      code: "KZ",
    },
  ];

  const [loginVariables, setLoginVariables] = useState({
    login: "",
    password: "",
  });

  const [userName, setUserName] = useState(
    JSON.parse(localStorage.getItem("user"))?.name
  );
  const [userSurname, setUserSurname] = useState(
    JSON.parse(localStorage.getItem("user"))?.surname
  );

  const isAdmin = () => {
    return user?.role === "system";
  };

  const isHelper = () => {
    return user?.role === "helper" || user?.role === "system";
  };

  const { data, refetch } = useQuery(LOGIN);
  const { data: dataOuter, refetch: refetchOuter } = useQuery(LOGIN);

  const handleClose = () => {
    setShowLoginModal(false);
    setShowLogoutModal(false);
  };

  const handleChangeLanguage = (code) => {
    localStorage.setItem("language", code);
    location.reload();
  };

  const handleShow = () => {
    if (user) {
      setShowLogoutModal(true);
    } else {
      setShowLoginModal(true);
    }
    setShowMenu(false);
  };

  const handleShowMenu = (event) => {
    setShowMenu(!showMenu);
    setMenuTarget(event.target);
  };

  const handleCloseOverlay = () => {
    setShowMenu(false);
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
            id: loginData.login.user.id,
            name: loginData.login.user.name,
            surname: loginData.login.user.surname,
            role: loginData.login.user.role,
            token: loginData.login.token,
          })
        );
        setUserName(loginData.login.user.name);
        setUserSurname(loginData.login.user.surname);
        console.log(userName);
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

  useEffect(() => {
    if (data) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.login.user.id,
          name: data.login.user.name,
          surname: data.login.user.surname,
          role: data.login.user.role,
          token: data.login.token,
        })
      );
      setUserName(data.login.user.name);
      setUserSurname(data.login.user.surname);
      console.log(userName);
      document.location.href = "/all-tickets";
    }
    refetch();
  }, [data, loginVariables]);

  useEffect(() => {
    if (language === null) {
      setLanguage("ru");
      localStorage.setItem("language", "RU");
    }
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleCloseOverlay();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const urlString = window.location.href;

  if (urlString.includes("/external/authorization")) {
    const url = new URL(urlString);
    const sessionKey = url.searchParams.get("session_key");
    console.log(sessionKey);
    // if (user) {
    //   localStorage.removeItem("user");
    //   document.location.href = "/";
    // }

    // setIsLoad(true);
    // setIsError(false);

    // try {
    //   const loginDataPromise = refetch(loginVariables);

    //   loginDataPromise.then((response) => {
    //     const loginData = response.data;

    //     if (loginData) {
    //       localStorage.setItem(
    //         "user",
    //         JSON.stringify({
    //           id: loginData.login.user.id,
    //           name: loginData.login.user.name,
    //           surname: loginData.login.user.surname,
    //           role: loginData.login.user.role,
    //           token: loginData.login.token,
    //         })
    //       );
    //       setUserName(loginData.login.user.name);
    //       setUserSurname(loginData.login.user.surname);
    //       console.log(userName);
    //       document.location.href = "/all-tickets";
    //     }
    //   });

    //   await loginDataPromise;
    // } catch (error) {
    //   setTimeout(() => {
    //     setIsError(true);
    //   }, 1000);
    // } finally {
    //   setTimeout(() => {
    //     setIsLoad(false);
    //   }, 1000);
    // }
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
          <div className="header__logo-wrapper">
            <a href={isAdmin() || isHelper() ? "/all-tickets" : "/"}>
              <img className="header__logo" src={Logo} alt=""></img>
            </a>
            <Dropdown className="language-menu">
              <Dropdown.Toggle
                variant="outline-success"
                className="language-menu__item-top"
              >
                {languagesList
                  .filter((languageItem) => {
                    return languageItem.code === language;
                  })
                  .map((languageItem, index) => (
                    <NavDropdown.Item
                      className="language-menu__item"
                      key={index}
                    >
                      <img
                        className="language-menu__flag"
                        src={
                          "/flags/" +
                          languageItem.code.toLocaleLowerCase() +
                          ".svg"
                        }
                        alt=""
                      />
                    </NavDropdown.Item>
                  ))}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {languagesList.map((language, index) => (
                  <NavDropdown.Item
                    onClick={handleChangeLanguage.bind(null, language.code)}
                    className="language-menu__item"
                    key={index}
                  >
                    <img
                      className="language-menu__flag"
                      src={
                        "/flags/" + language.code.toLocaleLowerCase() + ".svg"
                      }
                      alt=""
                    />
                    <span className="language-menu__text">
                      {language.title}
                    </span>
                  </NavDropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="header__btn-group" ref={ref}>
            <a
              className="header__exit"
              href="#"
              onClick={user ? handleShowMenu : handleShow}
            >
              {user
                ? `${userSurname} ${userName}`
                : get_translation("INTERFACE_LOG_IN")}
            </a>
            <a
              href="#"
              className="header__button"
              onClick={user ? handleShowMenu : handleShow}
            >
              <img src={headerBtn} alt="" className="header__button-svg" />
            </a>
          </div>
        </div>
      </section>

      <Overlay
        show={showMenu}
        target={menuTarget}
        placement="bottom-end"
        container={ref}
        containerPadding={20}
        rootClose={true}
      >
        <Popover id="popover-contained">
          <Popover.Body className="header-menu">
            <Nav
              defaultActiveKey={window.location.pathname}
              className="flex-column"
            >
              <Nav.Link href="/all-tickets">
                {get_translation("INTERFACE_TICKETS")}
              </Nav.Link>
              {isHelper() && (
                <Nav.Link href="/stats">
                  {get_translation("INTERFACE_STATS")}
                </Nav.Link>
              )}
              {isAdmin() && (
                <>
                  <Nav.Link href="/curators">
                    {get_translation("INTERFACE_CURATORS")}
                  </Nav.Link>
                  <Nav.Link href="/themes">
                    {get_translation("INTERFACE_THEMES")}
                  </Nav.Link>
                </>
              )}
              <Nav.Link>
                <Button variant="danger" size="sm" onClick={handleShow}>
                  {get_translation("INTERFACE_LOG_OUT")}
                </Button>
              </Nav.Link>
            </Nav>
          </Popover.Body>
        </Popover>
      </Overlay>

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
            {get_translation("INTERFACE_LOG_OUT")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
