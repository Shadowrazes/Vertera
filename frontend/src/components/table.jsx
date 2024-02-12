import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

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

  const [orderDir, setOrderDir] = useState("DESC");

  const columns = [
    "subTheme.theme.unit.name.stroke",
    "date",
    "subTheme.theme.name.stroke",
    "lastMessage.text",
  ];
  const columnsName = ["Раздел", "Дата", "Тема", "Последнее сообщение"];

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  let userId = null;

  if (user?.id === null) {
    return <></>;
  } else {
    userId = user?.id;
  }

  const itemsPerPage = 8;

  const isAdmin = () => {
    return user?.role === "helper" || user?.role === "system";
  };

  const adminRequest = () => {
    return useQuery(TABLE_TICKETS, {
      variables: {
        token: user?.token,
        filters: {
          helperIds: user?.id,
          limit: itemsPerPage,
          offset: 0,
          orderBy: "id",
          orderDir: "DESC",
          lang: "ru",
        },
      },
    });
  };

  const clientRequest = () => {
    return useQuery(TABLE_TICKETS_USER, {
      variables: {
        token: user?.token,
        clientId: user?.id,
        filters: {
          limit: itemsPerPage,
          offset: 0,
          orderBy: "id",
          orderDir: "DESC",
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
      if (data && data.helperQuery.ticketList.array) {
        setData(data.helperQuery.ticketList.array);
      }

      if (data && data.helperQuery.ticketList.count) {
        setDataAmount(data.helperQuery.ticketList.count);
      }
    } else {
      if (data && data.clientQuery.ticketListByClient.array) {
        setData(data.clientQuery.ticketListByClient.array);
      }

      if (data && data.clientQuery.ticketListByClient.count) {
        setDataAmount(data.clientQuery.ticketListByClient.count);
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

    console.log(index);

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

    if (prevSelectedSort !== -1 && orderDir == "DESC") {
      setSelectedSort(-1);
      _orderBy = "id";
      _orderDir = "DESC";
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
    return <>{userId == null ? <></> : <h2>Что-то пошло не так</h2>}</>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Новый":
        return "linear-gradient(0deg, rgba(0, 171, 151, 0.11) 0%, rgba(0, 171, 151, 0.11) 100%), #FFF";
      case "В процессе":
        return "#E6E3F6";
      case "На уточнении":
        return "rgba(171, 144, 0, 0.11)";
      case "Ожидает дополнения":
        return "rgba(102, 163, 209, 0.4)";
      case "Закрыт":
        return "rgba(171, 0, 0, 0.11)";
      default:
        return "white";
    }
  };

  return (
    <>
      {!loading && (
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
          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  {isAdmin() && <th>ID</th>}
                  <th>Раздел</th>
                  <th>Дата создания</th>
                  <th>Тема</th>
                  {isAdmin() && <th>Куратор</th>}
                  <th>Последнее сообщение</th>
                  <th>Сообщений</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    {isAdmin() && (
                      <td>
                        <Link
                          to={`/dialog/${ticket.link}`}
                          state={{
                            status: ticket.status.name.stroke,
                            linkPrev: window.location.href,
                          }}
                          className="alltickets__link"
                        >
                          {ticket.id}
                        </Link>
                      </td>
                    )}
                    <td style={{ textAlign: "left" }}>
                      <Link
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        {`${
                          ticket.subTheme.theme.unit.name.stroke ===
                          "Партнерам/Клиентам"
                            ? "ПК"
                            : "ДО"
                        } | ${ticket.subTheme.theme.name.stroke} ${
                          ticket.subTheme.name.stroke === "none"
                            ? ""
                            : `| ${ticket.subTheme.name.stroke}`
                        }`}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        {DateTime.fromISO(ticket.date, {
                          zone: "utc",
                        })
                          .toLocal()
                          .toFormat("yyyy.MM.dd")}
                        <br />
                        {DateTime.fromISO(ticket.date, {
                          zone: "utc",
                        })
                          .toLocal()
                          .toFormat("HH:mm:ss")}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        {ticket.title.length > 12
                          ? `${ticket.title.slice(0, 12)}...`
                          : `${ticket.title}`}
                      </Link>
                    </td>
                    {isAdmin() && (
                      <td>
                        <Link
                          to={`/dialog/${ticket.link}`}
                          state={{
                            status: ticket.status.name.stroke,
                            linkPrev: window.location.href,
                          }}
                          className="alltickets__link"
                        >
                          {`${ticket.helper.user.surname} ${ticket.helper.user.name}`}
                        </Link>
                      </td>
                    )}
                    <td>
                      <Link
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        {ticket.lastMessage.date
                          .slice(0, 10)
                          .replace(/-/g, ".")}
                        |{" "}
                        {ticket.lastMessage.sender.surname === "system"
                          ? "Системное сообщение"
                          : `${
                              ticket.lastMessage.sender.name
                            } ${ticket.lastMessage.sender.surname.charAt(0)}.`}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/dialog/${ticket.link}`}
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
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        <span
                          className="table__status"
                          style={{
                            background: getStatusColor(
                              ticket.status.name.stroke
                            ),
                            minWidth: "103px",
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
          </div>
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
