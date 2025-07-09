"use client";

import * as React from "react";

import { fetchStudents } from "@/app/students/api/action";
import { Student } from "@/app/interface/Student";

export const useStudent = () => {
  const [students, setStudents] = React.useState<Student[]>([]);

  const fetch = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  };

  return {
    students,
    fetch,
  };
};
