import "../css/chat-message-recipient.css";

function ChatMessage({ message, sender, time, attachs }) {
  let isVisible;
  const isBuild = import.meta.env.DEV !== "build";

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

  return (
    <>
      <div className="chat-message-recipient__container">
        <div className="chat-message-recipient__box">
          <h3 className="chat-message-recipient__name">
            {getFullName(sender)}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="chat-message-recipient__text"
          ></div>
          <div className="chat-message-translate">
            <span>Перевод с <img src="/flags/ru.svg" className="language-menu__flag" alt="" /> на <img src="/flags/en.svg" className="language-menu__flag" alt="" /></span>
          </div>
          <div
            className="chat-message-recipient__text"
          >
            <i>Auto translated message</i>
          </div>
          
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
                            ? "https://vticket.yasanyabeats.ru:4444" +
                              attach.path
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
