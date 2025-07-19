export interface Grades {
  fullName: string;
  writtenWorks: {
    range: { value: string; index: number }[];
    total: string;
    PS: string;
    WS: string;
  };
  performanceTasks: {
    range: { value: string; index: number }[];
    total: string;
    PS: string;
    WS: string;
  };
  quarterlyAssessment: {
    exam: string;
    PS: string;
    WS: string;
  };
  initialGrade: string;
  quarterlyGrade: string;
}
