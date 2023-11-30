import { useState } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import "../css/table.css";

function testTable() {
  type TableRow = {
    id: number;
    section: string;
    date: Date;
    theme: string;
    last_message: string;
    message_count: string;
    status: string;
  };

  const columns = [
    "Раздел",
    "Дата",
    "Тема",
    "Последнее сообщение",
    "Сообщений",
  ];

  const data: TableRow[] = [
    {
      id: 1,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "02.10.23| Имя Фамилия",
      message_count: "3/1",
      status: "Новый",
    },
    {
      id: 2,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "03.10.23| Имя Фамилия",
      message_count: "4/1",
      status: "В процессе",
    },
    {
      id: 3,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "03.10.23| Имя Фамилия",
      message_count: "4/1",
      status: "В ожидании",
    },
    {
      id: 4,
      section: "Темы",
      date: new Date("2023-10-17"),
      theme: "Название темы",
      last_message: "03.10.23| Имя Фамилия",
      message_count: "4/1",
      status: "Закрыт",
    },
  ];

  const [selectedSort, setSelectedSort] = useState(-1);
  const handleSorts = (index: number) => {
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
            {column}
          </span>
        ))}
      </div>

      <Table className="table__table" hover>
        <thead>
          <tr>
            <th>ID тикет</th>
            <th>Раздел</th>
            <th>Дата создания</th>
            <th>Тема</th>
            <th>Последнее сообщение</th>
            <th>Сообщений</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.section}</td>
              <td>{item.date.toLocaleDateString()}</td>
              <td>{item.theme}</td>
              <td>{item.last_message}</td>
              <td>{item.message_count}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default testTable;
