import { useEffect, useState } from "react";
import { getWishlist } from "../services/wishlistService";
import { useWishlist } from "../context/WishlistContext";
import ItemCard from "../components/ItemCard";
import EmptyState from "../components/EmptyState";
export default function Wishlist() {
  const { ids } = useWishlist();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getWishlist()
      .then((r) => setItems(r.data.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  const saved = items.filter((item) => ids.has(item._id));
  if (loading) return <div className="center">Loading...</div>;
  return (
    <section className="section">
      <span className="eyebrow">YOUR SPACE</span>
      <h1>My Wishlist</h1>
      {saved.length ? (
        <div className="item-grid">
          {saved.map((item) => (
            <ItemCard item={item} key={item._id} />
          ))}
        </div>
      ) : (
        <EmptyState message="You haven't saved anything yet." />
      )}
    </section>
  );
}
