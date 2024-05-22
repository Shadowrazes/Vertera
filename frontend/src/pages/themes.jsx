import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";
import { UPDATE_THEME_ORDER } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import ModalDialog from "../components/modal-dialog";
import Loader from "./loading";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/themes.css";

import get_translation from "../helpers/translation";

function Theme() {
  const [dataAll, setDataAll] = useState([]);
  const [data, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [showInactive, setShowInactive] = useState(false);
  const [showApplyButton, setShowApplyButton] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

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
      lang: language,
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
        header: get_translation("INTERFACE_THEME_ID"),
      },
      {
        accessorKey: "name",
        header: get_translation("INTERFACE_THEME_NAME"),
      },
      {
        accessorKey: "link",
        header: get_translation("INTERFACE_EDIT"),
        Cell: ({ row }) => (
          <Link
            to={`/edit-theme/${row.original.id}`}
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
    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
  }

  const handleUnitClick = (_unit) => {
    setSelectedUnit(_unit);

    const formattedData = dataThemeList.clientQuery.allThemeTree
      .find((unit) => unit.name.stroke === _unit)
      ?.themes.map((theme) => {
        return {
          orderNum: theme.orderNum,
          id: theme.id,
          name: theme.name.stroke,
          visibility: theme.visibility,
        };
      });
    setData(
      formattedData.filter((theme) => showInactive || theme.visibility !== 3)
    );
  };

  const handleIsActiveChange = () => {
    setShowInactive(!showInactive);

    if (selectedUnit !== null) {
      const formattedData = dataThemeList.clientQuery.allThemeTree
        .find((unit) => unit.name.stroke === selectedUnit)
        ?.themes.map((theme) => {
          return {
            orderNum: theme.orderNum,
            id: theme.id,
            name: theme.name.stroke,
            visibility: theme.visibility,
          };
        });
      setData(
        formattedData.filter((theme) => !showInactive || theme.visibility !== 3)
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
          type: "theme",
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
    setShowModal(true);
  };

  const handleShowError = () => {
    setShowErrorModal(true);
  };

  const handleCloseLeave = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleClose = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2
            title={get_translation("INTERFACE_THEMES")}
            className="title__heading"
          />
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
              {get_translation("INTERFACE_SHOW_DEACTIVE_THEME")}
            </span>
          </div>
          <div className="themes__dropdown-wrapper">
            <DropdownButton
              id="dropdown-custom-1"
              title={selectedUnit || get_translation("INTERFACE_SELECT_UNIT")}
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
          </div>
          <MRT_TableContainer table={table} />
          <div className="units__btn-row">
            <ButtonCustom
              title={get_translation("INTERFACE_ADD_THEME")}
              className={"button-hover"}
              onClick={goToAddTheme}
            />
            <ButtonCustom
              title={get_translation("INTERFACE_GO_TO_UNITS")}
              className={
                "add-curator__btn units__btn alltickets__button-two button-outlined"
              }
              onClick={goToUnits}
            />
            <ButtonCustom
              title={get_translation("INTERFACE_GO_TO_SUBTHEMES")}
              className={
                "add-curator__btn units__btn alltickets__button-two button-outlined"
              }
              onClick={goToSubthemes}
            />
            {showApplyButton && (
              <ButtonCustom
                title={get_translation("INTERFACE_APPLY_ORDER_CHANGE")}
                onClick={handleClickAplly}
                className={"button-outlined"}
              />
            )}
          </div>

          <ModalDialog
            show={showModal}
            onClose={handleCloseLeave}
            modalTitle={get_translation("INTERFACE_ORDER_CHANGE")}
            modalBody={get_translation("INTERFACE_ORDER_CHANGE_THEME")}
          />
          <ModalDialog
            show={showErrorModal}
            onClose={handleClose}
            modalTitle={get_translation("INTERFACE_ORDER_CHANGE_ERROR")}
            modalBody={get_translation("INTERFACE_ORDER_CHANGE_ERROR_THEME")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Theme;
