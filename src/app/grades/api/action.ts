"use server";

import { Student } from "@/app/interface/Student";
import { GOOGLE_SHEETS_ID } from "@/lib/google-sheets";
import axios from "axios";

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
      `SELECT * WHERE ${fullNameCol} = "${fullName}"`
    );
    const queryUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json&sheet=${section}s&tq=${query}`;

    console.log("Debug: Fetching grades from URL:", queryUrl);

    const response = await axios.get(queryUrl);
    const data = JSON.parse(
      response.data.substring(
        response.data.indexOf("{"),
        response.data.lastIndexOf("}") + 1
      )
    );
    console.log("Debug: Fetched data:", data);
    if (
      !data ||
      !data.table ||
      !data.table.cols ||
      data.table.cols.length === 0
    ) {
      console.log(`No data found for section "${student.lastName}".`);
      return [];
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching student grades from Google Sheet:", error);
    throw new Error("Failed to fetch student grades.");
  } finally {
    console.log("Finished fetching grades for student:", student.lastName);
  }
};
