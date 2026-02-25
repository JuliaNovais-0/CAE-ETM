import StatusBadge from "./StatusBadge";

export default function TaskCard({
  title = "Título da tarefa",
  description = "Descrição curta da tarefa…",
  status = "PENDENTE",
  dueDate,
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

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {dueDate ? `Prazo: ${dueDate}` : "Sem prazo"}
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
            onClick={onEdit}
            type="button"
          >
            Editar
          </button>
          <button
            className="rounded-lg border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            onClick={onDelete}
            type="button"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}