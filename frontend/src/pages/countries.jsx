import { useState, useEffect } from "react";
import { Table, Tabs, Tab, Form, Modal, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

import { COUNTRY_LIST, LANGUAGE_LIST, HELPER_PERMS } from "../apollo/queries";
import { ADD_LANG, DELETE_LANG, EDIT_LANG } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import DeleteIcon from "../assets/delete_icon.svg";
import ApplyIcon from "../assets/apply_icon.svg";
import "../css/table.css";
import "../css/edit-ticket.css";
import "../css/translation.css";
import "../css/countries.css";

function Countries() {
  const [countiesList, setCountiesList] = useState([]);
  const [langList, setLangList] = useState([]);
  const [changes, setChanges] = useState({});
  const [inputValues, setInputValues] = useState({});

  const [newCodeValue, setNewCodeValue] = useState("");
  const [newNameValue, setNewNameValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [queryError, setQueryError] = useState("");

  const [isAddLangVisible, setIsAddLangVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isApplyColumnVisible, setIsApplyColumnVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isErrorEditVisible, setIsErrorEditVisible] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [language, setLanguage] = useState(localStorage.getItem("language"));

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

  const { loading, error, data, refetch } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const {
    loading: loadingLangList,
    error: errorLangList,
    data: dataLangList,
    refetch: refetchLangList,
  } = useQuery(LANGUAGE_LIST, {
    variables: {
      token: user.token,
    },
  });

  const navigate = useNavigate();

  const goToAddCountry = () => {
    navigate("/add-country");
  };

  useEffect(() => {
    if (data && data.clientQuery.countryList) {
      setCountiesList(data.clientQuery.countryList);
    }

    if (dataLangList && dataLangList.clientQuery.langList) {
      setLangList(dataLangList.clientQuery.langList);
    }

    refetch();
    refetchLangList();
  }, [data, dataLangList]);

  const [addLang] = useMutation(ADD_LANG);
  const [deleteLang, { loading: loadingDelete }] = useMutation(DELETE_LANG);
  const [editLang] = useMutation(EDIT_LANG);

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

  if (loadingDelete) {
    return <Loader />;
  }

  if (loadingLangList) {
    return <Loader />;
  }

  if (errorLangList) {
    const networkError = errorLangList.networkError;

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

  const handleAddLangView = () => {
    setIsAddLangVisible(true);
    setIsButtonVisible(false);
  };

  const handleCloseClick = () => {
    setIsButtonVisible(true);
    setIsAddLangVisible(false);
    setIsErrorVisible(false);

    setNewNameValue("");
    setNewCodeValue("");
    setQueryError("");
  };

  const handleNewName = (e) => {
    setNewNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleNewCode = (e) => {
    setNewCodeValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (newCodeValue.trim() == "") {
      error = "Введите код языка";
    } else if (newNameValue.trim() == "") {
      error = "Введите название языка";
    } else if (queryError == "Unsolvable") {
      error = "Введен уже существующий код или название языка";
    } else {
      error = "Ошибка при добавлении языка";
    }

    return error;
  };

  const handleAddLang = async (e) => {
    e.preventDefault();

    if (
      newCodeValue.trim() == "" ||
      newNameValue.trim() == "" ||
      queryError == "Unsolvable"
    ) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addLang({
        variables: {
          token: user.token,
          code: newCodeValue.trim(),
          name: newNameValue.trim(),
        },
      });
      refetchLangList();
      setNewCodeValue("");
      setNewNameValue("");
      console.log("Язык успешно добавлен:", result);
    } catch (error) {
      console.log(error.networkError.result.errors[0].message);
      setQueryError(error.networkError.result.errors[0].message);
      setIsErrorVisible(true);
    }
  };

  const handleDeleteLang = async (e, id) => {
    e.preventDefault();
    setDeleteId(id);
    setShowWarning(true);
  };

  const handleCloseModal = () => {
    setShowWarning(false);
  };

  const handleCloseWarning = async () => {
    setShowWarning(false);
    setIsErrorEditVisible(false);

    const updatedChanges = { ...changes };
    delete updatedChanges[deleteId];
    setChanges(updatedChanges);

    if (Object.keys(updatedChanges).length == 0) {
      setIsApplyColumnVisible(false);
    }

    try {
      const result = await deleteLang({
        variables: {
          token: user.token,
          id: deleteId,
        },
      });
      refetchLangList();
      console.log("Язык успешно удален:", result);
    } catch (error) {
      console.log(error.networkError.result.errors[0].message);
    }
  };

  const handleLangChange = (id, field, value) => {
    setIsApplyColumnVisible(true);
    setIsErrorEditVisible(false);

    setChanges({ ...changes, [id]: true });

    setInputValues({
      ...inputValues,
      [id]: { ...inputValues[id], [field]: value, ["id"]: id },
    });
  };

  const isApplyVisible = (id) => {
    return changes[id];
  };

  const errorEditMsg = () => {
    let error = "Введите код или название языка";

    return error;
  };

  const handleApplyChange = async (id) => {
    if (inputValues[id].code == "" || inputValues[id].name.trim() == "") {
      setIsErrorEditVisible(true);
      return;
    }

    setIsErrorEditVisible(false);

    const updatedChanges = { ...changes };
    delete updatedChanges[id];
    setChanges(updatedChanges);

    if (Object.keys(updatedChanges).length == 0) {
      setIsApplyColumnVisible(false);
    }

    try {
      const result = await editLang({
        variables: {
          token: user.token,
          id: inputValues[id].id,
          code: inputValues[id].code,
          name: inputValues[id].name,
        },
      });
      console.log("Язык успешно обновлен", result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Все страны" className="title__heading" />
          <Tabs
            defaultActiveKey="countries"
            id="justify-tab-example"
            className="mb-3 edit-ticket__tabs"
            justify
          >
            <Tab
              className="chat__tab-wrapper"
              eventKey="countries"
              title="Страны"
            >
              <div className="table__wrapper">
                <Table className="table__table" hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Код</th>
                      <th>Название</th>
                      <th>Языки</th>
                      <th>Редактировать</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countiesList.map((country) => (
                      <tr key={country.id}>
                        <td>{country.id}</td>
                        <td>{country.code}</td>
                        <td>{country.name.stroke}</td>
                        <td>
                          {country.langs.map(
                            (lang, index) => (index ? ", " : "") + lang.name
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/edit-country/${country.id}`}
                            state={{
                              linkPrev: window.location.href,
                            }}
                            className="alltickets__link"
                          >
                            <img src={EditIcon} alt="" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <ButtonCustom
                title="Добавить страну"
                onClick={goToAddCountry}
                className={"table__btn button-hover"}
              />
            </Tab>
            <Tab className="chat__tab-wrapper" eventKey="langs" title="Языки">
              <div className="table__wrapper">
                <Table className="table__table" hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Код</th>
                      <th>Название</th>
                      <th>Удалить</th>
                      {isApplyColumnVisible && <th>Применить</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {langList.map((lang) => (
                      <tr key={lang.id}>
                        <td>
                          <Form.Control
                            type="text"
                            placeholder="ID"
                            value={lang.id}
                            className="countries__input countries__readonly-input"
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={
                              (inputValues[lang.id]?.code !== undefined
                                ? inputValues[lang.id]?.code
                                : lang.code) || ""
                            }
                            className="countries__input"
                            onChange={(e) =>
                              handleLangChange(lang.id, "code", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={
                              (inputValues[lang.id]?.name !== undefined
                                ? inputValues[lang.id]?.name
                                : lang.name) || ""
                            }
                            className="countries__input"
                            onChange={(e) =>
                              handleLangChange(lang.id, "name", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <img
                            src={DeleteIcon}
                            alt=""
                            className="countries__delete-icon"
                            onClick={(e) => handleDeleteLang(e, lang.id)}
                          />
                        </td>
                        <td>
                          {isApplyVisible(lang.id) && (
                            <img
                              src={ApplyIcon}
                              alt=""
                              className="countries__delete-icon"
                              onClick={() => handleApplyChange(lang.id)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {isErrorEditVisible && (
                <span
                  className="form__error"
                  style={{ marginBottom: "20px", display: "block" }}
                >
                  {errorEditMsg()}
                </span>
              )}
              {isButtonVisible && (
                <div className="countries__lang-buttons">
                  <ButtonCustom
                    title="Добавить язык"
                    onClick={handleAddLangView}
                    className={"table__btn button-hover"}
                  />
                </div>
              )}
              {isAddLangVisible && (
                <>
                  <div style={{ position: "relative" }}>
                    <a onClick={handleCloseClick}>
                      <div className="chat__edit-close"></div>
                    </a>
                    <div className="countries__column">
                      <Form.Control
                        type="text"
                        placeholder="Код"
                        value={newCodeValue}
                        className="add-currator__input"
                        onChange={handleNewCode}
                      />
                      <Form.Control
                        type="text"
                        placeholder="Название"
                        value={newNameValue}
                        className="add-currator__input"
                        onChange={handleNewName}
                      />
                      {isErrorVisible && (
                        <span className="form__error">{errorMsg()}</span>
                      )}
                      <ButtonCustom
                        title="Добавить"
                        onClick={handleAddLang}
                        className={"table__btn button-hover"}
                      />
                    </div>
                  </div>
                </>
              )}
            </Tab>
          </Tabs>

          <Modal show={showWarning} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Предупреждение</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Вы уверены, что хотите удалить этот язык?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseWarning}>
                Удалить
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

export default Countries;
