import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemForm from "../components/ItemForm";
import { getItem, updateItem } from "../services/itemService";
export default function EditItem() {
  const { id } = useParams();
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getItem(id)
      .then((r) => setInitial(r.data.data.item))
      .catch(() => nav("/marketplace"));
  }, [id]);
  if (!initial) return <div className="center">Loading...</div>;
  const submit = async (fd) => {
    setLoading(true);
    try {
      const r = await updateItem(id, fd);
      nav(`/items/${r.data.data.item._id}`);
    } catch (e) {
      alert(e.response?.data?.message || "Could not update listing.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="section narrow">
      <span className="eyebrow">EDIT</span>
      <h1>Update listing</h1>
      <ItemForm
        initial={initial}
        onSubmit={submit}
        submitText="Save Changes"
        loading={loading}
      />
    </section>
  );
}
