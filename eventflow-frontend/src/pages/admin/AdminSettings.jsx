import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Users, Calendar, BarChart, Settings, LogOut,
  Ticket, User, BookOpen, Save, Shield
} from "lucide-react";

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [settings, setSettings] = useState({
    siteName: "EventFlow",
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    maxEventsPerOrganizer: 10
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    // Mock API save
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const nav = [
    { to: "/admin",          icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users",    icon: Users,           label: "Manage Users" },
    { to: "/admin/events",   icon: Calendar,        label: "Manage Events" },
    { to: "/admin/bookings", icon: Ticket,          label: "Bookings" },
    { to: "/admin/reports",  icon: BarChart,        label: "Reports" },
    { to: "/admin/settings", icon: Settings,        label: "Settings", active: true },
  ];

  return (
    <div className="app-layout" style={{ paddingTop: 0 }}>
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </Link>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Admin</span>
          {nav.map(({ to, icon: Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}

          <span className="sidebar-nav-section" style={{ marginTop: "1.5rem" }}>Personal</span>
          <Link to="/events" className="sidebar-nav-link"><Calendar size={16} /> Browse Events</Link>
          <Link to="/my-bookings" className="sidebar-nav-link"><BookOpen size={16} /> My Bookings</Link>
          <Link to="/profile" className="sidebar-nav-link"><User size={16} /> Profile</Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: "#dc2626" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color: "var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">SYSTEM SETTINGS</h1>
            <p className="page-subtitle">Configure global parameters and security rules</p>
          </div>
        </div>

        <div style={{ 
          maxWidth: "800px", 
          background: "var(--ink-3)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--r-md)", 
          padding: "2rem" 
        }}>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--white)", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>
                <Shield size={18} /> General Settings
              </h3>
              
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ color: "var(--white)" }}>Site Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ color: "var(--white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input 
                    type="checkbox" 
                    name="allowRegistrations"
                    checked={settings.allowRegistrations}
                    onChange={handleChange}
                    style={{ accentColor: "var(--gold)" }}
                  />
                  Allow New User Registrations
                </label>
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ color: "var(--white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input 
                    type="checkbox" 
                    name="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={handleChange}
                    style={{ accentColor: "var(--gold)" }}
                  />
                  Require Email Verification for Organizers
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--white)", marginBottom: "1rem", fontFamily: "var(--font-display)" }}>
                <Settings size={18} /> System Limits
              </h3>
              
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ color: "var(--white)" }}>Max Events Per Organizer</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="maxEventsPerOrganizer"
                  value={settings.maxEventsPerOrganizer}
                  onChange={handleChange}
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label className="form-label" style={{ color: "var(--white)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input 
                    type="checkbox" 
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    style={{ accentColor: "var(--coral)" }}
                  />
                  <span style={{ color: "var(--coral)", fontWeight: "600" }}>Enable Maintenance Mode</span> (Restricts access to admins only)
                </label>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : <><Save size={16} /> Save Changes</>}
              </button>
              {success && <span style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: "600" }}>Settings updated successfully!</span>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
