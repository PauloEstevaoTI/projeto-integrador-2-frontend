import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { api } from "../../services/api";

type FormData = {
  name: string;
  email: string;
  password: string;
  registration_number: string;
  type_user: "professor" | "diretor" | "funcionario";
};

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      registration_number: "",
      type_user: "funcionario",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);
      console.log(data);
      await api.post("/users", data);
      alert("Usuário cadastrado com sucesso!");
      navigate("/"); // redireciona para login
    } catch (error: any) {
      alert(error?.response?.data?.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 500);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      {/* Overlay Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-[312px] h-[400px] flex flex-col justify-center items-center gap-4 m-auto">
        <h1 className="text-2xl uppercase font-bold">Cadastro</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full items-center"
        >
          {/* Nome */}
          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg outline-none">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => (
                <input
                  className="h-full w-full py-3 px-2 placeholder-gray-500 text-gray-500 rounded-lg"
                  type="text"
                  placeholder="Nome"
                  {...field}
                />
              )}
            />
          </div>
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

          {/* E-mail */}
          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg outline-none">
            <Controller
              control={control}
              name="email"
              rules={{ required: "E-mail é obrigatório" }}
              render={({ field }) => (
                <input
                  className="h-full w-full py-3 px-2 placeholder-gray-500 text-gray-500 rounded-lg"
                  type="email"
                  placeholder="E-mail"
                  autoComplete="email"
                  {...field}
                />
              )}
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}

          {/* Senha */}
          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg outline-none">
            <Controller
              control={control}
              name="password"
              rules={{ required: "Senha é obrigatória" }}
              render={({ field }) => (
                <input
                  className="h-full w-full py-3 px-2 placeholder-gray-500 text-gray-500 rounded-lg"
                  type="password"
                  placeholder="Senha"
                  {...field}
                />
              )}
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          {/* Matrícula */}
          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg outline-none">
            <Controller
              control={control}
              name="registration_number"
              rules={{ required: "Matrícula é obrigatória" }}
              render={({ field }) => (
                <input
                  className="h-full w-full py-3 px-2 placeholder-gray-500 text-gray-500 rounded-lg"
                  type="text"
                  placeholder="Matrícula"
                  {...field}
                />
              )}
            />
          </div>
          {errors.registration_number && (
            <span className="text-red-500 text-sm">
              {errors.registration_number.message}
            </span>
          )}

          {/* Role */}
          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg flex justify-center items-center relative">
            <Controller
              control={control}
              name="type_user"
              render={({ field }) => (
                <select
                  {...field}
                  className="px-2 w-full h-full appearance-none placeholder-gray-500 text-gray-500 rounded-lg"
                >
                  <option value="funcionario">Funcionário</option>
                  <option value="diretor">Diretor</option>
                  <option value="professor">Professor</option>
                </select>
              )}
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.97l3.71-3.74a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.25a.75.75 0 01.02-1.04z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Cadastrar
          </button>
        </form>

        <button type="button" onClick={goToLogin}>
          Já tem uma conta? Faça login
        </button>
      </div>
    </div>
  );
}
