import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "CSE",
    year: "2nd Year",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      nav("/login");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <form className="auth-card form" onSubmit={submit}>
        <span className="eyebrow">JOIN CAMPUSMART</span>
        <h1>Create your account</h1>
        {error && <div className="alert">{error}</div>}
        <label>
          Full Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          College Email
          <input
            required
            type="email"
            placeholder="you@rbunagpur.in"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <div className="two">
          <label>
            Department
            <input
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </label>
          <label>
            Year
            <select
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Password
          <input
            required
            type="password"
            minLength="6"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label>
          Confirm Password
          <input
            required
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <p className="muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
