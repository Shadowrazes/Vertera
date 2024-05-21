import { useState } from "react";

function Counter({ currentStatus, messagesQuery, data }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  return (
    <>
      {isAdmin() && currentStatus !== "Уведомление" && (
        <div className="chat__counter-wrapper">
          <span className="chat__counter-label">Счетчик:</span>
          <span
            className={
              currentStatus == "В процессе" ||
              currentStatus == "На уточнении" ||
              (currentStatus == "Новый" &&
                messagesQuery.at(-1).sender.id !==
                  data.clientQuery.ticket.recipient.id)
                ? "chat__counter-work"
                : "chat__counter-stop"
            }
          >
            {currentStatus == "В процессе" ||
            currentStatus == "На уточнении" ||
            (currentStatus == "Новый" &&
              messagesQuery.at(-1).sender.id !==
                data.clientQuery.ticket.recipient.id)
              ? "Запущен"
              : "Остановлен"}
          </span>
        </div>
      )}
    </>
  );
}

export default Counter;
