import { useMemo, useState } from "react";

import CustomModal from "../../shared/components/CustomModal";
import TaskCard from "../../shared/components/TaskCard";
import TaskForm from "../../shared/components/TaskForm";
import { mockTasks } from "../../features/task/mocks/mockTasks";

import toast from "react-hot-toast";

const STATUS_TABS = [
  { key: "ALL", label: "Todas" },
  { key: "PENDENTE", label: "Pendentes" },
  { key: "EM_ANDAMENTO", label: "Em andamento" },
  { key: "CONCLUIDA", label: "Concluídas" },
  { key: "CANCELADA", label: "Canceladas" },
];

function countByStatus(tasks) {
  return tasks.reduce(
    (acc, t) => {
      const s = t?.status ?? "PENDENTE";
      acc[s] = (acc[s] ?? 0) + 1;
      acc.ALL += 1;
      return acc;
    },
    { ALL: 0 }
  );
}

function nextId(tasks) {
  const maxId = tasks.reduce((acc, t) => Math.max(acc, Number(t.id) || 0), 0);
  return maxId + 1;
}

export default function Tasks() {
  // estado local (mock)
  const [tasks, setTasks] = useState(mockTasks);

  // filtro
  const [statusFilter, setStatusFilter] = useState("ALL");

  const counts = useMemo(() => countByStatus(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "ALL") return tasks;
    return tasks.filter((t) => (t?.status ?? "PENDENTE") === statusFilter);
  }, [tasks, statusFilter]);

  // modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // task | null

  const modalTitle = useMemo(
    () => (editing ? "Editar tarefa" : "Criar tarefa"),
    [editing]
  );

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(task) {
    setEditing(task);
    setOpen(true);
  }

  async function handleSubmit(values) {
    if (editing?.id) {
      // EDIT
      setTasks((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...values } : t))
      );
      toast.success("Tarefa atualizada!");
      closeModal();
      return;
    }

    // CREATE
    const newTask = { id: nextId(tasks), ...values };
    setTasks((prev) => [newTask, ...prev]);

    // volta pra "Todas" pra garantir que o usuário veja a nova tarefa
    setStatusFilter("ALL");

    toast.success("Tarefa criada!");
    closeModal();
  }

  function handleDelete(task) {
    const ok = window.confirm(`Excluir a tarefa "${task.title}"?`);
    if (!ok) return;

    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    toast.success("Tarefa excluída!");
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          onClick={openCreate}
          type="button"
        >
          Nova tarefa
        </button>
      </div>

      {/* Filtros + contadores */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.key;
          const qty = counts[tab.key] ?? 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm",
                "hover:bg-slate-50",
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700",
              ].join(" ")}
            >
              {tab.label}{" "}
              <span
                className={[
                  "ml-1 rounded-full px-2 py-0.5 text-xs",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-700",
                ].join(" ")}
              >
                {qty}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
          Nenhuma tarefa ainda. Clique em <b>Nova tarefa</b>.
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
          Nenhuma tarefa para esse filtro.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTasks.map((t) => (
            <TaskCard
              key={t.id}
              title={t.title}
              description={t.description}
              status={t.status}
              dueDate={t.dueDate}
              onEdit={() => openEdit(t)}
              onDelete={() => handleDelete(t)}
            />
          ))}
        </div>
      )}

      {/* Modal + Form */}
      <CustomModal open={open} onClose={closeModal} title={modalTitle}>
        <TaskForm
          initialValues={editing ?? undefined}
          onCancel={closeModal}
          onSubmit={handleSubmit}
          submitLabel={editing ? "Atualizar" : "Criar"}
        />
      </CustomModal>
    </div>
  );
}