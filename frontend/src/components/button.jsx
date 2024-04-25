import { Button } from "react-bootstrap";
import "../css/button.css";

function ButtonCustom({
  title,
  className,
  onClick,
  type,
  variant,
  id,
  styleCustom,
}) {
  const defaultClassName = "button";
  const combinedClassName = `${defaultClassName} ${className || ""}`;

  return (
    <>
      <Button
        variant={variant || "primary"}
        className={combinedClassName}
        onClick={onClick}
        style={styleCustom}
        type={type ? type : "button"}
        id={id}
      >
        {title}
      </Button>
    </>
  );
}

export default ButtonCustom;
