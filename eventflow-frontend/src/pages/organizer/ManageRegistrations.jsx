import ThemeToggle from "../../components/ThemeToggle";
// src/pages/organizer/ManageRegistrations.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Plus, Users, BarChart2, Settings, LogOut, Download, Search, CheckCircle, XCircle, Clock, User, BookOpen, Ticket, Calendar } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const STATUS_TAG  = { confirmed:"tag-green", pending:"tag-gold", cancelled:"tag-coral" };
const STATUS_ICON = { confirmed:CheckCircle, pending:Clock, cancelled:XCircle };

const MOCK = [
  { id:1, user_name:"Alex Chen",  user_id:1, event_title:"DevConf 2026",       booked_at:"2026-04-08T10:00:00Z", status:"confirmed" },
  { id:2, user_name:"Priya Shah", user_id:2, event_title:"UX Design Workshop", booked_at:"2026-04-09T14:30:00Z", status:"confirmed" },
  { id:3, user_name:"Marcus J.",  user_id:3, event_title:"DevConf 2026",       booked_at:"2026-04-10T09:15:00Z", status:"pending"   },
  { id:4, user_name:"Sarah K.",   user_id:4, event_title:"Open Source Summit", booked_at:"2026-04-06T11:00:00Z", status:"cancelled"  },
];

export default function ManageRegistrations() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Organizer";

  const [regs,    setRegs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    // Use the organizer-specific bookings endpoint (returns only this organizer's event bookings)
    axios.get("/api/organizer/bookings/")
      .then(r => {
        setRegs(r.data);
        setLoading(false);
      })
      .catch(() => { setRegs(MOCK); setLoading(false); });
  }, [user?.id]);

  const filtered = regs.filter(r => {
    const matchSearch =
      (r.user_name   || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.event_title || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const exportCSV = () => {
    const rows = [["ID","User","Event","Status","Booked At"],
      ...regs.map(r => [r.id, `"${r.user_name}"`, `"${r.event_title}"`, r.status, new Date(r.booked_at).toLocaleDateString()])];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = encodeURI(csv);
    a.download = "registrations.csv"; a.click();
  };

  const counts = {
    all:       regs.length,
    confirmed: regs.filter(r => r.status === "confirmed").length,
    pending:   regs.filter(r => r.status === "pending").length,
    cancelled: regs.filter(r => r.status === "cancelled").length,
  };

  const nav = [
    { to:"/organizer",               icon:LayoutDashboard, label:"Dashboard"      },
    { to:"/organizer/create",        icon:Plus,            label:"Create Event"   },
    { to:"/organizer/registrations", icon:Users,           label:"Registrations", active:true },
    { to:"/organizer/analytics",     icon:BarChart2,       label:"Analytics"      },
    { to:"/organizer/settings",      icon:Settings,        label:"Settings"       },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </Link>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Organizer</span>
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
          <div className="sidebar-avatar" style={{ background:"var(--coral)" }}>{name[0].toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Organizer</div>
          </div>
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">REGISTRATIONS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${filtered.length} registration${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Filter tabs + search row */}
        <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ display:"flex", gap:".4rem" }}>
            {["all","confirmed","pending","cancelled"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn btn-sm ${filter===f?"btn-primary":"btn-ghost"}`}
                style={{ textTransform:"capitalize" }}
              >
                {f} <span style={{ opacity:.6, marginLeft:".3rem", fontSize:".78em" }}>({counts[f]})</span>
              </button>
            ))}
          </div>
          <div style={{ position:"relative", maxWidth:300, flex:1 }}>
            <Search size={14} style={{ position:"absolute", left:".85rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted)" }} />
            <input
              className="form-control" placeholder="Search by name or event…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft:"2.25rem" }}
            />
          </div>
        </div>

        <div style={{
          background:"var(--ink-3)", border:"1px solid var(--border)",
          borderRadius:"var(--r-md)", overflow:"hidden"
        }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Attendee</th><th>Event</th><th>Booked At</th><th>Status</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign:"center", padding:"2.5rem", color:"var(--muted)" }}>Loading registrations…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign:"center", padding:"3rem" }}>
                      <Users size={28} style={{ opacity:.25, display:"block", margin:"0 auto .75rem" }} />
                      <span style={{ color:"var(--muted)", fontSize:".85rem" }}>
                        {search ? `No results for "${search}"` : `No ${filter === "all" ? "" : filter + " "}registrations.`}
                      </span>
                    </td>
                  </tr>
                ) : filtered.map(r => {
                  const Icon = STATUS_ICON[r.status] || Clock;
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight:600, color:"var(--white)" }}>{r.user_name || "—"}</td>
                      <td style={{ color:"var(--muted)" }}>{r.event_title || "—"}</td>
                      <td style={{ fontSize:".82rem", color:"var(--muted)" }}>
                        {r.booked_at ? new Date(r.booked_at).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "—"}
                      </td>
                      <td>
                        <span className={`tag ${STATUS_TAG[r.status] || "tag-muted"}`} style={{ display:"inline-flex", alignItems:"center", gap:".35rem" }}>
                          <Icon size={11} /> {r.status}
                        </span>
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
