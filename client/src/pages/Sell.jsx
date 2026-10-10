import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemForm from "../components/ItemForm";
import { createItem } from "../services/itemService";
export default function Sell() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = async (fd) => {
    setLoading(true);
    try {
      const r = await createItem(fd);
      nav(`/items/${r.data.data.item._id}`);
    } catch (e) {
      alert(e.response?.data?.message || "Could not create listing.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="section narrow">
      <span className="eyebrow">SELL</span>
      <h1>List an item</h1>
      <p className="muted">
        Give another student a chance to reuse something you no longer need.
      </p>
      <ItemForm onSubmit={submit} loading={loading} />
    </section>
  );
}
