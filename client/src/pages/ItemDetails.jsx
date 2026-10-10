import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getItem, soldItem, deleteItem } from "../services/itemService";
import { createReport } from "../services/reportService";
import { useAuth } from "../context/AuthContext";
import ReportModal from "../components/ReportModal";
const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace("/api", "");
export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [report, setReport] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getItem(id)
      .then((r) => setItem(r.data.data.item))
      .catch((e) =>
        setError(e.response?.data?.message || "Listing not found."),
      );
  }, [id]);
  if (error) return <div className="center">{error}</div>;
  if (!item) return <div className="center">Loading...</div>;
  const owner = user && String(user.id) === String(item.seller._id);
  const remove = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await deleteItem(id);
      nav("/my-listings");
    }
  };
  const sold = async () => {
    const r = await soldItem(id);
    setItem(r.data.data.item);
  };
  const submitReport = async (d) => {
    setLoading(true);
    try {
      await createReport({ listing: id, ...d });
      setReport(false);
      alert("Report submitted.");
    } catch (e) {
      alert(e.response?.data?.message || "Could not submit report.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="section">
      <div className="details">
        <div className="gallery">
          {item.images.map((x, i) => (
            <img key={i} src={`${API}${x}`} />
          ))}
        </div>
        <div>
          <span className="badge">{item.status}</span>
          <h1>{item.title}</h1>
          <div className="price">
            ₹{Number(item.price).toLocaleString("en-IN")}
          </div>
          <p>{item.description}</p>
          <div className="info">
            <span>{item.category}</span>
            <span>{item.condition}</span>
            <span>{item.location}</span>
          </div>
          <h3>Seller</h3>
          <p>
            {item.seller.name} · {item.seller.department} · {item.seller.year}
          </p>
          {owner ? (
            <div className="actions">
              <Link className="btn" to={`/items/${id}/edit`}>
                Edit Listing
              </Link>
              <button
                className="btn secondary"
                onClick={sold}
                disabled={item.status === "Sold"}
              >
                Mark as Sold
              </button>
              <button className="btn danger" onClick={remove}>
                Delete
              </button>
            </div>
          ) : (
            <div className="actions">
              {user && item.status === "Available" && (
                <button
                  className="btn"
                  onClick={() => alert(`Seller email: ${item.seller.email}`)}
                >
                  Contact Seller
                </button>
              )}{" "}
              {user && (
                <button
                  className="btn secondary"
                  onClick={() => setReport(true)}
                >
                  Report Listing
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {report && (
        <ReportModal
          onClose={() => setReport(false)}
          onSubmit={submitReport}
          loading={loading}
        />
      )}
    </section>
  );
}
