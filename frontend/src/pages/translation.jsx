import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table, Form, Modal, Button } from "react-bootstrap";

import {
  TRANSLATION_LIST,
  LANGUAGE_LIST,
  HELPER_PERMS,
} from "../apollo/queries";
import { UPDATE_TRANSLATION } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import "../css/translation.css";

function Translation() {
  const [dataQuery, setData] = useState([]);
  const [langList, setLanglist] = useState([]);

  const [updatedTranslations, setUpdatedTranslations] = useState([]);

  const [show, setShow] = useState(false);

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

  const { loading, error, data } = useQuery(TRANSLATION_LIST, {
    variables: {
      token: user.token,
    },
  });

  const { data: dataLangList } = useQuery(LANGUAGE_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  useEffect(() => {
    if (data && data.helperQuery.translationListFull) {
      setData(data.helperQuery.translationListFull);
    }

    if (dataLangList && dataLangList.clientQuery.langList) {
      setLanglist(dataLangList.clientQuery.langList);
    }
  }, [data, dataLangList]);

  const [updateTranslation] = useMutation(UPDATE_TRANSLATION);

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

  const handleTranslation = (e, code, lang) => {
    const { value } = e.target;

    const updatedTranslationsCopy = [...updatedTranslations];

    const currentTranslation = updatedTranslationsCopy.find(
      (translation) => translation.code === code && translation.lang === lang
    );

    if (currentTranslation) {
      currentTranslation.stroke = value;
    } else {
      updatedTranslationsCopy.push({
        code: code,
        lang: lang,
        stroke: value,
      });
    }

    console.log(updatedTranslationsCopy);

    setUpdatedTranslations(updatedTranslationsCopy);
  };

  const handleUpdateTranslation = async () => {
    if (updatedTranslations.length === 0) {
      return;
    }

    try {
      const result = await updateTranslation({
        variables: {
          token: user.token,
          translationUpdate: updatedTranslations,
        },
      });

      console.log("Перевод успешно обновлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении перевода:", error);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Переводы" className="title__heading" />
          <div className="translation__wrapper">
            <div
              className="table__wrapper"
              style={{ overflowX: "auto", marginBottom: "20px" }}
            >
              <Table className="table__table" hover>
                <thead>
                  <tr>
                    <td>Строковый код</td>
                    {langList.map((lang) => (
                      <td>{lang.name}</td>
                    ))}
                    {/* <td>Русский</td>
                    <td>Английский</td>
                    <td>Испанский</td>
                    <td>Чешский</td>
                    <td>Болгарский</td>
                    <td>Немецкий</td>
                    <td>Венгерский</td>
                    <td>Казахский</td> */}
                  </tr>
                </thead>
                <tbody>
                  {dataQuery.map((translationsData, indexRow) => (
                    <tr key={translationsData.id}>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Строковый код"
                          value={translationsData.code}
                          className="add-currator__input translation__readonly-input"
                          readOnly
                        />
                      </td>
                      {translationsData.translations.map(
                        (translationStroke, indexColumn) => (
                          <td key={indexColumn}>
                            <Form.Control
                              type="text"
                              value={
                                updatedTranslations.find(
                                  (item) =>
                                    item?.code === translationsData?.code &&
                                    item?.lang === translationStroke?.lang
                                )?.stroke ??
                                translationStroke?.stroke ??
                                ""
                              }
                              className="add-currator__input"
                              onChange={(e) =>
                                handleTranslation(
                                  e,
                                  translationsData.code,
                                  translationStroke.lang
                                )
                              }
                            />
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <ButtonCustom title="Сохранить" onClick={handleUpdateTranslation} />
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Переводы обновлены</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Таблица переводов успешно обновлена</p>
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

export default Translation;
