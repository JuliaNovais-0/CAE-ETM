import {http} from "../../../app/layouts/api/http";

export async function pingApi() {
    const res = await http.get("/health");
    return res.data;
}