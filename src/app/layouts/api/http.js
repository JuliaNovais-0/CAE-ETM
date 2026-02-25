// Importa o cliente HTTP e o utilitário para exibir toasts de erro
import axios from "axios";
import { toastError } from "../../../shared/lib/toast";

// Base URL da API.
// - Em desenvolvimento usamos base relativa para permitir que o proxy do Vite
//   encaminhe as requisições (evita CORS).
// - Em produção usa a variável VITE_API_BASE_URL ou fallback para localhost.
let baseURL;
if (import.meta.env.DEV) {
  baseURL = ""; // requisições vão para o mesmo host (vite dev server) e serão proxyadas
} else {
  baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
}

// Cria uma instância do axios com configuração padrão
// - `baseURL`: prefixo para todas as requisições
// - `timeout`: tempo máximo (ms) antes da requisição falhar
export const http = axios.create({
  baseURL,
  timeout: 15000,
});

// Interceptor de requisição: executado antes de cada chamada
// - Insere o `Authorization` se existir token no localStorage
// - Garante `Content-Type: application/json`
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // quando houver auth
    if (token) config.headers.Authorization = `Bearer ${token}`;

    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: trata erros de forma centralizada
http.interceptors.response.use(
  // Passa respostas bem-sucedidas adiante sem alteração
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Sem resposta (network/CORS/offline)
    if (!error.response) {
      toastError("Sem conexão com o servidor. Verifique sua internet/API.");
      return Promise.reject(error);
    }

    // Erro de autenticação (ex.: token expirado)
    if (status === 401) {
      toastError("Sessão expirada. Faça login novamente.");
      // Possível ação futura: limpar token e redirecionar para /login
      // localStorage.removeItem("token");
      // window.location.href = "/login";
      return Promise.reject(error);
    }

    // Erro no servidor
    if (status >= 500) {
      toastError("Erro no servidor. Tente novamente em instantes.");
      return Promise.reject(error);
    }

    // Erros de cliente (400/404/409/etc): tenta extrair mensagem enviada pelo backend
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Algo deu errado. Verifique os dados e tente novamente.";

    toastError(message);
    return Promise.reject(error);
  }
);