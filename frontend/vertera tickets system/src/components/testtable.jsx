import { useState, useEffect } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import { useQuery, gql, ApolloClient, InMemoryCache } from "@apollo/client";

import TABLE_TICKETS from "../apollo/queries";
import Loader from "../pages/loading";

import "../css/table.css";

function TestTable() {
  const [dataQuery, setData] = useState([]);
  const { loading, error, data } = useQuery(TABLE_TICKETS);

  const [selectedSort, setSelectedSort] = useState(-1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data && data.ticketList) {
      setData(data.ticketList);
    }
  }, [data]);

  const tickets = dataQuery;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const columns = [
    "subTheme.theme.unit.name.stroke",
    "date",
    "subTheme.theme.name.stroke",
    "lastMessage.text",
    "messages.length",
  ];
  const columnsName = [
    "Раздел",
    "Дата",
    "Тема",
    "Последнее сообщение",
    "Сообщение",
  ];

  const getField = (obj, path) => {
    const keys = path.split(".");
    let value = obj;

    for (const key of keys) {
      value = value[key];
    }

    return value;
  };

  const sortData = (field) => {
    console.log(field);
    // const copyData = [...data];

    const sortedData = [...dataQuery].sort((a, b) => {
      const aValue = getField(a, field);
      const bValue = getField(b, field);

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

  const handleSorts = (index) => {
    sortData(columns[index]);
    setSelectedSort(index);
  };

  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataQuery.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="table__sorts">
        <span className="table__sorts-label">Сортировать по:</span>
        {columns.map((column, index) => (
          <span
            key={column}
            onClick={() => {
              handleSorts(index);
              console.log(index);
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
            <th>Раздел</th>
            <th>Дата создания</th>
            <th>Тема</th>
            <th>Последнее сообщение</th>
            <th>Сообщений</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.subTheme.theme.unit.name.stroke}</td>
              <td>{ticket.date}</td>
              <td>{ticket.subTheme.theme.name.stroke}</td>
              <td>{ticket.lastMessage.text}</td>
              <td>{ticket.messages.length}</td>
              <td>{ticket.status.name.stroke}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TestTable;
