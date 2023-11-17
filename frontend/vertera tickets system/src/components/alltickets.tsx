import { useState } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import TitleH2 from "./title";
import DropdownBT from "./dropdown";
import ButtonCustom from "./button";
import "../css/alltickets.css";

function allTickets() {
  type TableRow = {
    id: number;
    section: string;
    date: Date;
    theme: string;
    last_message: string;
    message_count: string;
    status: string;
  };

  const columns = [
    "Раздел",
    "Дата",
    "Тема",
    "Последнее сообщение",
    "Сообщений",
  ];

  const data: TableRow[] = [
    {
      id: 1,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "02.10.23| Имя Фамилия",
      message_count: "3/1",
      status: "Новый",
    },
    {
      id: 2,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "03.10.23| Имя Фамилия",
      message_count: "4/1",
      status: "В процессе",
    },
    {
      id: 3,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "03.10.23| Имя Фамилия",
      message_count: "4/1",
      status: "В ожидании",
    },
    {
      id: 4,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "03.10.23| Имя Фамилия",
      message_count: "4/1",
      status: "Закрыт",
    },
  ];

  function getStatusColor(status: string): string {
    switch (status) {
      case "Новый":
        return "linear-gradient(0deg, rgba(0, 171, 151, 0.11) 0%, rgba(0, 171, 151, 0.11) 100%), #FFF";
      case "В процессе":
        return "#E6E3F6";
      case "В ожидании":
        return "rgba(171, 144, 0, 0.11)";
      case "Закрыт":
        return "rgba(171, 0, 0, 0.11)";
      default:
        return "white";
    }
  }

  const [selectedFilter, setSelectedFilter] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  const handleHideComponent = () => {
    setIsVisible((prevVisibility) => !prevVisibility);
  };

  const handleFilters = (index: number) => {
    setSelectedFilter(index);
  };

  let items = ["1", "2", "3"];

  return (
    <>
      <div className="alltickets__container">
        <TitleH2 title="Все обращения" className="title__heading-nomargin" />
        <ButtonCustom title="Показать фильтр" onClick={handleHideComponent} />
      </div>

      {isVisible && (
        <div className="alltickets__filters-container">
          <Form>
            <Row>
              <Col className="alltickets__column">
                <DropdownBT items={items} label="Подразделение" />
                <DropdownBT items={items} label="Тема" />
                <DropdownBT items={items} label="Подтема" />
              </Col>
              <Col className="alltickets__column">
                <DropdownBT items={items} label="Задать период" />
                <DropdownBT items={items} label="Мои реакции" />
                <DropdownBT items={items} label="Есть слова" />
              </Col>
            </Row>
            <Row className="alltickets__button-row">
              <ButtonCustom title="Применить" />
              <ButtonCustom
                title="Сбросить"
                className="alltickets__button-two"
              />
            </Row>
          </Form>
        </div>
      )}

      <div className="table__sorts">
        <span className="table__sorts-label">Сортировать по:</span>
        {columns.map((column, index) => (
          <span
            key={column}
            onClick={() => {
              handleFilters(index);
            }}
            className={
              selectedFilter === index
                ? "table__sort table__sort-active"
                : "table__sort"
            }
          >
            {column}
          </span>
        ))}
      </div>

      <Table className="table__table" hover>
        <thead>
          <tr>
            <th>ID тикет</th>
            <th>Раздел</th>
            <th>Дата создания</th>
            <th>Тема</th>
            <th>Последнее сообщение</th>
            <th>Сообщений</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.section}</td>
              <td>{item.date.toLocaleDateString()}</td>
              <td>{item.theme}</td>
              <td>{item.last_message}</td>
              <td>{item.message_count}</td>
              <td>
                <span
                  className="table__status"
                  style={{ background: getStatusColor(item.status) }}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default allTickets;
