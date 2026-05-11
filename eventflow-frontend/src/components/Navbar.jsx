// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { setMenuOpen(false); logout(); navigate("/"); };

  const dashboardLink = () => {
    if (!user) return null;
    return { user: "/dashboard", organizer: "/organizer", admin: "/admin" }[user.role] || "/";
  };

  return (
    <nav className="navbar">
      {/* ── Brand ── */}
      <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        Event<em>Flow</em>
      </Link>

      {/* ── Nav links: inline on desktop, slide-down panel on mobile ── */}
      <div className={`nav-content ${menuOpen ? "open" : ""}`}>
        <div className="nav-links">
          <Link to="/events"      className="nav-link" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/#categories" className="nav-link" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link to="/#about"      className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      </div>

      {/* ── Right strip: auth buttons + theme toggle + hamburger (always in header) ── */}
      <div className="nav-actions">
        {user ? (
          <>
            <Link to={dashboardLink()} className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              <LayoutDashboard size={14} />
              <span className="hide-mobile-text">Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut size={14} />
              <span className="hide-mobile-text">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)} aria-label="Sign in">
              <LogIn size={14} />
              <span className="hide-mobile-text">Sign In</span>
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)} aria-label="Create account">
              <UserPlus size={14} />
              <span className="hide-mobile-text">Get Started</span>
            </Link>
          </>
        )}

        <ThemeToggle />

        {/* Hamburger — CSS shows on mobile, hidden on desktop */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
