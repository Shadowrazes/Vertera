import "../css/chat-message-sender.css";

function ChatMessage({ message, time }) {
  return (
    <>
      <div className="chat-message-sender__container">
        <div className="chat-message-sender__box">
          <div className="chat-message-sender__text">{message}</div>
        </div>
        <span className="chat-message-sender__time">{time}</span>
      </div>
    </>
  );
}
export default ChatMessage;
