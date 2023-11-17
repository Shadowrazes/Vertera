import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "../css/dropdown.css";

interface DropdownProps {
  label: string;
  items: string[];
}

function DropdownBT({ label, items }: DropdownProps) {
  return (
    <DropdownButton id="dropdown-custom-1" title={label}>
      {items.map((item, index) => (
        <Dropdown.Item key={index} href="#">
          {item}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export default DropdownBT;
