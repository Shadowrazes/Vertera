import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "../css/dropdown.css";

interface DropdownProps {
  label: string;
  items: string[];
}

function DropdownBT({ label, items }: DropdownProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <DropdownButton id="dropdown-custom-1" title={selectedItem || label}>
      {items.map((item, index) => (
        <Dropdown.Item
          key={index}
          onClick={() => handleItemClick(item)}
          href="#"
        >
          {item}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export default DropdownBT;
