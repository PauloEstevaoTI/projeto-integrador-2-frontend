import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { api } from "../../services/api";
import {
  type GradeStudent,
  type Class,
  type Student,
  type AttendaceStudent,
} from "../../types";

export function Alunos() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [gradeStudent, setGradeStudent] = useState<GradeStudent[]>([]);
  const [attendanceStudent, setAttendanceStudent] = useState<
    AttendaceStudent[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Estados para modais de notas e faltas
  const [showGradesModal, setShowGradesModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [gradeForm, setGradeForm] = useState({
    subject: "",
    value: "",
  });
  const [attendanceForm, setAttendanceForm] = useState({
    date: "",
    present: true,
  });

  // Buscar turmas do usuário logado
  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await api.get(`classes/by_user/${user?.id}`);
        setClasses(response.data); // assume que a API retorna um array de classes
      } catch (error: any) {
        console.error(error.response?.data || error.message);
        alert("Falha ao buscar turmas.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [user?.id]);

  // const fetchClasses = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.get(`/classes/by_user/${user?.id}`);
  //     setClasses(response.data);
  //   } catch (error: any) {
  //     console.error("Erro ao buscar turmas:", error);
  //     alert(error.response?.data?.message || "Falha ao buscar turmas.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchGradesStudent = async (student_id: string) => {
    try {
      const response = await api.get(`/grades/`, {
        params: { student_id },
      });
      setGradeStudent(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar notas", error);
      alert(error.response?.data?.message || "Falha ao buscar notas.");
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/students/?class_id=${classId}`);
      setStudents(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar alunos:", error);
      alert(error.response?.data?.message || "Falha ao buscar alunos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = (classId: string) => {
    const classData = classes.find((c) => c.id === classId);
    setSelectedClass(classData || null);
    fetchStudents(classId);
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setStudents([]);
    setShowForm(false);
    setEditingStudent(null);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !selectedClass) {
      alert("O nome é obrigatório!");
      return;
    }

    try {
      if (editingStudent) {
        // Editar aluno existente
        await api.put(`/students/${editingStudent.id}`, formData);
        alert("Aluno atualizado com sucesso!");
      } else {
        // Adicionar novo aluno

        await api.post(`/students?class_id=${selectedClass.id}`, formData);
        alert("Aluno adicionado com sucesso!");
      }

      // Recarregar lista
      fetchStudents(selectedClass.id);
      resetForm();
    } catch (error: any) {
      console.error("Erro ao salvar aluno:", error);
      alert(error.response?.data?.message || "Falha ao salvar aluno.");
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
    });
    setShowForm(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) {
      return;
    }

    if (!selectedClass) return;

    try {
      await api.delete(`/students/${studentId}`);
      alert("Aluno excluído com sucesso!");
      fetchStudents(selectedClass.id);
    } catch (error: any) {
      console.error("Erro ao excluir aluno:", error);
      alert(error.response?.data?.message || "Falha ao excluir aluno.");
    }
  };

  // Funções para gerenciar notas
  const handleOpenGrades = (student: Student) => {
    setSelectedStudent(student);
    setShowGradesModal(true);
    fetchGradesStudent(student.id);
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await api.post(`/grades/`, {
        description: gradeForm.subject,
        value: parseFloat(gradeForm.value),
        student_id: selectedStudent.id,
      });
      alert("Nota adicionada com sucesso!");
      setGradeForm({ subject: "", value: "" });
      if (selectedClass) fetchStudents(selectedClass.id);
    } catch (error: any) {
      console.error("Erro ao adicionar nota:", error);
      alert(error.response?.data?.message || "Falha ao adicionar nota.");
    }

    fetchGradesStudent(selectedStudent.id);
  };

  // Funções para gerenciar faltas
  const handleOpenAttendance = (student: Student) => {
    setSelectedStudent(student);
    setShowAttendanceModal(true);
    fetchAttendanceStudent(student.id);
  };

  const fetchAttendanceStudent = async (studentId: string) => {
    try {
      const response = await api.get(`attendances/?student_id=${studentId}`);
      setAttendanceStudent(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar faltas do aluno:", error);
      alert(
        error.response?.data?.message || "Falha ao buscar faltas do aluno."
      );
    }
  };

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await api.post(`/attendances`, {
        date: attendanceForm.date,
        student_id: selectedStudent.id,
        status: attendanceForm.present,
      });
      alert("Nota registrada com sucesso!");
      setAttendanceForm({ date: "", present: true });
      // if (selectedClass) fetchStudents(selectedStudent.id);
    } catch (error: any) {
      console.error("Erro ao registrar presença:", error);
      alert(error.response?.data?.message || "Falha ao registrar presença.");
    }
    fetchAttendanceStudent(selectedStudent.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  // Visualização de lista de turmas
  if (!selectedClass) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gerenciar Alunos
          </h1>
          <p className="text-muted-foreground">
            Selecione uma turma para gerenciar seus alunos
          </p>
        </div>

        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectClass(classItem?.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {classItem.grade}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground">
                    <svg
                      className="w-4 h-4 mr-2 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Professor: {classItem.teacher}
                  </div>
                  <div className="flex items-center text-primary font-semibold">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {classItem.students_count} alunos
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Gerenciar Alunos
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <svg
              className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.38V4.804z" />
              <path d="M11 15.113v-9.3A3.987 3.987 0 0115.5 9c1.25 0 2.443.29 3.5.804v10A7.968 7.968 0 0015.5 14c-1.669 0-3.218.51-4.5 1.38z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-muted-foreground">
              Você precisa criar turmas primeiro para gerenciar alunos
            </p>
          </div>
        )}
      </div>
    );
  }

  // Visualização de gerenciamento de alunos da turma selecionada
  return (
    <div>
      <div className="mb-8">
        <button
          onClick={handleBackToClasses}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para turmas
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Alunos - {selectedClass.name}
        </h1>
        <p className="text-muted-foreground">
          {selectedClass.grade} • Professor: {selectedClass.teacher}
        </p>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {editingStudent ? "Editar Aluno" : "Novo Aluno"}
            </h2>
            <button
              onClick={resetForm}
              className="w-6 h-6 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors text-foreground"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome completo do aluno"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Matrícula
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                  placeholder="Número de matrícula"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div> */}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {editingStudent ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {students.length > 0 ? (
        <div className="space-y-4">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Novo Aluno
            </button>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Nome
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">
                    Notas
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">
                    Faltas
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border hover:bg-secondary transition-colors"
                  >
                    <td className="py-4 px-4 text-foreground font-medium">
                      {student.name}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleOpenGrades(student)}
                        className="bg-purple-500 text-white px-3 py-1.5 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium inline-flex items-center gap-1"
                        title="Gerenciar Notas"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Notas
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleOpenAttendance(student)}
                        className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium inline-flex items-center gap-1"
                        title="Gerenciar Faltas"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Faltas
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          title="Excluir"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Total de alunos: {students.length}
          </div>
        </div>
      ) : !showForm ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <svg
            className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum aluno cadastrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece adicionando um novo aluno usando o botão abaixo
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Adicionar Aluno
          </button>
        </div>
      ) : null}

      {/* Modal de Notas */}
      {showGradesModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Notas - {selectedStudent.name}
              </h2>
              <button
                onClick={() => {
                  setShowGradesModal(false);
                  setSelectedStudent(null);
                  setGradeForm({ subject: "", value: "" });
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors text-foreground"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Formulário para adicionar nota */}
            <form
              onSubmit={handleAddGrade}
              className="mb-6 p-4 bg-gray-100 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adicionar Nova Nota
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Matéria *
                  </label>
                  <input
                    type="text"
                    value={gradeForm.subject}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, subject: e.target.value })
                    }
                    placeholder="Ex: Matemática"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nota *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={gradeForm.value}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, value: e.target.value })
                    }
                    placeholder="0.0"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={gradeForm.date}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, date: e.target.value })
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div> */}
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                Adicionar Nota
              </button>
            </form>

            {/* Lista de notas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Histórico de Notas
              </h3>
              {gradeStudent && gradeStudent.length > 0 ? (
                <div className="space-y-2">
                  {gradeStudent.map((grade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {grade.description}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {grade.value.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma nota registrada ainda
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Faltas */}
      {showAttendanceModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Presença - {selectedStudent.name}
              </h2>
              <button
                onClick={() => {
                  setShowAttendanceModal(false);
                  setSelectedStudent(null);
                  setAttendanceForm({ date: "", present: true });
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors text-foreground"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Formulário para registrar presença */}
            <form
              onSubmit={handleAddAttendance}
              className="mb-6 p-4 bg-gray-100 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Registrar Presença
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Status *
                  </label>
                  <select
                    value={attendanceForm.present ? "true" : "false"}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        present: e.target.value === "true",
                      })
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Presente</option>
                    <option value="false">Ausente</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Registrar Presença
              </button>
            </form>

            {/* Lista de presenças */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Histórico de Presença
              </h3>
              {attendanceStudent && attendanceStudent.length > 0 ? (
                <div className="space-y-2">
                  {attendanceStudent.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                    >
                      <p className="text-gray-900">
                        {new Date(record.date).toLocaleDateString("pt-BR")}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status ? "Presente" : "Ausente"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum registro de presença ainda
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
