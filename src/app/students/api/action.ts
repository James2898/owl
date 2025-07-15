"use server";

import { sheets, GOOGLE_SHEETS_ID } from "@/lib/google-sheets";

import { Student } from "@/app/interface/Student";
import { studentColumns } from "@/app/students/columns";

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
