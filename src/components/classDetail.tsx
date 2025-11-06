"use client";

import { useState } from "react";
import type { Class, Student } from "../types/index";
// import { ArrowLeft, Trash2, Plus } from "lucide-react";
import StudentForm from "./studentForm";
// import StudentTable from "./student-table";

interface ClassDetailProps {
  classItem: Class;
  onUpdate: (updatedClass: Class) => void;
  onDelete: (classId: string) => void;
  onBack: () => void;
}

export default function ClassDetail({
  classItem,
  onUpdate,
  onDelete,
  onBack,
}: ClassDetailProps) {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    };
    onUpdate({
      ...classItem,
      students: [...classItem.students, newStudent],
    });
    setShowStudentForm(false);
  };

  const handleUpdateStudent = (studentData: Omit<Student, "id">) => {
    if (editingStudent) {
      onUpdate({
        ...classItem,
        students: classItem.students.map((s) =>
          s.id === editingStudent.id ? { ...s, ...studentData } : s
        ),
      });
      setEditingStudent(null);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    onUpdate({
      ...classItem,
      students: classItem.students.filter((s) => s.id !== studentId),
    });
  };

  const handleDeleteClass = () => {
    if (window.confirm("Tem certeza que deseja deletar esta turma?")) {
      onDelete(classItem.id);
      onBack();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            arrrow left
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {classItem.name}
            </h1>
            <p className="text-muted-foreground">
              {classItem.grade} • Prof. {classItem.teacher} • {classItem.period}
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteClass}
          className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors text-destructive"
        >
          trash
        </button>
      </div>

      {showStudentForm || editingStudent ? (
        <StudentForm
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={() => {
            setShowStudentForm(false);
            setEditingStudent(null);
          }}
          initialData={editingStudent || undefined}
        />
      ) : (
        <div>
          <button
            onClick={() => setShowStudentForm(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-6"
          >
            + Adicionar Aluno
          </button>

          {/* <StudentTable
            students={classItem.students}
            onEdit={(student) => setEditingStudent(student)}
            onDelete={handleDeleteStudent}
            onUpdateGrade={(studentId, grade) => {
              onUpdate({
                ...classItem,
                students: classItem.students.map((s) =>
                  s.id === studentId
                    ? {
                        ...s,
                        grades: [...(s.grades || []), grade],
                      }
                    : s
                ),
              });
            }}
            onUpdateAttendance={(studentId, attendance) => {
              onUpdate({
                ...classItem,
                students: classItem.students.map((s) =>
                  s.id === studentId
                    ? {
                        ...s,
                        attendance: [...(s.attendance || []), attendance],
                      }
                    : s
                ),
              });
            }}
          /> */}
        </div>
      )}
    </div>
  );
}
