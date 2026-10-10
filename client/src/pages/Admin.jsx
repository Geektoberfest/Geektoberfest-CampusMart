import { useEffect, useState } from "react";
import { getReports, updateReport } from "../services/reportService";
import { adminListings, adminDelete } from "../services/itemService";
export default function Admin() {
  const [reports, setReports] = useState([]);
  const [items, setItems] = useState([]);
  const load = () => {
    getReports().then((r) => setReports(r.data.data.reports));
    adminListings().then((r) => setItems(r.data.data.listings));
  };
  useEffect(load, []);
  return (
    <section className="section">
      <span className="eyebrow">ADMIN</span>
      <h1>Moderation dashboard</h1>
      <div className="admin-grid">
        <div>
          <h2>Reports</h2>
          {reports.length ? (
            reports.map((r) => (
              <div className="admin-card" key={r._id}>
                <b>{r.listing?.title || "Deleted listing"}</b>
                <p>{r.reason}</p>
                <p className="muted">
                  By {r.reporter?.name} · {r.status}
                </p>
                <div className="actions">
                  <button
                    className="btn small secondary"
                    onClick={async () => {
                      await updateReport(r._id, "Reviewed");
                      load();
                    }}
                  >
                    Reviewed
                  </button>
                  <button
                    className="btn small"
                    onClick={async () => {
                      await updateReport(r._id, "Resolved");
                      load();
                    }}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No reports found.</p>
          )}
        </div>
        <div>
          <h2>Listings</h2>
          {items.map((i) => (
            <div className="admin-card" key={i._id}>
              <b>{i.title}</b>
              <p>
                ₹{i.price} · {i.seller?.name}
              </p>
              <button
                className="btn small danger"
                onClick={async () => {
                  if (confirm("Remove this listing?")) {
                    await adminDelete(i._id);
                    load();
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
