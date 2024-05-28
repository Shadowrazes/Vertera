import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ButtonCustom from "../button";

import get_translation from "../../helpers/translation";

function Reaction({ reaction, handleLike, handleDislike }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const isAdmin = () => {
    return user.role === "helper" || user.role === "system";
  };

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  return (
    <>
      <div className="chat-input__close-container" style={{ width: "100%" }}>
        <div className="chat-input__close-box">
          <span className="chat-input__close-text">
            {get_translation("INTERFACE_TICKET_CLOSED")}
          </span>
        </div>
        {!isAdmin() && (
          <div className="chat-message-recepient__rate-container">
            {!reaction ? (
              <span className="chat-message-recepient__rate-title">
                {get_translation("INTERFACE_RATE_ANSWER")}
              </span>
            ) : (
              <span className="chat-message-recepient__rate-title">
                {get_translation("INTERFACE_RATED_ANSWER")}
              </span>
            )}

            <div className="chat-message-recepient__rate">
              {!reaction && (
                <>
                  <a href="#" onClick={handleLike}>
                    <span className="chat-message-recepient__rate-icon-like">
                      <img src="/like.svg" alt="" />
                    </span>
                  </a>
                  <a href="#" onClick={handleDislike}>
                    <span className="chat-message-recepient__rate-icon-dislike">
                      <img src="/dislike.svg" alt="" />
                    </span>
                  </a>
                </>
              )}

              {reaction === "dislike" && (
                <a href="#" className="disabled">
                  <span className="chat-message-recepient__rate-icon-dislike">
                    <img src="/dislike.svg" alt="" />
                  </span>
                </a>
              )}

              {reaction === "like" && (
                <a href="#" className="disabled">
                  <span className="chat-message-recepient__rate-icon-like">
                    <img src="/like.svg" alt="" />
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        {isAdmin() && (
          <div className="chat-message-recepient__rate-container">
            <span className="chat-message-recepient__rate-title">
              {get_translation("INTERFACE_TICKET_RATING")}
            </span>

            {!reaction && (
              <span className="chat-message-recepient__rate chat-message-recepient__text">
                {get_translation("INTERFACE_TICKET_NOT_RATED")}
              </span>
            )}

            {reaction === "dislike" && (
              <a href="#" className="disabled">
                <span className="chat-message-recepient__rate-icon-dislike">
                  <img src="/dislike.svg" alt="" />
                </span>
              </a>
            )}

            {reaction === "like" && (
              <a href="#" className="disabled">
                <span className="chat-message-recepient__rate-icon-like">
                  <img src="/like.svg" alt="" />
                </span>
              </a>
            )}
          </div>
        )}
        {!isAdmin() && (
          <ButtonCustom
            title={get_translation("INTERFACE_CREATE_NEW_TICKET")}
            className="button-hover"
            onClick={goToCreateTicket}
          />
        )}
      </div>
    </>
  );
}

export default Reaction;
