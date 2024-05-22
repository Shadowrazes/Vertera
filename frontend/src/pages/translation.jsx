import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table, Form } from "react-bootstrap";

import {
  TRANSLATION_LIST,
  LANGUAGE_LIST,
  HELPER_PERMS,
} from "../apollo/queries";
import { UPDATE_TRANSLATION } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import ModalDialog from "../components/modal-dialog";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import "../css/translation.css";

import get_translation from "../helpers/translation";

function Translation() {
  const [dataQuery, setData] = useState([]);
  const [langList, setLanglist] = useState([]);

  const [updatedTranslations, setUpdatedTranslations] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

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

  const {
    loading: loadingLangList,
    error: errorLangList,
    data: dataLangList,
  } = useQuery(LANGUAGE_LIST, {
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

  if (loading || loadingLangList) {
    return <Loader />;
  }

  if (error || errorLangList) {
    const networkError = error.networkError ?? errorLangList.networkError;

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

    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
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

      if (
        result.data.helperMutation.translationObj.updateTranslation.length !== 0
      ) {
        handleShowError();
      } else {
        handleShow();
      }
    } catch (error) {
      console.error("Ошибка при обновлении перевода:", error);
    }
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleShowError = () => {
    setShowErrorModal(true);
  };

  const handleCloseLeave = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleClose = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2
            title={get_translation("INTERFACE_TRANSLATION")}
            className="title__heading"
          />
          <div className="translation__wrapper">
            <div
              className="table__wrapper"
              style={{ overflowX: "auto", marginBottom: "20px" }}
            >
              <Table className="table__table" hover>
                <thead>
                  <tr>
                    <td>{get_translation("INTERFACE_STROKE_CODE")}</td>
                    {langList.map((lang) => (
                      <td>{lang.name}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataQuery.map((translationsData, indexRow) => (
                    <tr key={translationsData.id}>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder={get_translation("INTERFACE_STROKE_CODE")}
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
            <ButtonCustom
              title={get_translation("INTERFACE_SAVE")}
              className={"button-hover"}
              onClick={handleUpdateTranslation}
            />
          </div>

          <ModalDialog
            show={showModal}
            onClose={handleCloseLeave}
            modalTitle={get_translation("INTERFACE_TRANSLATION_UPDATE")}
            modalBody={get_translation("INTERFACE_TRANSLATION_UPDATE_FULL")}
          />

          <ModalDialog
            show={showErrorModal}
            onClose={handleClose}
            modalTitle={get_translation("INTERFACE_TRANSLATION_ERROR")}
            modalBody={get_translation("INTERFACE_TRANSLATION_ERROR_FULL")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Translation;
