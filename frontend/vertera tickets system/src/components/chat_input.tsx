import { useState, ChangeEvent, FormEvent } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import ButtonCustom from "../components/button";
import "../css/chat-input.css";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setMessage(e.target.value);
  }

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  }

  return (
    <div className="chat-input__container">
      <Form className="chat-input__form" onSubmit={handleSubmit}>
        <Row className="chat-input__row">
          <Form.Group controlId="TextareaForm">
            <Form.Control
              as="textarea"
              placeholder="Текст сообщения"
              rows={3}
              value={message}
              onChange={handleChange}
              className="chat-input__textarea"
            />
          </Form.Group>
          <Form.Group controlId="FileInputForm">
            <Form.Control type="file" />
          </Form.Group>
          <div className="chat-input__button-row">
            <ButtonCustom
              title="Отправить"
              className="chat-input__button-send"
              type="submit"
            />
            <ButtonCustom
              title="Закрыть заявку"
              className="chat-input__button-close"
            />
          </div>
        </Row>
      </Form>
    </div>
  );
}

export default ChatInput;
