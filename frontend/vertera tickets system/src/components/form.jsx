import { Form, Row, Col, Button } from "react-bootstrap";
import DropdownBT from "./dropdown";
import TitleH2 from "./title";
import "../css/form.css";

function FormComponent() {
  let itemsSubdivision = ["подразделение1", "подразделение2", "подразделение3"];
  let itemsType = ["типобращения1", "типобращения2", "типобращения3"];
  let itemsSubtheme = ["подтема1", "подтема2", "подтема3"];

  const handleNewTicket = () => {};

  return (
    <>
      <TitleH2 title="Создать обращение" className="title__heading" />
      <Form>
        <Row>
          <Col md={4} className="form__column">
            <DropdownBT
              items={itemsSubdivision}
              label="Выберите подразделение"
            />
            <DropdownBT items={itemsType} label="Тип обращения" />
            <DropdownBT items={itemsSubtheme} label="Подтема" />
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
              <Form.Control type="file" multiple />
            </Form.Group>
            <Button
              variant="primary"
              id="ButtonForm"
              type="submit"
              onClick={handleNewTicket}
            >
              Отправить обращение
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default FormComponent;
