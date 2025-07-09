"use client";

import * as React from "react";

import { studentColumns } from "./columns";
import { useStudent } from "@/app/students/hooks/useStudent";

const StudentsPage = () => {
  const { students, fetch } = useStudent();

  React.useEffect(() => {
    fetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log("Students state updated:", students);
  }, [students]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>
        {students.length == 0 ? (
          <p className="text-gray-600">No students found. Please Add Data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black text-gray-800">
              <thead className="bg-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.no.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.section.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.grade.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.strand.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.gender.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.lastName.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.firstName.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {studentColumns.middleName.name}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
