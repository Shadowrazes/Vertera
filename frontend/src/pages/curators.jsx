import { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

import { CURATORS_LIST, HELPER_PERMS } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/table.css";
import "../css/edit-curator.css";

function Curators() {
  const [dataQuery, setData] = useState([]);

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
      dataPerms.helperQuery.helperPerms.helperEdit || user.role === "system"
    );
  };

  const { loading, error, data, refetch } = useQuery(CURATORS_LIST, {
    variables: {
      token: user.token,
    },
  });

  const navigate = useNavigate();

  const goToAddCurator = () => {
    navigate("/add-curator");
  };

  useEffect(() => {
    if (data && data.helperQuery.helperList) {
      setData(data.helperQuery.helperList);
    }

    refetch();
  }, [data]);

  const curators = dataQuery;

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

  const handleIsActiveChange = () => {
    setShowInactive(!showInactive);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Все кураторы" className="title__heading" />
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
              Отображать неактивных кураторов
            </span>
          </div>
          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Дата рождения</th>
                  <th>Куратор ID</th>
                  <th>Вступил в должность</th>
                  <th>Редактировать</th>
                </tr>
              </thead>
              <tbody>
                {curators.map(
                  (curator) =>
                    (showInactive || curator.user.isActive) && (
                      <tr
                        className={curator.user.isActive ? "inactive-row" : ""}
                        key={curator.id}
                      >
                        <td>
                          {`${curator.user.surname} ${curator.user.name} ${
                            curator.user.patronymic
                              ? ` ${curator.user.patronymic}`
                              : ""
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
                            state={{ linkPrev: window.location.href }}
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
          <ButtonCustom
            title="Добавить куратора"
            onClick={goToAddCurator}
            className={"table__btn"}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Curators;
