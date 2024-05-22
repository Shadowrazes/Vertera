import { useState, useEffect } from "react";
import {
  Form,
  Row,
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

import get_translation from "../helpers/translation";

function allTickets() {
  const [dataQuery, setDataQuery] = useState([]);
  const [dataTableTickets, setDataTableTickets] = useState([]);
  const [ticketsAmount, setTicketsAmount] = useState(0);
  const [dataQueryCurators, setDataQueryCurators] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [statusList, setStatusList] = useState([]);

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
  const [numberFilterValue, setNumberFilterValue] = useState("");
  const [daysFilterValue, setDaysFilterValue] = useState("");
  const [numberIdFilterValue, setNumberIdFilterValue] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedStatusesId, setSelectedStatusesId] = useState([]);
  const [selectedOuterId, setSelectedOuterId] = useState(null);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("DESC");
  const [offset, setOffset] = useState(0);

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleFilters, setIsVisibleFilters] = useState(false);
  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [prevCurrentPage, setPrevCurrentPage] = useState(-1);

  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user?.role === "system";
  };

  const isHelper = () => {
    return user?.role === "helper" || user?.role === "system";
  };

  const [fastFilterStr, setFastFilterStr] = useState(isAdmin() ? "all" : "my");

  const [helperIdsFilter, setHelperIdsFilter] = useState(
    isAdmin() ? null : user.id
  );
  const [helperStatusFilter, setHelperStatusFilter] = useState(null);

  let fastFilterHelperId = isAdmin() ? null : user.id;
  let fastFilterStatus = null;

  const pageNumbers = [];
  // const itemsPerPage = 8;

  const reactions = [
    get_translation("INTERFACE_LIKE"),
    get_translation("INTERFACE_DISLIKE"),
  ];
  const outerIdSelect = ["Партнер", "Структура"];
  const itemsPerPageArray = [25, 50, 100];

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
    setNumberFilterValue("");
    setDaysFilterValue("");
    setNumberIdFilterValue("");
    setSelectedStatuses([]);
    setSelectedStatusesId([]);
    setQueryReaction(null);

    setIsRefetching(true);

    try {
      if (isHelper()) {
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
          lang: language,
        };
        await refetch(variables);
      } else {
        const variables = {
          filters: {
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
            lang: "ru",
          },
          lang: language,
        };
        await refetch(variables);
      }
    } catch (error) {
      console.error("Refetch error:", error);
    } finally {
      setIsRefetching(false);
    }
  };

  const {
    loading: loadingThemeList,
    error: errorThemeList,
    data: dataThemeList,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
      lang: language,
    },
  });
  const {
    loading: loadingCountryList,
    error: errorCountryList,
    data: dataCountryList,
  } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user?.token,
      lang: language,
    },
  });
  const {
    loading: loadingCuratorsList,
    error: errorCuratorsList,
    data: dataCurators,
  } = useQuery(CURATORS_LIST, {
    variables: {
      token: user?.token,
    },
  });
  const {
    loading: loadingStatusList,
    error: errorStatusList,
    data: dataStatusList,
  } = useQuery(STATUS_LIST, {
    variables: {
      token: user?.token,
    },
  });

  const adminRequest = () => {
    // console.log(2);
    // console.log(helperIdsFilter);
    let _helperIdsFilter = helperIdsFilter;
    if (isAdmin()) {
      _helperIdsFilter = null;
    }
    // console.log(_helperIdsFilter);
    return useQuery(TABLE_TICKETS, {
      variables: {
        token: user?.token,
        filters: {
          helperIds: _helperIdsFilter,
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
        clientId: user.id,
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

  const { loading, error, data, refetch } = isHelper()
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

    if (isHelper()) {
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
        lang: language,
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
        lang: language,
      };
      await refetch(variables);
    }
  };

  useEffect(() => {
    if (isHelper()) {
      if (data && data.helperQuery.ticketList?.array) {
        setDataTableTickets(data.helperQuery.ticketList.array);
      }

      if (data && data.helperQuery.ticketList?.count) {
        setTicketsAmount(data.helperQuery.ticketList.count);
      }

      if (dataCurators && dataCurators.helperQuery?.helperList) {
        setDataQueryCurators(dataCurators.helperQuery.helperList);
      }

      if (dataCountryList && dataCountryList.clientQuery?.countryList) {
        setCountryList(dataCountryList.clientQuery.countryList);
      }

      if (dataStatusList && dataStatusList.helperQuery?.ticketStatusList) {
        setStatusList(dataStatusList.helperQuery.ticketStatusList);
      }
    } else {
      if (data && data.clientQuery.ticketListByClient?.array) {
        setDataTableTickets(data.clientQuery.ticketListByClient.array);
      }

      if (data && data.clientQuery.ticketListByClient?.count) {
        setTicketsAmount(data.clientQuery.ticketListByClient.count);
      }
    }

    if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
      setDataQuery(dataThemeList.clientQuery.allThemeTree);
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
    dataThemeList,
    dataCurators,
    dataCountryList,
    dataStatusList,
    selectedSort,
    prevSelectedSort,
    currentPage,
    pageNumbers,
  ]);

  const tickets = dataTableTickets;

  for (let i = 1; i <= Math.ceil(ticketsAmount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (
    loading ||
    loadingCountryList ||
    loadingCuratorsList ||
    loadingStatusList ||
    isRefetching ||
    loadingThemeList
  ) {
    return <Loader />;
  }

  if (
    error ||
    errorCountryList ||
    errorCuratorsList ||
    errorStatusList ||
    errorThemeList
  ) {
    const networkError =
      error.networkError ??
      errorCountryList.networkError ??
      errorCuratorsList.networkError ??
      errorStatusList.networkError ??
      errorThemeList.networkError;

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        } else if (errorMessage === "Forbidden") {
          return <NotFoundPage />;
        }
      }
    }
    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
  }

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

    setOrderBy(_orderBy);
    setOrderDir(_orderDir);

    if (isHelper()) {
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
        lang: language,
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
        lang: language,
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
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    if (unit !== selectedUnit) {
      setSelectedTheme(null);
      setSelectedThemeId(null);
      setSelectedSubTheme(null);
      setSelectedSubThemeId(null);
      setSubThemeDropdownVisible(true);
      setIsVisible(false);
    }
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);

    if (theme !== selectedTheme) {
      setSelectedSubTheme(null);
      setSelectedSubThemeId(null);
      setSubThemeDropdownVisible(true);
      setIsVisible(false);
    }
  };

  const handleSubThemeClick = (subTheme, subThemeId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);

    setIsVisible(false);
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
    const formattedDate = period?.map((originalDate) => {
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

  const handleNumberFilterValueChange = (e) => {
    setNumberFilterValue(e.target.value);
  };

  const handleDaysFilterValueChange = (e) => {
    setDaysFilterValue(e.target.value);
  };

  const handleOuterIdClick = (outerId) => {
    setSelectedOuterId(outerId);
  };

  const handleNumberIdFilterValueChange = (e) => {
    setNumberIdFilterValue(e.target.value);
  };

  const handleReactionClick = (reaction) => {
    setSelectedReaction(reaction);

    switch (reaction) {
      case get_translation("INTERFACE_LIKE"):
        setQueryReaction(1);
        break;
      case get_translation("INTERFACE_DISLIKE"):
        setQueryReaction(0);
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

    setIsRefetching(true);
    try {
      if (isHelper()) {
        let helperIds;
        if (selectedCuratorsId.length === 0) {
          helperIds = user.id;
          if (user.id == 0) {
            helperIds = undefined;
          }
        } else {
          helperIds = selectedCuratorsId;
        }

        const variables = {
          filters: {
            unitIds: selectedUnitId,
            themeIds: selectedThemeId,
            subThemeIds: selectedSubThemeId,
            helperIds: helperIds,
            helperCountryIds: selectedCuratorsCountiesId,
            clientCountryIds: selectedClientsCountiesId,
            dateBefore: selectedDateBefore,
            dateAfter: selectedDateAfter,
            reaction: queryReaction,
            limit: itemsPerPage,
            words: wordsFilterValue,
            statusIds: selectedStatusesId,
            offset: offset,
            orderBy: orderBy,
            orderDir: orderDir,
            outerId: parseInt(numberIdFilterValue),
            lang: "ru",
          },
          lang: language,
        };
        await refetch(variables);
      } else {
        const variables = {
          clientId: user.id,
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
          lang: language,
        };
        await refetch(variables);
      }
    } catch (error) {
      console.error("Refetch error:", error);
    } finally {
      setIsRefetching(false);
    }

    // if (isHelper()) {
    //   let helperIds;
    //   if (selectedCuratorsId.length === 0) {
    //     helperIds = user.id;
    //     if (user.id == 0) {
    //       helperIds = undefined;
    //     }
    //   } else {
    //     helperIds = selectedCuratorsId;
    //   }

    //   const variables = {
    //     filters: {
    //       unitIds: selectedUnitId,
    //       themeIds: selectedThemeId,
    //       subThemeIds: selectedSubThemeId,
    //       helperIds: helperIds,
    //       helperCountryIds: selectedCuratorsCountiesId,
    //       clientCountryIds: selectedClientsCountiesId,
    //       dateBefore: selectedDateBefore,
    //       dateAfter: selectedDateAfter,
    //       reaction: queryReaction,
    //       limit: itemsPerPage,
    //       words: wordsFilterValue,
    //       statusIds: selectedStatusesId,
    //       offset: offset,
    //       orderBy: orderBy,
    //       orderDir: orderDir,
    //       outerId: parseInt(numberIdFilterValue),
    //       lang: "ru",
    //     },
    //     lang: language,
    //   };
    //   await refetch(variables);
    // } else {
    //   const variables = {
    //     clientId: user.id,
    //     filters: {
    //       unitIds: selectedUnitId,
    //       themeIds: selectedThemeId,
    //       subThemeIds: selectedSubThemeId,
    //       dateBefore: selectedDateBefore,
    //       dateAfter: selectedDateAfter,
    //       reaction: queryReaction,
    //       limit: itemsPerPage,
    //       offset: offset,
    //       orderBy: orderBy,
    //       orderDir: orderDir,
    //       lang: "ru",
    //     },
    //     lang: language,
    //   };
    //   await refetch(variables);
    // }
  };

  const handleFastFilter = async (filterStr, event) => {
    setFastFilterStr(filterStr);

    if (filterStr === "my") {
      fastFilterHelperId = user.id;
      fastFilterStatus = null;
      setHelperIdsFilter(fastFilterHelperId);
      setHelperStatusFilter(fastFilterStatus);
    } else if (filterStr === "all") {
      fastFilterHelperId = null;
      fastFilterStatus = null;
      setHelperIdsFilter(fastFilterHelperId);
      setHelperStatusFilter(fastFilterStatus);
    } else if (filterStr === "in-process") {
      fastFilterHelperId = isAdmin() ? null : user.id;
      fastFilterStatus = 3;
      setHelperIdsFilter(fastFilterHelperId);
      setHelperStatusFilter(fastFilterStatus);
    } else if (filterStr === "clarification") {
      fastFilterHelperId = isAdmin() ? null : user.id;
      fastFilterStatus = [4, 5];
      setHelperIdsFilter(fastFilterHelperId);
      setHelperStatusFilter(fastFilterStatus);
    }

    if (isHelper()) {
      // console.log(6);
      // console.log("helperID ", helperIdsFilter);
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
        lang: language,
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
        lang: language,
      };
      await refetch(variables);
    }
  };

  const handleUnitStroke = (unit) => {
    const words = unit?.split(/[ /]/);
    const firstLetters = words.map((word) => word.charAt(0).toUpperCase());
    const result = firstLetters.join("");

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

  const handleCreateTicket = () => {
    location.href = "/";
  };

  const newCuratorList = dataQueryCurators
    .filter((curator) => curator.user.isActive == true)
    .map((curator) => ({
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
        <TitleH2
          title={get_translation("INTERFACE_ALL_APPEALS")}
          className="title__heading-nomargin mobile"
        />
        {!isHelper() ? (
          <div className="alltickets__nav-info">
            {!isHelper() && (
              <ButtonCustom
                title={get_translation("INTERFACE_CREATE_TICKET")}
                onClick={handleCreateTicket}
                className={"alltickets__btn button-hover"}
              />
            )}

            <ButtonCustom
              title={
                isVisibleFilters == false
                  ? get_translation("INTERFACE_SHOW_FILTER")
                  : get_translation("INTERFACE_HIDE_FILTER")
              }
              onClick={handleHideComponent}
              className={"alltickets__btn button-outlined"}
            />
          </div>
        ) : (
          <ButtonCustom
            title={
              isVisibleFilters == false
                ? get_translation("INTERFACE_SHOW_FILTER")
                : get_translation("INTERFACE_HIDE_FILTER")
            }
            onClick={handleHideComponent}
            className={"alltickets__btn button-outlined alltickets__button"}
          />
        )}
      </div>

      <>
        {isVisibleFilters && (
          <>
            <div className="alltickets__filters-container">
              <Form>
                <Row className="alltickets__row">
                  <div className="alltickets__column">
                    <div className="form__column">
                      <DropdownButton
                        id="dropdown-custom-1"
                        title={
                          selectedUnit ||
                          get_translation("INTERFACE_SELECT_UNIT")
                        }
                      >
                        {dataQuery.map(
                          (unit, index) =>
                            unit.visibility !== 3 && (
                              <Dropdown.Item
                                key={index}
                                onClick={() =>
                                  handleUnitClick(unit.name.stroke, unit.id)
                                }
                                href="#"
                              >
                                {unit.name.stroke}
                              </Dropdown.Item>
                            )
                        )}
                      </DropdownButton>

                      {selectedUnit && (
                        <DropdownButton
                          id="dropdown-custom-1"
                          title={
                            selectedTheme ||
                            get_translation("INTERFACE_TYPE_APPEALS")
                          }
                        >
                          {dataQuery
                            .find((unit) => unit.name.stroke === selectedUnit)
                            ?.themes.map(
                              (theme) =>
                                theme.visibility !== 3 && (
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
                                )
                            )}
                        </DropdownButton>
                      )}

                      {isSubThemeDropdownVisible && selectedTheme && (
                        <DropdownButton
                          id="dropdown-custom-1"
                          title={
                            selectedSubTheme ||
                            get_translation("INTERFACE_SUBTHEME")
                          }
                        >
                          {dataQuery
                            .find((unit) => unit.name.stroke === selectedUnit)
                            ?.themes.find(
                              (theme) => theme.name.stroke === selectedTheme
                            )
                            ?.subThemes.map(
                              (subTheme) =>
                                subTheme.visibility !== 3 && (
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
                                )
                            )}
                        </DropdownButton>
                      )}
                    </div>

                    {isHelper() && (
                      <MultiSelect
                        value={selectedCurators}
                        onChange={(e) => handleCuratorsOnChange(e.value)}
                        options={newCuratorList}
                        optionLabel="name"
                        className="add-curator__multiselect"
                        placeholder={get_translation("INTERFACE_CURATOR")}
                        filter
                      />
                    )}

                    {isHelper() && (
                      <MultiSelect
                        value={selectedCuratorsCountries}
                        onChange={(e) =>
                          handleCuratorsCountriesOnChange(e.value)
                        }
                        options={newCountriesList}
                        optionLabel="name"
                        className="add-curator__multiselect"
                        placeholder={get_translation(
                          "INTERFACE_CURATORS_COUNTRY"
                        )}
                        filter
                      />
                    )}

                    {isHelper() && (
                      <MultiSelect
                        value={selectedClientsCountries}
                        onChange={(e) =>
                          handleClientsCountriesOnChange(e.value)
                        }
                        options={newCountriesList}
                        optionLabel="name"
                        className="add-curator__multiselect"
                        placeholder={get_translation(
                          "INTERFACE_PARTNERS_COUNTRY"
                        )}
                        filter
                      />
                    )}
                  </div>

                  <div className="alltickets__column">
                    <DateRangePicker
                      className="alltickets__date-range-picker"
                      placeholder={get_translation("INTERFACE_SET_PERIOD")}
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
                        isHelper()
                          ? selectedReaction ||
                            get_translation("INTERFACE_REACTIONS")
                          : selectedReaction ||
                            get_translation("INTERFACE_MY_REACTIONS")
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

                    {isHelper() && (
                      <div className="alltickets__input-wrapper">
                        <Form.Group controlId="wordsFilterForm">
                          <Form.Control
                            type="text"
                            placeholder={get_translation("INTERFACE_REG_EXP")}
                            className="add-currator__input"
                            value={wordsFilterValue}
                            onChange={handleWordsFilterValueChange}
                          />
                        </Form.Group>
                      </div>
                    )}

                    {isHelper() && (
                      <MultiSelect
                        value={selectedStatuses}
                        onChange={(e) => handleStatusesOnChange(e.value)}
                        options={newStatusesList}
                        optionLabel="name"
                        className="add-curator__multiselect"
                        placeholder={get_translation("INTERFACE_THEME_STATUS")}
                      />
                    )}

                    {isHelper() && (
                      <Form.Group
                        className="alltickets__days-ago"
                        controlId="wordsFilterForm"
                      >
                        <div
                          className="alltickets__days-ago-label"
                          style={{ minWidth: "105px" }}
                        >
                          {get_translation("INTERFACE_CREATE_MORE")}
                        </div>
                        <Form.Control
                          type="number"
                          min={0}
                          placeholder={get_translation("INTERFACE_DAY_AGO")}
                          className="add-currator__input alltickets__days-ago-input"
                          value={numberFilterValue}
                          onChange={handleNumberFilterValueChange}
                        />
                        <Form.Control
                          type="number"
                          min={0}
                          placeholder={get_translation("INTERFACE_TIME")}
                          className="add-currator__input alltickets__days-ago-input right-input"
                          value={daysFilterValue}
                          onChange={handleDaysFilterValueChange}
                        />
                      </Form.Group>
                    )}

                    {isHelper() && (
                      <Form.Group
                        className="alltickets__days-ago"
                        controlId="wordsFilterForm"
                      >
                        <div className="alltickets__days-ago-label">ID</div>
                        <DropdownButton
                          id="dropdown-custom-1"
                          title={
                            selectedOuterId ||
                            get_translation("INTERFACE_PARTNER_STRUCTURE")
                          }
                        >
                          {outerIdSelect.map((outerId, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => handleOuterIdClick(outerId)}
                              href="#"
                            >
                              {outerId}
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                        <Form.Control
                          type="number"
                          min={0}
                          placeholder={get_translation("INTERFACE_ID_NUMBER")}
                          className="add-currator__input alltickets__days-ago-input right-input"
                          value={numberIdFilterValue}
                          onChange={handleNumberIdFilterValueChange}
                        />
                      </Form.Group>
                    )}
                  </div>
                </Row>
                <Row className="alltickets__button-row">
                  <ButtonCustom
                    title={get_translation("INTERFACE_APPLY")}
                    onClick={handleSubmit}
                    className={"button-hover"}
                  />
                  <ButtonCustom
                    title={get_translation("INTERFACE_RESET")}
                    className="alltickets__button-two button-outlined"
                    onClick={handleResetFilters}
                  />
                </Row>
              </Form>
            </div>
          </>
        )}

        {isHelper() && (
          <ButtonGroup size="sm" className="mb-3 filter-buttonGroup">
            {!isAdmin() && (
              <Button
                onClick={handleFastFilter.bind(null, "my")}
                variant={fastFilterStr === "my" ? "primary" : "outline-primary"}
              >
                {get_translation("INTERFACE_MY_TICKETS")}
              </Button>
            )}
            <Button
              onClick={handleFastFilter.bind(null, "all")}
              variant={fastFilterStr === "all" ? "primary" : "outline-primary"}
            >
              {get_translation("INTERFACE_ALL_TICKETS")}
            </Button>
            <Button
              onClick={handleFastFilter.bind(null, "in-process")}
              variant={
                fastFilterStr === "in-process" ? "primary" : "outline-primary"
              }
            >
              {get_translation("TICKETSTATUS_B9C8AB323A26E59E41F56A62E1B4E5D1")}
            </Button>
            <Button
              onClick={handleFastFilter.bind(null, "clarification")}
              variant={
                fastFilterStr === "clarification"
                  ? "primary"
                  : "outline-primary"
              }
            >
              {get_translation("TICKETSTATUS_08F55006CF2D6B8E04B9A6A6929DAD22")}
            </Button>
          </ButtonGroup>
        )}

        <div className="table__sorts">
          <span className="table__sorts-label">
            {get_translation("INTERFACE_SORT")}:
          </span>
          {columns.map((column, index) => (
            <>
              {isHelper() || index !== 0 ? (
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

        <div className="table__wrapper alltickets__table-wrapper">
          <Table className="table__table" hover>
            <thead>
              <tr>
                {isHelper() && <th>ID</th>}
                <th>{get_translation("INTERFACE_CHAPTER")}</th>
                <th>{get_translation("INTERFACE_DATE_CREATE")}</th>
                <th>{get_translation("INTERFACE_THEME")}</th>
                {isHelper() && (
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
                <tr key={ticket.id}>
                  {isHelper() && (
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
                        ticket.subTheme.theme.unit.name.stroke === null
                          ? ""
                          : `${handleUnitStroke(
                              ticket.subTheme.theme.unit.name.stroke
                            )} |`
                      } ${ticket.subTheme.theme.name.stroke} ${
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
                  <td style={{ textAlign: "left" }}>
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
                  {isHelper() && (
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
                      <td>
                        <Link
                          to={`/dialog/${ticket.link}`}
                          state={{
                            status: ticket.status.name.stroke,
                            linkPrev: window.location.href,
                          }}
                          className="alltickets__link"
                        >
                          {`${ticket.recipient.surname} ${ticket.recipient.name}`}
                        </Link>
                      </td>
                    </>
                  )}
                  <td className="mobile" style={{ textAlign: "left" }}>
                    <Link
                      to={`/dialog/${ticket.link}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.lastMessage.date.slice(0, 10).replace(/-/g, ".")}|{" "}
                      {ticket.lastMessage.sender.surname === "system"
                        ? "Системное сообщение"
                        : `${
                            ticket.lastMessage.sender.name
                          } ${ticket.lastMessage.sender.surname.charAt(0)}.`}
                    </Link>
                  </td>
                  <td className="mobile">
                    <Link
                      to={`/dialog/${ticket.link}`}
                      state={{
                        status: ticket.status.name.stroke,
                        linkPrev: window.location.href,
                      }}
                      className="alltickets__link"
                    >
                      {ticket.messages?.length}
                    </Link>
                  </td>
                  <td id="alltickets__status">
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

          <DropdownButton
            id="dropdown-custom-1"
            title={itemsPerPage || get_translation("INTERFACE_NUMBER_OF_LINES")}
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
              {get_translation("INTERFACE_PREVIOUS")}
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
              {get_translation("INTERFACE_NEXT")}
            </button>
          )}
        </ul>
      </>

      {ticketsAmount == 0 && !isHelper() && (
        <div className="alltickets__empty-table">
          <span className="alltickets__text">
            {get_translation("INTERFACE_NO_TICKETS")}
          </span>
          <ButtonCustom
            title={get_translation("INTERFACE_TICKET_CREATOR")}
            onClick={goToCreateTicket}
            className={"button-hover"}
          />
        </div>
      )}
    </>
  );
}

export default allTickets;
