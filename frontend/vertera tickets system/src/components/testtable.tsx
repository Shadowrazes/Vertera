import { useState, useEffect } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import "../css/table.css";

function TestTable() {
  type TableRow = {
    id: number;
    theme: string;
    [key: string]: string | number;
  };

  const columns = ["ID тикет", "Тема"];

  const initialData: TableRow[] = [
    {
      id: 3,
      theme: "B",
    },
    {
      id: 4,
      theme: "A",
    },
    {
      id: 1,
      theme: "D",
    },
    {
      id: 2,
      theme: "C",
    },
  ];

  const [data, setData] = useState(initialData);
  const [selectedSort, setSelectedSort] = useState(-1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortData = (field: string) => {
    const copyData = [...data];

    const sortedData = copyData.sort((a, b) => {
      const aValue: string | number | Date = a[field];
      const bValue: string | number | Date = b[field];

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

    setData(sortedData);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  useEffect(() => {}, []);

  const handleSorts = (index: number) => {
    setSelectedSort(index);
    sortData(columns[index]);
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

        <span
          onClick={() => {
            sortData("id");
          }}
          className="table__sort"
        >
          ID
        </span>
        <span
          onClick={() => {
            sortData("theme");
          }}
          className="table__sort"
        >
          Тема
        </span>
      </div>

      <Table className="table__table" hover>
        <thead>
          <tr>
            <th
              onClick={() => {
                sortData("id");
              }}
            >
              ID тикет
            </th>
            <th
              onClick={() => {
                sortData("theme");
              }}
            >
              Тема
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.theme}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TestTable;
