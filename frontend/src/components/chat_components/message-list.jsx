import { useState } from "react";
import { DateTime } from "luxon";

import ChatMessageDeleted from "./chat-message-deleted";
import ChatMessageSender from "./chat-message-sender";
import ChatMessageSystem from "./chat-message-system";
import ChatMessageRecipient from "./chat-message-recipient";

function MessageList({
  messagesQuery,
  userId,
  currentStatusId,
  handleRefetch,
}) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };
  return (
    <>
      {messagesQuery.map(
        (msg) =>
          msg.text !== "" && (
            <div key={msg.id}>
              {msg.isActive == 0 ? (
                <ChatMessageDeleted
                  id={msg.id}
                  message={msg.text}
                  sender={msg.sender}
                  onClick={handleRefetch}
                  time={DateTime.fromISO(msg.date, { zone: "utc" })
                    .toLocal()
                    .toFormat(`yyyy.MM.dd      HH:mm:ss`)}
                  attachs={msg.attachs}
                />
              ) : msg.sender.id === userId ? (
                <ChatMessageSender
                  id={msg.id}
                  message={msg.text}
                  sender={msg.sender}
                  visibility={msg.visibility}
                  removable={msg.removable}
                  statusId={currentStatusId}
                  onClick={handleRefetch}
                  time={DateTime.fromISO(msg.date, { zone: "utc" })
                    .toLocal()
                    .toFormat(`yyyy.MM.dd      HH:mm:ss`)}
                  attachs={msg.attachs}
                />
              ) : msg.sender.role === "system" ? (
                <>
                  {isAdmin() && (
                    <ChatMessageSystem
                      message={msg.text}
                      time={DateTime.fromISO(msg.date, { zone: "utc" })
                        .toLocal()
                        .toFormat(`yyyy.MM.dd      HH:mm:ss`)}
                    />
                  )}
                </>
              ) : (
                <ChatMessageRecipient
                  message={msg.text}
                  sender={msg.sender}
                  visibility={msg.visibility}
                  time={DateTime.fromISO(msg.date, { zone: "utc" })
                    .toLocal()
                    .toFormat(`yyyy.MM.dd      HH:mm:ss`)}
                  attachs={msg.attachs}
                />
              )}
            </div>
          )
      )}
    </>
  );
}

export default MessageList;
