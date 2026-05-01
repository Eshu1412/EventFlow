// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const dashboardLink = () => {
    if (!user) return null;
    return { user: "/dashboard", organizer: "/organizer", admin: "/admin" }[user.role] || "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Event<em>Flow</em>
      </Link>

      <div className="nav-links">
        <Link to="/events" className="nav-link">Events</Link>
        <Link to="/#categories" className="nav-link">Categories</Link>
        <Link to="/#about" className="nav-link">About</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ThemeToggle />

        {user ? (
          <>
            <Link to={dashboardLink()} className="btn btn-ghost btn-sm">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
