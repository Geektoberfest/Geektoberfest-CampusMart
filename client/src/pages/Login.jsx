import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      nav("/marketplace");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <form className="auth-card form" onSubmit={submit}>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Login to CampusMart</h1>
        {error && <div className="alert">{error}</div>}
        <label>
          College Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
