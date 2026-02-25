import { useEffect } from "react";
import { http } from "../../../app/layouts/api/http";
import { toastSuccess } from "../../../shared/lib/toast";

export default function Tasks() {
  useEffect(() => {
    http.get("/health")
      .then((res) => toastSuccess(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tasks</h1>
    </div>
  );
}