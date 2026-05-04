import ThemeToggle from "../../components/ThemeToggle";
// src/pages/admin/ManageEvents.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Users, Calendar, BarChart, Ticket, Settings, LogOut, Search, Download, Eye, Trash2, User, BookOpen } from "lucide-react";
import { formatDate, statusColor } from "../../utils/helpers";

const STATUS_TAG = { active:"tag-green", ended:"tag-muted", draft:"tag-gold" };
const getStatus  = (date) => (new Date(date) > new Date() ? "active" : "ended");

const MOCK = [
  { id:1, title:"DevConf 2026",            organizer_id:1, date:"2026-09-10", location:"Chicago",  booked_seats:127, total_seats:200 },
  { id:2, title:"Neon Beats Music Festival", organizer_id:2, date:"2026-07-12", location:"NYC",     booked_seats:980, total_seats:1500 },
  { id:3, title:"Old Tech Summit",           organizer_id:1, date:"2024-11-05", location:"Online",  booked_seats:43,  total_seats:100 },
];

export default function ManageEvents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    axios.get("/api/admin/events/")
      .then(r => { setEvents(r.data); setLoading(false); })
      .catch(() => { setEvents(MOCK); setLoading(false); });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this event?")) return;
    try {
      await axios.delete(`/api/events/${id}/`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { alert("Could not delete event."); }
  };

  const exportCSV = () => {
    const rows = [["ID","Title","Date","Location","Booked","Total"],
      ...events.map(e => [e.id, `"${e.title}"`, e.date, `"${e.location||""}"`, e.booked_seats||0, e.total_seats])];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv);
    a.download = "eventflow_events.csv"; a.click();
  };

  const filtered = events.filter(e =>
    (e.title    || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.location || "").toLowerCase().includes(search.toLowerCase())
  );

  const nav = [
    { to:"/admin",          icon:LayoutDashboard, label:"Dashboard"    },
    { to:"/admin/users",    icon:Users,           label:"Manage Users"  },
    { to:"/admin/events",   icon:Calendar,        label:"Manage Events", active:true },
    { to:"/admin/bookings", icon:Ticket,          label:"Bookings"      },
    { to:"/admin/reports",  icon:BarChart,        label:"Reports"       },
    { to:"/admin/settings", icon:Settings,        label:"Settings"      },
  ];

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
          <Link to="/my-bookings" className="sidebar-nav-link"><Ticket size={16} /> My Bookings</Link>
          <Link to="/profile" className="sidebar-nav-link"><User size={16} /> Profile</Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"#dc2626" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">MANAGE EVENTS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Search */}
        <div style={{ position:"relative", maxWidth:380, marginBottom:"1.5rem" }}>
          <Search size={14} style={{ position:"absolute", left:".85rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }} />
          <input
            className="form-control" placeholder="Search by title or location…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft:"2.25rem" }}
          />
        </div>

        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", overflow:"hidden"
        }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Title</th><th>Date</th><th>Location</th><th>Booked / Total</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>Loading events…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>No events found.</td></tr>
                ) : filtered.map(ev => {
                  const st = getStatus(ev.date);
                  return (
                    <tr key={ev.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{ev.title}</td>
                      <td style={{ fontSize:".82rem" }}>{formatDate(ev.date)}</td>
                      <td style={{ color:"var(--muted)", fontSize:".82rem" }}>{ev.location || "—"}</td>
                      <td>
                        <strong>{ev.booked_seats ?? 0}</strong>
                        <span style={{ color:"var(--muted)" }}> / {ev.total_seats}</span>
                      </td>
                      <td><span className={`tag ${STATUS_TAG[st] || "tag-muted"}`}>{st}</span></td>
                      <td>
                        <div style={{ display:"flex", gap:".4rem" }}>
                          <Link to={`/events/${ev.id}`} className="btn btn-ghost btn-sm" title="View" style={{ padding:"5px 8px" }}>
                            <Eye size={13} />
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Delete"
                            style={{ padding:"5px 8px", color:"#f87171" }}
                            onClick={() => handleDelete(ev.id)}
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
      
        <div style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 1000 }} className="hide-mobile"><ThemeToggle /></div>
        <div style={{ position: "fixed", top: "1rem", right: "4rem", zIndex: 1000 }} className="mobile-only-theme-toggle"><ThemeToggle /></div>
      </main>
    </div>
  );
}
