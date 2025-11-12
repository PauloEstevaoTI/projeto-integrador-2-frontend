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
  students: Student[];
  students_count?: number;
}

export interface GradeStudent {
  value: number;
  description: string;
  id: string;
  student_id: string;
  date: string;
}

export interface AttendaceStudent {
  date: string;
  status: boolean;
  id: string;
  student_id: string;
}
