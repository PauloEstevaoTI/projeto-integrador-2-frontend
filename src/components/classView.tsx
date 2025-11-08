import type { Class } from "../types/index";
import type React from "react";
import { useState } from "react";
import { api } from "../services/api";

interface ClassesViewProps {
  classes: Class[];
  onSelectClass: (classItem: Class) => void;
  onCreateClass: (classData: Omit<Class, "id" | "students">) => void;
}

export default function ClassesView({
  classes,
  onSelectClass,
  onCreateClass,
}: ClassesViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    teacher: "",
    period: "Matutino",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.grade || !formData.teacher) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const response = await api.post("/classes", formData);

      // se chegou aqui -> deu certo
      onCreateClass(response.data);

      alert("Turma criada com sucesso!");

      setFormData({ name: "", grade: "", teacher: "", period: "Matutino" });
      setShowForm(false);
    } catch (error) {
      alert("Erro ao criar turma. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Turmas</h1>
        <p className="text-muted-foreground">Gerenciar turmas cadastradas</p>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Nova Turma</h2>
            <button
              onClick={() => setShowForm(false)}
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
                  Nome da Turma
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Turma A"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Série/Ano
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  placeholder="ex: 7º Ano"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Professor(a)
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                  placeholder="Nome do professor"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Período
                </label>
                <select
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Matutino</option>
                  <option>Vespertino</option>
                  <option>Noturno</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Criar Turma
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {classes.length > 0 ? (
        <div className="space-y-4">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className=" bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
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
              Nova Turma
            </button>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Nome da Turma
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Série
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Professor
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Período
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Alunos
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr
                    key={classItem.id}
                    className="border-b border-border hover:bg-secondary transition-colors"
                  >
                    <td className="py-4 px-4 text-foreground font-medium">
                      {classItem.name}
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {classItem.grade}
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {classItem.teacher}
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {classItem.period}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-2 text-primary font-semibold">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        {classItem.students.length}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onSelectClass(classItem)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : !showForm ? (
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
            Nenhuma turma criada
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece criando uma nova turma usando o botão abaixo
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
            Criar Turma
          </button>
        </div>
      ) : null}
    </div>
  );
}
