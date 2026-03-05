import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/tasks", label: "Tasks", icon: "✅" },
];

function getInitials(name = "CAE ETM") {
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
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
        "border border-slate-200 bg-white hover:bg-slate-50",
        "dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
        "focus:outline-none focus:ring-2 focus:ring-slate-900/15 dark:focus:ring-white/15"
      )}
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      <span className="text-base">{isDark ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

/** Navbar com indicador animado */
function SidebarNav() {
  const location = useLocation();

  // Pega o index do item ativo pra posicionar a “pílula”
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

            {/* “dot” discreto do lado direito quando ativo */}
            <span
              className={cx(
                "ml-auto h-2 w-2 rounded-full transition",
                location.pathname === item.to || (!item.end && location.pathname.startsWith(item.to))
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Mobile top bar */}
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
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-white text-xs font-semibold">
                {getInitials("Lucas")}
              </span>
              <span className="max-w-[140px] truncate">Lucas</span>
            </div>
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

            <div className="mt-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}