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
    <article
      className="
        group relative overflow-hidden
        rounded-2xl border p-5 shadow-sm
        bg-white border-slate-200
        dark:bg-slate-900/60 dark:border-slate-800
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {dueDate ? `Prazo: ${dueDate}` : "Sem prazo"}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="
              inline-flex items-center justify-center
              rounded-xl border px-3.5 py-2 text-sm font-semibold
              border-slate-200 bg-white text-slate-900
              hover:bg-slate-50 active:bg-slate-100
              dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100
              dark:hover:bg-slate-800/60 dark:active:bg-slate-800
              focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-white
              dark:focus:ring-slate-600 dark:focus:ring-offset-slate-950
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Editar
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="
              inline-flex items-center justify-center
              rounded-xl border px-3.5 py-2 text-sm font-semibold
              border-red-200 bg-white text-red-700
              hover:bg-red-50 active:bg-red-100
              dark:border-red-900/60 dark:bg-slate-900/40 dark:text-red-300
              dark:hover:bg-red-950/35 dark:active:bg-red-950/55
              focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:ring-offset-white
              dark:focus:ring-red-900/60 dark:focus:ring-offset-slate-950
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}