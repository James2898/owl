"use client";

import * as React from "react";

import { fetchStudentsBySection } from "@/app/students/api/action";
import { fetchStudentGrades } from "@/app/grades/api/action";
import { Student } from "@/app/interface/Student";
import { Grades } from "@/app/interface/Grades";

export const useSection = (section: string) => {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [studentGrades, setStudentGrades] = React.useState<Grades[]>([]);
  const [isSectionFetching, setIsSectionFetching] = React.useState(false);
  const [isStudentGradeFetching, setIsStudentGradeFetching] =
    React.useState(false);

  const refetchSections = React.useCallback(async () => {
    setIsSectionFetching(true);
    try {
      const data = await fetchStudentsBySection(section);
      setStudents(data);
    } catch (error) {
      console.error("Error refetching sections:", error);
      return [];
    } finally {
      setIsSectionFetching(false);
    }
  }, [section]);

  React.useEffect(() => {
    refetchSections();
  }, [refetchSections, section]);

  const refetchStudentGrades = React.useCallback(async (student: Student) => {
    console.log("Student clicked:", student);
    setIsStudentGradeFetching(true);
    try {
      const data: Grades[] = await fetchStudentGrades(student);
      setStudentGrades(data);
    } catch (error) {
      console.error("Error fetching student grades:", error);
      return [];
    } finally {
      setIsStudentGradeFetching(false);
    }
  }, []);

  return {
    students,
    studentGrades,
    isSectionFetching,
    isStudentGradeFetching,
    refetchSections,
    refetchStudentGrades,
  };
};
