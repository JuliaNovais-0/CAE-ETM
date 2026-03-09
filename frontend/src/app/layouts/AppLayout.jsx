import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠", end: false },
  { to: "/tasks", label: "Tasks", icon: "✅", end: false },
];

function getInitials(name = "U") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full p-2.5 text-slate-500 transition
        hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
}

/** Navbar com indicador animado */
function SidebarNav() {
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const path = location.pathname;
    const idx = NAV_ITEMS.findIndex((i) =>
      i.end ? path === i.to : path.startsWith(i.to)
    );
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  return (
    <div className="relative mt-4">
      {/* Indicador animado (pílula) */}
      <div
        className={cx(
          "absolute left-0 right-0 h-11 rounded-2xl",
          "bg-slate-900/5 dark:bg-white/10",
          "transition-transform duration-200 ease-out"
        )}
        style={{ transform: `translateY(${activeIndex * 52}px)` }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cx(
                "h-11 rounded-2xl px-3 flex items-center gap-3",
                "transition relative",
                "text-sm font-medium",
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )
            }
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-white text-base shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {item.icon}
            </span>
            <span className="truncate">{item.label}</span>

            <span
              className={cx(
                "ml-auto h-2 w-2 rounded-full transition",
                location.pathname.startsWith(item.to)
                  ? "bg-slate-900 dark:bg-white"
                  : "bg-transparent"
              )}
              aria-hidden="true"
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              ☰
            </button>

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 shadow-sm">
                <img
                  src="/logo.png"
                  alt="CAE ETM"
                  className="h-6 w-6 object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  CAE ETM
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Task Management
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User info */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-white text-xs font-semibold">
                {getInitials(user ?? "U")}
              </span>
              <span className="max-w-[140px] truncate">{user}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium
                text-slate-600 transition hover:bg-slate-100
                dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[280px_1fr] md:px-6">
        {/* Sidebar desktop */}
        <aside className="hidden md:block">
          <div className="sticky top-[76px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                NAVIGATION
              </div>
            </div>
            <SidebarNav />

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <div className="font-semibold text-slate-900 dark:text-white">
                Dica
              </div>
              <div className="mt-1">
                Mantenha PRs curtas e valide status/contrato da API.
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6 rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} CAE ETM</span>
              <span className="text-slate-400 dark:text-slate-500">
                Curso Full-Stack | Ka Solution
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* Sidebar mobile (drawer) */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          />

          <div className="absolute left-0 top-0 h-full w-[86%] max-w-[320px] bg-white p-4 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 shadow-sm">
                  <img
                    src="/logo.png"
                    alt="CAE ETM"
                    className="h-6 w-6 object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">CAE ETM</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Task Management
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
                onClick={() => setSidebarOpen(false)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <SidebarNav />

          </div>
        </div>
      ) : null}
    </div>
  );
}