function Input({ type = "text", setValue, value, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={({ target }) => setValue(target.value)}
    />
  );
}


export default Input