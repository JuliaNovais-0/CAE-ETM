import StatusBadge from "./StatusBadge";

const PRIORITY_LABELS = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

const PRIORITY_COLORS = {
  LOW: "text-slate-500",
  MEDIUM: "text-blue-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  // backend retorna "2026-03-05T00:00:00" ou "2026-03-05"
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("pt-BR");
}

export default function TaskCard({
  title = "Título da tarefa",
  description = "Descrição curta da tarefa…",
  status = "TODO",
  priority,
  category,
  dueDate,
  createdBy,
  assignees = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
            {description}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Meta: priority + category */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        {priority && (
          <span className={`font-medium ${PRIORITY_COLORS[priority] ?? ""}`}>
            ⚡ {PRIORITY_LABELS[priority] ?? priority}
          </span>
        )}
        {category && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
            {category}
          </span>
        )}
      </div>

      {/* Criado por + Atribuído a */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {createdBy && (
          <span title="Criado por">
            👤 <span className="font-medium text-slate-700">{createdBy}</span>
          </span>
        )}
        {(() => {
          // Filtra o criador da lista de atribuídos para não repetir o nome
          const others = assignees.filter((a) => a.login !== createdBy);
          if (others.length === 0) return null;
          return (
            <span title="Atribuído a">
              👥{" "}
              {others.map((a, i) => (
                <span key={a.id ?? i}>
                  <span className="font-medium text-slate-700">{a.login}</span>
                  {i < others.length - 1 && ", "}
                </span>
              ))}
            </span>
          );
        })()}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {dueDate ? `Prazo: ${formatDate(dueDate)}` : "Sem prazo"}
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            Editar
          </button>

          <button
            className="rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}