import { useEffect, useState } from "react";
import type { Class, Student } from "../types/index";
// import { ArrowLeft, Trash2, Plus } from "lucide-react";
import StudentForm from "./studentForm";
// import StudentTable from "./student-table";
import { useAuth } from "../context/authContext";
import { api } from "../services/api";

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
  const { user } = useAuth();
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get(`classes/by_user/${user?.id}`);
        setClasses(response.data); // assume que a API retorna um array de classes
      } catch (error: any) {
        console.error(error.response?.data || error.message);
        alert("Falha ao buscar turmas.");
      }
    };
    fetchClasses();
  }, [user?.id]);

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

  const handleDeleteStudent = async (classId: string) => {
    try {
      await api.delete(`classes/${classId}`);
      alert("Usuário excluido com sucesso");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert("Falha ao deletar aluno.");
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta turma?")) {
      onDelete(classId);
      handleDeleteStudent(classId);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Minhas Turmas</h1>
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          className="flex items-center justify-between mb-6 p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack} // ou uma função para abrir os detalhes da turma
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Voltar
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {classItem.name}
              </h1>
              <p className="text-muted-foreground">
                {classItem.grade} Prof. {classItem.teacher}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDeleteClass(classItem.id)}
            className="text-red-600 font-semibold hover:text-red-700 transition"
          >
            Excluir
          </button>
        </div>
      ))}

      {showStudentForm || editingStudent ? (
        <StudentForm
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={() => {
            setShowStudentForm(false);
            setEditingStudent(null);
          }}
          initialData={editingStudent || undefined}
        />
      ) : null}
    </div>
  );
}
