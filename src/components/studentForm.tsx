import type React from "react";

import { useState } from "react";
import type { Student } from "../types/index";
// import { X } from "lucide-react";

interface StudentFormProps {
  onSubmit: (studentData: Omit<Student, "id">) => void;
  onCancel: () => void;
  initialData?: Student;
}

export default function StudentForm({
  onSubmit,
  onCancel,
  initialData,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    registrationNumber: initialData?.registrationNumber || "",
    email: initialData?.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.registrationNumber) {
      onSubmit({
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        email: formData.email,
        grades: initialData?.grades || [],
        attendance: initialData?.attendance || [],
      });
    }
  };

  return (
    <div className="max-w-2xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {initialData ? "Editar Aluno" : "Novo Aluno"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          x
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nome do aluno"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Matrícula
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              placeholder="Número de matrícula"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email do aluno"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {initialData ? "Atualizar" : "Adicionar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
