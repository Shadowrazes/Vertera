import { useState, useEffect } from "react";
import LogoLoader from "../assets/logo-loader.svg";
import Spinner from "../components/spinner";
import "../css/loading.css";

import get_translation from "../helpers/translation";

function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(progress + 10);
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <>
      <div className="loading__container">
        <img className="loading__logo" src={LogoLoader} alt=""></img>
        <span className="loading__title">
          {get_translation("INTERFACE_TICKET_SYSTEM")}
        </span>
        <Spinner progress={progress} />
      </div>
    </>
  );
}

export default Loader;
