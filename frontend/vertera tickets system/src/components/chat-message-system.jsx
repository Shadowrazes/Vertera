import "../css/chat-message-system.css";

function ChatMessage({ message, time }) {
  return (
    <>
      <div className="chat-message-system__container">
        <div className="chat-message-system__box">
          <div className="chat-message-system__text">{message}</div>
        </div>
        <span className="chat-message-system__time">{time}</span>
      </div>
    </>
  );
}
export default ChatMessage;
