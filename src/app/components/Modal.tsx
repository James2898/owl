"use client";

import * as React from "react";

import { Student } from "../interface/Student";
import Image from "next/image";
import {
  getCoreRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { Style } from "@/lib/Styles";
import { Grades } from "../interface/Grades";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  student: Student | null;
  grades: Grades[]; // Assuming grades is an array, adjust type as necessary
}

export const Modal = ({ isOpen, handleClose, student, grades }: Props) => {
  if (!student) return null;

  if (!grades || grades.length === 0) {
    return <></>;
  }

  const fullName = `${student.lastName}, ${student.firstName} ${
    student.middleName || ""
  }`;

  React.useEffect(() => {
    console.log("Grades updated:", grades);
  }, [grades]);

  const table = useReactTable({
    data: [grades],
    columns: [
      {
        header: "Written Works",
        accessorKey: "writtenWorks",
        accessorFn: (row) => (row ? row[0].writtenWorks.range.r1 : ""),
        cell: (grades) => {
          console.log("Grades cell data:", grades.getValue());
          return <div>Sample</div>;
        },
      },
      // Add other columns as needed
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-black/75 z-50 my-4">
      <div className="bg-white p-6 rounded-lg shadow-lg justify-center bg-gray-300 max-w-sm w-full opacity-100">
        <Image
          src={student.imageUrl || ""}
          alt={fullName}
          width={60}
          height={60}
          className="mb-4 w-40 h-40 border rounded-full border-gray-300 border-solid border-2"
        />
        <h2 className="text-xl font-bold mb-4">{fullName}</h2>

        <table className="my-4 w-full border-collapse">
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

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};
