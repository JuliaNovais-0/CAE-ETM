import { http } from "../../../app/api/http";

/**
 * POST /api/auth/login
 * @param {{ login: string, password: string }} credentials
 * @returns {{ token: string }}
 */
export async function loginRequest({ login, password }) {
  const res = await http.post("/api/auth/login", { login, password });
  return res.data; // { token }
}

/**
 * POST /api/auth/register
 * @param {{ login: string, password: string }} credentials
 */
export async function registerRequest({ login, password }) {
  const res = await http.post("/api/auth/register", { login, password });
  return res.data;
}
