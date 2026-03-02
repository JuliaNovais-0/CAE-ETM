export default function select({ options, ...props}) {
    return (
        <select
            style={{
                padding: "8px",
                marginBottom: "10px",
                diplay: "block",
            }}
        {...props}
    >
     {options.map((option) => (
        <option key={option.value} value={option.value}>
        {option.label}
        </option>
      ))}
        </select>
    );
}