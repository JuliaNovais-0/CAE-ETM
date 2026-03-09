import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../../app/contexts/AuthContext";

const loginSchema = z.object({
  login: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = z.object({
  login: z.string().min(3, "Mínimo de 3 caracteres"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme a senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      if (isRegister) {
        const ok = await registerUser({
          login: data.login,
          password: data.password,
        });
        if (ok) {
          setIsRegister(false);
          reset();
        }
      } else {
        const ok = await login({
          login: data.login,
          password: data.password,
        });
        if (ok) navigate("/", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setIsRegister((prev) => !prev);
    reset();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-lg dark:shadow-slate-900/50">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-slate-900 dark:bg-slate-800 grid place-items-center">
            <img
              src="/logo.png"
              alt="CAE ETM"
              className="h-8 w-8 object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CAE ETM</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isRegister ? "Crie sua conta" : "Faça login para continuar"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Login field */}
          <div>
            <label
              htmlFor="login"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Usuário
            </label>
            <input
              id="login"
              type="text"
              autoComplete="username"
              {...formRegister("login")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500
                dark:bg-slate-800 dark:text-white dark:border-slate-700
                ${errors.login ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              placeholder="Digite seu usuário"
            />
            {errors.login && (
              <p className="mt-1 text-xs text-red-500">
                {errors.login.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              {...formRegister("password")}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500
                dark:bg-slate-800 dark:text-white dark:border-slate-700
                ${errors.password ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password (register only) */}
          {isRegister && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...formRegister("confirmPassword")}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                  focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500
                  dark:bg-slate-800 dark:text-white dark:border-slate-700
                  ${errors.confirmPassword ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                placeholder="Confirme sua senha"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white
              transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {submitting
              ? "Carregando..."
              : isRegister
              ? "Cadastrar"
              : "Entrar"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-slate-900 hover:underline dark:text-white"
          >
            {isRegister ? "Fazer login" : "Cadastre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}
