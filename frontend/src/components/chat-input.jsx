import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Row } from "react-bootstrap";
import ButtonCustom from "./button";
import "../css/chat-input.css";

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [isVisible, setIsVisible] = useState(false);

  const [isHelper, setIsHelper] = useState(false);

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selected = files[0];
      setSelectedFile(selected);
    }
  };

  useEffect(() => {

    // if (user)
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  function handleChange(e) {
    setMessage(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
      setCount((prevCount) => prevCount + 1);
    }
  }

  return (
    <>
      {isVisible && (
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
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
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
                  onClick={handleClose}
                />
              </div>
            </Row>
          </Form>
        </div>
      )}
      {!isVisible && (
        <div className="chat-input__close-container">
          <div className="chat-input__close-box">
            <span className="chat-input__close-text">Заявка закрыта</span>
          </div>
          <ButtonCustom
            title="Создать новую заявку"
            className="chat-input__button-close"
            onClick={goToCreateTicket}
          />
        </div>
      )}
    </>
  );
}

export default ChatInput;
