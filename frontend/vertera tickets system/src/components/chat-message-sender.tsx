import "../css/chat_message_sender.css";

interface ChatMessageProps {
  message: string;
  time: string;
}

function ChatMessage({ message, time }: ChatMessageProps) {
  return (
    <>
      <div className="chat-message-sender__container">
        <div className="chat-message-sender__box">
          <p className="chat-message-sender__text">{message}</p>
        </div>
        <span className="chat-message-sender__time">{time}</span>
      </div>
    </>
  );
}
export default ChatMessage;
