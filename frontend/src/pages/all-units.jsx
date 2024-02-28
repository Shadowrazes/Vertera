import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Table } from "react-bootstrap";

import { THEME_LIST } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/units.css";

function Units() {
  const [dataQuery, setData] = useState([]);

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

  const goToAddUnit = () => {
    navigate("/add-unit");
  };

  const goToThemes = () => {
    navigate("/themes");
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

  const units = dataQuery;

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

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Разделения" className="title__heading" />
          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <td>Порядок</td>
                  <td>Раздел ID</td>
                  <td>Название разделения</td>
                  <td>Редактировать</td>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td>{unit.orderNum}</td>
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
          </div>
          <div className="units__btn-row">
            <ButtonCustom title="Добавить раздел" onClick={goToAddUnit} />
            <ButtonCustom
              title="Перейти к темам"
              className={"add-curator__btn units__btn alltickets__button-two"}
              onClick={goToThemes}
            />
            <ButtonCustom
              title="Перейти к подтемамам"
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

export default Units;
