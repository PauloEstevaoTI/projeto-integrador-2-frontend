import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "../../services/api";
import { useAuth } from "../../context/authContext";

type FormData = {
  email: string;
  password: string;
};

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", data.email);
      formData.append("password", data.password);

      const response = await api.post("/auth/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = response.data.access_token;

      localStorage.setItem("token", token);

      const meResponse = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(meResponse.data);

      navigate("/dashboard");
    } catch (error: any) {
      alert(error?.response?.data?.detail || "Erro ao fazer o login");
    } finally {
      setIsLoading(false);
    }
  }

  function goToRegister() {
    navigate("/register");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="w-[312px] flex flex-col justify-center items-center gap-4 h-full">
        <h1 className="text-2xl uppercase font-bold text-center">Login</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-4 w-full items-center flex flex-col"
        >
          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <input
                  className="h-full w-full py-3 pl-2 rounded-lg"
                  type="email"
                  placeholder="E-mail"
                  autoComplete="email"
                  {...field}
                />
              )}
            />
          </div>

          <div className="w-full h-[52px] border-2 border-[#d6d3d1] rounded-lg">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input
                  className="h-full w-full py-3 pl-2 rounded-lg"
                  type="password"
                  placeholder="Senha"
                  autoComplete="current-password"
                  {...field}
                />
              )}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button type="button" onClick={goToRegister}>
          Não tem uma conta? Cadastre-se
        </button>
      </div>
    </div>
  );
}
