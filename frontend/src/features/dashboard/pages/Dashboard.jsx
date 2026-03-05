import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/dashboardApi";

const STAT_CARDS = [
  { key: "totalTasks", label: "Total", icon: "📋", color: "bg-slate-100 text-slate-700" },
  { key: "todoCount", label: "A Fazer", icon: "📝", color: "bg-yellow-100 text-yellow-700" },
  { key: "doingCount", label: "Em andamento", icon: "⚙️", color: "bg-blue-100 text-blue-700" },
  { key: "doneCount", label: "Concluídas", icon: "✅", color: "bg-green-100 text-green-700" },
  { key: "blockedCount", label: "Bloqueadas", icon: "🚫", color: "bg-red-100 text-red-700" },
  { key: "delayedCount", label: "Atrasadas", icon: "⏰", color: "bg-orange-100 text-orange-700" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => console.error("Erro ao carregar dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-slate-500">Carregando dashboard...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-red-500">Erro ao carregar dados do dashboard.</span>
      </div>
    );
  }

  const categories = stats.countByCategory ?? {};

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Visão geral das suas tarefas</p>
      </div>

      {/* Cards de status */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, icon, color }) => (
          <div
            key={key}
            className={`flex items-center gap-4 rounded-2xl border p-5 shadow-sm ${color}`}
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="text-2xl font-bold">{stats[key] ?? 0}</p>
              <p className="text-sm font-medium opacity-80">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de atrasadas */}
      {stats.totalTasks > 0 && (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Taxa de atraso
            </span>
            <span className="text-sm font-bold text-orange-600">
              {stats.delayedPercentage}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-orange-400 transition-all"
              style={{ width: `${Math.min(stats.delayedPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Categorias */}
      {Object.keys(categories).length > 0 && (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Tarefas por Categoria
          </h2>
          <div className="space-y-3">
            {Object.entries(categories).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-700 transition-all"
                      style={{
                        width: `${
                          stats.totalTasks > 0
                            ? (count / stats.totalTasks) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="min-w-[2rem] text-right text-sm font-semibold text-slate-900">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}