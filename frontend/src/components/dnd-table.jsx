import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";

import Loader from "../pages/loading";

const DNDTable = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [data, setData] = useState([]);

  const {
    loading,
    error,
    data: dataThemeList,
    refetch,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
    },
  });

  useEffect(() => {
    if (dataThemeList && dataThemeList.clientQuery.allThemeTree) {
      const formattedData = dataThemeList.clientQuery.allThemeTree.map(
        (unit) => {
          return {
            orderNum: unit.orderNum,
            id: unit.id,
            name: unit.name.stroke,
          };
        }
      );
      setData(formattedData);
    }

    refetch();
  }, [dataThemeList]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderNum",
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

  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    enableColumnActions: false,
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

  if (loading) {
    return <Loader />;
  }

  return <MRT_TableContainer table={table} />;
};

export default DNDTable;
