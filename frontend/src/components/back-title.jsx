import { useNavigate } from "react-router-dom";

import "../css/ticket-title.css";

function BackTitle({ title, className, linkPrev }) {
  const navigate = useNavigate();
  const handleGoBack = () => {
    // console.log(linkPrev);
    if (linkPrev == null) {
      // window.location.href = "/all-tickets";
      navigate("/all-tickets");
    } else {
      // window.location.href = linkPrev;
      navigate(`${linkPrev}`);
    }
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
      </div>
    </>
  );
}

export default BackTitle;
