import api from "./axios";

export async function getTasks({ search, status, page = 0, size = 5 } = {}) {
  try {
    const params = {};
    if (search != null && search !== "") params.search = search;
    if (status != null && status !== "") params.status = status;
    params.page = page;
    params.size = size;

    const response = await api.get("/tasks", { params });
    return response.data;
  } catch (err) {
    throw normalizeApiError(err, "Falha ao buscar tarefas");
  }
}

export async function createTask(task) {
  try {
    const response = await api.post("/tasks", task);
    return response.data;
  } catch (err) {
    throw normalizeApiError(err, "Falha ao criar tarefa");
  }
}

export async function updateTask(id, updatedTask) {
  try {
    const response = await api.put(`/tasks/${id}`, updatedTask);
    return response.data;
  } catch (err) {
    throw normalizeApiError(err, "Falha ao atualizar tarefa");
  }
}

export async function deleteTask(id) {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data ?? true;
  } catch (err) {
    throw normalizeApiError(err, "Falha ao deletar tarefa");
  }
}

function normalizeApiError(error, defaultMessage) {
  if (error?.response) {
    const { status, data } = error.response;
    return new Error(
      `${defaultMessage}: ${status}${data?.message ? ` - ${data.message}` : ""}`
    );
  }
  if (error?.request) {
    return new Error(`${defaultMessage}: sem resposta do servidor`);
  }
  return new Error(`${defaultMessage}: ${error?.message || "erro desconhecido"}`);
}