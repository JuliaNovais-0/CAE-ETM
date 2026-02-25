import TaskCard from "../../../shared/components/TaskCard";

export default function Tasks() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <TaskCard
          title="Configurar Axios"
          description="Criar http client com interceptors e toast."
          status="CONCLUIDA"
          dueDate="20/02"
        />
        <TaskCard
          title="Criar TaskForm"
          description="Form com React Hook Form + Zod."
          status="EM_ANDAMENTO"
          dueDate="22/02"
        />
      </div>
    </div>
  );
}