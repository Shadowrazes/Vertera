import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  MRT_TableContainer,
  useMaterialReactTable,
} from "material-react-table";

import { THEME_LIST } from "../apollo/queries";
import { UPDATE_THEME_ORDER } from "../apollo/mutations";

import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

const DNDTable = () => {
  const [data, setData] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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
      const formattedData = dataThemeList.clientQuery.allThemeTree
        .find((unit) => unit.id == 3)
        .themes.map((unit) => {
          return {
            orderNum: unit.orderNum,
            id: unit.id,
            name: unit.name.stroke,
          };
        });
      setData(formattedData);
      setDataOrder(formattedData);
    }
  }, [dataThemeList]);

  const [updateThemeOrder] = useMutation(UPDATE_THEME_ORDER);

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
          const newData = [...data];
          const newDataOrder = [...dataOrder];
          newData.splice(
            hoveredRow.index,
            0,
            newData.splice(draggingRow.index, 1)[0]
          );

          newDataOrder.forEach((item, index) => {
            item.orderNum = index + 1;
          });

          setData(newData);
          setDataOrder(newDataOrder);
        }
      },
    }),
  });

  if (loading) {
    return <Loader />;
  }

  const handleClickAplly = async () => {
    const queryData = data.map((item, index) => ({
      orderNum: dataOrder[index].orderNum,
      id: item.id,
    }));

    // console.log(queryData);

    try {
      const result = await updateThemeOrder({
        variables: {
          token: user.token,
          type: "unit",
          themeOrderUpdateItem: queryData,
        },
      });

      console.log("Порядок успешно обновлен:", result);
    } catch (error) {
      console.error("Ошибка при обновлении порядка:", error);
    }
  };

  return (
    <>
      <MRT_TableContainer table={table} />
      <ButtonCustom title="apply" onClick={handleClickAplly} />
    </>
  );
};

export default DNDTable;
