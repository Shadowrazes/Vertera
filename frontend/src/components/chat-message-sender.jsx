import "../css/chat-message-sender.css";

function ChatMessage({ message, time, attachs }) {
  let isVisible;
  const isBuild = import.meta.env.DEV !== "build";

  if (attachs.length == 0) {
    isVisible = true;
  } else {
    isVisible = false;
  }

  return (
    <>
      <div className="chat-message-sender__container">
        <div className="chat-message-sender__box">
          <div className="chat-message-sender__text">{message}</div>
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
                            ? "http://vertera-ticket.yasanyabeats.ru:4444/" +
                              attach.path
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
        </div>
        <span className="chat-message-sender__time">{time}</span>
      </div>
    </>
  );
}
export default ChatMessage;
