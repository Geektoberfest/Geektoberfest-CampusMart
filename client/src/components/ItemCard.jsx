import { Link } from "react-router-dom";
const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");
export default function ItemCard({ item }) {
  return (
    <Link className="card item-card" to={`/items/${item._id}`}>
      <img
        src={item.images?.[0] ? `${API}${item.images[0]}` : "/placeholder.svg"}
      />
      <div className="card-body">
        <div className="muted">
          {item.category} · {item.condition}
        </div>
        <h3>{item.title}</h3>
        <strong>₹{Number(item.price).toLocaleString("en-IN")}</strong>
        <p className="muted">
          {item.location} · {item.status}
        </p>
      </div>
    </Link>
  );
}
