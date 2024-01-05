import Spinner from "react-bootstrap/Spinner";
import "../css/spinner.css";

function SpinnerLoader({ progress }) {
  return (
    <div className="spinner__container">
      <Spinner
        animation="border"
        role="status"
        className="spinner__style"
      ></Spinner>

      <div className="progress__container">
        <span className="progress__text">{`${progress}%`}</span>
      </div>
    </div>
  );
}

export default SpinnerLoader;
