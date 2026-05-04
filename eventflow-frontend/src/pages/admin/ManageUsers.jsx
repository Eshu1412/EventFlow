import ThemeToggle from "../../components/ThemeToggle";
// src/pages/admin/ManageUsers.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Users, Calendar, BarChart, Ticket, Settings, LogOut, Search, Download, Shield, Trash2, User, BookOpen } from "lucide-react";
import { formatDate, roleColor } from "../../utils/helpers";

const ROLE_TAG = { user: "tag-muted", organizer: "tag-gold", admin: "tag-coral" };

const MOCK = [
  { id: 1, name: "Alex Chen", email: "alex@ex.com", role: "user", joined: "2026-04-08" },
  { id: 2, name: "Priya Shah", email: "priya@ex.com", role: "organizer", joined: "2026-04-07" },
  { id: 3, name: "Marcus J.", email: "marcus@ex.com", role: "user", joined: "2026-04-06" },
  { id: 4, name: "Sarah K.", email: "sarah@ex.com", role: "user", joined: "2026-03-20" },
  { id: 5, name: "Admin User", email: "admin@ef.com", role: "admin", joined: "2026-01-01" },
];

export default function ManageUsers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/admin/users/")
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => { setUsers(MOCK); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await axios.delete(`/api/admin/users/${id}/`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert("Could not delete user."); }
  };

  const changeRole = async (id, newRole) => {
    try {
      await axios.put(`/api/admin/users/${id}/`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch { alert("Could not change role. Make sure you are logged in as admin."); }
  };

  const exportCSV = () => {
    const rows = [["ID", "Name", "Email", "Role"],
    ...users.map(u => [u.id, `"${u.name}"`, u.email, u.role])];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv);
    a.download = "eventflow_users.csv"; a.click();
  };

  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const nav = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/users", icon: Users, label: "Manage Users", active: true },
    { to: "/admin/events", icon: Calendar, label: "Manage Events" },
    { to: "/admin/bookings", icon: Ticket, label: "Bookings" },
    { to: "/admin/reports", icon: BarChart, label: "Reports" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
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
          <Link to="/my-bookings" className="sidebar-nav-link"><Ticket size={16} /> My Bookings</Link>
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
            <h1 className="page-title">MANAGE USERS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} user${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 380, marginBottom: "1.5rem" }}>
          <Search size={14} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            className="form-control" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>

        <div style={{
          background: "var(--ink-3)", border: "1px solid var(--border)",
          borderRadius: "var(--r-md)", overflow: "hidden"
        }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>Loading users…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>No users found matching "{search}"</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: "var(--white)" }}>{u.name || "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: ".82rem" }}>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        style={{
                          background: "var(--ink-4)", border: "1px solid var(--border)",
                          borderRadius: "var(--r-xs)", color: "var(--text)", fontSize: ".78rem",
                          padding: "3px 8px", cursor: "pointer"
                        }}
                      >
                        <option value="user">user</option>
                        <option value="organizer">organizer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ fontSize: ".82rem", color: "var(--muted)" }}>
                      {u.joined ? formatDate(u.joined) : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: ".4rem" }}>
                        <button className="btn btn-ghost btn-sm" title="Change Role" style={{ fontSize: ".78rem" }}>
                          <Shield size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Delete User"
                          style={{ fontSize: ".78rem", color: "#f87171" }}
                          onClick={() => handleDelete(u.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
        <div style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 1000 }} className="hide-mobile"><ThemeToggle /></div>
        <div style={{ position: "fixed", top: "1rem", right: "4rem", zIndex: 1000 }} className="mobile-only-theme-toggle"><ThemeToggle /></div>
      </main>
    </div>
  );
}
