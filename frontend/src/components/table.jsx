import { useState, useEffect } from "react";
import { Table, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

import { TABLE_TICKETS_USER, TABLE_TICKETS } from "../apollo/queries";

import TitleH2 from "./title";
import ButtonCustom from "./button";
import Loader from "../pages/loading";

import "../css/table.css";
import "../css/all-tickets.css";

import get_translation from "../helpers/translation";

function TableTickets() {
  const [dataQuery, setData] = useState([]);
  const [dataAmount, setDataAmount] = useState(0);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderDir, setOrderDir] = useState("DESC");

  const columns = [
    "id",
    "subTheme.theme.unit.name.stroke",
    "date",
    "subTheme.theme.name.stroke",
    "lastMessage.text",
  ];
  const columnsName = [
    "ID",
    get_translation("INTERFACE_CHAPTER"),
    get_translation("INTERFACE_DATE"),
    get_translation("INTERFACE_THEME"),
    get_translation("INTERFACE_LAST_MSG"),
  ];

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [language, setLanguage] = useState(localStorage.getItem("language"));
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
        lang: language,
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
        lang: language,
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
      if (data && data.helperQuery.ticketList?.array) {
        setData(data.helperQuery.ticketList.array);
      }

      if (data && data.helperQuery.ticketList?.count) {
        setDataAmount(data.helperQuery.ticketList.count);
      }
    } else {
      if (data && data.clientQuery.ticketListByClient?.array) {
        setData(data.clientQuery.ticketListByClient.array);
      }

      if (data && data.clientQuery.ticketListByClient?.count) {
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
        _orderBy = "id";
        break;

      case 1:
        _orderBy = "unitStroke";
        break;

      case 2:
        _orderBy = "date";
        break;

      case 3:
        _orderBy = "themeStroke";
        break;

      case 4:
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
        lang: language,
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
        lang: language,
      };

      await refetch(variables);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    const networkError = error.networkError;

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        }
      }
    }
    return (
      <>
        {userId == null ? <></> : <h2>{get_translation("INTERFACE_ERROR")}</h2>}
      </>
    );
  }

  const handleUnitStroke = (unit) => {
    const words = unit?.split(/[ /]/);
    const firstLetters = words?.map((word) => word.charAt(0).toUpperCase());
    const result = firstLetters?.join("");

    return result;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Новый":
        return "#E3F3F6";
      case "В процессе":
        return "#F6F6E3";
      case "На уточнении":
        return "#F0E3F6";
      case "Ожидает дополнения":
        return "#F6EDE3";
      case "У наставника":
        return "#E3E5F6";
      case "Уведомление":
        return "#FFFFFF";
      case "Выполнено":
        return "#E3F6E5";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <>
      {!loading && (
        <>
          <TitleH2
            title={get_translation("INTERFACE_MY_APPEALS")}
            className="title__heading"
          />
          <div className="table__sorts">
            <span className="table__sorts-label">
              {get_translation("INTERFACE_SORT")}:
            </span>
            {columns.map((column, index) => (
              <>
                {isAdmin() || index !== 0 ? (
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
                ) : null}
              </>
            ))}
          </div>
          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  {isAdmin() && <th>ID</th>}
                  <th>{get_translation("INTERFACE_CHAPTER")}</th>
                  <th>{get_translation("INTERFACE_DATE_CREATE")}</th>
                  <th>{get_translation("INTERFACE_THEME")}</th>
                  {isAdmin() && (
                    <>
                      <th className="mobile">ID партнера</th>
                      <th>{get_translation("INTERFACE_CURATOR")}</th>
                    </>
                  )}
                  <th className="mobile">
                    {get_translation("INTERFACE_LAST_MSG")}
                  </th>
                  <th className="mobile">{get_translation("INTERFACE_MSG")}</th>
                  <th>{get_translation("INTERFACE_STATUS")}</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr className="d-md-table-row" key={ticket.id}>
                    {isAdmin() && (
                      <td className="d-md-table-cell">
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
                    <td
                      className="d-md-table-cell"
                      style={{ textAlign: "left" }}
                    >
                      <Link
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        {`${handleUnitStroke(
                          ticket.subTheme.theme.unit.name.stroke
                        )} | ${ticket.subTheme.theme.name.stroke} ${
                          ticket.subTheme.name.stroke === "none"
                            ? ""
                            : `| ${ticket.subTheme.name.stroke}`
                        }`}
                      </Link>
                    </td>
                    <td className="d-md-table-cell">
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
                    <td className="d-md-table-cell">
                      <Link
                        to={`/dialog/${ticket.link}`}
                        state={{
                          status: ticket.status.name.stroke,
                          linkPrev: window.location.href,
                        }}
                        className="alltickets__link"
                      >
                        {ticket.title.length > 20
                          ? `${ticket.title.slice(0, 20)}...`
                          : `${ticket.title}`}
                      </Link>
                    </td>
                    {isAdmin() && (
                      <>
                        <td className="mobile">
                          <Link
                            to={`/dialog/${ticket.link}`}
                            state={{
                              status: ticket.status.name.stroke,
                              linkPrev: window.location.href,
                            }}
                            className="alltickets__link"
                          >
                            {ticket.initiator.outerId
                              ? ticket.initiator.outerId
                              : ticket.initiator.id}
                          </Link>
                        </td>
                        <td className="d-md-table-cell">
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
                      </>
                    )}
                    <td className="d-md-table-cell mobile">
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
                    <td className="d-md-table-cell mobile">
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
                    <td className="d-md-table-cell">
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
            title={get_translation("INTERFACE_SHOW_ALL_TICKETS")}
            onClick={goToAllTickets}
            className={"table__button button-hover"}
          />
        </>
      )}
    </>
  );
}

export default TableTickets;
