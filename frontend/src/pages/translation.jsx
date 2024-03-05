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

  const [translationsValues, setTranslationsValues] = useState([]);
  const [translationRuValue, setTranslationRuValue] = useState(null);

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

  const handleRuTranslation = (e, translationIndex) => {
    const { value } = e.target;
    setTranslationRuValue(value);

    const _translationIndex = translationsValues.findIndex(
      (translation) => translation.id === translationIndex
    );

    if (_translationIndex !== -1) {
      setTranslationsValues((prevTranslations) => {
        const newTranslations = [...prevTranslations];
        newTranslations[translationIndex] = {
          ...newTranslations[translationIndex],
          ru: value,
        };
        return newTranslations;
      });
    } else {
      const newTranslation = {
        id: translationsValues.length + 1,
        code: "",
        ru: value,
        en: "",
        es: "",
        cs: "",
        bg: "",
        de: "",
        hu: "",
        kk: "",
      };

      setTranslationsValues((prevTranslations) => [
        ...prevTranslations,
        newTranslation,
      ]);
    }
    console.log(translationsValues.map((trans) => trans));
  };

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
                    <tr key={index}>
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
                          value={translation.ru || translationRuValue}
                          className="add-currator__input add-theme__dropdown"
                          onChange={(e) => handleRuTranslation(e, index)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.en}
                          className="add-currator__input add-theme__dropdown"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.es}
                          className="add-currator__input add-theme__dropdown"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.cs}
                          className="add-currator__input add-theme__dropdown"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.bg}
                          className="add-currator__input add-theme__dropdown"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.hu}
                          className="add-currator__input add-theme__dropdown"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.kk}
                          className="add-currator__input add-theme__dropdown"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={translation.en}
                          className="add-currator__input add-theme__dropdown"
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
