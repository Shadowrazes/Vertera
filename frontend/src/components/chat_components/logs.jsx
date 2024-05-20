import { useState } from "react";
import { DateTime } from "luxon";

import { Table } from "react-bootstrap";
import ButtonCustom from "../../components/button";

function Logs({ currentStatus, logs }) {
  const [isVisibleLogs, setIsVisibleLogs] = useState(false);

  const handleHideComponent = () => {
    setIsVisibleLogs((prevVisibility) => !prevVisibility);
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
    <>
      <a className="alltickets__link">
        <ButtonCustom
          title={isVisibleLogs == false ? "Показать историю" : "Скрыть историю"}
          onClick={handleHideComponent}
          className={"button-outlined single"}
        />
      </a>

      {isVisibleLogs && (
        <>
          <div
            className={
              currentStatus == "Новый"
                ? "chat__table-log-new"
                : "chat__table-log"
            }
          >
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Имя</th>
                  <th>Роль</th>
                  <th>Событие</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>
                      {DateTime.fromISO(log.date, {
                        zone: "utc",
                      })
                        .toLocal()
                        .toFormat(`yyyy.MM.dd      HH:mm:ss`)}
                    </td>
                    <td>{getFullName(log.initiator)}</td>
                    <td>
                      {log.initiator.role == "system"
                        ? "Система"
                        : log.initiator.role == "helper"
                        ? "Куратор"
                        : "Партнер"}
                    </td>
                    <td>{log.info}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}

export default Logs;
