import { http } from "../../../app/api/http";

/**
 * GET /api/tasks?status=&priority=&category=&page=0&size=20&sort=createdAt,desc
 */
export async function fetchTasks({ status, priority, category, page = 0, size = 50 } = {}) {
  const params = { page, size, sort: "createdAt,desc" };
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (category) params.category = category;

  const res = await http.get("/api/tasks", { params });
  return res.data; // Page<Task>
}

/**
 * POST /api/tasks
 */
export async function createTask(data) {
  const payload = buildPayload(data);
  const res = await http.post("/api/tasks", payload);
  return res.data;
}

/**
 * PUT /api/tasks/:id
 */
export async function updateTask(id, data) {
  const payload = buildPayload(data);
  const res = await http.put(`/api/tasks/${id}`, payload);
  return res.data;
}

/**
 * DELETE /api/tasks/:id  (soft delete no backend)
 */
export async function deleteTask(id) {
  const res = await http.delete(`/api/tasks/${id}`);
  return res.data;
}

/** Converte dados do form para o formato esperado pelo CreateTaskDTO do backend */
function buildPayload(data) {
  return {
    title: data.title,
    description: data.description || "",
    status: data.status,
    priority: data.priority,
    category: data.category,
    dueDate: data.dueDate ? `${data.dueDate}T00:00:00` : null,
    tags: data.tags || [],
    assigneeIds: data.assigneeIds || [],
  };
}