import { Link } from "react-router-dom";
const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");
export default function ItemCard({ item }) {
  const sold = item.status === "Sold";
  const imageSrc = item.images?.[0]
    ? `${API}${item.images[0]}`
    : "/placeholder.svg";
  return (
    <Link
      className={`card item-card${sold ? " is-sold" : ""}`}
      to={`/items/${item._id}`}
      aria-label={`${item.title} - ₹${Number(item.price).toLocaleString("en-IN")}${sold ? " (Sold)" : ""}`}
    >
      <div className="item-card-media">
        <img src={imageSrc} alt={item.title} loading="lazy" />
        <span
          className={`badge status-badge${sold ? " sold" : " available"}`}
        >
          {sold ? "Sold" : item.status || "Available"}
        </span>
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
