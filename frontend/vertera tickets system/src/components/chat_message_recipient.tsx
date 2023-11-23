import "../css/chat_message_recipient.css";

interface ChatMessageProps {
  message: string;
  time: string;
}

function ChatMessage({ message, time }: ChatMessageProps) {
  return (
    <>
      <div className="chat-message-recipient__container">
        <div className="chat-message-recipient__box">
          <p className="chat-message-recipient__text">{message}</p>
          <div className="chat-message-recepient__separator"></div>
          <div className="chat-message-recepient__rate-container">
            <span className="chat-message-recepient__rate-title">
              Оцените ответ
            </span>
            <div className="chat-message-recepient__rate-like">
              <span className="chat-message-recepient__rate-icon"></span>
              <span className="chat-message-recepient__rate-icon"></span>
            </div>
          </div>
        </div>
        <span className="chat-message-recipient__time">{time}</span>
      </div>
    </>
  );
}

export default ChatMessage;
