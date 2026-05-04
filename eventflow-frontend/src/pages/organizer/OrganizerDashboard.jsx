import ThemeToggle from "../../components/ThemeToggle";
// src/pages/organizer/OrganizerDashboard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Calendar, Plus, Users, BarChart2, Settings, LogOut, Edit, Trash2, Eye, ArrowUpRight, Ticket, User, BookOpen, Search } from "lucide-react";
import { formatDate, formatPrice } from "../../utils/helpers";

const MOCK_EVENTS = [
  { id:"e1", title:"DevConf 2026",        date:"2026-09-10", location:"Hyatt, Chicago", booked_seats:127, total_seats:200, status:"active" },
  { id:"e2", title:"UX Design Workshop",  date:"2026-07-18", location:"WeWork, NYC",    booked_seats:45,  total_seats:60,  status:"active" },
  { id:"e3", title:"Open Source Summit",  date:"2026-06-30", location:"Online",         booked_seats:322, total_seats:500, status:"ended"  },
  { id:"e4", title:"Blockchain Bootcamp", date:"2026-10-22", location:"SF Hub",         booked_seats:0,   total_seats:80,  status:"draft"  },
];

const STATUS_CLASS = { active:"tag-green", draft:"tag-gold", ended:"tag-muted" };

function getEventStatus(date) {
  const d = new Date(date);
  const now = new Date();
  if (d > now) return "active";
  return "ended";
}

export default function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Organizer";

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("/api/events/")
      .then(r => {
        // Filter to only this organizer's events
        const mine = user?.id
          ? r.data.filter(e => e.organizer_id === user.id)
          : r.data;
        setEvents(mine.length ? mine : r.data.slice(0, 10)); // fallback: show all if organizer_id unknown
        setLoading(false);
      })
      .catch(() => { setEvents(MOCK_EVENTS); setLoading(false); });
  }, [user?.id]);

  const totalSeats   = events.reduce((s, e) => s + (e.total_seats  || 0), 0);
  const totalBooked  = events.reduce((s, e) => s + (e.booked_seats || 0), 0);
  const activeEvents = events.filter(e => new Date(e.date) > new Date()).length;

  const filteredEvents = events.filter(ev => 
    ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (ev.location || ev.venue)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/events/${id}/`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { alert("Could not delete event. You may not have permission."); }
  };

  const doLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { to:"/organizer",               icon:LayoutDashboard, label:"Dashboard",     active:true },
    { to:"/organizer/create",        icon:Plus,            label:"Create Event"  },
    { to:"/organizer/registrations", icon:Users,           label:"Registrations" },
    { to:"/organizer/analytics",     icon:BarChart2,       label:"Analytics"     },
    { to:"/organizer/settings",      icon:Settings,        label:"Settings"      },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </Link>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Organizer</span>
          {navLinks.map(({ to, icon:Icon, label, active }) => (
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
          <div className="sidebar-avatar" style={{ background:"var(--coral)" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Organizer</div>
          </div>
          <button onClick={doLogout} style={{ color:"var(--muted)" }}><LogOut size={14} /></button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">ORGANIZER DASHBOARD</h1>
            <p className="page-subtitle">Manage your events and track registrations</p>
          </div>
          <Link to="/organizer/create" className="btn btn-primary">
            <Plus size={15} /> Create Event
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label:"My Events",          value: loading ? "—" : events.length, sub:`${activeEvents} upcoming`,   accent:"#60a5fa" },
            { label:"Total Registrations",value: loading ? "—" : totalBooked,   sub:"Across all events",          accent:"#c8a96e" },
            { label:"Capacity Used",      value: loading ? "—" : (totalSeats ? `${Math.round(totalBooked/totalSeats*100)}%` : "—"), sub:"Average fill rate", accent:"#34d399" },
            { label:"Upcoming",           value: loading ? "—" : activeEvents,  sub:"Events still to run",        accent:"#a78bfa" },
          ].map(({ label, value, sub, accent }) => (
            <div className="stat-card" key={label} style={{ "--stat-accent": accent }}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-sub">{sub}</div>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", marginBottom:"2rem", overflow:"hidden"
        }}>
          <div style={{
            padding:"1.25rem 1.5rem", borderBottom:"1px solid var(--border)",
            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem"
          }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.05rem", letterSpacing:"0.04em", color:"var(--white)", margin:0 }}>
              MY EVENTS
            </h3>
            <div style={{ display: "flex", gap: "1rem", flex: "1", justifyContent: "flex-end", alignItems: "center" }}>
              <div style={{ position: "relative", maxWidth: "250px", width: "100%" }}>
                <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ 
                    width: "100%", padding: "0.4rem 1rem 0.4rem 2.2rem", 
                    borderRadius: "20px", border: "1px solid var(--border)", 
                    background: "var(--input-bg)", color: "var(--white)", fontSize: "0.85rem",
                    outline: "none"
                  }} 
                />
              </div>
              <Link to="/organizer/create" className="btn btn-ghost btn-sm" style={{ fontSize:"0.75rem", whiteSpace: "nowrap" }}>
                <Plus size={13} /> Add New
              </Link>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th><th>Date</th><th>Location</th>
                  <th>Booked / Total</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign:"center", padding:"2rem", color:"var(--muted)" }}>Loading…</td></tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign:"center", padding:"3rem" }}>
                      <Calendar size={28} style={{ opacity:.3, display:"block", margin:"0 auto .75rem" }} />
                      <span style={{ color:"var(--muted)", fontSize:".85rem" }}>No events found. </span>
                      {searchQuery === "" && <Link to="/organizer/create" style={{ color:"var(--gold)", fontSize:".85rem" }}>Create your first →</Link>}
                    </td>
                  </tr>
                ) : filteredEvents.map(ev => {
                  const status = getEventStatus(ev.date);
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{ev.title}</td>
                      <td>{formatDate(ev.date)}</td>
                      <td style={{ color:"var(--muted)" }}>{ev.location || ev.venue || "—"}</td>
                      <td>
                        <span style={{ fontWeight:600 }}>{ev.booked_seats ?? 0}</span>
                        <span style={{ color:"var(--muted)" }}> / {ev.total_seats ?? "—"}</span>
                      </td>
                      <td>
                        <span className={`tag ${STATUS_CLASS[status] || "tag-muted"}`}>{status}</span>
                      </td>
                      <td>
                        <div style={{ display:"flex", gap:".4rem" }}>
                          <Link to={`/events/${ev.id}`} className="btn btn-ghost btn-sm" title="View" style={{ padding:"5px 8px" }}>
                            <Eye size={13} />
                          </Link>
                          <Link to={`/organizer/edit/${ev.id}`} className="btn btn-ghost btn-sm" title="Edit" style={{ padding:"5px 8px" }}>
                            <Edit size={13} />
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Delete"
                            onClick={() => handleDelete(ev.id)}
                            style={{ padding:"5px 8px", color:"#f87171" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          <Link to="/organizer/create" className="btn btn-primary" style={{ flex:"1 1 200px", justifyContent:"center" }}>
            <Plus size={15} /> Create New Event
          </Link>
          <Link to="/organizer/registrations" className="btn btn-outline" style={{ flex:"1 1 200px", justifyContent:"center" }}>
            <Users size={15} /> View Registrations <ArrowUpRight size={13} />
          </Link>
        </div>
      
        <div style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 1000 }} className="hide-mobile"><ThemeToggle /></div>
        <div style={{ position: "fixed", top: "1rem", right: "4rem", zIndex: 1000 }} className="mobile-only-theme-toggle"><ThemeToggle /></div>
      </main>
    </div>
  );
}
