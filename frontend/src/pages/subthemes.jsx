import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Table, DropdownButton, Dropdown, Form } from "react-bootstrap";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";

function Subthemes() {
  const [dataQuery, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const [showInactive, setShowInactive] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const { data: dataPerms } = useQuery(HELPER_PERMS, {
    variables: {
      token: user?.token,
      id: user?.id,
    },
  });

  const isAdmin = () => {
    return (
      user.role === "system" || dataPerms?.helperQuery?.helperPerms.themeEdit
    );
  };

  const { loading, error, data, refetch } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
    },
  });

  const navigate = useNavigate();

  const goToAddSubtheme = () => {
    navigate("/add-subtheme");
  };

  const goToUnits = () => {
    navigate("/units");
  };

  const goToThemes = () => {
    navigate("/themes");
  };

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }

    refetch();
  }, [data]);

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

  const handleUnitClick = (unit) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);

    setSelectedTheme(null);
  };

  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);

    // console.log(themeId);

    // switch ((selectedUnitId, themeId)) {
    //   case (1, 14):
    //     setSelectedSubThemeId(73);
    //     setSubThemeDropdownVisible(false);
    //     break;
    //   case (2, 15):
    //     setSelectedSubThemeId(74);
    //     setSubThemeDropdownVisible(false);
    //     break;
    //   case (2, 16):
    //     setSelectedSubThemeId(75);
    //     setSubThemeDropdownVisible(false);
    //     break;
    //   case (2, 22):
    //     setSelectedSubThemeId(102);
    //     setSubThemeDropdownVisible(false);
    //     break;
    //   case (2, 23):
    //     setSelectedSubThemeId(103);
    //     setSubThemeDropdownVisible(false);
    //     break;
    //   default:
    // }
  };

  const handleIsActiveChange = () => {
    setShowInactive(!showInactive);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Подтемы" className="title__heading" />
          <div
            className="edit-curator__checkbox-block"
            style={{ marginBottom: "20px" }}
          >
            <Form.Check
              type="checkbox"
              id="custom-switch"
              value={showInactive}
              onChange={handleIsActiveChange}
            />
            <span className="edit-curator__field-label">
              Отображать неактивные подтемы
            </span>
          </div>
          <div className="subthemes__dropdown-wrapper">
            <DropdownButton
              id="dropdown-custom-1"
              title={selectedItem || "Выберите подразделение"}
              className="themes__dropdown"
            >
              {dataQuery.map(
                (unit, index) =>
                  unit.visibility !== 3 && (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleUnitClick(unit.name.stroke)}
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
                title={selectedTheme || "Тип обращения"}
                className="themes__dropdown"
              >
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
                  ?.themes.map(
                    (theme) =>
                      theme.visibility !== 3 && (
                        <Dropdown.Item
                          key={theme.id}
                          onClick={() => handleThemeClick(theme.name.stroke)}
                          href="#"
                        >
                          {theme.name.stroke}
                        </Dropdown.Item>
                      )
                  )}
              </DropdownButton>
            )}
          </div>

          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <td>Порядок</td>
                  <td>Подтема ID</td>
                  <td>Название подтемы</td>
                  <td>Редактировать</td>
                </tr>
              </thead>
              <tbody>
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
                  ?.themes.find((theme) => theme.name.stroke === selectedTheme)
                  ?.subThemes.map(
                    (subTheme) =>
                      (showInactive || subTheme.visibility !== 3) && (
                        <tr key={subTheme.id}>
                          <td>{subTheme.orderNum}</td>
                          <td>{subTheme.id}</td>
                          <td>{subTheme.name.stroke}</td>

                          <td>
                            <Link
                              to={`/edit-subtheme/${subTheme.id}`}
                              state={{
                                linkPrev: window.location.href,
                              }}
                              className="alltickets__link"
                            >
                              <img src={EditIcon} alt="" />
                            </Link>
                          </td>
                        </tr>
                      )
                  )}
              </tbody>
            </Table>
          </div>

          <div className="units__btn-row">
            <ButtonCustom title="Добавить подтему" onClick={goToAddSubtheme} />
            <ButtonCustom
              title="Перейти к разделам"
              className={"add-curator__btn units__btn alltickets__button-two"}
              onClick={goToUnits}
            />
            <ButtonCustom
              title="Перейти к темам"
              className={"add-curator__btn units__btn alltickets__button-two"}
              onClick={goToThemes}
            />
          </div>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Subthemes;
