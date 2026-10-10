import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getItems } from "../services/itemService";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ItemCard from "../components/ItemCard";
import EmptyState from "../components/EmptyState";
export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    sort: params.get("sort") || "newest",
    search: params.get("search") || "",
  });
  const [data, setData] = useState({
    listings: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const load = async (page = 1) => {
    setLoading(true);
    try {
      const r = await getItems({ ...filters, page, limit: 12 });
      setData(r.data.data);
      setParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [
    filters.category,
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.search,
  ]);
  return (
    <section className="section">
      <div className="page-head">
        <div>
          <span className="eyebrow">MARKETPLACE</span>
          <h1>Find something useful</h1>
          <p className="muted">{data.totalItems} listings available</p>
        </div>
      </div>
      <SearchBar
        initial={filters.search}
        onSearch={(search) => setFilters({ ...filters, search })}
      />
      <FilterPanel filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="center">Loading listings...</div>
      ) : data.listings.length ? (
        <>
          <div className="item-grid">
            {data.listings.map((i) => (
              <ItemCard item={i} key={i._id} />
            ))}
          </div>
          <div className="pagination">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <button
                className={data.currentPage === i + 1 ? "active" : ""}
                key={i}
                onClick={() => load(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
