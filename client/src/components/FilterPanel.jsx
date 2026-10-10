export default function FilterPanel({ filters, setFilters }) {
  const update = (k, v) => setFilters({ ...filters, [k]: v });
  return (
    <div className="filters">
      <select
        value={filters.category}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="">All categories</option>
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
      <select
        value={filters.condition}
        onChange={(e) => update("condition", e.target.value)}
      >
        <option value="">Any condition</option>
        {["New", "Like New", "Good", "Fair"].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        placeholder="Min ₹"
        value={filters.minPrice}
        onChange={(e) => update("minPrice", e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Max ₹"
        value={filters.maxPrice}
        onChange={(e) => update("maxPrice", e.target.value)}
      />
      <select
        value={filters.sort}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
      </select>
      <button
        className="btn secondary"
        onClick={() =>
          setFilters({
            category: "",
            condition: "",
            minPrice: "",
            maxPrice: "",
            sort: "newest",
            search: "",
          })
        }
      >
        Reset
      </button>
    </div>
  );
}
