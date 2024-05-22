import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Form, Modal, Button } from "react-bootstrap";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";
import { UPDATE_THEME_ORDER } from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "./loading";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import EditIcon from "../assets/edit_icon.svg";
import "../css/units.css";

function Units() {
  const [data, setData] = useState([]);

  const [showInactive, setShowInactive] = useState(false);
  const [showApplyButton, setShowApplyButton] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const modalTitle = "Порядок обновлен";
  const modalBody = "Порядок разделов успешно обновлен";
  const [showErrorModal, setShowErrorModal] = useState(false);
  const modalErrorTitle = "Ошибка при смене порядка";
  const modalErrorBody = "Порядок разделов не был обновлен";

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
    if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
      const formattedData = dataThemeList.clientQuery.allThemeTree.map(
        (unit) => {
          return {
            orderNum: unit.orderNum,
            id: unit.id,
            name: unit.name.stroke,
            visibility: unit.visibility,
          };
        }
      );
      setData(
        formattedData.filter((unit) => showInactive || unit.visibility !== 3)
      );
    }

    refetch();
  }, [dataThemeList, showInactive]);

  const [updateThemeOrder] = useMutation(UPDATE_THEME_ORDER);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Раздел ID",
      },
      {
        accessorKey: "name",
        header: "Название разделение",
      },
      {
        accessorKey: "link",
        header: "Редактировать",
        Cell: ({ row }) => (
          <Link
            to={`/edit-unit/${row.original.id}`}
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

  const handleIsActiveChange = () => {
    setShowInactive(!showInactive);
  };

  const handleClickAplly = async () => {
    const queryData = data.map(({ id, orderNum }) => ({ id, orderNum }));

    // console.log(queryData);

    try {
      const result = await updateThemeOrder({
        variables: {
          token: user.token,
          type: "unit",
          themeOrderUpdateItem: queryData,
        },
      });

      if (result.data.helperMutation.themeObj.updateThemeOrders.length !== 0) {
        handleShowErrorModal();
      } else {
        console.log("Порядок успешно обновлен:", result);
        handleShowModal();
      }
    } catch (error) {
      console.error("Ошибка при обновлении порядка:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleShowErrorModal = () => {
    setShowErrorModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <style>
            {`
          .inactive-row {
            background-color: lightgray !important;
          }
          `}
          </style>
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
          <MRT_TableContainer table={table} />
          <div className="units__btn-row">
            <ButtonCustom
              title="Добавить раздел"
              onClick={goToAddUnit}
              className={"button-hover"}
            />
            <ButtonCustom
              title="Перейти к темам"
              className={
                "add-curator__btn units__btn alltickets__button-two button-outlined"
              }
              onClick={goToThemes}
            />
            <ButtonCustom
              title="Перейти к подтемам"
              className={
                "add-curator__btn units__btn alltickets__button-two button-outlined"
              }
              onClick={goToSubthemes}
            />
            {showApplyButton && (
              <ButtonCustom
                title="Применить изменения порядка"
                onClick={handleClickAplly}
                className={"button-outlined"}
              />
            )}
          </div>

          <ModalDialog
            show={showModal}
            onClose={handleCloseModal}
            modalTitle={modalTitle}
            modalBody={modalBody}
          />

          <ModalDialog
            show={showErrorModal}
            onClose={handleCloseErrorModal}
            modalTitle={modalErrorTitle}
            modalBody={modalErrorBody}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Units;
