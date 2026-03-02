import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error("não autorizado");
        }

        if(error.response?.status >=500) {
            toast.error("erro no servidor");
        }

        return Promise.reject(error);
    }
);

export default api