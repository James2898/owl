"use server";

import {
  sheets,
  GOOGLE_SHEETS_ID,
  getGoogleDriveDirectLink,
} from "@/lib/google-sheets";

import { Student } from "@/app/interface/Student";
import { studentColumns } from "@/app/students/columns";
import axios from "axios";

interface GoogleSheetCell {
  v?: string;
  f?: string;
}

interface GoogleSheetRow {
  c?: GoogleSheetCell[];
}

interface GoogleSheetTable {
  rows: GoogleSheetRow[];
}

interface GoogleSheetData {
  table: GoogleSheetTable;
}

export const fetchStudents = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: "Students!A:V",
      majorDimension: "ROWS",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found in the sheet.");
      return [];
    }

    // const header = rows[0] as string[];
    const studentData = rows.slice(1) as string[][];

    const students: Student[] = studentData.map((row) => {
      return {
        no: row[studentColumns.no.no] || "",
        section: row[studentColumns.section.no] || "",
        grade: row[studentColumns.grade.no] || "",
        strand: row[studentColumns.strand.no] || "",
        gender: row[studentColumns.gender.no] || "",
        lrnNo: row[studentColumns.lrnNo.no] || "",
        lastName: row[studentColumns.lastName.no] || "",
        firstName: row[studentColumns.firstName.no] || "",
        middleName: row[studentColumns.middleName.no] || "",
        birthdate: row[studentColumns.birthdate.no] || "",
        age: row[studentColumns.age.no] || "",
        religion: row[studentColumns.religion.no] || "",
        currentAddress: row[studentColumns.currentAddress.no] || "",
        guardianLastName: row[studentColumns.guardianLastName.no] || "",
        guardianFirstName: row[studentColumns.guardianFirstName.no] || "",
        contactNo: row[studentColumns.contactNo.no] || "",
        psa: row[studentColumns.psa.no] || "",
        card: row[studentColumns.card.no] || "",
        form137: row[studentColumns.form137.no] || "",
        previousSchool: row[studentColumns.previousSchool.no] || "",
        previousSchoolNameAdviser:
          row[studentColumns.previousSchoolNameAdviser.no] || "",
        previousSchoolSection:
          row[studentColumns.previousSchoolSection.no] || "",
      };
    });

    return students;
  } catch (error) {
    console.error("Error fetching students from Google Sheet:", error);
    throw new Error("Failed to fetch student data.");
  }
};

export const fetchStudentsBySection = async (section: string) => {
  console.log("Fetching students by section:", section);
  if (!section) {
    console.warn("No section provided for fetching students.");
    return [];
  }

  console.log(`Fetching students for section: ${section}`);
  try {
    const sectionCol = "B";

    const query = encodeURIComponent(
      `SELECT A, B, C, D, E, G, H, I, W WHERE ${sectionCol} = '${section}'`
    );
    const queryUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json&sheet=Students&tq=${query}`;

    console.log("DEBUG: Query URL:", queryUrl);

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
      console.log(`No data found for section "${section}".`);
      return [];
    }

    const students: Student[] = (data as GoogleSheetData).table.rows.map(
      (row: GoogleSheetRow) => {
        const c: GoogleSheetCell[] = row.c || [];
        const imageURL = c[8]?.v || "";
        const directURL = getGoogleDriveDirectLink(imageURL);
        return {
          no: c[0]?.v || "",
          section: c[1]?.v || "",
          grade: c[2]?.v || "",
          strand: c[3]?.v || "",
          gender: c[4]?.v || "",
          lastName: c[5]?.v || "",
          firstName: c[6]?.v || "",
          middleName: c[7]?.v || "",
          imageUrl: directURL || "", // Assuming image URL is at index 8
        };
      }
    );

    console.log(
      `Fetched ${students.length} students for section "${section}".`
    );
    console.log("Students data:", students);

    return students;
  } catch (error) {
    console.error("Error fetching students by section:", error);
    throw new Error("Failed to fetch students by section.");
  }
};
