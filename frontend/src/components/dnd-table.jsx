import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";

const DNDTable = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const {
    loading,
    error,
    data: dataQuery,
    refetch,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
    },
  });

  //   const initData = [
  //     {
  //       order: "Dylan",
  //       lastName: "Murray",
  //       city: "East Daphne",
  //     },
  //     {
  //       firstName: "Raquel",
  //       lastName: "Kohler",
  //       city: "Columbus",
  //     },
  //     {
  //       firstName: "Ervin",
  //       lastName: "Reinger",
  //       city: "South Linda",
  //     },
  //     {
  //       firstName: "Brittany",
  //       lastName: "McCullough",
  //       city: "Lincoln",
  //     },
  //     {
  //       firstName: "Branson",
  //       lastName: "Frami",
  //       city: "Charleston",
  //     },
  //   ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "order",
        header: "порядок",
      },
      {
        accessorKey: "id",
        header: "раздел id",
      },
      {
        accessorKey: "name",
        header: "название",
      },
    ],
    []
  );

  const [data, setData] = useState(() => initData);

  //   useEffect(() => {
  //     // if (data && data.clientQuery.allThemeTree) {
  //     //   setData(data.clientQuery.allThemeTree);
  //     // }

  //     refetch();
  //   }, [data]);

  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          data.splice(
            hoveredRow.index,
            0,
            data.splice(draggingRow.index, 1)[0]
          );
          setData([...data]);
        }
      },
    }),
  });
  return <MRT_TableContainer table={table} />;
};

export default DNDTable;
