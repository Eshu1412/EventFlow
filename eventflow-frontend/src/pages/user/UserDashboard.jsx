// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Calendar, BookOpen, User, LogOut,
         Ticket, ArrowUpRight, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const MOCK_BOOKINGS = [
  { id:"b1", event_title:"Neon Beats Festival",  event_date:"2026-07-12", event_location:"MSG, NYC",       status:"confirmed" },
  { id:"b2", event_title:"TechConf Summit",       event_date:"2026-08-03", event_location:"Moscone, SF",   status:"pending"   },
  { id:"b3", event_title:"Urban Marathon",        event_date:"2026-06-22", event_location:"Central Park",  status:"confirmed" },
  { id:"b4", event_title:"Art Expo 2026",         event_date:"2026-09-05", event_location:"MoMA, NYC",     status:"cancelled" },
];

const STATUS_TAG  = { confirmed:"tag-green", pending:"tag-gold", cancelled:"tag-coral" };
const STATUS_ICON = { confirmed: CheckCircle, pending: Clock, cancelled: XCircle };

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "User";

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    axios.get("/api/bookings/me/")
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => { setBookings(MOCK_BOOKINGS); setLoading(false); });
  }, []);

  const now = new Date();
  const upcoming  = bookings.filter(b => b.status !== "cancelled" && new Date(b.event_date) > now).length;
  const attended  = bookings.filter(b => b.status === "confirmed"  && new Date(b.event_date) < now).length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  const stats = [
    { label:"Total Bookings", value: bookings.length, sub:"+1 this month",  accent:"#c8a96e" },
    { label:"Upcoming",       value: upcoming,         sub:"Next events",    accent:"#60a5fa" },
    { label:"Attended",       value: attended,         sub:"All time",       accent:"#34d399" },
    { label:"Cancelled",      value: cancelled,        sub:"This year",      accent:"#f87171" },
  ];

  const doLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { to:"/dashboard",   icon:LayoutDashboard, label:"Dashboard",    active:true },
    { to:"/events",      icon:Calendar,         label:"Browse Events" },
    { to:"/my-bookings", icon:BookOpen,          label:"My Bookings" },
    { to:"/profile",     icon:User,              label:"Profile" },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Main</span>
          {navItems.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">User</div>
          </div>
          <button onClick={doLogout} style={{ color:"var(--muted)" }} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="main-content">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">WELCOME BACK, {name.toUpperCase()}</h1>
            <p className="page-subtitle">
              {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
          <Link to="/events" className="btn btn-primary">
            <Calendar size={15} /> Browse Events
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map(({ label, value, sub, accent }) => (
            <div className="stat-card" key={label} style={{ "--stat-accent": accent }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{loading ? "—" : value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Bookings table */}
        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", marginBottom:"2rem", overflow:"hidden"
        }}>
          <div style={{
            padding:"1.25rem 1.5rem", borderBottom:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center"
          }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", letterSpacing:"0.04em", color:"var(--white)" }}>
              RECENT BOOKINGS
            </h3>
            <Link to="/my-bookings" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem" }}>
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign:"center", padding:"2rem" }}>
                      <Ticket size={28} style={{ opacity:.3, display:"block", margin:"0 auto .75rem" }} />
                      <span style={{ color:"var(--muted)", fontSize:".85rem" }}>No bookings yet.</span>
                    </td>
                  </tr>
                ) : bookings.slice(0, 5).map((b) => {
                  const Icon = STATUS_ICON[b.status] || Clock;
                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{b.event_title}</td>
                      <td>{b.event_date ? formatDate(b.event_date) : "—"}</td>
                      <td style={{ color:"var(--muted)" }}>{b.event_location || "—"}</td>
                      <td>
                        <span className={`tag ${STATUS_TAG[b.status] || "tag-muted"}`} style={{ display:"inline-flex", alignItems:"center", gap:".3rem" }}>
                          <Icon size={10} /> {b.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/events/${b.event_id}`} className="btn btn-ghost btn-sm" style={{ fontSize:".75rem", padding:"5px 10px" }}>
                          <Ticket size={12} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming events mini cards */}
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.1rem", letterSpacing:"0.04em", color:"var(--white)", marginBottom:"1.25rem" }}>
          UPCOMING EVENTS
        </h3>
        {loading ? (
          <p style={{ color:"var(--muted)", fontSize:".85rem" }}>Loading…</p>
        ) : (
          <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
            {bookings
              .filter(b => b.status !== "cancelled" && new Date(b.event_date) > now)
              .slice(0, 3)
              .map((b) => (
                <div key={b.id} style={{
                  flex:"1 1 220px",
                  background:"var(--ink-3)", border:"1px solid var(--border)",
                  borderRadius:"var(--r-md)", padding:"1.25rem",
                  transition:"border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{ fontWeight:600, marginBottom:".5rem", fontSize:".9rem", color:"var(--white)" }}>
                    {b.event_title}
                  </div>
                  <div className="event-meta-row" style={{ marginBottom:".3rem" }}>
                    <Calendar size={11} /> {b.event_date ? formatDate(b.event_date) : "—"}
                  </div>
                  {b.event_location && (
                    <div className="event-meta-row">
                      <MapPin size={11} /> {b.event_location}
                    </div>
                  )}
                </div>
              ))}
            {bookings.filter(b => b.status !== "cancelled" && new Date(b.event_date) > now).length === 0 && (
              <p style={{ color:"var(--muted)", fontSize:".85rem" }}>No upcoming events. <Link to="/events" style={{ color:"var(--gold)" }}>Browse now →</Link></p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
