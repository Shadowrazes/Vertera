import { useState, useEffect } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import TABLE_TICKETS from "../apollo/queries";
import Loader from "../pages/loading";
import TitleH2 from "../components/title";
import DropdownBT from "../components/dropdown";
import ButtonCustom from "../components/button";

import "../css/all-tickets.css";
import "rsuite/dist/rsuite-no-reset.min.css";

function allTickets() {
  const [dataQuery, setData] = useState([]);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("ASC");
  const [offset, setOffset] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [prevCurrentPage, setPrevCurrentPage] = useState(-1);

  const itemsPerPage = 2;
  const ticketsAmount = 5;

  //filters visibillity
  const [isVisibleFilters, setIsVisibleFilters] = useState(false);

  const handleHideComponent = () => {
    setIsVisibleFilters((prevVisibility) => !prevVisibility);
  };

  let items = ["1", "2", "3"];

  // dropdown reset
  const initialSelectedFilterState = [-1, -1, -1, -1, -1, -1];
  const [selectedFilter, setSelectedFilter] = useState(
    initialSelectedFilterState
  );

  const handleResetFilters = () => {
    const resetState = initialSelectedFilterState.map(() => -1);
    setSelectedFilter(resetState);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ticketsAmount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const { loading, error, data, refetch } = useQuery(TABLE_TICKETS, {
    variables: {
      filters: {
        limit: itemsPerPage,
        offset: 0,
        orderBy: "id",
        orderDir: "ASC",
        lang: "ru",
      },
    },
  });

  const handleNewPage = async (index) => {
    setCurrentPage(index);

    let lastItem = currentPage * itemsPerPage;
    let _offset = lastItem - itemsPerPage;

    setOffset(_offset);

    const variables = {
      filters: {
        limit: itemsPerPage,
        offset: _offset,
        orderBy: orderBy,
        orderDir: orderDir,
        lang: "ru",
      },
    };
    await refetch(variables);
  };

  useEffect(() => {
    if (data && data.ticketList) {
      setData(data.ticketList);
    }

    if (selectedSort !== prevSelectedSort) {
      handleSorts(selectedSort);
      setPrevSelectedSort(selectedSort);
    }

    if (currentPage !== prevCurrentPage) {
      handleNewPage(currentPage);
      setPrevCurrentPage(currentPage);
    }

    setIsVisible(pageNumbers.length > 1);
  }, [data, selectedSort, prevSelectedSort, currentPage, pageNumbers]);

  const tickets = dataQuery;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const columns = [
    "subTheme.theme.unit.name.stroke",
    "date",
    "subTheme.theme.name.stroke",
    "lastMessage.text",
  ];
  const columnsName = ["Раздел", "Дата", "Тема", "Последнее сообщение"];

  const handleSorts = async (index) => {
    setSelectedSort(index);

    let _orderBy;
    let _orderDir;

    if (prevSelectedSort === index) {
      _orderDir = "DESC";
    } else {
      _orderDir = "ASC";
    }

    switch (index) {
      case 0:
        _orderBy = "unitStroke";
        break;

      case 1:
        _orderBy = "date";
        break;

      case 2:
        _orderBy = "themeStroke";
        break;

      case 3:
        _orderBy = "lastMsgDate";
        break;

      default:
        _orderBy = "id";
        break;
    }

    if (orderDir == "DESC") {
      setSelectedSort(-1);
      _orderBy = "id";
      _orderDir = "ASC";
    }

    setOrderBy(_orderBy);
    setOrderDir(_orderDir);

    const variables = {
      filters: {
        limit: itemsPerPage,
        offset: offset,
        orderBy: _orderBy,
        orderDir: _orderDir,
        lang: "ru",
      },
    };
    await refetch(variables);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(ticketsAmount / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  function getStatusBGColor(status) {
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

  return (
    <>
      <div className="alltickets__container">
        <TitleH2 title="Все обращения" className="title__heading-nomargin" />
        <ButtonCustom
          title={
            isVisibleFilters == false ? "Показать фильтр" : "Скрыть фильтр"
          }
          onClick={handleHideComponent}
        />
      </div>

      {isVisibleFilters && (
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
                  locale={{
                    sunday: "Вс",
                    monday: "Пн",
                    tuesday: "Вт",
                    wednesday: "Ср",
                    thursday: "Чт",
                    friday: "Пт",
                    saturday: "Сб",
                    ok: "ОК",
                    today: "Сегодня",
                    yesterday: "Вчера",
                    last7Days: "Последние 7 дней",
                  }}
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
            {columnsName[index]}
            {selectedSort === index && (
              <span className="table__sort-arrow">
                <svg
                  className={
                    orderDir == "DESC"
                      ? "table__sort-arrow-svg-rotated"
                      : "table__sort-arrow-svg"
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                >
                  <path
                    d="M3.5 9V1M3.5 1L1 3.15385M3.5 1L6 3.15385"
                    stroke="#00AB97"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            )}
          </span>
        ))}
      </div>

      <Table className="table__table" hover>
        <thead>
          <tr>
            <th style={{ minWidth: "115px" }}>ID тикет</th>
            <th>Раздел</th>
            <th>Дата создания</th>
            <th>Тема</th>
            <th>Последнее сообщение</th>
            <th>Сообщений</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  {ticket.id}
                </Link>
              </td>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  {ticket.subTheme.theme.unit.name.stroke}
                </Link>
              </td>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  {ticket.date.replace(/T|-/g, (match) =>
                    match === "T" ? " " : "."
                  )}
                </Link>
              </td>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  {ticket.subTheme.theme.name.stroke}
                </Link>
              </td>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  {ticket.lastMessage.date.slice(0, 10).replace(/-/g, ".")}|{" "}
                  {ticket.lastMessage.text}
                </Link>
              </td>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  {ticket.messages.length}
                </Link>
              </td>
              <td>
                <Link
                  to={`/dialog/${ticket.id}`}
                  state={{ status: ticket.status.name.stroke }}
                  className="alltickets__link"
                >
                  <span
                    className="table__status"
                    style={{
                      background: getStatusBGColor(ticket.status.name.stroke),
                    }}
                  >
                    {ticket.status.name.stroke}
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ul className="alltickets__pagination">
        {isVisible && (
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
        )}
        {pageNumbers.map((number) => (
          <li key={number} className="alltickets__page-item">
            <button
              onClick={() => handleNewPage(number)}
              className={
                number === currentPage
                  ? "alltickets__page-link active-link"
                  : "alltickets__page-link"
              }
            >
              {number}
            </button>
          </li>
        ))}
        {isVisible && (
          <button
            onClick={handleNextPage}
            className={
              currentPage === Math.ceil(data.length / itemsPerPage)
                ? "alltickets__page-btn-disabled"
                : "alltickets__page-btn"
            }
            disabled={currentPage === Math.ceil(ticketsAmount / itemsPerPage)}
          >
            Следующая
          </button>
        )}
      </ul>
    </>
  );
}

export default allTickets;
