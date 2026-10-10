import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myListings, deleteItem, soldItem } from "../services/itemService";
import EmptyState from "../components/EmptyState";

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const response = await myListings();

      setItems(response.data.data.listings || []);
    } catch (error) {
      console.error("Failed to load listings:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSold = async (id) => {
    try {
      await soldItem(id);
      await load();
    } catch (error) {
      console.error("Failed to mark item as sold:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing?")) {
      return;
    }

    try {
      await deleteItem(id);
      await load();
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

  if (loading) {
    return <div className="center">Loading...</div>;
  }

  return (
    <section className="section">
      <span className="eyebrow">YOUR SPACE</span>

      <h1>My Listings</h1>

      {items.length ? (
        <div className="table-list">
          {items.map((item) => (
            <div className="list-row" key={item._id}>
              <div>
                <span className="badge">{item.status}</span>

                <h3>{item.title}</h3>

                <p className="muted">
                  ₹{item.price} · {item.category}
                </p>
              </div>

              <div className="actions">
                <Link
                  className="btn small"
                  to={`/items/${item._id}/edit`}
                >
                  Edit
                </Link>

                <button
                  className="btn small secondary"
                  disabled={item.status === "Sold"}
                  onClick={() => handleSold(item._id)}
                >
                  Sold
                </button>

                <button
                  className="btn small danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="You haven't listed anything yet." />
      )}
    </section>
  );
}
