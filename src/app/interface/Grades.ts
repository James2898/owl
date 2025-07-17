interface Range {
  r1: string;
  r2: string;
  r3: string;
  r4: string;
  r5: string;
  r6: string;
  r7: string;
  r8: string;
  r9: string;
  r10: string;
}

export interface Grades {
  fullName: string;
  writtenWorks: {
    range: Range;
    total: string;
    PS: string;
    WS: string;
  };
}
