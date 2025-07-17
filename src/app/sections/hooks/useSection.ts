"use client";

import * as React from "react";

import { fetchStudentsBySection } from "@/app/students/api/action";
import { fetchStudentGrades } from "@/app/grades/api/action";
import { Student } from "@/app/interface/Student";

export const useSection = (section: string) => {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [studentGrades, setStudentGrades] = React.useState<any[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);

  const refetchSections = React.useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchStudentsBySection(section);
      setStudents(data);
    } catch (error) {
      console.error("Error refetching sections:", error);
      return [];
    } finally {
      setIsFetching(false);
    }
  }, [section]);

  React.useEffect(() => {
    refetchSections();
  }, [refetchSections, section]);

  const refetchStudentGrades = React.useCallback(async (student: Student) => {
    console.log("Student clicked:", student);
    setIsFetching(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await fetchStudentGrades(student);
      setStudentGrades(data);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      return [];
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    students,
    studentGrades,
    isFetching,
    refetchSections,
    refetchStudentGrades,
  };
};
