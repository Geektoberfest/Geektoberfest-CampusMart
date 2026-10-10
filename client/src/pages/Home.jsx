import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const nav = useNavigate();
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">CAMPUS-ONLY MARKETPLACE</span>
          <h1>
            Buy. Sell. Reuse.
            <br />
            Right on Campus.
          </h1>
          <p>
            Find affordable books, electronics, furniture and more from students
            around your campus.
          </p>
          <SearchBar
            onSearch={(q) =>
              nav(`/marketplace?search=${encodeURIComponent(q)}`)
            }
          />
          <div className="hero-actions">
            <Link className="btn" to="/marketplace">
              Browse Marketplace
            </Link>
            <Link className="btn secondary" to="/sell">
              Sell an Item
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">EXPLORE</span>
            <h2>Shop by category</h2>
          </div>
        </div>
        <div className="category-grid">
          {[
            "📚 Books",
            "🧮 Calculators",
            "💻 Electronics",
            "🪑 Furniture",
            "🧪 Lab Equipment",
            "🎒 Accessories",
          ].map((x) => (
            <Link
              to={`/marketplace?category=${encodeURIComponent(x.slice(2))}`}
              className="category"
              key={x}
            >
              {x}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
