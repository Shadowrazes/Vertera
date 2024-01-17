import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Button,
} from "react-bootstrap";

import { HELPER } from "../apollo/queries";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

function EditCurator() {
  const { curatorId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [dataQuery, setDataQuery] = useState([]);
  const [dataQueryUser, setDataQueryUser] = useState([]);

  const { loading, error, data } = useQuery(HELPER, {
    variables: {
      id: parseInt(curatorId),
    },
  });

  useEffect(() => {
    if (data && data.helper) {
      setDataQuery(data.helper);

      console.log(data.helper);
    }

    if (data && data.helper.user) {
      setDataQueryUser(data.helper.user);
      console.log(data.helper.user);
    }

    if (location.state && location.state.linkPrev) {
      setLinkPrev(location.state.linkPrev);
    }
  }, [data, location.state]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const handleOnChangeName = () => {};

  return (
    <>
      <BackTitle
        title={`Редактировать куратора #${curatorId}`}
        linkPrev={linkPrev}
      />
      <Row className="add-curator__row">
        <Col className="add-curator__column">
          <div className="edit-curator__fields-row">
            <span className="edit-curator__field-label">Имя</span>
            {/* <Form.Group controlId="NameForm">
              <Form.Control
                type="text"
                placeholder="Имя"
                className="add-currator__input"
                value={dataQuery.user.id}
                onChange={handleOnChangeName}
              />
            </Form.Group> */}
            <span>{dataQueryUser.name}</span>
            <ButtonCustom title="Изменить" />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default EditCurator;
