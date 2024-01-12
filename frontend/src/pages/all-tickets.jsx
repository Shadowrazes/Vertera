import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Table,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import {
  TABLE_TICKETS,
  TABLE_TICKETS_USER,
  THEME_LIST,
} from "../apollo/queries";
import Loader from "../pages/loading";
import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";

import "../css/all-tickets.css";
import "rsuite/dist/rsuite-no-reset.min.css";

function allTickets() {
  const [dataTableTickets, setDataTableTickets] = useState([]);
  const [dataAmount, setDataAmount] = useState(0);
  const [dataTheme, setDataTheme] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [queryReaction, setQueryReaction] = useState(null);
  const [selectedDateBefore, setSelectedDateBefore] = useState(null);
  const [selectedDateAfter, setSelectedDateAfter] = useState(null);
  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("ASC");
  const [offset, setOffset] = useState(0);

  const [isVisible, setIsVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [prevCurrentPage, setPrevCurrentPage] = useState(-1);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [userRole, setUserRole] = useState(
    JSON.parse(localStorage.getItem("userRole"))?.role.role
  );

  const [dateRange, setDateRange] = useState([]);

  let userId = null;
  let userCurRole = null;

  if (user === null) {
    userId = 999;
  } else {
    userId = user.id;
  }

  if (userRole === null) {
    userCurRole = "client";
  } else {
    userCurRole = userRole;
  }

  const pageNumbers = [];
  const itemsPerPage = 8;

  const isAdmin = () => {
    return userRole === "helper";
  };

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  const [isVisibleFilters, setIsVisibleFilters] = useState(false);

  const handleHideComponent = () => {
    setIsVisibleFilters((prevVisibility) => !prevVisibility);
    // console.log(dataTheme);
  };

  let reactions = ["Понравилось", "Не понравилось", "Все реакции"];

  const handleResetFilters = (e) => {
    e.preventDefault();
    // const resetState = initialSelectedFilterState.map(() => -1);
    // setSelectedFilter(resetState);
    setSelectedUnit(null);
    setSelectedUnitId(null);
    setSelectedItem(null);
    setSelectedTheme(null);
    setSelectedThemeId(null);
    setSelectedSubTheme(null);
    setSelectedSubThemeId(null);
    setDateRange([]);
    setSelectedDateAfter(null);
    setSelectedDateBefore(null);
    setSelectedReaction(null);
    setQueryReaction(null);
  };

  const {
    loading: themeLoading,
    error: themeError,
    data: themeData,
  } = useQuery(THEME_LIST);

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

  const handleNewPage = async (index) => {
    setCurrentPage(index);

    let lastItem = currentPage * itemsPerPage;
    let _offset = lastItem - itemsPerPage;

    setOffset(_offset);

    if (isAdmin()) {
      const variables = {
        filters: {
          helperIds: userId,
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          limit: itemsPerPage,
          offset: _offset,
          orderBy: orderBy,
          orderDir: orderDir,
          lang: "ru",
        },
      };
      await refetch(variables);
    } else {
      const variables = {
        filters: {
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          limit: itemsPerPage,
          offset: _offset,
          orderBy: orderBy,
          orderDir: orderDir,
          lang: "ru",
        },
      };
      await refetch(variables);
    }
  };

  useEffect(() => {
    // if (data && data.ticketListByClient.array) {
    //   setDataTableTickets(data.ticketListByClient.array);
    // }

    // if (data && data.ticketListByClient.count) {
    //   setDataAmount(data.ticketListByClient.count);
    // }

    if (isAdmin()) {
      if (data && data.ticketList.array) {
        setDataTableTickets(data.ticketList.array);
      }

      if (data && data.ticketList.count) {
        setDataAmount(data.ticketList.count);
      }
    } else {
      if (data && data.ticketListByClient.array) {
        setDataTableTickets(data.ticketListByClient.array);
      }

      if (data && data.ticketListByClient.count) {
        setDataAmount(data.ticketListByClient.count);
      }
    }

    if (themeData && themeData.allThemeTree) {
      setDataTheme(themeData.allThemeTree);
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
    // console.log(pageNumbers.length);
  }, [
    data,
    themeData,
    selectedSort,
    prevSelectedSort,
    currentPage,
    pageNumbers,
  ]);

  const tickets = dataTableTickets;

  const ticketsAmount = dataAmount;
  // console.log(ticketsAmount);

  for (let i = 1; i <= Math.ceil(ticketsAmount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

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

    if (isAdmin()) {
      const variables = {
        filters: {
          helperIds: userId,
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          limit: itemsPerPage,
          offset: offset,
          orderBy: _orderBy,
          orderDir: _orderDir,
          lang: "ru",
        },
      };
      await refetch(variables);
    } else {
      const variables = {
        filters: {
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          limit: itemsPerPage,
          offset: offset,
          orderBy: _orderBy,
          orderDir: _orderDir,
          lang: "ru",
        },
      };
      await refetch(variables);
    }
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

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);
    // console.log(unitId);

    setSelectedTheme(null);
    setSelectedSubTheme(null);
    setSubThemeDropdownVisible(true);
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);
    // console.log(themeId);

    setSelectedSubTheme(null);
    setSubThemeDropdownVisible(true);

    switch ((selectedUnitId, themeId)) {
      case (1, 14):
        setSelectedSubThemeId(73);
        setSubThemeDropdownVisible(false);
        break;
      case (2, 15):
        setSelectedSubThemeId(74);
        setSubThemeDropdownVisible(false);
        break;
      case (2, 16):
        setSelectedSubThemeId(75);
        setSubThemeDropdownVisible(false);
        break;
      case (2, 22):
        setSelectedSubThemeId(102);
        setSubThemeDropdownVisible(false);
        break;
      case (2, 23):
        setSelectedSubThemeId(103);
        setSubThemeDropdownVisible(false);
        break;
      default:
    }
  };

  const handleSubThemeClick = (subTheme, subThemeId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);
    // console.log(subThemeId);
  };

  const handlePeriodClick = (period) => {
    const formattedDate = period.map((originalDate) => {
      const year = originalDate.getFullYear();
      const month = ("0" + (originalDate.getMonth() + 1)).slice(-2);
      const day = ("0" + originalDate.getDate()).slice(-2);

      return `${year}-${month}-${day}`;
    });
    setDateRange(period);
    setSelectedDateAfter(formattedDate[0] + " 00:00:00");
    setSelectedDateBefore(formattedDate[1] + " 23:59:59");
    // console.log(formattedDate[0]);
  };

  const handleReactionClick = (reaction) => {
    setSelectedReaction(reaction);
    switch (reaction) {
      case "Понравилось":
        setQueryReaction("like");
        break;
      case "Не понравилось":
        setQueryReaction("dislike");
        break;
      default:
        setQueryReaction(null);
    }
    // console.log(queryReaction);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(selectedUnit);
    // console.log(selectedTheme);
    // console.log(selectedSubTheme);
    // console.log(selectedDateBefore);
    // console.log(selectedDateAfter);
    // console.log(queryReaction);

    if (isAdmin()) {
      const variables = {
        filters: {
          helperIds: userId,
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          limit: itemsPerPage,
          offset: offset,
          orderBy: orderBy,
          orderDir: orderDir,
          lang: "ru",
        },
      };
      await refetch(variables);
    } else {
      const variables = {
        filters: {
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          limit: itemsPerPage,
          offset: offset,
          orderBy: orderBy,
          orderDir: orderDir,
          lang: "ru",
        },
      };
      await refetch(variables);
    }
  };

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
      <div className="alltickets__container">
        <TitleH2 title="Все обращения" className="title__heading-nomargin" />
        {!loading && dataAmount > 0 && (
          <ButtonCustom
            title={
              isVisibleFilters == false ? "Показать фильтр" : "Скрыть фильтр"
            }
            onClick={handleHideComponent}
          />
        )}
      </div>
      {!loading && dataAmount > 0 && (
        <>
          {isVisibleFilters && (
            <div className="alltickets__filters-container">
              <Form>
                <Row>
                  <Col className="alltickets__column">
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={selectedItem || "Выберите подразделение"}
                    >
                      {dataTheme.map((unit, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            handleUnitClick(unit.name.stroke, unit.id)
                          }
                          href="#"
                        >
                          {unit.name.stroke}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>

                    {selectedUnit && (
                      <DropdownButton
                        id="dropdown-custom-1"
                        title={selectedTheme || "Тип обращения"}
                      >
                        {dataTheme
                          .find((unit) => unit.name.stroke === selectedUnit)
                          ?.themes.map((theme) => (
                            <Dropdown.Item
                              key={theme.id}
                              onClick={() =>
                                handleThemeClick(theme.name.stroke, theme.id)
                              }
                              href="#"
                            >
                              {theme.name.stroke}
                            </Dropdown.Item>
                          ))}
                      </DropdownButton>
                    )}

                    {isSubThemeDropdownVisible && selectedTheme && (
                      <DropdownButton
                        id="dropdown-custom-1"
                        title={selectedSubTheme || "Подтема"}
                      >
                        {dataTheme
                          .find((unit) => unit.name.stroke === selectedUnit)
                          ?.themes.find(
                            (theme) => theme.name.stroke === selectedTheme
                          )
                          ?.subThemes.map((subTheme) => (
                            <Dropdown.Item
                              key={subTheme.id}
                              onClick={() =>
                                handleSubThemeClick(
                                  subTheme.name.stroke,
                                  subTheme.id
                                )
                              }
                              href="#"
                            >
                              {subTheme.name.stroke}
                            </Dropdown.Item>
                          ))}
                      </DropdownButton>
                    )}
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
                      onChange={handlePeriodClick}
                      value={dateRange}
                    />
                    <DropdownButton
                      id="dropdown-custom-1"
                      title={selectedReaction || "Мои реакции"}
                    >
                      {reactions.map((reaction, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleReactionClick(reaction)}
                          href="#"
                        >
                          {reaction}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </Col>
                </Row>
                <Row className="alltickets__button-row">
                  <ButtonCustom title="Применить" onClick={handleSubmit} />
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
                          minWidth: "115px",
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
                disabled={
                  currentPage === Math.ceil(ticketsAmount / itemsPerPage)
                }
              >
                Следующая
              </button>
            )}
          </ul>
        </>
      )}
      {dataAmount == 0 && (
        <div className="alltickets__empty-table">
          <span className="alltickets__text">
            У вас нет тикетов, чтобы создать обращение нажмите на кнопку
          </span>
          <ButtonCustom
            title="Создать новое обращение"
            onClick={goToCreateTicket}
          />
        </div>
      )}
    </>
  );
}

export default allTickets;
