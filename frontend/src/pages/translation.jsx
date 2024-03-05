import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table, Form, Row, Col, Modal, Button } from "react-bootstrap";

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

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
  };

  const { loading, error, data, refetch } = useQuery(TRANSLATION_LIST, {
    variables: {
      token: user.token,
    },
  });

  useEffect(() => {
    if (data && data.adminQuery.translationListFull) {
      setData(data.adminQuery.translationListFull);
    }

    refetch();
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
      lang: lang,
      stroke: value,
      code: code,
    };

    setUpdatedTranslations(updatedTranslationsCopy);
  };

  console.log(updatedTranslations.map((trans) => trans));

  const handleUpdateTranslation = async () => {
    try {
      const result = await updateTranslation({
        variables: {
          token: user.token,
        },
      });

      console.log("Перевод успешно обновлен:", result);
      // handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении перевода:", error);
    }
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Переводы" className="title__heading" />
          <div className="translation__wrapper">
            <div className="table__wrapper" style={{ overflowX: "auto" }}>
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
                          className="add-currator__input add-theme__dropdown"
                          readOnly
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.ru ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "ru")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.en ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "en")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.es ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "es")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.cs ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "cs")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.bg ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "bg")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.de ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "de")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.hu ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) =>
                            handleTranslation(e, index, translation.code, "hu")
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            updatedTranslations[index]?.stroke ||
                            translation?.kk ||
                            undefined
                          }
                          className="add-currator__input add-theme__dropdown"
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
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Translation;
