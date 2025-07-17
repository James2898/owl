"use client";

import * as React from "react";
import { Student } from "../interface/Student";
import Image from "next/image";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  student: Student | null;
}

export const Modal = ({ isOpen, handleClose, student }: Props) => {
  if (!student) return null;

  const fullName = `${student.lastName}, ${student.firstName} ${
    student.middleName || ""
  }`;

  const table = useReactTable({
    data: [student],
    columns: [
      {
        accessorKey: "no",
        header: "No",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info) => (
          <Image
            src={info.getValue() || "/static/default-profile.svg"}
            alt="Student Image"
            width={60}
            height={60}
            className="w-20 h-20 rounded-full"
          />
        ),
      },
      {
        id: "fullName",
        accessorFn: (row) =>
          `${row.lastName}, ${row.firstName} ${row.middleName || ""}`,
        header: "Full Name",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-black/75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg justify-center bg-gray-300 max-w-sm w-full opacity-100">
        <Image
          src={student.imageUrl || ""}
          alt={fullName}
          width={60}
          height={60}
          className="mb-4 w-40 h-40 border rounded-full border-gray-300 border-solid border-2"
        />
        <h2 className="text-xl font-bold mb-4">{fullName}</h2>

        <table>
          <tbody>
            {table.}
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
