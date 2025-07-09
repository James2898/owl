"use client";

import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { studentColumns } from "./columns";
import { useStudent } from "@/app/students/hooks/useStudent";
import { Student } from "@/app/interface/Student";

const StudentsPage = () => {
  const { students } = useStudent();
  const [data, setData] = React.useState<Student[]>(students);

  React.useEffect(() => {
    console.log("Students state updated:", students);
    setData(students);
  }, [students]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = React.useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "no",
        header: studentColumns.no.name,
        cell: (student) => student.getValue(),
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorFn: (student) =>
          `${student.grade} - ${student.strand} - ${student.section}`,
        header: studentColumns.section.name,
        cell: (student) => student.getValue(),
      },
      {
        accessorFn: (student) =>
          `${student.lastName}, ${student.firstName} ${
            student.middleName ? student.middleName[0] + "." : ""
          }`,
        header: "Name",
      },
      {
        header: "Actions",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>
        {students.length == 0 ? (
          <p className="text-gray-600">No students found. Please Add Data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table divide-y divide-black text-gray-800">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-blue-800 text-white">
                    {headerGroup.headers.map((header) => {
                      return (
                        <th key={header.id} className={Style.th}>
                          {header.isPlaceholder ? null : (
                            <>
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
                            </>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} className={Style.tr}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id} className={Style.td}>
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
            {/* Pagination */}
            <div className="mt-4 flex items-center inline-block w-full justify-center">
              <div>
                <div className="w-full flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-700">
                    Page{" "}
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </strong>
                  </span>
                </div>
                <nav className="isolate inline-flex justify-center w-full">
                  <button
                    type="button"
                    className={
                      table.getCanPreviousPage()
                        ? Style.btnDefault
                        : Style.btnDisabled
                    }
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    First
                  </button>
                  <button
                    type="button"
                    className={
                      table.getCanPreviousPage()
                        ? Style.btnDefault
                        : Style.btnDisabled
                    }
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className={
                      table.getCanNextPage()
                        ? Style.btnDefault
                        : Style.btnDisabled
                    }
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className={
                      table.getCanNextPage()
                        ? Style.btnDefault
                        : Style.btnDisabled
                    }
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    Last
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Style = {
  th: "px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider",
  tr: "bg-white border-b hover:bg-blue-200",
  td: "px-3 py-2 text-sm text-gray-800",
  btnDefault:
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800",
  btnDisabled:
    "cursor-not-allowed py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
};

export default StudentsPage;
