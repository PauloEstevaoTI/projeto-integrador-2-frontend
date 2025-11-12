import { Link, useLocation, useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useAuth } from "../../context/authContext";

export function Dashboard() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const active = (path: string) => pathname.includes(path);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen bg-[#f0f0f0] overflow-hidden">
      <main className="grid grid-cols-6 h-full p-5 gap-4">
        <aside className="col-span-1 bg-white rounded-md flex flex-col h-full overflow-hidden">
          {/* título fora do ul */}
          <div className="px-5 py-2 font-bold text-xl">Dashboard</div>

          {/* Informações do usuário */}
          {user && (
            <div className="px-5 py-2 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Olá, <span className="font-bold text-xl">{user.name}</span>
              </p>
            </div>
          )}

          <nav className="px-5 py-4 space-y-1 flex-1 overflow-y-auto">
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

          {/* Botão de Logout */}
          <div className="px-5 py-4 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-md font-semibold text-md bg-red-500 text-white hover:bg-red-600 transition-colors"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair
            </button>
          </div>
        </aside>

        <section className="col-span-5 bg-white rounded-md p-5 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
