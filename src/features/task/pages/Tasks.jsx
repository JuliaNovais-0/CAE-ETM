import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import CustomModal from "../../../shared/components/CustomModal";
import TaskCard from "../../../shared/components/TaskCard";
import TaskForm from "../../../shared/components/TaskForm";
import { mockTasks } from "../mocks/mockTasks";

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
  const [tasks, setTasks] = useState(mockTasks);

  const [activeTab, setActiveTab] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const counts = useMemo(() => countByStatus(tasks), [tasks]);

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return tasks;
    return tasks.filter((t) => t.status === activeTab);
  }, [tasks, activeTab]);

  const modalTitle = editing ? "Editar tarefa" : "Criar tarefa";

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
      setTasks((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...values } : t))
      );
      toast.success("Tarefa atualizada!");
      closeModal();
      return;
    }

    const newTask = { id: nextId(tasks), ...values };
    setTasks((prev) => [newTask, ...prev]);
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
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-slate-600">Total: {counts.ALL ?? 0}</p>
        </div>

        <button
          className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          onClick={openCreate}
          type="button"
        >
          Nova tarefa
        </button>
      </div>

      {/* Tabs / Filtros */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const pill =
            isActive
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 hover:bg-slate-50 border";

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${pill}`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs ${
                  isActive ? "bg-white/15" : "bg-slate-100"
                }`}
              >
                {counts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600">
          Nenhuma tarefa nesse filtro.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
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

      {/* Modal + Form (ATENÇÃO: aqui dentro é SÓ TaskForm) */}
      <CustomModal open={open} onClose={closeModal} title={modalTitle} size="lg">
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