// src/pages/admin/AdminPanel.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Users, Calendar, BarChart, Settings, LogOut, Ticket, ArrowUpRight, RefreshCw, User, BookOpen } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const ROLE_TAG   = { user:"tag-muted", organizer:"tag-gold", admin:"tag-coral" };
const STATUS_TAG = { active:"tag-green", ended:"tag-muted", draft:"tag-gold" };
const getStatus  = (date) => (new Date(date) > new Date() ? "active" : "ended");

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get("/api/admin/stats/").catch(() => ({ data: null })),
      axios.get("/api/admin/users/").catch(() => ({ data: [] })),
      axios.get("/api/admin/events/").catch(() => ({ data: [] })),
    ]).then(([s, u, e]) => {
      setStats(s.data);
      setUsers((u.data || []).slice(0, 5));
      setEvents((e.data || []).slice(0, 5));
      setLoading(false);
    });
  };

  useEffect(() => { load(); , []);

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try { await axios.delete(`/api/admin/users/${id}/`); setUsers(p => p.filter(u => u.id !== id)); }
    catch { alert("Could not delete user."); }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Permanently delete this event?")) return;
    try { await axios.delete(`/api/events/${id}/`); setEvents(p => p.filter(e => e.id !== id)); }
    catch { alert("Could not delete event."); }
  };

  const nav = [
    { to:"/admin",          icon:LayoutDashboard, label:"Dashboard",     active:true },
    { to:"/admin/users",    icon:Users,           label:"Manage Users"   },
    { to:"/admin/events",   icon:Calendar,        label:"Manage Events"  },
    { to:"/admin/bookings", icon:Ticket,          label:"Bookings"       },
    { to:"/admin/reports",  icon:BarChart,        label:"Reports"        },
    { to:"/admin/settings", icon:Settings,        label:"Settings"       },
  ];

  const statCards = [
    { label:"Total Users",    value: stats?.total_users    ?? "—", sub:"Registered accounts", accent:"#60a5fa" },
    { label:"Total Events",   value: stats?.total_events   ?? "—", sub:"All time",            accent:"#34d399" },
    { label:"Total Bookings", value: stats?.total_bookings ?? "—", sub:"All time",            accent:"#c8a96e" },
    { label:"Active Events",  value: events.filter(e => getStatus(e.date) === "active").length, sub:"Currently running", accent:"#a78bfa" },
  ];

  const row = { padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const box = { background:"var(--ink-3)", border:"1px solid var(--border)", borderRadius:"var(--r-md)", marginBottom:"2rem", overflow:"hidden" };

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </Link>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Admin</span>
          {nav.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active?"active":""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}

          <span className="sidebar-nav-section" style={{ marginTop: "1.5rem" }}>Personal</span>
          <Link to="/events" className="sidebar-nav-link"><Calendar size={16} /> Browse Events</Link>
          <Link to="/my-bookings" className="sidebar-nav-link"><BookOpen size={16} /> My Bookings</Link>
          <Link to="/profile" className="sidebar-nav-link"><User size={16} /> Profile</Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"#dc2626" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}><LogOut size={14} /></button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">ADMIN CONTROL PANEL</h1>
            <p className="page-subtitle">{new Date().toLocaleString()}</p>
          </div>
          <div style={{ display:"flex", gap:".75rem" }}>
            <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
              <RefreshCw size={13} /> Refresh
            </button>
            <Link to="/admin/users"  className="btn btn-outline btn-sm"><Users size={13} /> Users</Link>
            <Link to="/admin/events" className="btn btn-primary btn-sm"><Calendar size={13} /> Events</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map(({ label, value, sub, accent }) => (
            <div className="stat-card" key={label} style={{ "--stat-accent": accent }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{loading ? "—" : value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div style={box}>
          <div style={row}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", letterSpacing:"0.04em", color:"var(--white)" }}>RECENT USERS</h3>
            <Link to="/admin/users" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>Manage All <ArrowUpRight size={13} /></Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan="4" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                  : users.length === 0
                    ? <tr><td colSpan="4" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>No users found.</td></tr>
                    : users.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight:600, color:"var(--white)" }}>{u.name || "—"}</td>
                        <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{u.email}</td>
                        <td><span className={`tag ${ROLE_TAG[u.role]||"tag-muted"}`}>{u.role}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:".4rem" }}>
                            <button className="btn btn-ghost btn-sm" style={{ fontSize:".78rem" }}>Edit</button>
                            <button className="btn btn-ghost btn-sm" style={{ fontSize:".78rem", color:"#f87171" }} onClick={() => deleteUser(u.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Events table */}
        <div style={box}>
          <div style={row}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", letterSpacing:"0.04em", color:"var(--white)" }}>RECENT EVENTS</h3>
            <Link to="/admin/events" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>Manage All <ArrowUpRight size={13} /></Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Booked</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {loading
                  ? <tr><td colSpan="6" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                  : events.length === 0
                    ? <tr><td colSpan="6" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>No events found.</td></tr>
                    : events.map(ev => {
                      const st = getStatus(ev.date);
                      return (
                        <tr key={ev.id}>
                          <td style={{ fontWeight:600, color:"var(--white)" }}>{ev.title}</td>
                          <td style={{ fontSize:".82rem" }}>{formatDate(ev.date)}</td>
                          <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{ev.location || "—"}</td>
                          <td><strong>{ev.booked_seats ?? 0}</strong><span style={{ color:"var(--muted)" }}> / {ev.total_seats}</span></td>
                          <td><span className={`tag ${STATUS_TAG[st]||"tag-muted"}`}>{st}</span></td>
                          <td>
                            <div style={{ display:"flex", gap:".4rem" }}>
                              <Link to={`/events/${ev.id}`} className="btn btn-ghost btn-sm" style={{ fontSize:".78rem" }}>View</Link>
                              <button className="btn btn-ghost btn-sm" style={{ fontSize:".78rem", color:"#f87171" }} onClick={() => deleteEvent(ev.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
