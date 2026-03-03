import { http } from "../../../app/api/http";

// Health check (se seu backend tiver /health)
export async function pingApi() {
  const res = await http.get("/health");
  return res.data;
}

// ===== TASKS CRUD =====
// Ajuste a BASE conforme seu backend:
// - se for "/tasks" ok
// - se for "/api/tasks" troque aqui
const BASE = "/tasks";

export async function getTasks() {
  const res = await http.get(BASE);
  return res.data; // esperado: array
}

export async function getTaskById(id) {
  const res = await http.get(`${BASE}/${id}`);
  return res.data;
}

export async function createTask(payload) {
  const res = await http.post(BASE, payload);
  return res.data; // esperado: task criada
}

export async function updateTask(id, payload) {
  const res = await http.put(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteTask(id) {
  const res = await http.delete(`${BASE}/${id}`);
  return res.data;
}