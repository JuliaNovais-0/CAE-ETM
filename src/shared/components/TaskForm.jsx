import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  title: z.string().min(3, "Título precisa ter pelo menos 3 caracteres"),
  description: z.string().min(3, "Descrição precisa ter pelo menos 3 caracteres"),
  status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]),
  dueDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});

const STATUS_OPTIONS = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
  { value: "CANCELADA", label: "Cancelada" },
];

export default function TaskForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}) {
  const defaultValues = useMemo(
    () => ({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      status: initialValues?.status ?? "PENDENTE",
      dueDate: initialValues?.dueDate ?? "",
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
    mode: "onBlur",
  });

  // sempre que trocar initialValues (editar outra task), reseta o form
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

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