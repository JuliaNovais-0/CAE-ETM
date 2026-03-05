import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  title: z.string().min(3, "Título precisa ter pelo menos 3 caracteres"),
  description: z.string().min(3, "Descrição precisa ter pelo menos 3 caracteres"),
  status: z.enum(["TODO", "DOING", "DONE", "BLOCKED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  assigneeIds: z.array(z.string()).optional(),
});

const STATUS_OPTIONS = [
  { value: "TODO", label: "A Fazer" },
  { value: "DOING", label: "Em andamento" },
  { value: "DONE", label: "Concluída" },
  { value: "BLOCKED", label: "Bloqueada" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "CRITICAL", label: "Crítica" },
];

const CATEGORY_OPTIONS = [
  "Desenvolvimento",
  "Design",
  "Documentação",
  "Bug",
  "Infraestrutura",
  "Outro",
];

export default function TaskForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  users = [],  // [{ id, login }]
}) {
  const defaultValues = useMemo(
    () => ({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      status: initialValues?.status ?? "TODO",
      priority: initialValues?.priority ?? "MEDIUM",
      category: initialValues?.category ?? "",
      dueDate: initialValues?.dueDate ?? "",
      assigneeIds: initialValues?.assigneeIds ?? [],
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
    mode: "onBlur",
  });

  const selectedAssignees = watch("assigneeIds") ?? [];

  // sempre que trocar initialValues (editar outra task), reseta o form
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function toggleAssignee(userId) {
    const current = selectedAssignees;
    if (current.includes(userId)) {
      setValue("assigneeIds", current.filter((id) => id !== userId));
    } else {
      setValue("assigneeIds", [...current, userId]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => onSubmit?.(values))}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700">Título</label>
        <input
          {...register("title")}
          className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Ex: Criar TaskForm"
        />
        {errors.title?.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Ex: Form com React Hook Form + Zod no modal."
        />
        {errors.description?.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select
            {...register("status")}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.status?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Prioridade</label>
          <select
            {...register("priority")}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.priority?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.priority.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Categoria</label>
          <select
            {...register("category")}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="">Selecione...</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Prazo</label>
          <input
            {...register("dueDate")}
            type="date"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
          {errors.dueDate?.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.dueDate.message}</p>
          ) : null}
        </div>
      </div>

      {/* Atribuir a usuários */}
      {users.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Atribuir a
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {users.map((u) => {
              const selected = selectedAssignees.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggleAssignee(u.id)}
                  className={`rounded-full px-3 py-1 text-sm border transition ${
                    selected
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {u.login}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}