import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";

import { THEME_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/themes.css";

function Theme() {
  const [dataQuery, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
  };

  const { loading, error, data, refetch } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
    },
  });

  const navigate = useNavigate();

  const goToAddTheme = () => {
    navigate("/add-theme");
  };

  const goToUnits = () => {
    navigate("/units");
  };

  const goToSubthemes = () => {
    navigate("/subthemes");
  };

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
      // console.log(data.allThemeTree.map((unit) => unit.id));
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

    // console.log(unitId);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Темы" className="title__heading" />
          <div className="themes__dropdown-wrapper">
            <DropdownButton
              id="dropdown-custom-1"
              title={selectedItem || "Выберите подразделение"}
              className="themes__dropdown"
            >
              {dataQuery.map((unit, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleUnitClick(unit.name.stroke)}
                  href="#"
                >
                  {unit.name.stroke}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>

          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <td>Порядок</td>
                  <td>Тема ID</td>
                  <td>Название темы</td>
                  <td>Редактировать</td>
                </tr>
              </thead>
              <tbody>
                {dataQuery
                  .find((unit) => unit.name.stroke === selectedUnit)
                  ?.themes.map((theme) => (
                    <tr key={theme.id}>
                      <td>{theme.orderNum}</td>
                      <td>{theme.id}</td>
                      <td>{theme.name.stroke}</td>
                      <td>
                        <Link
                          to={`/edit-theme/${theme.id}`}
                          state={{
                            linkPrev: window.location.href,
                          }}
                          className="alltickets__link"
                        >
                          <img src={EditIcon} alt="" />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          <div className="units__btn-row">
            <ButtonCustom title="Добавить тему" onClick={goToAddTheme} />
            <ButtonCustom
              title="Перейти к разделам"
              className={"add-curator__btn units__btn alltickets__button-two"}
              onClick={goToUnits}
            />
            <ButtonCustom
              title="Перейти к подтемам"
              className={"add-curator__btn units__btn alltickets__button-two"}
              onClick={goToSubthemes}
            />
          </div>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Theme;
