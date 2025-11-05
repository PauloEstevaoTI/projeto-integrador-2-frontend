import { Routes, Route } from "react-router";
import { Login } from "../pages/Auth/login";
import { Register } from "../pages/Auth/register";
import { NotFound } from "../pages/notFound";
import { Dashboard } from "../pages/Dashboard/dashboard";
import { Pontos } from "../pages/Dashboard/pontos";
import { Turmas } from "../pages/Dashboard/turmas";
import { Alunos } from "../pages/Dashboard/alunos";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" index element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="pontos" element={<Pontos />} />
        <Route path="turmas" element={<Turmas />} />
        <Route path="alunos" element={<Alunos />} />
        {/* <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
