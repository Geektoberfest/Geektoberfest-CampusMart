import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getItems } from "../services/itemService";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ItemCard from "../components/ItemCard";
import EmptyState from "../components/EmptyState";
export default function Marketplace() {
  const [params, setParams] = useSearchParams();
  const PAGE_SIZE = 12;
  const parsePage = (v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 ? n : 1;
  };
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    condition: "",
    minPrice: "",
    maxPrice: "",
    sort: params.get("sort") || "newest",
    search: params.get("search") || "",
  });
  const [page, setPage] = useState(() => parsePage(params.get("page")));
  const [data, setData] = useState({
    listings: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const window = [current - 1, current, current + 1].filter(
      (n) => n > 1 && n < total,
    );
    return [1, ...window, total].reduce((acc, n, i, arr) => {
      if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);
  };
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const r = await getItems({ ...filters, page, limit: PAGE_SIZE });
        setData(r.data.data);
        const next = { ...filters };
        if (page > 1) next.page = String(page);
        setParams(
          Object.fromEntries(Object.entries(next).filter(([, v]) => v)),
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [
    filters.category,
    filters.condition,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.search,
    page,
  ]);
  const updateFilters = (next) => {
    setFilters(next);
    setPage(1);
  };
  const goToPage = (next) => {
    const total = data.totalPages || 1;
    const clamped = Math.min(Math.max(1, next), total);
    setPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
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
        onSearch={(search) => updateFilters({ ...filters, search })}
      />
      <FilterPanel filters={filters} setFilters={updateFilters} />
      {loading ? (
        <div className="center">Loading listings...</div>
      ) : data.listings.length ? (
        <>
          <div className="item-grid">
            {data.listings.map((i) => (
              <ItemCard item={i} key={i._id} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div
              className="pagination"
              role="navigation"
              aria-label="Marketplace pages"
            >
              <button
                onClick={() => goToPage(data.currentPage - 1)}
                disabled={data.currentPage <= 1 || loading}
                aria-label="Previous page"
              >
                Previous
              </button>
              {getPageNumbers(data.currentPage, data.totalPages).map((n, i) =>
                n === "…" ? (
                  <span key={`gap-${i}`} className="pagination-gap">
                    …
                  </span>
                ) : (
                  <button
                    className={data.currentPage === n ? "active" : ""}
                    aria-current={data.currentPage === n ? "page" : undefined}
                    aria-label={`Page ${n}`}
                    key={n}
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                onClick={() => goToPage(data.currentPage + 1)}
                disabled={data.currentPage >= data.totalPages || loading}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
