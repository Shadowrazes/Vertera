import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  DropdownButton,
  Dropdown,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";
import { UPDATE_THEME_ORDER } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";

function Subthemes() {
  const [dataAll, setDataAll] = useState([]);
  const [data, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const [showInactive, setShowInactive] = useState(false);
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const {
    loading,
    error,
    data: dataThemeList,
    refetch,
  } = useQuery(THEME_LIST, {
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
    if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
      setDataAll(dataThemeList.clientQuery.allThemeTree);
    }

    refetch();
  }, [dataThemeList]);

  const [updateThemeOrder] = useMutation(UPDATE_THEME_ORDER);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Подтема ID",
      },
      {
        accessorKey: "name",
        header: "Название подтемы",
      },
      {
        accessorKey: "link",
        header: "Редактировать",
        Cell: ({ row }) => (
          <Link
            to={`/edit-subtheme/${row.original.id}`}
            state={{
              linkPrev: window.location.href,
            }}
            className="alltickets__link"
          >
            <img src={EditIcon} alt="" />
          </Link>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    enableColumnActions: false,
    data,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          const newData = [...data];
          newData.splice(
            hoveredRow.index,
            0,
            newData.splice(draggingRow.index, 1)[0]
          );

          newData.forEach((item, index) => {
            item.orderNum = index + 1;
          });

          if (!showApplyButton) {
            setShowApplyButton(true);
          }

          setData(newData);
        }
      },
    }),
    muiTableBodyRowProps: ({ row }) => ({
      className: row.original.visibility === 3 ? "inactive-row" : "",
    }),
  });

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
    setSelectedUnit(unit);

    if (unit !== selectedUnit) {
      setData([]);
      setSelectedTheme(null);
    }
  };

  const handleThemeClick = (_theme) => {
    setSelectedTheme(_theme);

    const formattedData = dataThemeList.clientQuery.allThemeTree
      .find((unit) => unit.name.stroke === selectedUnit)
      ?.themes.find((theme) => theme.name.stroke === _theme)
      ?.subThemes.map((subtheme) => {
        return {
          orderNum: subtheme.orderNum,
          id: subtheme.id,
          name: subtheme.name.stroke,
          visibility: subtheme.visibility,
        };
      });
    setData(
      formattedData.filter(
        (subtheme) => showInactive || subtheme.visibility !== 3
      )
    );
  };

  const handleIsActiveChange = () => {
    setShowInactive(!showInactive);

    if (selectedTheme !== null) {
      const formattedData = dataThemeList.clientQuery.allThemeTree
        .find((unit) => unit.name.stroke === selectedUnit)
        ?.themes.find((theme) => theme.name.stroke === selectedTheme)
        ?.subThemes.map((subtheme) => {
          return {
            orderNum: subtheme.orderNum,
            id: subtheme.id,
            name: subtheme.name.stroke,
            visibility: subtheme.visibility,
          };
        });
      setData(
        formattedData.filter(
          (subtheme) => !showInactive || subtheme.visibility !== 3
        )
      );
    }
  };

  const handleClickAplly = async () => {
    const queryData = data.map(({ id, orderNum }) => ({ id, orderNum }));

    // console.log(queryData);

    try {
      const result = await updateThemeOrder({
        variables: {
          token: user.token,
          type: "subtheme",
          themeOrderUpdateItem: queryData,
        },
      });

      if (result.data.helperMutation.themeObj.updateThemeOrders.length !== 0) {
        handleShowError();
      } else {
        console.log("Порядок успешно обновлен:", result);
        handleShow();
      }
    } catch (error) {
      console.error("Ошибка при обновлении порядка:", error);
    }
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShowError = () => {
    setShowError(true);
  };

  const handleCloseLeave = () => {
    setShow(false);
    window.location.reload();
  };

  const handleClose = () => {
    setShowError(false);
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
              title={selectedUnit || "Выберите подразделение"}
              className="themes__dropdown"
            >
              {dataAll.map(
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
                {dataAll
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

          {/* <div className="table__wrapper">
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
          </div> */}

          <MRT_TableContainer table={table} />

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
            {showApplyButton && (
              <ButtonCustom
                title="Применить изменения порядка"
                onClick={handleClickAplly}
              />
            )}
          </div>

          <Modal show={show} onHide={handleCloseLeave}>
            <Modal.Header closeButton>
              <Modal.Title>Порядок обновлен</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Порядок тем успешно обновлен</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseLeave}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showError} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Ошибка при смене порядка</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Порядок тем не был обновлен</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Subthemes;
