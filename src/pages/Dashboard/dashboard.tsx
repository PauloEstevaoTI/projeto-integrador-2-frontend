import { Link, useLocation } from "react-router";
import { Outlet } from "react-router";

export function Dashboard() {
  const { pathname } = useLocation();
  const active = (path: string) => pathname.includes(path);

  return (
    <div className="h-screen bg-[#f0f0f0]">
      <main className="grid grid-cols-6 h-full p-5 gap-4">
        <aside className="col-span-1 bg-white rounded-md">
          {/* título fora do ul */}
          <div className="px-5 py-2 font-bold text-xl">Dashboard</div>
          <nav className="px-5 py-4 space-y-1">
            <Link
              to="pontos"
              className={`block p-2 rounded-md font-semibold text-md cursor-pointer ${
                active("/dashboard/pontos")
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-[#f0f0f0] hover:text-blue-500"
              }`}
            >
              Pontos
            </Link>

            <Link
              to="turmas"
              className={`block p-2 rounded-md font-semibold text-md cursor-pointer ${
                active("/dashboard/turmas")
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-[#f0f0f0] hover:text-blue-500"
              }`}
            >
              Turmas
            </Link>

            <Link
              to="alunos"
              className={`block p-2 rounded-md font-semibold text-md cursor-pointer ${
                active("/dashboard/alunos")
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-[#f0f0f0] hover:text-blue-500"
              }`}
            >
              Alunos
            </Link>

            <Link
              to="relatorios"
              className={`block p-2 rounded-md font-semibold text-md cursor-pointer ${
                active("/dashboard/relatorios")
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-[#f0f0f0] hover:text-blue-500"
              }`}
            >
              Relatórios
            </Link>

            <Link
              to="configuracoes"
              className={`block p-2 rounded-md font-semibold text-md cursor-pointer ${
                active("/dashboard/configuracoes")
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-[#f0f0f0] hover:text-blue-500"
              }`}
            >
              Configurações
            </Link>
          </nav>
        </aside>

        <section className="col-span-5 bg-white rounded-md">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
