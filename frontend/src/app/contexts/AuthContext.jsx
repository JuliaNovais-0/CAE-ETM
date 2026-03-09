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

      console.log("%c=== LOGIN DE USUÁRIO ===", "color: #22c55e; font-weight: bold; font-size: 14px");
      console.log("%cUsuário: %c" + login, "color: #94a3b8", "color: #fff; font-weight: bold");
      console.log("%cToken JWT (senha criptografada no servidor):", "color: #94a3b8");
      console.log("%c" + data.token, "color: #60a5fa; font-size: 11px; word-break: break-all");
      console.log("%c========================", "color: #22c55e; font-weight: bold");

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
      const data = await registerRequest({ login, password });

      console.log("%c=== CADASTRO DE USUÁRIO ===", "color: #a855f7; font-weight: bold; font-size: 14px");
      console.log("%cUsuário: %c" + login, "color: #94a3b8", "color: #fff; font-weight: bold");
      console.log("%cSenha criptografada (BCrypt):", "color: #94a3b8");
      console.log("%c" + data.encryptedPassword, "color: #f59e0b; font-size: 11px");
      console.log("%c===========================", "color: #a855f7; font-weight: bold");

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
