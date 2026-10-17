import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ItemCard from "../components/ItemCard";
import { getItems } from "../services/itemService";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const nav = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getItems({ limit: 8, sort: "newest" })
      .then((r) => setListings(r.data.data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);
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
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">FRESH LISTINGS</span>
            <h2>Latest on campus</h2>
          </div>
          <Link className="btn secondary" to="/marketplace">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="center">Loading listings...</div>
        ) : listings.length ? (
          <div className="item-grid">
            {listings.map((item) => (
              <ItemCard item={item} key={item._id} />
            ))}
          </div>
        ) : (
          <p className="muted">No listings yet. Be the first to sell.</p>
        )}
      </section>
    </>
  );
}
