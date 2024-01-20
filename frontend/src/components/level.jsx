import "../css/level.css";
import { useState, useEffect, useRef } from "react";

function Level({fantasy}) {
    const getLevel = (fantasy) => {
        
        if(!fantasy) {
            return 0;
        }
        return Math.round(fantasy); 
    }

    const getProgress = (fantasy) => {
        return Math.round((fantasy - Math.round(fantasy)) * 100);
    }

  const [level, setLevel] = useState(getLevel(fantasy));

  useEffect(() => {
    setLevel(getLevel(fantasy));
  }, [fantasy])

  return (
    <>
      <div className="level">
        <span className="level__circle">{level}</span>
        <div className="level__progress-wrapper">
            <span className="level__progress-text">Прогресс текущего уровня: {level}%</span>
            <div className="level__progress-bar">
                <div className="level__progress-bar-active" style={{width: {level} + "%"}}></div>
            </div>
        </div>
      </div>
    </>
  );
}

export default Level;
