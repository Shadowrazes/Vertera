import { useState, useEffect } from "react";
import { Table, Form, Modal, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";

import { DEPARTMENTS_LIST } from "../apollo/queries";
import {
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT,
  EDIT_DEPARTMENT,
} from "../apollo/mutations";

import TitleH2 from "../components/title";
import ButtonCustom from "../components/button";
import Loader from "../pages/loading";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import DeleteIcon from "../assets/delete_icon.svg";
import ApplyIcon from "../assets/apply_icon.svg";
import "../css/table.css";

function Departments() {
  const [departmentsList, setDepartmentsList] = useState([]);
  const [changes, setChanges] = useState({});
  const [inputValues, setInputValues] = useState({});

  const [newNameValue, setNewNameValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [isApplyColumnVisible, setIsApplyColumnVisible] = useState(false);
  const [isAddDepartmentVisible, setIsAddDepartmentVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isErrorEditVisible, setIsErrorEditVisible] = useState(false);

  const [showWarning, setShowWarning] = useState(false);
  const modalTitle = "Предупреждение";
  const modalBody = "Вы уверены, что хотите удалить этот дераптамент?";

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

  if (user === null) {
    window.location.href = "/";
  }

  const isAdmin = () => {
    return user.role === "system";
  };

  const { loading, error, data, refetch } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  useEffect(() => {
    if (data && data.helperQuery.departmentList) {
      setDepartmentsList(data.helperQuery.departmentList);
    }

    refetch();
  }, [data]);

  const [addDepartment] = useMutation(ADD_DEPARTMENT);
  const [editDepartment] = useMutation(EDIT_DEPARTMENT);
  const [deleteDepartment, { loading: loadingDelete }] =
    useMutation(DELETE_DEPARTMENT);

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

  if (loadingDelete) {
    return <Loader />;
  }

  const handleAddDepartmentView = () => {
    setIsAddDepartmentVisible(true);
    setIsButtonVisible(false);
  };

  const handleCloseClick = () => {
    setIsButtonVisible(true);
    setIsAddDepartmentVisible(false);
    setIsErrorVisible(false);

    setNewNameValue("");
  };

  const handleNewName = (e) => {
    setNewNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (newNameValue.trim() == "") {
      error = "Введите название департамента";
    } else {
      error = "Ошибка при добавлении департамента";
    }

    return error;
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    if (newNameValue.trim() == "") {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addDepartment({
        variables: {
          token: user.token,
          stroke: newNameValue.trim(),
        },
      });
      refetch();
      setNewNameValue("");
      console.log("Департамент успешно добавлен:", result);
    } catch (error) {
      console.log(error.networkError.result.errors[0].message);
      setIsErrorVisible(true);
    }
  };

  const handleDepartmentChange = (id, value) => {
    setIsApplyColumnVisible(true);
    setIsErrorEditVisible(false);

    setChanges({ ...changes, [id]: true });

    setInputValues({
      ...inputValues,
      [id]: { ...inputValues[id], stroke: value, id: id },
    });
  };

  const isApplyVisible = (id) => {
    return changes[id];
  };

  const errorEditMsg = () => {
    let error = "Введите название департамента";

    return error;
  };

  const handleApplyChange = async (id) => {
    if (inputValues[id].stroke.trim() == "") {
      setIsErrorEditVisible(true);
      return;
    }

    setIsErrorEditVisible(false);

    const updatedChanges = { ...changes };
    delete updatedChanges[id];
    setChanges(updatedChanges);

    if (Object.keys(updatedChanges).length == 0) {
      setIsApplyColumnVisible(false);
    }

    try {
      const result = await editDepartment({
        variables: {
          token: user.token,
          id: inputValues[id].id,
          stroke: inputValues[id].stroke,
        },
      });
      console.log("Департамент успешно обновлен", result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDepartment = async (e, id) => {
    e.preventDefault();
    setDeleteId(id);
    setShowWarning(true);
  };

  const handleCloseModal = () => {
    setShowWarning(false);
  };

  const handleCloseWarning = async () => {
    setShowWarning(false);
    setIsErrorEditVisible(false);

    const updatedChanges = { ...changes };
    delete updatedChanges[deleteId];
    setChanges(updatedChanges);

    if (Object.keys(updatedChanges).length == 0) {
      setIsApplyColumnVisible(false);
    }

    try {
      const result = await deleteDepartment({
        variables: {
          token: user.token,
          id: deleteId,
        },
      });
      refetch();
      console.log("Департамент успешно удален:", result);
    } catch (error) {
      console.log(error.networkError.result.errors[0].message);
    }
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <TitleH2 title="Все департаменты" className="title__heading" />
          <div className="table__wrapper">
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Название</th>
                  <th>Удалить</th>
                  {isApplyColumnVisible && <th>Применить</th>}
                </tr>
              </thead>
              <tbody>
                {departmentsList.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <Form.Control
                        type="text"
                        placeholder="ID"
                        value={department.id}
                        className="countries__input countries__readonly-input"
                        readOnly
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={
                          (inputValues[department.id]?.stroke !== undefined
                            ? inputValues[department.id]?.stroke
                            : department.name.stroke) || ""
                        }
                        className="countries__input"
                        onChange={(e) =>
                          handleDepartmentChange(department.id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <img
                        src={DeleteIcon}
                        alt=""
                        className="countries__delete-icon"
                        onClick={(e) =>
                          handleDeleteDepartment(e, department.id)
                        }
                      />
                    </td>
                    <td>
                      {isApplyVisible(department.id) && (
                        <img
                          src={ApplyIcon}
                          alt=""
                          className="countries__delete-icon"
                          onClick={() => handleApplyChange(department.id)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {isErrorEditVisible && (
            <span
              className="form__error"
              style={{ marginBottom: "20px", display: "block" }}
            >
              {errorEditMsg()}
            </span>
          )}
          {isButtonVisible && (
            <div className="countries__lang-buttons">
              <ButtonCustom
                title="Добавить департамент"
                onClick={handleAddDepartmentView}
                className={"table__btn button-hover"}
              />
            </div>
          )}
          {isAddDepartmentVisible && (
            <>
              <div style={{ position: "relative" }}>
                <a onClick={handleCloseClick}>
                  <div className="chat__edit-close"></div>
                </a>
                <div className="countries__column">
                  <Form.Control
                    type="text"
                    placeholder="Название"
                    value={newNameValue}
                    className="add-currator__input"
                    onChange={handleNewName}
                  />
                  {isErrorVisible && (
                    <span className="form__error">{errorMsg()}</span>
                  )}
                  <ButtonCustom
                    title="Добавить"
                    onClick={handleAddDepartment}
                    className={"table__btn button-hover"}
                  />
                </div>
              </div>
            </>
          )}

          <ModalDialog
            show={showWarning}
            onClose={handleCloseModal}
            onConfirm={handleCloseWarning}
            modalTitle={modalTitle}
            modalBody={modalBody}
            warning={true}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default Departments;
