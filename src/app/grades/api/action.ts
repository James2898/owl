"use server";

import { Student } from "@/app/interface/Student";
import { GOOGLE_SHEETS_ID } from "@/lib/google-sheets";
import axios from "axios";

import { Grades } from "@/app/interface/Grades";

const gradeColumns = {
  writtenWorks: {
    range: "E, F, G, H, I, J, K, L, M, N",
    total: "O",
    PS: "P",
    WS: "Q",
  },
  performanceTasks: {
    range: "R, S, T, U, V, W, X, Y, Z, AA",
    total: "AB",
    PS: "AC",
    WS: "AD",
  },
  quarterlyAssessment: {
    exam: "AE",
    PS: "AF",
    WS: "AG",
  },
  initialGrade: "AH",
  quarterlyGrade: "AI",
};

export const fetchStudentGrades = async (student: Student) => {
  console.log("Fetching grades for student:", student.lastName);
  if (!student) {
    console.warn("No student provided for fetching grades.");
    return [];
  }

  try {
    const fullName = `${student.lastName}, ${student.firstName}${
      student.middleName ? " " + student.middleName[0] + "." : ""
    }`;
    const section = student.section || "Default Section";
    const fullNameCol = "C";

    console.log(fullNameCol, fullName);

    const queryWrittenWorks = `${gradeColumns.writtenWorks.range}, ${gradeColumns.writtenWorks.total}, ${gradeColumns.writtenWorks.PS}, ${gradeColumns.writtenWorks.WS}`;
    const queryPerformanceTasks = `${gradeColumns.performanceTasks.range}, ${gradeColumns.performanceTasks.total}, ${gradeColumns.performanceTasks.PS}, ${gradeColumns.performanceTasks.WS}`;
    const queryQuarterlyAssessment = `${gradeColumns.quarterlyAssessment.exam}, ${gradeColumns.quarterlyAssessment.PS}, ${gradeColumns.quarterlyAssessment.WS}`;
    const query = encodeURIComponent(
      `SELECT ${fullNameCol}, ${queryWrittenWorks}, ${queryPerformanceTasks}, ${queryQuarterlyAssessment} WHERE ${fullNameCol} = "${fullName}"`
    );
    const queryUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json&sheet=${section}s&tq=${query}`;

    console.log(
      "Debug: Query URL:",
      `SELECT ${fullNameCol}, ${gradeColumns.writtenWorks.range}, ${gradeColumns.writtenWorks.total}, P, WHERE ${fullNameCol} = "${fullName}"`
    );

    console.log("Debug: Fetching grades from URL:", queryUrl);

    const response = await axios.get(queryUrl);
    const data = JSON.parse(
      response.data.substring(
        response.data.indexOf("{"),
        response.data.lastIndexOf("}") + 1
      )
    );

    if (
      !data ||
      !data.table ||
      !data.table.rows ||
      data.table.rows.length === 0
    ) {
      alert(`No data found for section "${student.lastName}".`);
      return [];
    }

    console.log("Debug: Fetched data:", data.table.cols[0]);
    console.log("Debug: Fetched data:", data.table.rows[0]);

    const grades: Grades[] = data.table.rows.map((row) => {
      const c = row.c || [];
      const wwRange = c
        .slice(1, 11)
        .map((cell, idx) => {
          return {
            index: idx,
            value: cell?.v || "",
          };
        })
        .filter((cell) => cell.value !== undefined && cell.value !== "");

      const ptRange = c
        .slice(14, 24)
        .map((cell, idx) => {
          return {
            index: idx,
            value: cell?.v || "",
          };
        })
        .filter((cell) => cell.value !== undefined && cell.value !== "");

      console.log("Debug: Processed written works range:", wwRange);
      console.log("Debug: Processed performance tasks range:", ptRange);

      return {
        fullName: c[0]?.v || "",
        writtenWorks: {
          range: wwRange,
          total: c[11]?.v || "",
          PS: c[12]?.v || "",
          WS: c[13]?.v || "",
        },
        performanceTasks: {
          range: ptRange,
          total: c[24]?.v || "",
          PS: c[25]?.v || "",
          WS: c[26]?.v || "",
        },
        quarterlyAssessment: {
          exam: c[27]?.v || "",
          PS: c[28]?.v || "",
          WS: c[29]?.v || "",
        },
      };
    });

    return grades;
  } catch (error) {
    console.error("Error fetching student grades from Google Sheet:", error);
    throw new Error("Failed to fetch student grades.");
  } finally {
    console.log("Finished fetching grades for student:", student.lastName);
  }
};
