import { Button } from "react-bootstrap";
import "../css/button.css";

function ButtonCustom({ title, className, onClick, variant, id }) {
  const defaultClassName = "button";
  const combinedClassName = `${defaultClassName} ${className || ""}`;

  return (
    <>
      <Button
        variant={variant || "primary"}
        className={combinedClassName}
        onClick={onClick}
        type="submit"
        id={id}
      >
        {title}
      </Button>
    </>
  );
}

export default ButtonCustom;
