import { useState } from "react";
import { DateTime } from "luxon";

import { Table } from "react-bootstrap";
import ButtonCustom from "../../components/button";

import get_translation from "../../helpers/translation";

function Logs({ currentStatusId, logs }) {
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
          title={
            isVisibleLogs == false
              ? get_translation("INTERFACE_SHOW_LOGS")
              : get_translation("INTERFACE_HIDE_LOGS")
          }
          onClick={handleHideComponent}
          className={"button-outlined single"}
        />
      </a>

      {isVisibleLogs && (
        <>
          <div
            className={
              currentStatusId == 1 ? "chat__table-log-new" : "chat__table-log"
            }
          >
            <Table className="table__table" hover>
              <thead>
                <tr>
                  <th>{get_translation("INTERFACE_DATE")}</th>
                  <th>{get_translation("INTERFACE_NAME")}</th>
                  <th>{get_translation("INTERFACE_ROLE")}</th>
                  <th>{get_translation("INTERFACE_EVENT")}</th>
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
                        ? get_translation("INTERFACE_SYSTEM")
                        : log.initiator.role == "helper"
                        ? get_translation("INTERFACE_CURATOR")
                        : get_translation("INTERFACE_PARTNER")}
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
