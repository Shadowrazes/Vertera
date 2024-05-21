import { useState } from "react";

import { Table, Col, Row } from "react-bootstrap";

function InfoTable({ data, currentStatus }) {
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
                <b>Создатель обращения:</b>
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
            {currentStatus !== "Уведомление" && (
              <tr>
                <td>
                  <b>Текущий куратор:</b>
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
            {isAdmin() && currentStatus == "На уточнении" && (
              <tr>
                <td>
                  <b>Уточняющий куратор:</b>
                </td>
                <td>{getFullName(data?.clientQuery.ticket?.assistant)}</td>
              </tr>
            )}
            {currentStatus == "У наставника" && (
              <tr>
                <td>
                  <b>Уточняющий наставник:</b>
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
