// src/pages/user/BookingHistory.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Calendar, BookOpen, User, LogOut,
  Ticket, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Download,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import { downloadTicket } from "../../utils/ticketDownload";

const MOCK = [
  { id:"b1", event_id:1, event_title:"Neon Beats Festival", event_date:"2025-07-12", event_location:"MSG, NYC",       status:"confirmed" },
  { id:"b2", event_id:2, event_title:"TechConf Summit",      event_date:"2025-08-03", event_location:"Moscone, SF",   status:"pending"   },
  { id:"b3", event_id:3, event_title:"Urban Marathon",        event_date:"2025-06-22", event_location:"Central Park", status:"confirmed" },
  { id:"b4", event_id:4, event_title:"Art Expo 2025",         event_date:"2025-09-05", event_location:"MoMA, NYC",    status:"cancelled" },
];

const STATUS_TAG  = { confirmed:"tag-green", pending:"tag-gold", cancelled:"tag-coral" };
const STATUS_ICON = { confirmed:CheckCircle, pending:Clock, cancelled:XCircle };

export default function BookingHistory() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "User";

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [downloading, setDownloading] = useState({});  // { [bookingId]: bool }

  useEffect(() => {
    axios.get("/api/bookings/me/")
      .then(r => { setBookings(r.data); setLoading(false); })
      .catch(() => { setBookings(MOCK); setLoading(false); });
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.delete(`/api/bookings/${id}/`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status:"cancelled" } : b));
    } catch {
      alert("Could not cancel. Please try again.");
    }
  };

  const handleDownload = async (id, title) => {
    setDownloading(prev => ({ ...prev, [id]: true }));
    try {
      await downloadTicket(id, title);
    } catch {
      alert("Could not download ticket. Please try again.");
    } finally {
      setDownloading(prev => ({ ...prev, [id]: false }));
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all:       bookings.length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    pending:   bookings.filter(b => b.status === "pending").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const navItems = [
    { to:"/dashboard",   icon:LayoutDashboard, label:"Dashboard"    },
    { to:"/events",      icon:Calendar,         label:"Browse Events"},
    { to:"/my-bookings", icon:BookOpen,          label:"My Bookings", active:true },
    { to:"/profile",     icon:User,              label:"Profile"     },
  ];

  return (
    <div className="app-layout" style={{ paddingTop:0 }}>
      {/* Sidebar */}
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
          <button onClick={() => { logout(); navigate("/"); }} style={{ color:"var(--muted)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">MY BOOKINGS</h1>
            <p className="page-subtitle">
              {loading ? "Loading…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Link to="/events" className="btn btn-primary">
            <Calendar size={15} /> Browse Events
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:".5rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
          {["all", "confirmed", "pending", "cancelled"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
              style={{ textTransform:"capitalize" }}
            >
              {f} <span style={{ opacity:.6, marginLeft:".3rem", fontSize:".78em" }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {loading ? (
          <div style={{
            background:"var(--ink-3)", border:"1px solid var(--border)",
            borderRadius:"var(--r-md)", padding:"3rem", textAlign:"center", color:"var(--muted)"
          }}>
            <Clock size={28} style={{ opacity:.3, display:"block", margin:"0 auto .75rem" }} />
            Loading your bookings…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background:"var(--ink-3)", border:"1px solid var(--border)",
            borderRadius:"var(--r-md)", padding:"3rem", textAlign:"center"
          }}>
            <Ticket size={36} style={{ opacity:.25, display:"block", margin:"0 auto 1rem", color:"var(--gold)" }} />
            <p style={{ color:"var(--muted)", marginBottom:"1rem", fontSize:".9rem" }}>
              {filter === "all" ? "You have no bookings yet." : `No ${filter} bookings.`}
            </p>
            <Link to="/events" className="btn btn-primary btn-sm">Browse Events</Link>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {filtered.map(b => {
              const Icon = STATUS_ICON[b.status] || AlertCircle;
              const isPast = new Date(b.event_date) < new Date();
              return (
                <div
                  className="booking-row"
                  key={b.id}
                  style={{
                    background:"var(--ink-3)", border:"1px solid var(--border)",
                    borderRadius:"var(--r-md)", padding:"1.25rem 1.5rem",
                    display:"flex", alignItems:"center", gap:"1.25rem",
                    transition:"border-color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {/* Icon circle */}
                  <div style={{
                    width:44, height:44, borderRadius:"50%",
                    background:"rgba(200,169,110,0.1)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"var(--gold)", flexShrink:0,
                  }}>
                    <Ticket size={18} />
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, color:"var(--white)", marginBottom:".35rem", fontSize:".95rem" }}>
                      {b.event_title}
                    </div>
                    <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                      {b.event_date && (
                        <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--muted)" }}>
                          <Calendar size={11} /> {formatDate(b.event_date)}
                        </span>
                      )}
                      {b.event_location && (
                        <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--muted)" }}>
                          <MapPin size={11} /> {b.event_location}
                        </span>
                      )}
                      {b.booked_at && (
                        <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--muted)" }}>
                          <Clock size={11} /> Booked {new Date(b.booked_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`tag ${STATUS_TAG[b.status] || "tag-muted"}`} style={{ display:"inline-flex", alignItems:"center", gap:".3rem", flexShrink:0 }}>
                    <Icon size={11} /> {b.status}
                  </span>

                  {/* Actions */}
                  <div className="booking-actions" style={{ display:"flex", gap:".5rem", flexShrink:0 }}>
                    <Link
                      to={`/events/${b.event_id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize:".75rem", padding:"5px 12px" }}
                    >
                      View
                    </Link>
                    {b.status === "confirmed" && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDownload(b.id, b.event_title)}
                        disabled={!!downloading[b.id]}
                        style={{
                          fontSize: ".75rem",
                          padding: "5px 12px",
                          color: "var(--gold)",
                          display: "flex",
                          alignItems: "center",
                          gap: ".3rem",
                        }}
                        title="Download PDF Ticket"
                      >
                        <Download size={12} />
                        {downloading[b.id] ? "…" : "Ticket"}
                      </button>
                    )}
                    {b.status !== "cancelled" && !isPast && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleCancel(b.id)}
                        style={{ fontSize:".75rem", padding:"5px 12px", color:"#f87171" }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
