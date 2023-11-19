import { useState } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import TitleH2 from "./title";
import DropdownBT from "./dropdown";
import ButtonCustom from "./button";
import "../css/alltickets.css";
import "rsuite/dist/rsuite-no-reset.min.css";

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
  //filters visibillity
  const [selectedSort, setSelectedSort] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);

  const handleHideComponent = () => {
    setIsVisible((prevVisibility) => !prevVisibility);
  };

  const handleSorts = (index: number) => {
    setSelectedSort(index);
  };

  let items = ["1", "2", "3"];
  //paginaton
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  // dropdown reset
  const initialSelectedFilterState = [-1, -1, -1, -1, -1, -1];
  const [selectedFilter, setSelectedFilter] = useState(
    initialSelectedFilterState
  );

  const handleResetFilters = () => {
    const resetState = initialSelectedFilterState.map(() => -1);
    setSelectedFilter(resetState);
  };

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
                <DateRangePicker
                  className="alltickets__date-range-picker"
                  placeholder="Задать период"
                />
                <DropdownBT items={items} label="Мои реакции" />
                <DropdownBT items={items} label="Есть слова" />
              </Col>
            </Row>
            <Row className="alltickets__button-row">
              <ButtonCustom title="Применить" />
              <ButtonCustom
                title="Сбросить"
                className="alltickets__button-two"
                onClick={handleResetFilters}
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
              handleSorts(index);
            }}
            className={
              selectedSort === index
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
          {currentItems.map((item) => (
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

      <ul className="alltickets__pagination">
        <button
          onClick={handlePrevPage}
          className={
            currentPage === 1
              ? "alltickets__page-btn-disabled"
              : "alltickets__page-btn"
          }
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>
        {pageNumbers.map((number) => (
          <li key={number} className="alltickets__page-item">
            <a
              onClick={() => setCurrentPage(number)}
              href="#"
              className={
                number === currentPage
                  ? "alltickets__page-link active-link"
                  : "alltickets__page-link"
              }
            >
              {number}
            </a>
          </li>
        ))}
        <button
          onClick={handleNextPage}
          className={
            currentPage === Math.ceil(data.length / itemsPerPage)
              ? "alltickets__page-btn-disabled"
              : "alltickets__page-btn"
          }
          disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
        >
          Следующая
        </button>
      </ul>
    </>
  );
}

export default allTickets;
