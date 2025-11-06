export interface Grade {
  subject: string;
  value: number;
  date: string;
}

export interface Attendance {
  date: string;
  present: boolean;
}

export interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  grades?: Grade[];
  attendance?: Attendance[];
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  period: string;
  students: Student[];
}
