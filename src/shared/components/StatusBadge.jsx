const variants = {
  PENDENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  EM_ANDAMENTO: "bg-blue-100 text-blue-800 border-blue-200",
  CONCLUIDA: "bg-green-100 text-green-800 border-green-200",
  CANCELADA: "bg-red-100 text-red-800 border-red-200",
};

export default function StatusBadge({ status = "PENDENTE" }) {
  const cls =
    variants[status] ?? "bg-slate-100 text-slate-700 border-slate-200";

  const label = status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}