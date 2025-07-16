"use client";

import * as React from "react";

import { fetchStudentsBySection } from "@/app/students/api/action";
import { Student } from "@/app/interface/Student";

export const useSection = (section: string) => {
  const [students, setStudents] = React.useState<Student[]>([]);
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

  return {
    students,
    isFetching,
    refetchSections,
  };
};
