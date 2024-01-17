import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

import { CURATORS_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";

import EditIcon from "../assets/edit_icon.svg";
import "../css/table.css";

function Curators() {
  const [dataQuery, setData] = useState([]);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [userRole, setUserRole] = useState(
    JSON.parse(localStorage.getItem("userRole"))?.role.role
  );
  let userId = null;
  let userCurRole = null;

  if (user === null) {
    return <></>;
  } else {
    userId = user.id;
  }

  if (userRole === null) {
    userCurRole = "client";
  } else {
    userCurRole = userRole;
  }

  const isAdmin = () => {
    return userCurRole === "helper";
  };

  const { loading, error, data } = useQuery(CURATORS_LIST);

  const navigate = useNavigate();

  const goToAddCurator = () => {
    navigate("/add-curator");
  };

  useEffect(() => {
    if (data && data.helperList) {
      setData(data.helperList);
    }
  }, [data]);

  const curators = dataQuery;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  return (
    <>
      <TitleH2 title="Все кураторы" className="title__heading" />
      <Table className="table__table" hover>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Дата рождения</th>
            <th>Куратор ID</th>
            <th>Вступил в должность</th>
            {/* <th>Последнее действие</th> */}
            <th>Редактировать</th>
          </tr>
        </thead>
        <tbody>
          {curators.map((curator) => (
            <tr key={curator.id}>
              <td>
                {`${curator.user.surname} ${curator.user.name} ${
                  curator.user.patronymic ? ` ${curator.user.patronymic}` : ""
                }`}
              </td>
              <td>
                {curator.birthday.replace(
                  /^(\d{4})-(\d{2})-(\d{2}).*/,
                  "$3.$2.$1"
                )}
              </td>
              <td>{curator.id}</td>
              <td>
                {curator.startWorkDate.replace(
                  /^(\d{4})-(\d{2})-(\d{2}).*/,
                  "$3.$2.$1"
                )}
              </td>
              <td>
                <Link
                  to={`/edit-curator/${curator.id}`}
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
      <ButtonCustom title="Добавить куратора" onClick={goToAddCurator} />
    </>
  );
}

export default Curators;
