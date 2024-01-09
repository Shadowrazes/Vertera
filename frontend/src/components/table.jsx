import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { TABLE_TICKETS_USER, TABLE_TICKETS } from "../apollo/queries";

import Loader from "../pages/loading";
import TitleH2 from "./title";
import ButtonCustom from "./button";

import "../css/table.css";
import "../css/all-tickets.css";

function TableTickets() {
  const [dataQuery, setData] = useState([]);
  const [dataAmount, setDataAmount] = useState(0);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderDir, setOrderDir] = useState("ASC");

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [userRole, setUserRole] = useState(
    JSON.parse(localStorage.getItem("userRole"))?.role
  );

  let userId = null;
  let userCurRole = null;

  if (user === null) {
    return <></>;
  } else {
    userId = user.id;
  }

  if (userRole === null) {
    userCurRole = "client";
  } else {
    userCurRole = userRole;
  }
  // console.log(userId);

  const itemsPerPage = 8;

  const isAdmin = () => {
    return userCurRole === "helper";
  };

  const adminRequest = () => {
    return useQuery(TABLE_TICKETS, {
      variables: {
        filters: {
          helperIds: userId,
          limit: itemsPerPage,
          offset: 0,
          orderBy: "id",
          orderDir: "ASC",
          lang: "ru",
        },
      },
    });
  };

  const clientRequest = () => {
    return useQuery(TABLE_TICKETS_USER, {
      variables: {
        clientId: userId,
        filters: {
          limit: itemsPerPage,
          offset: 0,
          orderBy: "id",
          orderDir: "ASC",
          lang: "ru",
        },
      },
    });
  };

  const { loading, error, data, refetch } = isAdmin()
    ? adminRequest()
    : clientRequest();

  const navigate = useNavigate();

  const goToAllTickets = () => {
    navigate("/all-tickets");
  };

  useEffect(() => {
    if (isAdmin()) {
      if (data && data.ticketList.array) {
        setData(data.ticketList.array);
      }

      if (data && data.ticketList.count) {
        setDataAmount(data.ticketList.count);
      }
    } else {
      if (data && data.ticketListByClient.array) {
        setData(data.ticketListByClient.array);
      }

      if (data && data.ticketListByClient.count) {
        setDataAmount(data.ticketListByClient.count);
      }
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
    if (isAdmin()) {
      const variables = {
        filters: {
          helperIds: userId,
          limit: itemsPerPage,
          offset: 0,
          orderBy: _orderBy,
          orderDir: _orderDir,
          lang: "ru",
        },
      };

      await refetch(variables);
    } else {
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
    }
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

  const getStatusColor = (status) => {
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
  };

  return (
    <>
      {!loading && dataAmount > 0 && (
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
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.id}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.subTheme.theme.unit.name.stroke}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.date.replace(/T|-/g, (match) =>
                        match === "T" ? " " : "."
                      )}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.subTheme.theme.name.stroke}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.lastMessage.date.slice(0, 10).replace(/-/g, ".")}|{" "}
                      {ticket.lastMessage.sender.fullName}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.messages.length}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/dialog/${userId}/${ticket.id}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
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
          <ButtonCustom
            title="Показать все обращения"
            onClick={goToAllTickets}
          />
        </>
      )}
    </>
  );
}

export default TableTickets;
