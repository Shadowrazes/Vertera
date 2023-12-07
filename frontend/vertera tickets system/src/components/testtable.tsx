import { useState, useEffect } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import { useQuery, gql, ApolloClient, InMemoryCache } from "@apollo/client";

import TABLE_TICKETS from "../apollo/queries";
import Loader from "../pages/loading";
import Spinner from "../components/spinner";

import "../css/table.css";

function TestTable() {
  type TableRow = {
    id: number;
    subTheme: {
      theme: {
        unit: {
          name: {
            stroke: string;
          };
        };
      };
    };
    date: string;
    subTheme: {
      theme: {
        name: {
          stroke: string;
        };
      };
    };
    lastMessage: {
      text: string;
    };
    status: {
      name: {
        stroke: string;
      };
    };
    [key: string]: string | number;
  };

  const { loading, error, data } = useQuery(TABLE_TICKETS);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h2>Что-то пошло не так</h2>;
  }

  const tickets: TableRow[] = data?.ticketList || [];

  // const columns = ["theme", "status"];
  // const columnsName = ["Тема", "Статус"];

  // const initialData: TableRow[] = [
  //   // {
  //   //   id: 3,
  //   //   theme: "B",
  //   //   status: "Новый",
  //   // },
  //   // {
  //   //   id: 4,
  //   //   theme: "A",
  //   //   status: "В процессе",
  //   // },
  //   // {
  //   //   id: 1,
  //   //   theme: "C",
  //   //   status: "В ожидании",
  //   // },
  //   // {
  //   //   id: 2,
  //   //   theme: "D",
  //   //   status: "Закрыт",
  //   // },
  // ];

  // const [dataQuery, setData] = useState(initialData);
  // const [selectedSort, setSelectedSort] = useState(-1);
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
  //   "asc"
  // );
  // let counter = 0;

  // const sortData = (field: string) => {
  //   console.log(field);
  //   // const copyData = [...data];

  //   const sortedData = dataQuery.sort((a, b) => {
  //     const aValue: string | number = a[field];
  //     const bValue: string | number = b[field];

  //     if (typeof aValue === "string" && typeof bValue === "string") {
  //       return sortDirection === "asc"
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     } else if (typeof aValue === "number" && typeof bValue === "number") {
  //       return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  //     } else {
  //       return 0;
  //     }
  //   });
  //   setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  //   setData(sortedData);
  // };

  // useEffect(() => {
  //   //   // sortData("id");
  //   //   // setSortDirection("asc");
  // }, []);

  // const handleSorts = (index: number) => {
  //   // if (selectedSort == index) {
  //   //   counter++;
  //   // } else {
  //   //   counter = 0;
  //   // }
  //   // if (counter == 1) {
  //   //   setSortDirection("asc");
  //   // }

  //   sortData(columns[index]);
  //   setSelectedSort(index);
  // };

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {/* <div className="table__sorts">
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
      </div> */}

      <Table className="table__table" hover>
        <thead>
          <tr>
            <th>ID тикет</th>
            <th>Раздел</th>
            <th>Дата создания</th>
            <th>Тема</th>
            <th>Последнее сообщение</th>
            <th>сообщений</th>
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
              <td>{ticket.status.name.stroke}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TestTable;
