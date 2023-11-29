import "../css/chat-message-sender.css";

interface ChatMessageProps {
  message: string;
  time: string;
}

function ChatMessage({ message, time }: ChatMessageProps) {
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
