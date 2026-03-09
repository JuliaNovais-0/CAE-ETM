import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CustomModal from "../../../shared/components/CustomModal";
import TaskCard from "../../../shared/components/TaskCard";
import TaskForm from "../../../shared/components/TaskForm";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskApi";
import { fetchUsers } from "../services/userApi";
import { http } from "../../../app/api/http";

const STATUS_TABS = [
  { key: "ALL", label: "Todas" },
  { key: "TODO", label: "A Fazer" },
  { key: "DOING", label: "Em andamento" },
  { key: "DONE", label: "Concluídas" },
  { key: "BLOCKED", label: "Bloqueadas" },
];

function countByStatus(tasks) {
  return tasks.reduce(
    (acc, t) => {
      const s = t?.status ?? "TODO";
      acc[s] = (acc[s] ?? 0) + 1;
      acc.ALL += 1;
      return acc;
    },
    { ALL: 0 }
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [activeTab, setActiveTab] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Carrega tasks do backend
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const page = await fetchTasks();
      setTasks(page.content ?? []);
    } catch (err) {
      toast.error("Erro ao carregar tarefas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega lista de usuários para atribuição
  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, [loadTasks, loadUsers]);

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
    // Converter dueDate de "2026-03-05T00:00:00" para "2026-03-05" para o input date
    const dueDate = task.dueDate ? task.dueDate.substring(0, 10) : "";
    // Extrair IDs dos assignees para o form
    const assigneeIds = (task.assignee ?? []).map((u) => u.id);
    setEditing({ ...task, dueDate, assigneeIds });
    setOpen(true);
  }

  async function handleSubmit(values) {
    try {
      if (editing?.id) {
        await updateTask(editing.id, values);
        toast.success("Tarefa atualizada!");
      } else {
        await createTask(values);
        toast.success("Tarefa criada!");
      }
      closeModal();
      await loadTasks(); // Recarrega do backend
    } catch (err) {
      toast.error("Erro ao salvar tarefa");
      console.error(err);
    }
  }

  async function handleDelete(task) {
    if (!task?.id) return;
    const ok = window.confirm(`Excluir a tarefa "${task.title}"?`);
    if (!ok) return;

    try {
      await http.delete(`/api/tasks/${task.id}`);
      // Remove da lista local imediatamente
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      toast.success("Tarefa excluída!");
    } catch (err) {
      toast.error("Erro ao excluir tarefa");
      console.error("DELETE error:", err);
      // Recarrega para garantir consistência
      await loadTasks();
    }
  }

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Total: {counts.ALL ?? 0}</p>
        </div>

        <button
          className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
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
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-white text-slate-700 hover:bg-slate-50 border dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800";

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
                  isActive ? "bg-white/15" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {counts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Carregando tarefas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-sm text-slate-600 dark:text-slate-400">
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
              priority={t.priority}
              category={t.category}
              dueDate={t.dueDate}
              createdBy={t.createdBy?.login}
              assignees={t.assignee ?? []}
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
          users={users}
        />
      </CustomModal>
    </div>
  );
}