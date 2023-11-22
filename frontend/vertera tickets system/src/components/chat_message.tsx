// import "../css/chat_message.css";

interface ChatMessageProps {
  sender: string;
  message: string;
}

function ChatMessage({ sender, message }: ChatMessageProps): JSX.Element {
  return (
    <>
      <strong>{sender}</strong>: {message}
    </>
  );
}

export default ChatMessage;
