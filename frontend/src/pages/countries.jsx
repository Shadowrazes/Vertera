import { useState, useEffect } from "react";
import { Table, Tabs, Tab, Form, Col } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

import { COUNTRY_LIST, LANGUAGE_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/table.css";
import "../css/edit-ticket.css";
import "../css/translation.css";
import "../css/countries.css";

function Countries() {
  const [countiesList, setCountiesList] = useState([]);
  const [langList, setLangList] = useState([]);

  const [isAddLangVisible, setIsAddLangVisible] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  const { loading, error, data, refetch } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
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
                        <td>{country.langs.map((lang) => lang.name)}</td>
                        <td>
                          <img src={EditIcon} alt="" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <ButtonCustom
                title="Добавить страну"
                onClick={goToAddCountry}
                className={"table__btn"}
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
                            className="add-currator__input translation__readonly-input"
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={lang.code}
                            className="add-currator__input"
                            //   onChange={}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={lang.name}
                            className="add-currator__input"
                            //   onChange={}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <ButtonCustom
                title="Добавить язык"
                onClick={handleAddLangView}
                className={"table__btn"}
              />
              {isAddLangVisible && (
                <>
                  <div className="countries__column">
                    <Form.Control
                      type="text"
                      placeholder="Код"
                      // value={}
                      className="add-currator__input"
                      //   onChange={}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Название"
                      // value={}
                      className="add-currator__input"
                      //   onChange={}
                    />
                  </div>
                </>
              )}
            </Tab>
          </Tabs>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Countries;
