import { useState, useEffect } from "react";

import { Translater } from "../api/translater";
import { franc } from "franc";

import "../css/chat-message-recipient.css";

function ChatMessage({ message, sender, visibility, time, attachs }) {
  const [translatedText, setTranslatedText] = useState("");
  let isVisible;
  const isBuild = import.meta.env.DEV !== "build";

  const [language, setLanguage] = useState(localStorage.getItem("language"));

  const languageCode = {
    rus: ["RU", "/flags/ru.svg"],
    eng: ["EN", "/flags/en.svg"],
    spa: ["ES", "/flags/es.svg"],
    ces: ["CS", "/flags/cs.svg"],
    bul: ["BG", "/flags/bg.svg"],
    deu: ["DE", "/flags/de.svg"],
    hu: ["HU", "/flags/hu.svg"],
    kaz: ["KZ", "/flags/kz.svg"],
    ewe: ["EN", "/flags/en.svg"],
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

  if (attachs.length == 0) {
    isVisible = true;
  } else {
    isVisible = false;
  }

  const getFullName = (userData) => {
    let result = "";
    // console.log(userData);

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
    fetchData();
    setTranslatedText("");
  }, [message, language]);

  return (
    <>
      <div className="chat-message-recipient__container">
        <div
          className={
            visibility == 2
              ? "chat-message-recipient__box chat-message-recipient__box-curators-chat"
              : "chat-message-recipient__box"
          }
        >
          <h3 className="chat-message-recipient__name">
            {getFullName(sender)}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="chat-message-recipient__text"
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
              <span className="chat-message-recipient__attachs-title">
                Прикрепленные файлы:
              </span>
              <div className="chat-message-recipient__attachs">
                {attachs &&
                  attachs.map((attach) => (
                    <div key={attach.id}>
                      <a
                        className="chat-message-recipient__attach-link"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          isBuild
                            ? "https://help.vertera.org:4444" + attach.path
                            : "http://localhost:4444" + attach.path
                        }
                      >
                        <img
                          src="/file.svg"
                          className="chat-message-recipient__attach-icon"
                          alt=""
                        />
                        <span className="chat-message-recipient__attach">
                          {attach.name}
                        </span>
                      </a>
                    </div>
                  ))}
              </div>
            </>
          )}
          <span className="chat-message-recipient__time">{time}</span>
        </div>
      </div>
    </>
  );
}

export default ChatMessage;
