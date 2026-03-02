import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import Select from "../components/Select";

import {
  getTasks,
  createTask,
  updateTask as updateTaskApi,
} from "../api/tasksService";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

 
  const [refreshToken, setRefreshToken] = useState(0);

  
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const pageSize = 5;
  const debouncedSearch = useDebounce(search, 500);


  useEffect(() => {
    let isMounted = true;

    async function fetchTasks() {
      try {
        setLoading(true);

        const data = await getTasks({
          search: debouncedSearch,
          status: status === "ALL" ? undefined : status,
          page,
          size: pageSize,
        });

        const items = data?.content ?? data?.items ?? data ?? [];
        const pages =
          data?.totalPages ??
          (typeof data?.totalElements === "number"
            ? Math.ceil(data.totalElements / pageSize)
            : 0);

        if (!isMounted) return;

        setTasks(items);
        setTotalPages(pages);
      } catch (error) {
        console.error(error);
       
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, status, page, refreshToken]);

  
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status]);

  const canGoPrev = page > 0;
  const canGoNext = page + 1 < totalPages;

 
  async function handleCreateTask(task) {
    try {
      await createTask(task);
     
      setPage(0);
      setRefreshToken((x) => x + 1);
    } catch (error) {
      console.error(error);
    }
  }

  
  async function handleUpdateTask(id, partialUpdate) {
    const prevTasks = tasks; 
    try {
      
      setUpdatingIds((prev) => new Set(prev).add(id));

      
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...partialUpdate } : t))
      );

     
      const updated = await updateTaskApi(id, partialUpdate);

   
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error(error);
      // rollback
      setTasks(prevTasks);
    } finally {
      
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <>
      <h2>Lista de Tarefas</h2>

   
      <TaskForm onTaskCreated={handleCreateTask} />

   
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Buscar tarefa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar tarefa"
        />

        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { value: "ALL", label: "Todos" },
            { value: "PENDING", label: "Pendente" },
            { value: "IN_PROGRESS", label: "Em andamento" },
            { value: "DONE", label: "Concluída" },
          ]}
        />
      </div>

     
      {loading && <p>Carregando...</p>}
      {!loading && !tasks.length && <p>Nenhuma tarefa encontrada</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem
              task={task}
              updating={updatingIds.has(task.id)}
              onUpdate={(partial) => handleUpdateTask(task.id, partial)}
            />
          </li>
        ))}
      </ul>

      
      <div style={{ marginTop: 15, display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!canGoPrev || loading}
          aria-label="Página anterior"
        >
        
        </button>

        <span style={{ margin: "0 10px" }}>
          Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!canGoNext || loading}
          aria-label="Próxima página"
        >
        </button>
      </div>
    </>
  );
}