import { useState } from "react";
export default function ItemForm({
  initial = {},
  onSubmit,
  submitText = "Publish Item",
  loading = false,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Books",
    price: "",
    condition: "Good",
    location: "",
    ...initial,
  });
  const [files, setFiles] = useState([]);
  const set = (k, v) => setForm({ ...form, [k]: v });
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("images", f));
    onSubmit(fd);
  };
  return (
    <form className="form" onSubmit={submit}>
      <label>
        Title
        <input
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          required
          rows="5"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>
      <div className="two">
        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {[
              "Books",
              "Electronics",
              "Calculators",
              "Furniture",
              "Stationery",
              "Lab Equipment",
              "Clothing",
              "Accessories",
              "Other",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Condition
          <select
            value={form.condition}
            onChange={(e) => set("condition", e.target.value)}
          >
            {["New", "Like New", "Good", "Fair"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="two">
        <label>
          Price (₹)
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </label>
        <label>
          Location
          <input
            required
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Main Campus"
          />
        </label>
      </div>
      <label>
        Images
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          required={!initial.title}
          onChange={(e) => setFiles([...e.target.files])}
        />
        <small>Up to 5 images, 5 MB each.</small>
      </label>
      {files.length > 0 && (
        <div className="file-list">
          {files.map((f) => (
            <span key={f.name}>{f.name}</span>
          ))}
        </div>
      )}
      <button className="btn" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}
