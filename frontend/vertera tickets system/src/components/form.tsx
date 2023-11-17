import { Form, Row, Col, Button } from "react-bootstrap";
import DropdownBT from "./dropdown";
import TitleH2 from "./title";
import "../css/form.css";

function FormComponent() {
  let items = ["1", "2", "3"];
  return (
    <>
      <TitleH2 title="Создать обращение" className="title__heading" />
      <Form>
        <Row>
          <Col md={4} className="form__column">
            <DropdownBT items={items} label="Выберите подразделение" />
            <DropdownBT items={items} label="Тип обращения" />
            <DropdownBT items={items} label="Подтема" />
          </Col>

          <Col md={8} className="form__column">
            <Form.Group controlId="TextareaForm">
              <Form.Control
                as="textarea"
                placeholder="Текст сообщения"
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="FileInputForm">
              <Form.Control type="file" />
            </Form.Group>
            <Button variant="primary" id="ButtonForm" type="submit">
              Отправить обращение
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default FormComponent;
