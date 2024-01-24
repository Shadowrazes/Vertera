import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Table, DropdownButton, Dropdown } from "react-bootstrap";

import { THEME_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";

import EditIcon from "../assets/edit_icon.svg";

function Subthemes() {
  const [dataQuery, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const { loading, error, data, refetch } = useQuery(THEME_LIST);

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

  return (
    <>
      <TitleH2 title="Подтемы" className="title__heading" />
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

      {selectedUnit && (
        <DropdownButton
          id="dropdown-custom-1"
          title={selectedTheme || "Тип обращения"}
          className="themes__dropdown"
        >
          {dataQuery
            .find((unit) => unit.name.stroke === selectedUnit)
            ?.themes.map((theme) => (
              <Dropdown.Item
                key={theme.id}
                onClick={() => handleThemeClick(theme.name.stroke)}
                href="#"
              >
                {theme.name.stroke}
              </Dropdown.Item>
            ))}
        </DropdownButton>
      )}

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
              ?.subThemes.map((subTheme) => (
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
              ))}
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
  );
}

export default Subthemes;
