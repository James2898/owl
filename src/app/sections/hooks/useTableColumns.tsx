"use client";

import * as React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/app/interface/Student";
import { studentColumns } from "@/app/students/columns";
import { Style } from "@/lib/Styles";

export const useTableColumns = () => {
  const desktopCols = React.useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "no",
        header: studentColumns.no.name,
        cell: (student) => student.getValue(),
      },
      {
        accessorKey: "imageUrl",
        header: studentColumns.imageUrl.name,
        cell: (student) => {
          const imageUrl = student.getValue() as string | undefined;
          return imageUrl ? (
            <Image
              src={imageUrl}
              alt="Student Image"
              width={20}
              height={20}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <Image
              src="/static/default-profile.svg"
              alt="Student Image"
              width={20}
              height={20}
              className="w-20 h-20 rounded-full"
            />
          );
        },
      },
      {
        id: "fullName",
        accessorFn: (student) =>
          `${student.lastName}, ${student.firstName} ${
            student.middleName ? student.middleName[0] + "." : ""
          }`,
        header: "Full Name",
      },
      {
        header: "Actions",
        cell: (student) => {
          const studentData = student.row.original;
          return (
            <div className="flex space-x-2">
              <button
                className={Style.btnView}
                onClick={() =>
                  alert(`View details for ${studentData.firstName}`)
                }
              >
                View
              </button>
              <button
                className={Style.btnDelete}
                onClick={() => alert(`Delete ${studentData.firstName}`)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const mobileCols = React.useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "no",
        header: studentColumns.no.name,
        cell: (student) => student.getValue(),
      },
      {
        accessorKey: "imageUrl",
        header: studentColumns.imageUrl.name,
        cell: (student) => {
          const imageUrl = student.getValue() as string | undefined;
          return imageUrl ? (
            <Image
              src={imageUrl}
              alt="Student Image"
              width={20}
              height={20}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <Image
              src="/static/default-profile.svg"
              alt="Student Image"
              width={20}
              height={20}
              className="w-20 h-20 rounded-full"
            />
          );
        },
      },
      {
        accessorFn: (student) => student.lastName,
        header: studentColumns.lastName.name,
        cell: (student) => {
          const lastName = student.getValue() as string;
          return <span className="text-2xl">{lastName}</span>;
        },
      },
    ],
    []
  );

  return {
    desktopCols,
    mobileCols,
  };
};
