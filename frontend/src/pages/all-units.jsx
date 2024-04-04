import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Table, Form } from "react-bootstrap";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/units.css";

function Units() {
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
      user.role === "system" || dataPerms?.helperQuery.helperPerms.themeEdit
    );
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

  const handleIsActiveChange = () => {
    setShowInactive(!showInactive);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Разделения" className="title__heading" />
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
              Отображать неактивные разделы
            </span>
          </div>
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
                {units.map(
                  (unit) =>
                    (showInactive || unit.visibility !== 3) && (
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
                    )
                )}
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

export default Units;
