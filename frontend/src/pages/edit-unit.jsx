import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";

import { UNIT, HELPER_PERMS } from "../apollo/queries";
import { EDIT_UNIT } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import get_translation from "../helpers/translation";

function EditUnit() {
  const { unitId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [nameValue, setNameValue] = useState("");
  const [visibility, setVisibility] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const visibilityItems = {
    1: get_translation("INTERFACE_VISIBILITY_ALL"),
    2: get_translation("INTERFACE_VISIBILITY_CURATORS"),
    3: get_translation("INTERFACE_VISIBILITY_NONE"),
  };

  const findKeyByValue = (obj, value) =>
    Object.keys(obj).find((key) => obj[key] === value);

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

  const { loading, error, data, refetch } = useQuery(UNIT, {
    variables: {
      token: user.token,
      id: parseInt(unitId),
      lang: language,
    },
  });

  const [editUnit, { loading: loadingEditUnit }] = useMutation(EDIT_UNIT);

  const navigate = useNavigate();

  const goToAllUnits = () => {
    navigate("/units");
  };

  useEffect(() => {
    if (data && data.helperQuery.unit) {
      setNameValue(data.helperQuery.unit.name.stroke);
      setVisibility(data.helperQuery.unit.visibility);
      // console.log(data.helperQuery.unit.name.stroke);
    }

    setLinkPrev("/units");

    refetch();
  }, [data, location.state]);

  if (loading || loadingEditUnit) {
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

  const handleOnChangeName = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_UNIT");
    } else {
      error = get_translation("INTERFACE_ERROR_UNIT_CHANGE");
    }

    return error;
  };

  const handleEditUnit = async (e) => {
    e.preventDefault();

    if (nameValue.trim() == "") {
      setIsErrorVisible(true);
      return;
    }
    setIsErrorVisible(false);

    try {
      const result = await editUnit({
        variables: {
          token: user.token,
          id: parseInt(unitId),
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: parseInt(visibility),
        },
      });

      console.log("Раздел успешно обновлен:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении раздела:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleCloseLeave = () => {
    setShowModal(false);
    goToAllUnits();
  };

  const handleVisibilityClick = (visibility) => {
    setVisibility(findKeyByValue(visibilityItems, visibility));
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={`${get_translation("INTERFACE_EDIT_UNIT")} #${unitId}`}
            linkPrev={linkPrev}
          />
          <Row className="edit-unit__container">
            <Col className="edit-unit__column">
              <Form.Group controlId="NameForm">
                <Form.Label className="edit-curator__field-label">
                  {get_translation("INTERFACE_NAME_OF_UNIT")}
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input add-theme__dropdown"
                  value={nameValue}
                  onChange={handleOnChangeName}
                />
                <Form.Label className="edit-curator__field-label">
                  {get_translation("INTERFACE_VISIBILITY")}
                </Form.Label>
                <DropdownButton
                  id="dropdown-custom-1"
                  title={
                    visibilityItems[visibility] ||
                    get_translation("INTERFACE_VISIBILITY_LEVEL")
                  }
                  style={{ margin: "20px" }}
                >
                  {Object.values(visibilityItems).map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleVisibilityClick(item)}
                      href="#"
                    >
                      {item}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Form.Group>

              <div className="edit-unit__column">
                {isErrorVisible && (
                  <span className="form__error">{errorMsg()}</span>
                )}
                <div className="edit-curator__btn-row">
                  <ButtonCustom
                    title={get_translation("INTERFACE_APPLY")}
                    className={
                      "add-curator__btn edit-curator__btn button-hover"
                    }
                    onClick={handleEditUnit}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <ModalDialog
            show={showModal}
            onClose={handleCloseLeave}
            modalTitle={get_translation("INTERFACE_UNIT_CHANGED")}
            modalBody={get_translation("INTERFACE_UNIT_CHANGED_FULL")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default EditUnit;
