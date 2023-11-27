import { Button } from "react-bootstrap";
import "../css/button.css";

interface ButtonProps {
  title: string;
  className?: string;
  onClick?: () => void;
  type?: string;
}

function ButtonCustom({ title, className, onClick }: ButtonProps) {
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
