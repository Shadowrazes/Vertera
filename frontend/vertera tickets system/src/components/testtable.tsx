import { useState, useEffect } from "react";
import { Form, Row, Col, Table, Button } from "react-bootstrap";
import { useQuery, gql, ApolloClient, InMemoryCache } from "@apollo/client";

// import TABLE_TICKETS from "../apollo/table";
import Loader from "../pages/loading";
import Spinner from "../components/spinner";

import "../css/table.css";

// interface DataTable {
//   id: number;
//   section: string;
//   date: string;
//   theme: string;
//   last_message: string;
//   status: string;
// }

// interface TableTicketsData {
//   dataTable: DataTable[];
// }

// const client = new ApolloClient({
//   uri: "http://localhost:4444/graphql",
//   cache: new InMemoryCache(),
// });

// const TABLE_TICKETS = gql`
//   query q {
//     ticket(id: 4) {
//       id
//       date
//     }
//   }
// `;

function TestTable() {
  // type TableRow = {
  //   id: number;
  //   theme: string;
  //   status: string;
  //   [key: string]: string | number;
  // };

  // const { loading, error, data } = useQuery<TicketData>(TABLE_TICKETS);

  // if (loading) {
  //   return <Loader />;
  // }

  // const ticket = data?.ticket;

  // const columns = ["theme", "status"];
  // const columnsName = ["Тема", "Статус"];

  // const initialData: TableRow[] = [
  //   {
  //     id: 3,
  //     theme: "B",
  //     status: "Новый",
  //   },
  //   {
  //     id: 4,
  //     theme: "A",
  //     status: "В процессе",
  //   },
  //   {
  //     id: 1,
  //     theme: "C",
  //     status: "В ожидании",
  //   },
  //   {
  //     id: 2,
  //     theme: "D",
  //     status: "Закрыт",
  //   },
  // ];

  // const [selectedSort, setSelectedSort] = useState(-1);
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
  //   "asc"
  // );
  // let counter = 0;

  // const sortData = (field: string) => {
  //   console.log(field);
  //   // const copyData = [...data];

  //   const sortedData = datas.sort((a, b) => {
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
  //   // sortData("id");
  //   // setSortDirection("asc");
  // }, []);

  // const handleSorts = (index: number) => {
  //   if (selectedSort == index) {
  //     counter++;
  //   } else {
  //     counter = 0;
  //   }
  //   if (counter == 1) {
  //     setSortDirection("asc");
  //   }

  //   sortData(columns[index]);
  //   setSelectedSort(index);
  // };

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);

  // const { loading, error, data } = useQuery(TABLE_TICKETS);
  // const [ticketData, setTicketData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (!loading && !error && data) {
  //         console.log("Data from GraphQL query:", data);
  //         // Now you can set the data to your component state or perform other actions
  //         setTicketData(data.ticket);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [loading, error, data]);

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
            {/* <th>Тема</th>
            <th>Статус</th> */}
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </Table>
    </>
  );
}

export default TestTable;
