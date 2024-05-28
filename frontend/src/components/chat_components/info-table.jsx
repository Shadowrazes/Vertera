import { useState } from "react";

import { Table, Col, Row } from "react-bootstrap";

import get_translation from "../../helpers/translation";

function InfoTable({ data, currentStatusId }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  const getFullName = (userData) => {
    let result = "";

    if (userData?.surname) {
      result += userData?.surname + " ";
    }
    if (userData?.name) {
      result += userData?.name + " ";
    }
    if (userData?.patronymic) {
      result += userData?.patronymic;
    }
    return result;
  };

  return (
    <Row>
      <Col md={6}>
        <Table bordered hover>
          <tbody>
            <tr>
              <td>
                <b>{get_translation("INTERFACE_TICKET_CREATOR")}:</b>
              </td>
              <td>
                {`${data.clientQuery.ticket.initiator.surname} ${
                  data.clientQuery.ticket.initiator.name
                } ${
                  data.clientQuery.ticket.initiator.patronymic
                    ? ` ${data.clientQuery.ticket.initiator.patronymic}`
                    : ""
                } (${data.clientQuery.ticket.initiator.country.name.stroke})`}
              </td>
            </tr>
            {currentStatusId !== 6 && (
              <tr>
                <td>
                  <b>{get_translation("INTERFACE_CURRENT_CURATOR")}:</b>
                </td>
                <td>
                  {`${data.clientQuery.ticket.recipient.surname} ${
                    data.clientQuery.ticket.recipient.name
                  } ${
                    data.clientQuery.ticket.recipient.patronymic
                      ? ` ${data.clientQuery.ticket.recipient.patronymic}`
                      : ""
                  }  (${
                    data.clientQuery.ticket.recipient.country.name.stroke
                  })`}
                </td>
              </tr>
            )}
            {isAdmin() && currentStatusId == 4 && (
              <tr>
                <td>
                  <b>{get_translation("INTERFACE_ASSISTANT")}:</b>
                </td>
                <td>{getFullName(data?.clientQuery.ticket?.assistant)}</td>
              </tr>
            )}
            {currentStatusId == 7 && (
              <tr>
                <td>
                  <b>{get_translation("INTERFACE_ASSISTANT_MENTOR")}:</b>
                </td>
                <td>{getFullName(data?.clientQuery.ticket?.assistant)}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}

export default InfoTable;
