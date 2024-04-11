import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button, Modal } from "react-bootstrap";

import { MESSAGE } from "../apollo/queries";
import { DELETE_MESSAGE } from "../apollo/mutations";

import Loader from "../pages/loading";

import { franc } from "franc";
import { Translater } from "../api/translater";

import DeleteMsgIcon from "../assets/delete_msg_icon.svg";
import "../css/chat-message-sender.css";

function ChatMessage({
  id,
  message,
  sender,
  visibility,
  removable,
  status,
  time,
  attachs,
  onClick,
}) {
  const [translatedText, setTranslatedText] = useState("");
  const [senderId, setSenderId] = useState(null);

  let isVisible;
  const [showWarningDelete, setShowWarningDelete] = useState(false);

  const isBuild = import.meta.env.DEV !== "build";

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [language, setLanguage] = useState(localStorage.getItem("language"));

  const { data } = useQuery(MESSAGE, {
    variables: {
      token: user.token,
      id: id,
    },
  });

  const languageCode = {
    rus: ["RU", "/flags/ru.svg"],
    eng: ["EN", "/flags/en.svg"],
    spa: ["ES", "/flags/es.svg"],
    ces: ["CS", "/flags/cs.svg"],
    bul: ["BG", "/flags/bg.svg"],
    deu: ["DE", "/flags/de.svg"],
    hu: ["HU", "/flags/hu.svg"],
    kaz: ["KZ", "/flags/kz.svg"],
  };

  const languageCodeQuery = {
    RU: ["русский", "/flags/ru.svg"],
    EN: ["английский", "/flags/en.svg"],
    ES: ["испанский", "/flags/es.svg"],
    CS: ["чешский", "/flags/cs.svg"],
    BG: ["болгарский", "/flags/bg.svg"],
    DE: ["немецкий", "/flags/de.svg"],
    HU: ["венгерский", "/flags/hu.svg"],
    KZ: ["казахский", "/flags/kz.svg"],
  };

  if (attachs.length === 0) {
    isVisible = true;
  } else {
    isVisible = false;
  }

  const getFullName = (userData) => {
    let result = "";

    if (userData?.surname) {
      result += userData?.surname + " ";
    }

    if (userData?.name) {
      result += userData?.name + " ";
    }
    if (userData?.patronymic) {
      result += userData?.patronymic;
    }

    return result;
  };

  const handleTranslate = async (text, lang) => {
    try {
      const translatedText = await Translater(text, lang);
      setTranslatedText(translatedText);
      // console.log(translatedText);
    } catch (error) {
      console.error("Error during translation:", error.message);
    }
  };

  useEffect(() => {
    // console.log("time = ", time);
    const fetchData = async () => {
      // if (languageCode.hasOwnProperty(franc(message))) {
      //   if ((languageCode[franc(message)][0] || franc(message)) !== language) {
      //     handleTranslate(message, languageCodeQuery[language]);
      //     // console.log("franc ", franc(message));
      //     // console.log("orig", franc(message));
      //     // console.log("selected", languageCodeQuery[language]);
      //   }
      // } else {
      //   handleTranslate(message, languageCodeQuery[language]);
      //   // console.log("orig", franc(message));
      //   // console.log("selected", languageCodeQuery[language]);
      // }
      handleTranslate(message, languageCodeQuery[language]);
    };

    if (data && data.clientQuery.message) {
      setSenderId(data.clientQuery.message.sender.id);
    }

    fetchData();
    setTranslatedText("");
  }, [data, message, language]);

  const [deleteMessage, { loading: loadingDelete }] =
    useMutation(DELETE_MESSAGE);

  if (loadingDelete) {
    return <Loader />;
  }

  const handleDeleteMsg = async (e) => {
    e.preventDefault();

    try {
      const result = await deleteMessage({
        variables: {
          token: user.token,
          id: id,
        },
      });
      console.log("Сообщение успешно добавлена:", result);
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowWarningDelete = () => {
    setShowWarningDelete(true);
  };

  const handleCloseWarning = () => {
    setShowWarningDelete(false);
  };

  return (
    <>
      <div className="chat-message-sender__container">
        <div
          className={
            visibility == 2
              ? "chat-message-sender__box chat-message-sender__box-curators-chat"
              : "chat-message-sender__box"
          }
        >
          <h3 className="chat-message-sender__name">{getFullName(sender)}</h3>
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="chat-message-sender__text"
          ></div>
          {translatedText !== "" &&
            languageCode[franc(message)] !== language && (
              <>
                <div className="chat-message-translate">
                  <span>
                    Перевод на{" "}
                    <img
                      src={languageCodeQuery[language][1]}
                      className="language-menu__flag"
                      alt=""
                    />
                  </span>
                </div>
                <div
                  className="chat-message-recipient__text"
                  style={{ textAlign: "right" }}
                >
                  <i dangerouslySetInnerHTML={{ __html: translatedText }}></i>
                </div>
              </>
            )}
          {!isVisible && (
            <>
              <span className="chat-message-sender__attachs-title">
                Прикрепленные файлы:
              </span>
              <div className="chat-message-sender__attachs">
                {attachs &&
                  attachs.map((attach) => (
                    <div key={attach.id}>
                      <a
                        className="chat-message-sender__attach-link"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          isBuild
                            ? "https://help.vertera.org:4444" + attach.path
                            : "http://localhost:4444" + attach.path
                        }
                      >
                        <span className="chat-message-sender__attach">
                          {attach.name}
                        </span>
                      </a>
                    </div>
                  ))}
              </div>
            </>
          )}
          <span className="chat-message-sender__time">{time}</span>
          {user.id === senderId &&
            sender.role !== "client" &&
            removable !== null &&
            status !== "Выполнено" && (
              <div className="chat-message-sender__delete">
                <img
                  src={DeleteMsgIcon}
                  alt=""
                  className="countries__delete-icon"
                  style={{ width: "42px" }}
                  onClick={handleShowWarningDelete}
                />
              </div>
            )}
        </div>
      </div>

      <Modal show={showWarningDelete} onHide={handleCloseWarning}>
        <Modal.Header closeButton>
          <Modal.Title>Предупреждение</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите удалить это сообщение?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWarning}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleDeleteMsg}>
            Продолжить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ChatMessage;
