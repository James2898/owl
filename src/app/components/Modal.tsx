"use client";

import * as React from "react";

import Image from "next/image";
import { Student } from "@/app/interface/Student";
import { Grades } from "@/app/interface/Grades";
import { Loading } from "@/app/components/Loading";

interface Props {
  handleClose: () => void;
  isFetching: boolean;
  student: Student | null;
  grades: Grades[]; // Assuming grades is an array, adjust type as necessary
}

export const Modal = ({ handleClose, student, grades, isFetching }: Props) => {
  if (!student) return null;

  if (!grades || grades.length === 0) {
    return <></>;
  }

  const fullName = `${student.lastName}, ${student.firstName} ${
    student.middleName || ""
  }`;

  const studentGrades = grades[0];
  return (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-black/75 z-50 my-4">
      <div className="bg-white p-6 rounded-lg shadow-lg justify-center bg-gray-300 max-w-sm w-full opacity-100">
        <div className="flex justify-end items-center">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center space-x-2">
            <Loading width={20} height={20} />
          </div>
        ) : (
          <div>
            {student.imageUrl ? (
              <Image
                src={student.imageUrl}
                alt="Student Image"
                width={60}
                height={60}
                className="w-40 h-40 rounded-full border border-2 border-gray-300 mb-4"
              />
            ) : (
              <Image
                src="/static/default-profile.svg"
                alt="Student Image"
                width={60}
                height={60}
                className="w-40 h-40 rounded-full"
              />
            )}
            <h2 className="text-xl font-bold mb-4">{fullName}</h2>
            <form className="w-full max-w-sm">
              {/* WRITTEN WORKS */}
              <div className={Style.rangeContainer}>
                <div className="w-full">
                  <h1 className="text-lg font-bold">Written Works</h1>
                </div>
              </div>
              {studentGrades.writtenWorks.range.map((range, index) => (
                <div className={Style.rangeContainer} key={index}>
                  <div className="w-1/8 text-right">
                    <label className="block text-gray-500 font-bold mr-2">
                      Q{range.index + 1}:
                    </label>
                  </div>
                  <div className="w-7/8">
                    <input
                      className="appearance-none border-2 border-blue-400 rounded w-full py-1 pl-2 text-gray-700 leading-tight"
                      id="inline-full-name"
                      type="text"
                      value={range.value || ""}
                      readOnly
                    />
                  </div>
                </div>
              ))}
              <div className={Style.rangeContainer}>
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mr-2">
                    Total: {studentGrades.writtenWorks.total || "N/A"}
                  </label>
                </div>
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mr-2">
                    PS: {studentGrades.writtenWorks.PS || "N/A"}
                  </label>
                </div>
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mr-2">
                    WS: {studentGrades.writtenWorks.WS || "N/A"}
                  </label>
                </div>
              </div>

              {/* PERFORMANCE TASKS */}
              <div className={Style.rangeContainer}>
                <div className="w-full">
                  <h1 className="text-lg font-bold">Performance Tasks</h1>
                </div>
              </div>
              {studentGrades.performanceTasks.range.map((range, index) => (
                <div className={Style.rangeContainer} key={index}>
                  <div className="w-1/8 text-right">
                    <label className="block text-gray-500 font-bold mr-2">
                      Q{range.index + 1}:
                    </label>
                  </div>
                  <div className="w-7/8">
                    <input
                      className="appearance-none border-2 border-blue-400 rounded w-full py-1 pl-2 text-gray-700 leading-tight"
                      id="inline-full-name"
                      type="text"
                      value={range.value || ""}
                      readOnly
                    />
                  </div>
                </div>
              ))}
              <div className={Style.rangeContainer}>
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mr-2">
                    Total: {studentGrades.performanceTasks.total || "N/A"}
                  </label>
                </div>
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mr-2">
                    PS: {studentGrades.performanceTasks.PS || "N/A"}
                  </label>
                </div>
                <div className="w-full">
                  <label className="block text-gray-500 font-bold mr-2">
                    WS: {studentGrades.performanceTasks.WS || "N/A"}
                  </label>
                </div>
              </div>

              {/* Quarterly Assessment */}
              <div>
                <h1 className="text-lg font-bold">Quarterly Assessment</h1>
                <div className={Style.rangeContainer}>
                  <div className="w-1/4">
                    <label className="block text-gray-500 font-bold">
                      Exam:
                    </label>
                  </div>
                  <div className="w-3/4">
                    <input
                      className="appearance-none border-2 border-blue-400 rounded w-full py-1 pl-2 text-gray-700 leading-tight"
                      id="inline-full-name"
                      type="text"
                      value={studentGrades.quarterlyAssessment.exam || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className={Style.rangeContainer}>
                  <div className="w-full">
                    <label className="block text-gray-500 font-bold mr-2">
                      PS: {studentGrades.quarterlyAssessment.PS || "N/A"}
                    </label>
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-500 font-bold mr-2">
                      WS: {studentGrades.quarterlyAssessment.WS || "N/A"}
                    </label>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="md:flex  md:items-center">
                <div className="md:w-2/3">
                  <button
                    className="shadow bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Style = {
  rangeContainer: "flex  items-center mb-2",
};
