import { Button } from "react-bootstrap";
import "../css/button.css";


function ButtonCustom({ title, className, onClick }) {
  const defaultClassName = "button";
  const combinedClassName = `${defaultClassName} ${className || ""}`;

  return (
    <>
      <Button
        variant="primary"
        className={combinedClassName}
        onClick={onClick}
        type="submit"
      >
        {title}
      </Button> 
    </>
  );
}

export default ButtonCustom;
