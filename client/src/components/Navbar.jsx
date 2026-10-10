import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link className="brand" to="/">
        CampusMart
      </Link>
      <nav>
        <Link to="/marketplace">Browse</Link>
        {user && <Link to="/sell">Sell Item</Link>}
        {user && <Link to="/my-listings">My Listings</Link>}
        {user?.isAdmin && <Link to="/admin">Admin</Link>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/profile" className="user-chip">
              {user.name}
            </Link>
            <button
              className="link-btn"
              onClick={() => {
                logout();
                nav("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="btn small" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
