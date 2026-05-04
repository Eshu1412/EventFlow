// src/pages/admin/ManageBookings.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, Calendar, BarChart, Settings, LogOut, Search, Download, Ticket, User, BookOpen } from "lucide-react";
import axios from "axios";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

const MOCK = [
  { id: 1, user_name: "Alex Chen",  event_title: "TechConf Summit",       status: "confirmed", booked_at: "2026-04-08T10:00:00Z" },
  { id: 2, user_name: "Priya Shah", event_title: "Neon Beats Festival",   status: "confirmed", booked_at: "2026-04-09T14:30:00Z" },
  { id: 3, user_name: "Marcus J.",  event_title: "Urban Marathon",         status: "cancelled", booked_at: "2026-04-07T09:15:00Z" },
  { id: 4, user_name: "Sarah K.",   event_title: "Digital Art Expo 2026", status: "confirmed", booked_at: "2026-04-10T16:00:00Z" },
];

export default function ManageBookings() {
  const { user, logout } = useAuth();
  const name = user?.name || "Admin";

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    axios.get("/api/admin/bookings/", authHeaders())
      .then(r => setBookings(r.data))
      .catch(() => setBookings(MOCK))
      .finally(() => setLoading(false));
  , []);

  const filtered = bookings.filter(b =>
    (b.user_name  || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.event_title || "").toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["ID", "User Name", "Event Title", "Status", "Booked At"],
      ...bookings.map(b => [
        b.id,
        `"${b.user_name}"`,
        `"${b.event_title}"`,
        b.status,
        `"${new Date(b.booked_at).toLocaleDateString()}"`,
      ]),
    ];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "eventflow_bookings.csv";
    a.click();
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </Link>
        <nav className="sidebar-nav">
          {[
            { to: "/admin",          icon: LayoutDashboard, label: "Dashboard" },
            { to: "/admin/users",    icon: Users,            label: "Manage Users" },
            { to: "/admin/events",   icon: Calendar,         label: "Manage Events" },
            { to: "/admin/bookings", icon: Ticket,           label: "Manage Bookings", active: true },
            { to: "/admin/reports",  icon: BarChart,         label: "Reports" },
            { to: "#",               icon: Settings,         label: "Settings" },
          ].map(({ to, icon: Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={17} /> {label}
            </Link>
          ))}

          <span className="sidebar-nav-section" style={{ marginTop: "1.5rem" }}>Personal</span>
          <Link to="/events" className="sidebar-nav-link"><Calendar size={16} /> Browse Events</Link>
          <Link to="/my-bookings" className="sidebar-nav-link"><Ticket size={16} /> My Bookings</Link>
          <Link to="/profile" className="sidebar-nav-link"><User size={16} /> Profile</Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: "#dc2626" }}>{name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: ".83rem", fontWeight: 600 }}>{name}</div>
            <span className="badge badge-red" style={{ fontSize: ".65rem" }}>Admin</span>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Bookings</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} booking${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        <div className="page-content">
          {/* Search */}
          <div style={{ position: "relative", maxWidth: 360, marginBottom: "1.5rem" }}>
            <Search size={15} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
            <input
              className="form-control"
              placeholder="Search by user or event…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Event Title</th>
                    <th>Status</th>
                    <th>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Loading…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-text-muted)" }}>
                        <Ticket size={32} style={{ marginBottom: ".75rem", opacity: .3, display: "block", margin: "0 auto .75rem" }} />
                        No bookings matching &ldquo;{search}&rdquo;
                      </td>
                    </tr>
                  ) : filtered.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: "var(--color-text-muted)", fontSize: ".82rem" }}>#{b.id}</td>
                      <td style={{ fontWeight: 600 }}>{b.user_name}</td>
                      <td>{b.event_title}</td>
                      <td>
                        <span className={`badge ${b.status === "confirmed" ? "badge-green" : "badge-red"}`}>
                          {b.status === "confirmed" ? "✅ Confirmed" : "❌ Cancelled"}
                        </span>
                      </td>
                      <td style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>
                        {new Date(b.booked_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
