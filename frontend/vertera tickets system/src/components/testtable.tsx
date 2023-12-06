import { useState, useEffect } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import "../css/table.css";

function TestTable() {
  type TableRow = {
    id: number;
    theme: string;
    status: string;
    [key: string]: string | number;
  };

  const columns = ["theme", "status"];
  const columnsName = ["Тема", "Статус"];

  const initialData: TableRow[] = [
    {
      id: 3,
      theme: "B",
      status: "Новый",
    },
    {
      id: 4,
      theme: "A",
      status: "В процессе",
    },
    {
      id: 1,
      theme: "C",
      status: "В ожидании",
    },
    {
      id: 2,
      theme: "D",
      status: "Закрыт",
    },
  ];

  const [data, setData] = useState(initialData);
  const [selectedSort, setSelectedSort] = useState(-1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );
  let counter = 0;

  const sortData = (field: string) => {
    console.log(field);
    // const copyData = [...data];

    const sortedData = data.sort((a, b) => {
      const aValue: string | number = a[field];
      const bValue: string | number = b[field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    });
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setData(sortedData);
  };

  useEffect(() => {
    // sortData("id");
    // setSortDirection("asc");
  }, []);

  const handleSorts = (index: number) => {
    if (selectedSort == index) {
      counter++;
    } else {
      counter = 0;
    }
    if (counter == 1) {
      setSortDirection("asc");
    }

    sortData(columns[index]);
    setSelectedSort(index);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="table__sorts">
        <span className="table__sorts-label">Сортировать по:</span>
        {columns.map((column, index) => (
          <span
            key={column}
            onClick={() => {
              handleSorts(index);
            }}
            className={
              selectedSort === index
                ? "table__sort table__sort-active"
                : "table__sort"
            }
          >
            {columnsName[index]}
          </span>
        ))}
      </div>

      <Table className="table__table" hover>
        <thead>
          <tr>
            <th>ID тикет</th>
            <th>Тема</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.theme}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TestTable;
