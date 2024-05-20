import "../../css/chat-message-system.css";

function ChatMessage({ message, time }) {
  return (
    <>
      <div className="chat-message-system__container">
        <div className="chat-message-system__box">
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="chat-message-system__text"
          ></div>
          <span className="chat-message-system__time">{time}</span>
        </div>
      </div>
    </>
  );
}
export default ChatMessage;
