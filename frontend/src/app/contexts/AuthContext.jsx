import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest } from "../../features/auth/services/authApi";
import { toastSuccess, toastError } from "../../shared/lib/toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao iniciar, restaura sessão do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  async function login({ login, password }) {
    try {
      const data = await loginRequest({ login, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", login);
      setUser(login);
      toastSuccess("Login realizado com sucesso!");
      return true;
    } catch (err) {
      const msg =
        err.response?.status === 403
          ? "Credenciais inválidas"
          : "Erro ao fazer login";
      toastError(msg);
      return false;
    }
  }

  async function register({ login, password }) {
    try {
      await registerRequest({ login, password });
      toastSuccess("Cadastro realizado! Faça login.");
      return true;
    } catch (err) {
      const msg =
        err.response?.status === 400
          ? "Usuário já existe"
          : "Erro ao cadastrar";
      toastError(msg);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
