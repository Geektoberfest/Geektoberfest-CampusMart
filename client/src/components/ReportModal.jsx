import { useState } from "react";
export default function ReportModal({ onClose, onSubmit, loading }) {
  const [reason, setReason] = useState("Scam/Fraud");
  const [description, setDescription] = useState("");
  return (
    <div className="overlay">
      <div className="modal">
        <h2>Report listing</h2>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          {[
            "Scam/Fraud",
            "Inappropriate Content",
            "Incorrect Information",
            "Duplicate Listing",
            "Prohibited Item",
            "Other",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <textarea
          rows="4"
          placeholder="Optional details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="actions">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn danger"
            disabled={loading}
            onClick={() => onSubmit({ reason, description })}
          >
            {loading ? "Sending..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
