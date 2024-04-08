import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { MESSAGE } from "../apollo/queries";

import Loader from "../pages/loading";

import { franc } from "franc";
import { Translater } from "../api/translater";

import "../css/chat-message-sender.css";

function ChatMessage({ id, message, sender, time, attachs, onClick }) {
  const [translatedText, setTranslatedText] = useState("");
  const [senderId, setSenderId] = useState(null);

  let isVisible;

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
    // try {
    //   const translatedText = await Translater(text, lang);
    //   setTranslatedText(translatedText);
    //   // console.log(translatedText);
    // } catch (error) {
    //   console.error("Error during translation:", error.message);
    // }
  };

  useEffect(() => {
    // console.log("time = ", time);
    const fetchData = async () => {
      if (languageCode.hasOwnProperty(franc(message))) {
        if ((languageCode[franc(message)][0] || franc(message)) !== language) {
          handleTranslate(message, languageCodeQuery[language]);
          // console.log("franc ", franc(message));
          // console.log("orig", franc(message));
          // console.log("selected", languageCodeQuery[language]);
        }
      } else {
        handleTranslate(message, languageCodeQuery[language]);
        // console.log("orig", franc(message));
        // console.log("selected", languageCodeQuery[language]);
      }
    };

    if (data && data.clientQuery.message) {
      setSenderId(data.clientQuery.message.sender.id);
    }

    fetchData();
    setTranslatedText("");
  }, [data, message, language]);

  return (
    <>
      <div className="chat-message-sender__container">
        <div
          className="chat-message-sender__box"
          style={{ background: "rgb(0 0 0 / 9%)" }}
        >
          <h3 className="chat-message-sender__name">{getFullName(sender)}</h3>
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="chat-message-sender__text"
            style={{ textDecoration: "line-through" }}
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
                <div className="chat-message-recipient__text">
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
          <div className="chat-message-deleted__delete-msg">
            <span>Сообщение удалено</span>
            <span
              className="chat-message-sender__time"
              style={{ marginTop: "0" }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChatMessage;
