import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");
export default function ItemCard({ item }) {
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const nav = useNavigate();
  const saved = isWishlisted(item._id);
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return nav("/login");
    toggle(item._id);
  };
  const sold = item.status === "Sold";
  const imageSrc = item.images?.[0]
    ? `${API}${item.images[0]}`
    : "/placeholder.svg";
  return (
    <Link className="card item-card" to={`/items/${item._id}`}>
      <div className="item-image">
        <img
          src={
            item.images?.[0] ? `${API}${item.images[0]}` : "/placeholder.svg"
          }
        />
        <button
          className={`wishlist-btn${saved ? " active" : ""}`}
          onClick={handleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          title={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <div className="muted item-card-meta">
          {item.category} · {item.condition}
        </div>
        <h3 className="item-card-title">{item.title}</h3>
        <strong className="item-card-price">
          ₹{Number(item.price).toLocaleString("en-IN")}
        </strong>
        <p className="muted item-card-location">{item.location}</p>
      </div>
    </Link>
  );
}
