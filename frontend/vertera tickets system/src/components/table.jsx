import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { TABLE_TICKETS } from "../apollo/queries";
import Loader from "../pages/loading";
import TitleH2 from "./title";
import ButtonCustom from "./button";

import "../css/table.css";
import "../css/all-tickets.css";

function TableTickets() {
  const [dataQuery, setData] = useState([]);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderDir, setOrderDir] = useState("ASC");

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const itemsPerPage = 8;

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

  const navigate = useNavigate();

  const goToAllTickets = () => {
    navigate("/all-tickets");
  };

  useEffect(() => {
    if (data && data.ticketList.array) {
      setData(data.ticketList.array);
    }

    if (selectedSort !== prevSelectedSort) {
      handleSorts(selectedSort);
      setPrevSelectedSort(selectedSort);
    }
  }, [data, selectedSort, prevSelectedSort]);

  const tickets = dataQuery;

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

    setOrderDir(_orderDir);

    const variables = {
      filters: {
        limit: itemsPerPage,
        offset: 0,
        orderBy: _orderBy,
        orderDir: _orderDir,
        lang: "ru",
      },
    };
    await refetch(variables);
  };

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

  function getStatusColor(status) {
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
      <TitleH2 title="Мои обращения" className="title__heading" />
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
                  {ticket.lastMessage.sender.fullName}
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
                      background: getStatusColor(ticket.status.name.stroke),
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

      <ButtonCustom title="Показать все обращения" onClick={goToAllTickets} />
    </>
  );
}

export default TableTickets;
