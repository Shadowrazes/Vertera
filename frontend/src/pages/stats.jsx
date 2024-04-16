import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import {
  STATS,
  CURATORS_LIST,
  THEME_LIST,
  COUNTRY_LIST,
  DEPARTMENTS_LIST,
} from "../apollo/queries";

import { DateRangePicker } from "rsuite";
import { MultiSelect } from "primereact/multiselect";
import TitleH2 from "../components/title";
import Level from "../components/level";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import "rsuite/dist/rsuite-no-reset.min.css";
import "../css/stats.css";

import {
  Form,
  Row,
  Col,
  Button,
  DropdownButton,
  Dropdown,
  Modal,
  Table,
} from "react-bootstrap";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Radar, Doughnut } from "react-chartjs-2";
import subDays from "date-fns/subDays";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

import get_translation from "../helpers/translation";

function Stats() {
  const [dataQueryCurators, setDataQueryCurators] = useState([]);
  const [themeList, setThemeList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedCurator, setSelectedCurator] = useState(null);
  const [selectedCuratorIndex, setSelectedCuratorIndex] = useState(0);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [selectedDateAfter, setSelectedDateAfter] = useState(null);
  const [selectedDateBefore, setSelectedDateBefore] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCountiesId, setSelectedCountriesId] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);

  const [totalData, setTotalData] = useState({});
  const [likeData, setLikeData] = useState({});
  const [tableInfo, setTableInfo] = useState({});
  const [fantasy, setFantasy] = useState({});
  const [rateAvgTime, setRateAvgTime] = useState([]);
  const [rateLike, setRateLike] = useState([]);

  const [isVisibleFilters, setIsVisibleFilters] = useState(false);
  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const [language, setLanguage] = useState(localStorage.getItem("language"));

  const predefinedRanges = [
    {
      label: "Неделя",
      value: [subDays(new Date(), 6), new Date()],
      placement: "bottom",
    },
    {
      label: "Месяц",
      value: [subDays(new Date(), 29), new Date()],
      placement: "bottom",
    },

    {
      label: "Все время",
      value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
      placement: "bottom",
    },
  ];

  const isHelper = () => {
    return user.role === "helper" || user.role === "system";
  };

  const isAdmin = () => {
    return user.role === "system";
  };

  const { loading, error, data, refetch } = useQuery(STATS, {
    variables: {
      token: user.token,
      filters: {
        limit: 999,
        offset: 0,
        orderBy: "id",
        orderDir: "",
      },
    },
  });

  const { data: dataThemeList } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
    },
  });

  const { data: dataCountryList } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user?.token,
      lang: language,
    },
  });

  const { data: dataDepartmentList } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const {
    loading: loadingCurators,
    error: errorCurators,
    data: dataCurators,
  } = useQuery(CURATORS_LIST, {
    variables: {
      token: user.token,
    },
  });

  const getCurrentUserStats = () => {
    if (isAdmin()) {
      return data?.helperQuery.helperStatList;
    } else {
      return data?.helperQuery.helperStatList.filter((elem) => {
        return elem.helper.id == user.id;
      });
    }
  };

  const getAvgReplyTimeAllUsers = () => {
    let avg = 0;
    data?.helperQuery.helperStatList.forEach((elem) => {
      avg += elem.stats.avgReplyTime;
    });
    return avg / data?.helperQuery.helperStatList.length;
  };

  const getFullName = (userData) => {
    let result = "";
    if (userData?.helper?.user?.name) {
      result += userData?.helper?.user?.name + " ";
    }
    if (userData?.helper?.user?.surname) {
      result += userData?.helper?.user?.surname + " ";
    }
    if (userData?.helper?.user?.patronymic) {
      result += userData?.helper?.user?.patronymic;
    }
    return result;
  };

  const getStatCoefs = (stat) => {
    if (stat?.totalTickets == 0) {
      return {
        likeDislikeCoef: 10,
        avgReplyTimeCoef: 10,
        effTicketsCoef: 10,
      };
    }

    let result = {
      likeDislikeCoef: Math.round(
        (stat?.likes / (stat?.likes + stat?.dislikes)) * 100
      ),
      avgReplyTimeCoef: Math.round(
        (1 - (stat?.avgReplyTime < 1 ? stat?.avgReplyTime : 1)) * 100
      ),
      effTicketsCoef: Math.round(
        (1 - stat?.inProgressTickets / stat?.totalTickets) * 100
      ),
    };

    result.likeDislikeCoef = Math.max(result.likeDislikeCoef, 10);
    result.avgReplyTimeCoef = Math.max(result.avgReplyTimeCoef, 10);
    result.effTicketsCoef = Math.max(result.effTicketsCoef, 10);

    return result;
  };

  const getRateLike = (allUserData) => {
    if (!allUserData) {
      return [];
    }

    allUserData = [...allUserData?.helperQuery.helperStatList];
    allUserData = allUserData
      ?.filter((userData) => userData.stats.likes !== 0)
      .sort((userData1, userData2) => {
        return -(userData1.stats.likes - userData2.stats.likes);
      })
      .map((userData) => {
        return {
          name: getFullName(userData),
          value: userData?.stats?.likes,
        };
      });

    return allUserData;
  };

  const getRateAvgTime = (allUserData) => {
    if (!allUserData) {
      return [];
    }

    allUserData = [...allUserData?.helperQuery.helperStatList];
    allUserData = allUserData
      ?.filter((userData) => userData.stats.avgReplyTime !== -3600)
      .sort((userData1, userData2) => {
        return userData1.stats.avgReplyTime - userData2.stats.avgReplyTime;
      })
      .map((userData) => {
        return {
          name: `${userData.helper.user.surname} ${userData.helper.user.name} ${
            userData.helper.user.patronymic
              ? ` ${userData.helper.user.patronymic}`
              : ""
          }`,
          value: getTimeStr(userData?.stats?.avgReplyTime),
        };
      });

    return allUserData;
  };

  const getAvgStatCoefs = (allUserData) => {
    let allCoefs = [];
    allUserData?.helperQuery.helperStatList.forEach((userData) => {
      allCoefs.push(getStatCoefs(userData.stats));
    });

    let result = {
      likeDislikeCoef: 0,
      avgReplyTimeCoef: 0,
      effTicketsCoef: 0,
    };

    allCoefs.forEach((elem) => {
      result.likeDislikeCoef += elem.likeDislikeCoef;
      result.avgReplyTimeCoef += elem.avgReplyTimeCoef;
      result.effTicketsCoef += elem.effTicketsCoef;
    });

    result.likeDislikeCoef /= allCoefs.length;
    result.avgReplyTimeCoef /= allCoefs.length;
    result.effTicketsCoef /= allCoefs.length;

    return result;
  };

  const getTime = (sourceHource) => {
    let hours = Math.round(sourceHource / 60 / 60);
    let minutes = Math.round(sourceHource / 60) % 60;
    let seconds = Math.round(sourceHource) % 60;
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  const getTimeStr = (sourceHource) => {
    let time = getTime(sourceHource);
    let result = "";
    if (time.hours > 0) {
      result += time.hours + " ч. ";
    }
    if (time.minutes > 0) {
      result += time.minutes + " мин. ";
    }
    if (time.seconds > 0) {
      result += time.seconds + " сек.";
    }
    return result !== "" ? result : "0 сек.";
  };

  const handleCuratorClick = (
    curatorName,
    curatorSurname,
    curatorPatronymic,
    curatorIndex
  ) => {
    let fullName = `${curatorSurname} ${curatorName} ${
      curatorPatronymic ? ` ${curatorPatronymic}` : ""
    }`;
    setSelectedCurator(fullName);
    setSelectedCuratorIndex(curatorIndex);
  };

  const handlePeriodChange = async (period) => {
    const formattedDate = period?.map((originalDate) => {
      const year = originalDate.getFullYear();
      const month = ("0" + (originalDate.getMonth() + 1)).slice(-2);
      const day = ("0" + originalDate.getDate()).slice(-2);

      return `${year}-${month}-${day}`;
    });

    setSelectedDateAfter(formattedDate[0] + " 00:00:00");
    setSelectedDateBefore(formattedDate[1] + " 23:59:59");

    setDateRange(period);
  };

  const handlePeriodClean = async () => {
    setDateRange(null);

    const variables = {
      filters: {
        dateAfter: null,
        dateBefore: null,
        limit: 999,
        offset: 0,
        orderBy: "id",
        orderDir: "",
      },
    };
    await refetch(variables);
  };

  useEffect(() => {
    if (isAdmin()) {
      if (dataCurators && dataCurators.helperQuery.helperList) {
        setDataQueryCurators(dataCurators.helperQuery.helperList);
      }
    }

    if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
      setThemeList(dataThemeList.clientQuery.allThemeTree);
    }

    if (dataCountryList && dataCountryList.clientQuery.countryList) {
      setCountryList(dataCountryList.clientQuery.countryList);
    }

    if (dataDepartmentList && dataDepartmentList.helperQuery.departmentList) {
      setDepartmentList(dataDepartmentList.helperQuery.departmentList);
    }

    let currentStats = getCurrentUserStats();
    if (currentStats) {
      if (isAdmin()) {
        currentStats = currentStats[selectedCuratorIndex].stats;
      } else {
        setSelectedCurator("");
        currentStats = currentStats[0].stats;
      }
    }

    setLikeData({
      labels: ["Положительные", "Отрицательные", "Неоценённые"],
      datasets: [
        {
          backgroundColor: [
            "rgba(71, 225, 167, 0.5)",
            "rgba(194, 116, 161, 0.5)",
            "rgba(146,207,251, 1)",
          ],
          data: [
            currentStats?.likes,
            currentStats?.dislikes,
            currentStats?.notRated,
          ],
        },
      ],
    });

    let coefs = getStatCoefs(currentStats);
    let avgCoefs = getAvgStatCoefs(data);

    setTotalData({
      labels: [
        "Положительные отзывы",
        "Средняя скорость ответа",
        "Эффективность",
      ],
      datasets: [
        {
          label: "Моя статистика",
          backgroundColor: ["#EBE0FF88"],
          data: [
            coefs.likeDislikeCoef,
            coefs.avgReplyTimeCoef,
            coefs.effTicketsCoef,
          ],
        },
        {
          label: "Средние значения",
          backgroundColor: ["#D1FDD6"],
          data: [
            avgCoefs.likeDislikeCoef,
            avgCoefs.avgReplyTimeCoef,
            avgCoefs.effTicketsCoef,
          ],
        },
      ],
    });

    setTableInfo([
      {
        name: "Всего тикетов",
        value: currentStats?.totalTickets,
      },
      {
        name: "Закрытых тикетов",
        value: currentStats?.closedTickets,
      },
      {
        name: "Тикетов в работе",
        value: currentStats?.inProgressTickets,
      },
      {
        name: "Положительных отзывов",
        value: currentStats?.likes,
      },
      {
        name: "Отрицательных отзывов",
        value: currentStats?.dislikes,
      },
      {
        name: "Среднее время ответа",
        value: getTimeStr(currentStats?.avgReplyTime),
      },
    ]);
    setFantasy(currentStats?.fantasy);

    setRateLike(getRateLike(data));
    setRateAvgTime(getRateAvgTime(data));
  }, [
    data,
    dataQueryCurators,
    selectedCurator,
    selectedCuratorIndex,
    dataThemeList,
    dataCountryList,
    dataDepartmentList,
  ]);

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
        } else if (errorMessage === "Forbidden") {
          return <NotFoundPage />;
        }
      }
    }

    return <h2>Что-то пошло не так</h2>;
  }

  const handleHideComponent = () => {
    setIsVisibleFilters((prevVisibility) => !prevVisibility);
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
    }
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);

    if (theme !== selectedTheme) {
      setSelectedSubTheme(null);
      setSubThemeDropdownVisible(true);
    }
  };

  const handleSubThemeClick = (subTheme, subThemeId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);
  };

  const handleCountriesOnChange = (country) => {
    setSelectedCountries(country);
    setSelectedCountriesId(country.map((country) => country.id));
  };

  const handleDepartmentsOnChange = (departments) => {
    setSelectedDepartments(departments);
    setSelectedDepartmentsId(departments.map((department) => department.id));
    // console.log(departments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const variables = {
      filters: {
        dateAfter: selectedDateAfter,
        dateBefore: selectedDateBefore,
        limit: 999,
        offset: 0,
        orderBy: "id",
        orderDir: "ASC",
        unitIds: selectedUnitId,
        themeIds: selectedThemeId,
        subThemeIds: selectedSubThemeId,
        countryIds: selectedCountiesId,
        departmentIds: selectedDepartmentsId,
      },
    };
    await refetch(variables);
  };

  const handleResetFilters = async (e) => {
    e.preventDefault();

    setSelectedDateAfter(null);
    setSelectedDateBefore(null);
    setSelectedUnit(null);
    setSelectedUnitId(null);
    setSelectedTheme(null);
    setSelectedThemeId(null);
    setSelectedSubTheme(null);
    setSelectedSubThemeId(null);
    setSelectedCountries([]);
    setSelectedCountriesId([]);
    setSelectedDepartments([]);
    setSelectedDepartmentsId([]);

    const variables = {
      filters: {
        dateAfter: selectedDateAfter,
        dateBefore: selectedDateBefore,
        limit: 999,
        offset: 0,
        orderBy: "id",
        orderDir: "ASC",
        unitIds: selectedUnitId,
        themeIds: selectedThemeId,
        subThemeIds: selectedSubThemeId,
        countryIds: selectedCountiesId,
        departmentIds: selectedDepartmentsId,
      },
    };
    await refetch(variables);
  };

  const newCountriesList = countryList.map((country) => ({
    name: country.name.stroke,
    id: country.id,
  }));

  const newDepartmentList = departmentList.map((department) => ({
    name: department.name.stroke,
    id: department.id,
  }));

  return (
    <>
      {isHelper() ? (
        <>
          <TitleH2 title="Статистика" className="title__heading" />
          <div className="stats__container">
            {isAdmin() && (
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedCurator || "Куратор"}
                className="themes__dropdown"
              >
                {dataQueryCurators.map(
                  (curator, index) =>
                    curator.user.isActive &&
                    curator.permissions.sendMsg && (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          handleCuratorClick(
                            curator.user.name,
                            curator.user.surname,
                            curator.user.patronymic,
                            index
                          )
                        }
                        href="#"
                      >
                        {`${curator.user.surname} ${curator.user.name} ${
                          curator.user.patronymic
                            ? ` ${curator.user.patronymic}`
                            : ""
                        }`}
                      </Dropdown.Item>
                    )
                )}
              </DropdownButton>
            )}
            {selectedCurator != null && (
              <>
                <Row>
                  <Col>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th colSpan={2}>Общая информация</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableInfo.map((elem, index) => (
                          <tr key={index}>
                            <td>{elem.name}</td>
                            <td>{elem.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <h3 className="stats-title stats-title_left">
                    Уровень куратора VERTERA
                  </h3>
                  <Col md={6} className="mt-2">
                    <Level fantasy={fantasy} />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={7}>
                    <h3 className="stats-title">Статистика моя/средняя</h3>
                    <Radar
                      data={totalData}
                      options={{
                        responsive: true,
                        scales: {
                          r: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </Col>
                  <Col md={5}>
                    <h3 className="stats-title">Статистика лайки/дизлайки</h3>
                    <Doughnut data={likeData} options={{ responsive: true }} />
                  </Col>
                </Row>
              </>
            )}

            <div className="alltickets__container">
              <h3 className="stats-title stats-title_left">
                Рейтинг кураторов
              </h3>
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
            {isVisibleFilters && (
              <>
                <div className="alltickets__filters-container">
                  <Form>
                    <Row className="alltickets__row">
                      <div className="alltickets__column">
                        <DropdownButton
                          id="dropdown-custom-1"
                          title={
                            selectedUnit ||
                            get_translation("INTERFACE_SELECT_UNIT")
                          }
                        >
                          {themeList.map(
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
                            {themeList
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
                            {themeList
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
                      <div className="alltickets__column">
                        <DateRangePicker
                          ranges={predefinedRanges}
                          placeholder="Задать период"
                          className="alltickets__date-range-picker"
                          onChange={handlePeriodChange}
                          onClean={handlePeriodClean}
                          value={dateRange}
                        />

                        <MultiSelect
                          value={selectedCountries}
                          onChange={(e) => handleCountriesOnChange(e.value)}
                          options={newCountriesList}
                          optionLabel="name"
                          className="add-curator__multiselect"
                          placeholder={get_translation(
                            "INTERFACE_CURATORS_COUNTRY"
                          )}
                          filter
                        />

                        <MultiSelect
                          value={selectedDepartments}
                          onChange={(e) => handleDepartmentsOnChange(e.value)}
                          options={newDepartmentList}
                          optionLabel="name"
                          placeholder={get_translation(
                            "INTERFACE_SELECT_DEPARTMENT"
                          )}
                          className="add-curator__multiselect"
                        />
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
            <Row className="mt-3">
              <Col md={6} className="mt-2">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan={3}>По времени ответа</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateAvgTime.map((elem, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{elem.name}</td>
                        <td>{elem.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col md={6} className="mt-2">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan={3}>По кол-ву положительных отзывов</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateLike.map((elem, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{elem.name}</td>
                        <td>{elem.value} отзыв(-ов)</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Stats;
