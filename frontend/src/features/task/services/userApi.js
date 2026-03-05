import { http } from "../../../app/api/http";

/**
 * GET /api/users — lista todos os usuários (id + login)
 */
export async function fetchUsers() {
  const res = await http.get("/api/users");
  return res.data; // [{ id, login }]
}
