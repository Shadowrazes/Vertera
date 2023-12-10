import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Row } from "react-bootstrap";
import ButtonCustom from "./button";
import "../css/chat-input.css";

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selected = files[0];
      setSelectedFile(selected);
    }
  };

  const location = useLocation();
  let initialStatus = location.state && location.state.status;

  const [status, setStatus] = useState(initialStatus);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (status !== "Закрыт") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [status]);

  const [isVisible2, setIsVisible2] = useState(false);

  useEffect(() => {
    if (status == "Закрыт" && count > 1) {
      setIsVisible2(true);
    }
  });

  const handleClose = () => {
    setIsVisible(false);
    setStatus("Закрыт");
  };

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  function handleChange(e) {
    setMessage(e.target.value);
  }

  const [count, setCount] = useState(0);

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
      {isVisible2 && (
        <div className="chat-input__more">
          <span className="chat-input__more-text">
            <a href="#" className="chat-input__more-link">
              Показать {count} скрытых сообщения
            </a>
          </span>
        </div>
      )}
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
