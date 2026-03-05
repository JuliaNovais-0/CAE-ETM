const variants = {
  TODO: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DOING: "bg-blue-100 text-blue-800 border-blue-200",
  DONE: "bg-green-100 text-green-800 border-green-200",
  BLOCKED: "bg-red-100 text-red-800 border-red-200",
};

const labels = {
  TODO: "A Fazer",
  DOING: "Em andamento",
  DONE: "Concluída",
  BLOCKED: "Bloqueada",
};

export default function StatusBadge({ status = "TODO" }) {
  const cls =
    variants[status] ?? "bg-slate-100 text-slate-700 border-slate-200";

  const label = labels[status] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  );
}