import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Table,
  Button,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { DateTime } from "luxon";

import {
  TABLE_TICKETS,
  TABLE_TICKETS_USER,
  THEME_LIST,
  CURATORS_LIST,
  COUNTRY_LIST,
  STATUS_LIST,
} from "../apollo/queries";

import { DateRangePicker } from "rsuite";
import { MultiSelect } from "primereact/multiselect";
import Loader from "../pages/loading";
import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";

import "../css/all-tickets.css";
import "../css/add-curator.css";
import "rsuite/dist/rsuite-no-reset.min.css";

function allTickets() {
  const [dataTableTickets, setDataTableTickets] = useState([]);
  const [dataAmount, setDataAmount] = useState(0);
  const [dataTheme, setDataTheme] = useState([]);
  const [dataQueryCurators, setDataQueryCurators] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);
  const [selectedCurators, setSelectedCurators] = useState([]);
  const [selectedCuratorsId, setSelectedCuratorsId] = useState([]);
  const [selectedCuratorsCountries, setSelectedCuratorsCountries] = useState(
    []
  );
  const [selectedCuratorsCountiesId, setSelectedCuratorsCountriesId] = useState(
    []
  );
  const [selectedClientsCountries, setSelectedClientsCountries] = useState([]);
  const [selectedClientsCountiesId, setSelectedClientsCountriesId] = useState(
    []
  );
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [queryReaction, setQueryReaction] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [selectedDateBefore, setSelectedDateBefore] = useState(null);
  const [selectedDateAfter, setSelectedDateAfter] = useState(null);
  const [wordsFilterValue, setWordsFilterValue] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedStatusesId, setSelectedStatusesId] = useState([]);
  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("DESC");
  const [offset, setOffset] = useState(0);

  const [fastFilterStr, setFastFilterStr] = useState("my");

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleFilters, setIsVisibleFilters] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [prevCurrentPage, setPrevCurrentPage] = useState(-1);

  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [userRole, setUserRole] = useState(
    JSON.parse(localStorage.getItem("userRole"))?.role.role
  );

  let userId = null;

  if (user === null) {
    userId = 999;
  } else {
    userId = user.id;
  }

  const [helperIdsFilter, setHelperIdsFilter] = useState(userId);
  const [helperStatusFilter, setHelperStatusFilter] = useState(null);

  let userCurRole = null;

  if (userRole === null) {
    userCurRole = "helper";
  } else {
    userCurRole = userRole;
  }

  let fastFilterHelperId = userId;
  let fastFilterStatus = null;

  const pageNumbers = [];
  // const itemsPerPage = 8;

  const reactions = ["Понравилось", "Не понравилось", "Все реакции"];
  const itemsPerPageArray = [25, 50, 100];

  const isAdmin = () => {
    return userRole === "helper";
  };

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  const handleHideComponent = () => {
    setIsVisibleFilters((prevVisibility) => !prevVisibility);
    // console.log(dataTheme);
  };

  const handleResetFilters = async (e) => {
    e.preventDefault();

    setSelectedUnit(null);
    setSelectedUnitId(null);
    setSelectedItem(null);
    setSelectedTheme(null);
    setSelectedThemeId(null);
    setSelectedSubTheme(null);
    setSelectedSubThemeId(null);
    setSelectedCurators([]);
    setSelectedCuratorsId([]);
    setSelectedCuratorsCountries([]);
    setSelectedCuratorsCountriesId([]);
    setSelectedClientsCountries([]);
    setSelectedClientsCountriesId([]);
    setDateRange(null);
    setSelectedDateAfter(null);
    setSelectedDateBefore(null);
    setSelectedReaction(null);
    setWordsFilterValue("");
    setSelectedStatuses([]);
    setSelectedStatusesId([]);
    setQueryReaction(null);

    if (isAdmin()) {
      // console.log(1);
      const variables = {
        filters: {
          helperIds: helperIdsFilter,
          unitIds: null,
          themeIds: null,
          subThemeIds: null,
          dateBefore: null,
          dateAfter: null,
          reaction: null,
          limit: itemsPerPage,
          offset: offset,
          orderBy: orderBy,
          orderDir: orderDir,
          statusIds: null,
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

  const { data: themeData } = useQuery(THEME_LIST);
  const { data: dataCurators } = useQuery(CURATORS_LIST);
  const { data: dataCountryList } = useQuery(COUNTRY_LIST);
  const { data: dataStatusList } = useQuery(STATUS_LIST);

  const adminRequest = () => {
    // console.log(2);
    return useQuery(TABLE_TICKETS, {
      variables: {
        filters: {
          helperIds: helperIdsFilter,
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
        clientId: userId,
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

  const handleNewPage = async (index) => {
    setCurrentPage(index);

    let lastItem = currentPage * itemsPerPage;
    let _offset = lastItem - itemsPerPage;

    setOffset(_offset);

    // console.log("fast id ", helperIdsFilter);
    // console.log("unit id ", selectedUnitId);
    // console.log("theme id ", selectedThemeId);
    // console.log("subtheme id ", selectedSubThemeId);
    // console.log("datebefore ", selectedDateBefore);
    // console.log("dateafter ", selectedDateAfter);
    // console.log("reactions ", queryReaction);
    // console.log("items/page ", itemsPerPage);
    // console.log("offset ", _offset);
    // console.log("orderby ", orderBy);
    // console.log("orderdir ", orderDir);
    // console.log("fastfilter status ", fastFilterStatus);

    if (isAdmin()) {
      // console.log(3);
      const variables = {
        filters: {
          helperIds: helperIdsFilter,
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
          statusIds: helperStatusFilter,
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
    if (isAdmin()) {
      if (data && data.helperQuery.ticketList.array) {
        setDataTableTickets(data.helperQuery.ticketList.array);
      }

      if (data && data.helperQuery.ticketList.count) {
        setDataAmount(data.helperQuery.ticketList.count);
      }

      if (dataCurators && dataCurators.helperQuery.helperList) {
        setDataQueryCurators(dataCurators.helperQuery.helperList);
      }

      if (dataCountryList && dataCountryList.adminQuery.countryList) {
        setCountryList(dataCountryList.adminQuery.countryList);
      }

      if (dataStatusList && dataStatusList.helperQuery.ticketStatusList) {
        setStatusList(dataStatusList.helperQuery.ticketStatusList);
      }
    } else {
      if (data && data.clientQuery.ticketListByClient.array) {
        setDataTableTickets(data.clientQuery.ticketListByClient.array);
      }

      if (data && data.clientQuery.ticketListByClient.count) {
        setDataAmount(data.clientQuery.ticketListByClient.count);
      }
    }

    if (themeData && themeData.clientQuery.allThemeTree) {
      setDataTheme(themeData.clientQuery.allThemeTree);
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
    dataCurators,
    dataCountryList,
    dataStatusList,
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

    if (prevSelectedSort !== -1 && orderDir == "DESC") {
      setSelectedSort(-1);
      _orderBy = "id";
      _orderDir = "DESC";
    }

    setOrderBy(_orderBy);
    setOrderDir(_orderDir);

    if (isAdmin()) {
      // console.log(4);
      const variables = {
        filters: {
          helperIds: helperIdsFilter,
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
          statusIds: helperStatusFilter,
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

  const handleCuratorsOnChange = (curators) => {
    setSelectedCurators(curators);
    setSelectedCuratorsId(curators.map((curator) => curator.id));
  };

  const handleCuratorsCountriesOnChange = (country) => {
    setSelectedCuratorsCountries(country);
    setSelectedCuratorsCountriesId(country.map((country) => country.id));
  };

  const handleClientsCountriesOnChange = (country) => {
    setSelectedClientsCountries(country);
    setSelectedClientsCountriesId(country.map((country) => country.id));
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
    console.log(formattedDate[0]);
  };

  const handleWordsFilterValueChange = (e) => {
    setWordsFilterValue(e.target.value);
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

  const handleStatusesOnChange = (statuses) => {
    setSelectedStatuses(statuses);
    setSelectedStatusesId(statuses.map((status) => status.id));
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
      // console.log(5);
      const variables = {
        filters: {
          helperIds: helperIdsFilter,
          unitIds: selectedUnitId,
          themeIds: selectedThemeId,
          subThemeIds: selectedSubThemeId,
          helperIds: selectedCuratorsId,
          helperCountryIds: selectedCuratorsCountiesId,
          clientCountryIds: selectedClientsCountiesId,
          dateBefore: selectedDateBefore,
          dateAfter: selectedDateAfter,
          reaction: queryReaction,
          statusIds: selectedStatusesId,
          limit: itemsPerPage,
          offset: offset,
          orderBy: orderBy,
          orderDir: orderDir,
          statusIds: helperStatusFilter,
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

  const handleFastFilter = async (filterStr, event) => {
    setFastFilterStr(filterStr);

    if (filterStr === "my") {
      fastFilterHelperId = userId;
      fastFilterStatus = null;
      setHelperIdsFilter(fastFilterHelperId);
      setHelperStatusFilter(fastFilterStatus);
    } else if (filterStr === "all") {
      fastFilterHelperId = null;
      fastFilterStatus = null;
      setHelperIdsFilter(fastFilterHelperId);
      setHelperStatusFilter(fastFilterStatus);
    } else if (filterStr === "in-process") {
      fastFilterHelperId = null;
      fastFilterStatus = 3;
      setHelperIdsFilter(null);
      setHelperStatusFilter(fastFilterStatus);
    } else if (filterStr === "clarification") {
      fastFilterHelperId = null;
      fastFilterStatus = 4;
      setHelperIdsFilter(null);
      setHelperStatusFilter(fastFilterStatus);
    }

    if (isAdmin()) {
      // console.log(6);
      console.log("helperID ", helperIdsFilter);
      const variables = {
        filters: {
          helperIds: fastFilterHelperId,
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
          statusIds: fastFilterStatus,
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
      case "На уточнении":
        return "rgba(171, 144, 0, 0.11)";
      case "Закрыт":
        return "rgba(171, 0, 0, 0.11)";
      default:
        return "white";
    }
  };

  const newCuratorList = dataQueryCurators.map((curator) => ({
    name: `${curator.user.surname} ${curator.user.name} ${
      curator.user.patronymic ? ` ${curator.user.patronymic}` : ""
    }`,
    id: curator.id,
  }));

  const newCountriesList = countryList.map((country) => ({
    name: country.name.stroke,
    id: country.id,
  }));

  const newStatusesList = statusList.map((status) => ({
    name: status.name.stroke,
    id: status.id,
  }));

  return (
    <>
      <div className="alltickets__container">
        <TitleH2 title="Все обращения" className="title__heading-nomargin" />
        {!loading && (
          <ButtonCustom
            title={
              isVisibleFilters == false ? "Показать фильтр" : "Скрыть фильтр"
            }
            onClick={handleHideComponent}
            className={"alltickets__btn"}
          />
        )}
      </div>
      {!loading && (
        <>
          {isVisibleFilters && (
            <>
              {isAdmin() ? (
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
                                    handleThemeClick(
                                      theme.name.stroke,
                                      theme.id
                                    )
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

                        <MultiSelect
                          value={selectedCurators}
                          onChange={(e) => handleCuratorsOnChange(e.value)}
                          options={newCuratorList}
                          optionLabel="name"
                          className="add-curator__multiselect"
                          placeholder="Куратор"
                          filter
                        />

                        <MultiSelect
                          value={selectedCuratorsCountries}
                          onChange={(e) =>
                            handleCuratorsCountriesOnChange(e.value)
                          }
                          options={newCountriesList}
                          optionLabel="name"
                          className="add-curator__multiselect"
                          placeholder="Страны кураторов"
                          filter
                        />

                        <MultiSelect
                          value={selectedClientsCountries}
                          onChange={(e) =>
                            handleClientsCountriesOnChange(e.value)
                          }
                          options={newCountriesList}
                          optionLabel="name"
                          className="add-curator__multiselect"
                          placeholder="Страны партнеров"
                          filter
                        />
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
                          title={
                            selectedReaction || isAdmin()
                              ? "Реакции"
                              : "Мои реакции"
                          }
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

                        <Form.Group controlId="wordsFilterForm">
                          <Form.Control
                            type="text"
                            placeholder="Есть слова"
                            className="add-currator__input"
                            value={wordsFilterValue}
                            onChange={handleWordsFilterValueChange}
                          />
                        </Form.Group>

                        <MultiSelect
                          value={selectedStatuses}
                          onChange={(e) => handleStatusesOnChange(e.value)}
                          options={newStatusesList}
                          optionLabel="name"
                          className="add-curator__multiselect"
                          placeholder="Статус темы"
                        />

                        <Form.Group
                          className="alltickets__days-ago"
                          controlId="wordsFilterForm"
                        >
                          <div className="alltickets__days-ago-label">
                            Создано более чем
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="X число назад"
                            className="add-currator__input"
                            value={wordsFilterValue}
                            onChange={handleWordsFilterValueChange}
                          />
                          <Form.Control
                            type="text"
                            placeholder="мин/часов/дней"
                            className="add-currator__input"
                            value={wordsFilterValue}
                            onChange={handleWordsFilterValueChange}
                          />
                        </Form.Group>
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
              ) : (
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
                                    handleThemeClick(
                                      theme.name.stroke,
                                      theme.id
                                    )
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
                          title={
                            selectedReaction || isAdmin()
                              ? "Реакции"
                              : "Мои реакции"
                          }
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
            </>
          )}

          {isAdmin() && (
            <ButtonGroup className="mb-3">
              <Button
                onClick={handleFastFilter.bind(null, "my")}
                variant={fastFilterStr === "my" ? "primary" : "outline-primary"}
              >
                Мои тикеты
              </Button>
              <Button
                onClick={handleFastFilter.bind(null, "all")}
                variant={
                  fastFilterStr === "all" ? "primary" : "outline-primary"
                }
              >
                Все тикеты
              </Button>
              <Button
                onClick={handleFastFilter.bind(null, "in-process")}
                variant={
                  fastFilterStr === "in-process" ? "primary" : "outline-primary"
                }
              >
                В процессе рассмотрения
              </Button>
              <Button
                onClick={handleFastFilter.bind(null, "clarification")}
                variant={
                  fastFilterStr === "clarification"
                    ? "primary"
                    : "outline-primary"
                }
              >
                На уточнении
              </Button>
            </ButtonGroup>
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

          <div className="table__wrapper">
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
                    <td>
                      <Link
                        to={`/dialog/${ticket.link}`}
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
                          .toFormat("yyyy.MM.dd HH:mm:ss")}
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
                        {ticket.subTheme.theme.name.stroke}
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
                        {ticket.lastMessage.date
                          .slice(0, 10)
                          .replace(/-/g, ".")}
                        |{" "}
                        {ticket.lastMessage.sender.surname === "system"
                          ? "Системное сообщение"
                          : `${ticket.lastMessage.sender.surname} ${ticket.lastMessage.sender.name}`}
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

            <DropdownButton
              id="dropdown-custom-1"
              title={itemsPerPage || "Количество строк"}
              className="alltickets__amount"
            >
              {itemsPerPageArray.map((amount, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setItemsPerPage(amount)}
                  href="#"
                >
                  {amount}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>

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
      {dataAmount == 0 && !isAdmin() && (
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

      {/* {dataAmount == 0 && isAdmin() && (
        <div className="alltickets__empty-table">
          <span className="alltickets__text">У вас нет тикетов</span>
        </div>
      )} */}
    </>
  );
}

export default allTickets;
