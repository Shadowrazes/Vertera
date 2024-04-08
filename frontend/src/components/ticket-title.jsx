import { useNavigate } from "react-router-dom";

import "../css/ticket-title.css";

const getStatusColor = (status) => {
  console.log(status);
  switch (status) {
    case "Открыто":
      return "#00AB97";
    case "Закрыто":
      return "#AB0000";
    default:
      return "black";
  }
};

function TicketTitle({ title, className, state, linkPrev }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // console.log(linkPrev);
    // window.location.href = linkPrev;
    navigate("/all-tickets");
  };

  return (
    <>
      <div className="ticket-title__container">
        <a href="#" onClick={handleGoBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <circle
              cx="15"
              cy="15"
              r="15"
              transform="matrix(-1 0 0 1 30 0)"
              fill="#00AB97"
            />
            <path
              d="M17.8378 8.91888L12.4449 14.3117C12.2887 14.4679 12.2887 14.7212 12.4449 14.8774L17.8378 20.2702"
              stroke="white"
              strokeLinecap="round"
            />
          </svg>
        </a>
        <h2 className={className}>{title}</h2>
        <span
          style={{ color: getStatusColor(state) }}
          className="ticket-title__state"
        >
          {state}
        </span>
      </div>
    </>
  );
}

export default TicketTitle;
