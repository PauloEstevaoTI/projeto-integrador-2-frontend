import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { api } from "../../services/api";
import type { Class, Student } from "../../types";

export function Alunos() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
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

  const fetchStudents = async (classId: string) => {
    console.log("AQUIIII!");
    console.log(classId);
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
                  {/* <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Matrícula
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Email
                  </th> */}
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
    </div>
  );
}
