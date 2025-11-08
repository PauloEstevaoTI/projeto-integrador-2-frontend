// AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type UserTypeEnum = "admin" | "professor" | "aluno";

export type User = {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  type_user: UserTypeEnum;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void; // adiciona logout
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  function setUser(user: User | null) {
    setUserState(user);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }

  // função de logout
  function logout() {
    setUser(null); // limpa estado e localStorage
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserState(JSON.parse(stored));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa estar dentro do AuthProvider");
  }
  return ctx;
}
