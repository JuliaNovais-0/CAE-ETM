export default function TaskItem({ task }) {
    return (
    <li>
        style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            marginBottom: "8px",
        }}
    
        <strong>{task.titulo}</strong>
        <div>Status: {task.status}</div>
        </li>
    );
}