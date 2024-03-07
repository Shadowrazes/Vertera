import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table, Form, Modal, Button } from "react-bootstrap";

import { TRANSLATION_LIST } from "../apollo/queries";
import { UPDATE_TRANSLATION } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import "../css/translation.css";

function Translation() {
  const [dataQuery, setData] = useState([]);

  const [updatedTranslations, setUpdatedTranslations] = useState([]);

  const [show, setShow] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
  };

  const { loading, error, data } = useQuery(TRANSLATION_LIST, {
    variables: {
      token: user.token,
    },
  });

  useEffect(() => {
    if (data && data.adminQuery.translationListFull) {
      setData(data.adminQuery.translationListFull);
    }
  }, [data]);

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

  const handleTranslation = (e, translationIndex, code, lang) => {
    const { value } = e.target;

    const updatedTranslationsCopy = [...updatedTranslations];

    updatedTranslationsCopy[translationIndex] = {
      ...updatedTranslationsCopy[translationIndex],
      [lang]: value,
      code: code,
    };

    setUpdatedTranslations(updatedTranslationsCopy);
  };

  const handleUpdateTranslation = async () => {
    let newTranslatons = updatedTranslations
      .filter((updatedTranslation) => updatedTranslation)
      .map(({ code, ru, en, es, cs, bg, de, hu, kk }) => {
        const result = [];
        if (ru !== undefined) {
          result.push({ lang: "ru", stroke: ru, code: code });
        }
        if (en !== undefined) {
          result.push({ lang: "en", stroke: en, code: code });
        }
        if (es !== undefined) {
          result.push({ lang: "es", stroke: es, code: code });
        }
        if (cs !== undefined) {
          result.push({ lang: "cs", stroke: cs, code: code });
        }
        if (bg !== undefined) {
          result.push({ lang: "bg", stroke: bg, code: code });
        }
        if (de !== undefined) {
          result.push({ lang: "de", stroke: de, code: code });
        }
        if (hu !== undefined) {
          result.push({ lang: "hu", stroke: hu, code: code });
        }
        if (kk !== undefined) {
          result.push({ lang: "kk", stroke: en, code: code });
        }
        return result;
      })
      .flat();

    if (newTranslatons.length === 0) {
      return;
    }

    try {
      const result = await updateTranslation({
        variables: {
          token: user.token,
          translationUpdate: newTranslatons,
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
                    <td>Русский</td>
                    <td>Английский</td>
                    <td>Испанский</td>
                    <td>Чешский</td>
                    <td>Болгарский</td>
                    <td>Немецкий</td>
                    <td>Венгерский</td>
                    <td>Казахский</td>
                  </tr>
                </thead>
                <tbody>
                  {dataQuery.map((translation, index) => (
                    <tr key={translation.id}>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Строковый код"
                          value={translation.code}
                          className="add-currator__input translation__readonly-input"
                          readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.ru ??
                            translation?.ru ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "ru")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.en ??
                            translation?.en ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "en")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.es ??
                            translation?.es ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "es")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.cs ??
                            translation?.cs ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "cs")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.bg ??
                            translation?.bg ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "bg")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.de ??
                            translation?.de ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "de")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.hu ??
                            translation?.hu ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "hu")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.kk ??
                            translation?.kk ??
                            ""
                          }
                          className="add-currator__input"
                          onChange={(e) => handleTranslation(e, index, "kk")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <ButtonCustom title="Сохранить" onClick={handleUpdateTranslation} />
          </div>

          <Modal show={show}>
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
