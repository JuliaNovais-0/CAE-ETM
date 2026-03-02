import { useState } from "react";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");

  function handleSubmit(e) {
    e.preventDefault();

    const newTask = {
      title,
      description,
      status,
    };

    onTaskCreated(newTask);

    setTitle("");
    setDescription("");
    setStatus("PENDING");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Criar Tarefa</h2>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <br />

      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", resize: "vertical" }}
      />

      <br />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="PENDING">Pendente</option>
        <option value="IN_PROGRESS">Em andamento</option>
        <option value="DONE">Concluída</option>
      </select>

      <br />

      <button type="submit">Criar</button>
    </form>
  );
}

export default TaskForm;