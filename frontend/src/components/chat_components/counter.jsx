import { useState } from "react";

import get_translation from "../../helpers/translation";

function Counter({ currentStatusId, messagesQuery, data }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  return (
    <>
      {isAdmin() && currentStatusId !== 6 && (
        <div className="chat__counter-wrapper">
          <span className="chat__counter-label">
            {get_translation("INTERFACE_COUNTER")}:
          </span>
          <span
            className={
              currentStatusId == 3 ||
              currentStatusId == 4 ||
              (currentStatusId == 1 &&
                messagesQuery.at(-1).sender.id !==
                  data.clientQuery.ticket.recipient.id)
                ? "chat__counter-work"
                : "chat__counter-stop"
            }
          >
            {currentStatusId == 3 ||
            currentStatusId == 4 ||
            (currentStatusId == 1 &&
              messagesQuery.at(-1).sender.id !==
                data.clientQuery.ticket.recipient.id)
              ? get_translation("INTERFACE_COUNTRE_ENABLED")
              : get_translation("INTERFACE_COUNTER_DISABLED")}
          </span>
        </div>
      )}
    </>
  );
}

export default Counter;
