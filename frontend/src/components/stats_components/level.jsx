import { useState, useEffect } from "react";

import "../../css/level.css";

import get_translation from "../../helpers/translation";

function Level({ fantasy, allTickets }) {
  const getLevel = () => {
    if (!fantasy) {
      return 0;
    }
    return Math.round((fantasy + allTickets) / 2);
  };

  const getProgress = () => {
    return Math.round((fantasy - Math.floor(fantasy)) * 100);
  };

  const [level, setLevel] = useState(getLevel(fantasy));

  useEffect(() => {
    setLevel(getLevel());
  }, [fantasy, allTickets]);

  return (
    <>
      <div className="level">
        <span className="level__circle">{level}</span>
        <div className="level__progress-wrapper">
          <span className="level__progress-text">
            {get_translation("INTERFACE_CURRENT_PROGRESS")}: {getProgress()}%
          </span>
          <div className="level__progress-bar">
            <div
              className="level__progress-bar-active"
              style={{ width: getProgress() + "%" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Level;
