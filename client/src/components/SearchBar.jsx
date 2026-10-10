import { useState } from "react";
export default function SearchBar({ initial = "", onSearch }) {
  const [value, setValue] = useState(initial);
  return (
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search books, calculators, electronics..."
      />
      <button className="btn">Search</button>
    </form>
  );
}
