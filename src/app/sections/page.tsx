"use client";

import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Student } from "@/app/interface/Student";
import { useSection } from "@/app/sections/hooks/useSection";
import { Loading } from "@/app/components/Loading";
import { Pagination } from "@/app/components/Pagination";
import { Style } from "@/lib/Styles";
import useWindowSize from "../hooks/useWindowSize";
import { useTableColumns } from "./hooks/useTableColumns";

const StudentsPage = () => {
  const [section, setSection] = React.useState("Ruby");
  const { students, isFetching } = useSection(section);
  const [data, setData] = React.useState<Student[]>(students);

  React.useEffect(() => {
    console.log("Students state updated:", students);
    setData(students);
  }, [students]);

  const handleSectionChange = (section: string) => {
    setData([]);
    setSection(section);
  };

  const windowSize = useWindowSize();
  const { desktopCols, mobileCols } = useTableColumns();

  const table = useReactTable({
    data,
    columns:
      windowSize === "sm" || windowSize === "md" ? mobileCols : desktopCols,
    filterFns: {},
    state: {
      // columnFilters,
    },
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Section:
          <select
            className="ml-2 p-2 border rounded"
            value={section}
            onChange={(e) => handleSectionChange(e.target.value)}
          >
            <option value="Ruby">Ruby</option>
            <option value="Jade">Jade</option>
            <option value="Beryl">Beryl</option>
            <option value="Pearl">Pearl</option>
            <option value="Topaz">Topaz</option>
          </select>
        </h1>
        {isFetching ? (
          <div className="flex items-center justify-center space-x-2">
            <Loading height={16} width={16} />
          </div>
        ) : data.length == 0 ? (
          <p className="text-gray-600">No students found. Please Add Data</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Total Students: {data.length}
              <br />
              Total Male:
              {data.filter((student) => student.gender === "Male").length}
              <br />
              Total Female:{" "}
              {data.filter((student) => student.gender === "Female").length}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full max-h-screen table divide-y divide-black text-gray-800">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-blue-800 text-white">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className={Style.th}>
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id} className={Style.tr}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className={`${Style.td} ${
                                cell.row.original.gender === "Female"
                                  ? "bg-pink-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pagination {...table} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
