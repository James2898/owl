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
  performanceTasks: "R, S, T, U, V, W, X, Y, Z, AA, AB, AC, AD",
  quarterlyAssessment: "AE, AF, AG",
  initialGrade: "AH",
  finalGrade: "AI",
};

export const fetchStudentGrades = async (student: Student) => {
  console.log("Fetching grades for student:", student.lastName);
  if (!student) {
    console.warn("No student provided for fetching grades.");
    return [];
  }

  try {
    const fullName = `${student.lastName}, ${student.firstName} ${
      student.middleName ? student.middleName[0] + "." : ""
    }`;
    const section = student.section || "Default Section";
    const fullNameCol = "C";

    console.log(fullNameCol, fullName);
    const query = encodeURIComponent(
      `SELECT ${fullNameCol}, ${gradeColumns.writtenWorks.range}, ${gradeColumns.writtenWorks.total} WHERE ${fullNameCol} = "${fullName}"`
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
      console.log(`No data found for section "${student.lastName}".`);
      return [];
    }

    console.log("Debug: Fetched data:", data.table.cols[0]);
    console.log("Debug: Fetched data:", data.table.rows[0]);

    const grades: Grades[] = data.table.rows.map((row) => {
      const c = row.c || [];

      return {
        fullName: c[0]?.v || "",
        writtenWorks: {
          range: {
            r1: c[1]?.v || "",
            r2: c[2]?.v || "",
            r3: c[3]?.v || "",
            r4: c[4]?.v || "",
            r5: c[5]?.v || "",
            r6: c[6]?.v || "",
            r7: c[7]?.v || "",
            r8: c[8]?.v || "",
            r9: c[9]?.v || "",
            r10: c[10]?.v || "",
          },
          total: c[11]?.v || "",
          PS: c[12]?.v || "",
          WS: c[13]?.v || "",
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
