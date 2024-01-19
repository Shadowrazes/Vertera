import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { Table } from "react-bootstrap";

import { THEME_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";

import EditIcon from "../assets/edit_icon.svg";

function Units() {
  const [dataQuery, setData] = useState([]);
  const { loading, error, data, refetch } = useQuery(THEME_LIST);

  const navigate = useNavigate();

  const goToAddUnit = () => {
    navigate("/add-unit");
  };

  useEffect(() => {
    if (data && data.allThemeTree) {
      setData(data.allThemeTree);
      // console.log(data.allThemeTree.map((unit) => unit.id));
    }

    refetch();
  }, [data]);

  const units = dataQuery;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  return (
    <>
      <TitleH2 title="Разделения" className="title__heading" />
      <Table className="table__table" hover>
        <thead>
          <tr>
            <td>Раздел ID</td>
            <td>Название разделения</td>
            <td>Редактировать</td>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td>{unit.id}</td>
              <td>{unit.name.stroke}</td>
              <td>
                <Link
                  to={`/edit-unit/${unit.id}`}
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
      <ButtonCustom title="Добавить раздел" onClick={goToAddUnit} />
    </>
  );
}

export default Units;
