import { useState, useEffect, useMemo } from "react";
import { Table } from "react-bootstrap";
import { useQuery } from "@apollo/client";

import TABLE_TICKETS from "../apollo/queries";
import Loader from "../pages/loading";

import "../css/table.css";

function TestTable() {
  const [dataQuery, setData] = useState([]);
  const [prevSelectedSort, setPrevSelectedSort] = useState(-1);

  const [orderBy, setOrderBy] = useState("id");
  const [orderDir, setOrderDir] = useState("ASC");

  const [isVisible, setIsVisible] = useState(false);

  const itemsPerPage = 2;
  const ticketsAmount = 5;

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(ticketsAmount / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const { loading, error, data, refetch } = useQuery(TABLE_TICKETS, {
    variables: {
      filters: {
        limit: itemsPerPage,
        offset: 0,
        orderBy: "id",
        orderDir: "ASC",
        lang: "ru",
      },
    },
  });

  const [selectedSort, setSelectedSort] = useState(-1);

  const [currentPage, setCurrentPage] = useState(1);

  const handleNewPage = async (index) => {
    setCurrentPage(index);

    let lastItem = currentPage * itemsPerPage;
    let offset = lastItem - itemsPerPage;
    // console.log("offset", offset);

    const variables = {
      filters: {
        limit: itemsPerPage,
        offset: offset,
        orderBy: orderBy,
        orderDir: orderDir,
        lang: "ru",
      },
    };
    await refetch(variables);
  };

  useEffect(() => {
    if (data && data.ticketList) {
      setData(data.ticketList);
    }

    if (selectedSort !== prevSelectedSort) {
      handleSorts(selectedSort);
      setPrevSelectedSort(selectedSort);
      console.log(prevSelectedSort);
    }

    handleNewPage(currentPage);

    setIsVisible(pageNumbers.length > 1);
  }, [data, selectedSort, prevSelectedSort, currentPage, pageNumbers]);

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
  ];
  const columnsName = ["Раздел", "Дата", "Тема", "Последнее сообщение"];

  const handleSorts = async (index) => {
    setSelectedSort(index);
    let newOrderBy;
    let newOrderDir;

    if (prevSelectedSort === index) {
      newOrderDir = "DESC";
    } else {
      newOrderDir = "ASC";
    }

    switch (index) {
      case 0:
        newOrderBy = "unitStroke";
        break;

      case 1:
        newOrderBy = "date";
        break;

      case 2:
        newOrderBy = "themeStroke";
        break;

      case 3:
        newOrderBy = "lastMsgDate";
        break;

      default:
        newOrderBy = "id";
        break;
    }

    setOrderBy(newOrderBy);
    setOrderDir(newOrderDir);

    const variables = {
      filters: {
        limit: itemsPerPage,
        offset: 0,
        orderBy: newOrderBy,
        orderDir: newOrderDir,
        lang: "ru",
      },
    };
    await refetch(variables);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(ticketsAmount / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

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

      <ul className="alltickets__pagination">
        {isVisible && (
          <button
            onClick={handlePrevPage}
            className={
              currentPage === 1
                ? "alltickets__page-btn-disabled"
                : "alltickets__page-btn"
            }
            disabled={currentPage === 1}
          >
            Предыдущая
          </button>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className="alltickets__page-item">
            <button
              onClick={() => handleNewPage(number)}
              className={
                number === currentPage
                  ? "alltickets__page-link active-link"
                  : "alltickets__page-link"
              }
            >
              {number}
            </button>
          </li>
        ))}
        {isVisible && (
          <button
            onClick={handleNextPage}
            className={
              currentPage === Math.ceil(data.length / itemsPerPage)
                ? "alltickets__page-btn-disabled"
                : "alltickets__page-btn"
            }
            disabled={currentPage === Math.ceil(ticketsAmount / itemsPerPage)}
          >
            Следующая
          </button>
        )}
      </ul>
    </>
  );
}

export default TestTable;
