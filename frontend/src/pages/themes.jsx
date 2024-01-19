import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";

import { THEME_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";

import EditIcon from "../assets/edit_icon.svg";

function Theme() {
  const [dataQuery, setData] = useState([]);
  const { loading, error, data } = useQuery(THEME_LIST);

  useEffect(() => {
    if (data && data.allThemeTree) {
      setData(data.allThemeTree);
      console.log(data.allThemeTree.map((unit) => unit.id));
    }
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
      <TitleH2 title="Темы" className="title__heading" />
      <Table className="table__table" hover>
        <thead>
          <tr>
            <td>Тема ID</td>
            <td>Название темы</td>
            <td>Редактировать</td>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td>{unit.id}</td>
              <td>{unit.name.stroke}</td>
              <td>
                <img src={EditIcon} alt="" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Theme;
