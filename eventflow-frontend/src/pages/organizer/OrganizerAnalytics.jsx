import ThemeToggle from "../../components/ThemeToggle";
// src/pages/organizer/OrganizerAnalytics.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { LayoutDashboard, Plus, Users, BarChart2, Settings, LogOut, Activity, DollarSign, Ticket, Calendar, Award, User, BookOpen } from "lucide-react";
import { formatPrice } from "../../utils/helpers";

/* ── Interactive Pie Chart ──────────────────────────────────── */
function InteractivePieChart({ data, title }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  if (total === 0) return <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>No data available.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.5rem" }}>
        <BarChart2 size={15} style={{ color: "var(--gold)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>
          {title}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
        <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ width: '140px', height: '140px', transform: 'rotate(-90deg)', overflow: 'visible' }}>
          {data.map((slice) => {
            if (slice.value === 0) return null;
            const percent = slice.value / total;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            cumulativePercent += percent;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = percent > 0.5 ? 1 : 0;
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');

            const isHovered = hovered?.label === slice.label;
            if (percent === 1) {
              return (
                <circle
                  key={slice.label} r="1" cx="0" cy="0" fill={slice.color}
                  onMouseEnter={() => setHovered(slice)} onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.3s', opacity: hovered && !isHovered ? 0.3 : 1, transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                />
              );
            }
            return (
              <path
                key={slice.label} d={pathData} fill={slice.color}
                onMouseEnter={() => setHovered(slice)} onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'all 0.3s', opacity: hovered && !isHovered ? 0.3 : 1, transform: isHovered ? 'scale(1.08)' : 'scale(1)', transformOrigin: '0 0' }}
              />
            );
          })}
        </svg>

        <div style={{ flex: 1 }}>
          {hovered ? (
            <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{hovered.label}</div>
              <div style={{ fontSize: '1.5rem', color: hovered.color, fontWeight: 700 }}>
                {hovered.prefix}{hovered.value}{hovered.suffix}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                {Math.round((hovered.value / total) * 100)}% of total
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: '0.8rem' }}>{d.label}</span>
                </div>
              )).slice(0, 4)}
              {data.length > 4 && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>+ {data.length - 4} more</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Interactive Bar Chart ──────────────────────────────────── */
function InteractiveBarChart({ data, title, height = 200, icon: Icon }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const [hovered, setHovered] = useState(null);

  if (data.length === 0) return <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>No data available.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.5rem" }}>
        <Icon size={15} style={{ color: "var(--gold)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>
          {title}
        </span>
      </div>
      
      <div style={{ position: 'relative', height: `${height}px`, display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '30px' }}>
        {data.map((d, i) => {
          const pct = (d.value / maxVal) * 100;
          const isHovered = hovered === i;
          return (
            <div 
              key={i}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div style={{ 
                  position: 'absolute', bottom: `calc(${pct}% + 8px)`, background: 'var(--ink-4)', 
                  padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border)', 
                  zIndex: 10, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease-in-out', pointerEvents: 'none'
                }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginBottom: '2px' }}>{d.label}</div>
                  <div style={{ color: d.color || 'var(--gold)', fontWeight: 700, fontSize: '1rem' }}>{d.prefix}{d.value}{d.suffix}</div>
                </div>
              )}
              <div style={{ 
                width: '100%', height: `${Math.max(pct, 2)}%`, background: d.color || 'var(--gold)', 
                borderRadius: '4px 4px 0 0', opacity: hovered === null || isHovered ? 1 : 0.3, transition: 'all 0.3s', cursor: 'pointer'
              }} />
              <div style={{ 
                fontSize: '0.65rem', color: isHovered ? 'var(--white)' : 'var(--muted)', marginTop: '8px', textAlign: 'center', 
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', transition: 'color 0.3s'
              }}>{d.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

const CAT_COLOR = {
  Tech: "#60a5fa", Music: "#f472b6", Sports: "#34d399",
  Food: "#fb923c", Art: "#a78bfa", Business: "#fbbf24",
};

export default function OrganizerAnalytics() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Organizer";

  const [events,    setEvents]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/events/").catch(() => ({ data: [] })),
      axios.get("/api/organizer/bookings/").catch(() => ({ data: [] })),
    ]).then(([e, b]) => {
      const myEvents = user?.id ? (e.data || []).filter(ev => ev.organizer_id === user.id) : (e.data || []);
      setEvents(myEvents);
      setBookings(b.data || []);
      setLoading(false);
    });
  }, [user?.id]);

  const navLinks = [
    { to:"/organizer",               icon:LayoutDashboard, label:"Dashboard"     },
    { to:"/organizer/create",        icon:Plus,            label:"Create Event"  },
    { to:"/organizer/registrations", icon:Users,           label:"Registrations" },
    { to:"/organizer/analytics",     icon:BarChart2,       label:"Analytics", active:true },
    { to:"/organizer/settings",      icon:Settings,        label:"Settings"      },
  ];

  const doLogout = () => { logout(); navigate("/"); };

  // Derived Analytics
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed").length;
  const totalCapacity = events.reduce((sum, e) => sum + (e.total_seats || 0), 0);
  
  let totalRevenue = 0;
  const revenueByCategory = {};
  const eventsMap = {};
  
  events.forEach(e => {
    eventsMap[e.id] = e;
  });

  bookings.forEach(b => {
    if (b.status === "confirmed") {
      const rev = (b.event_price || 0) * (b.quantity || 1);
      totalRevenue += rev;
      
      const eventInfo = eventsMap[b.event_id];
      const cat = eventInfo?.category || "Other";
      revenueByCategory[cat] = (revenueByCategory[cat] || 0) + rev;
    }
  });

  const revenueChartData = Object.entries(revenueByCategory).map(([cat, rev]) => ({
    label: cat, value: rev, prefix: "₹", color: CAT_COLOR[cat] || "#94a3b8"
  })).sort((a, b) => b.value - a.value);

  const topEvents = [...events]
    .sort((a, b) => (b.booked_seats || 0) - (a.booked_seats || 0))
    .slice(0, 6);

  const topEventsChartData = topEvents.map(e => ({
    label: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
    fullLabel: e.title,
    value: e.booked_seats || 0,
    color: CAT_COLOR[e.category] || "var(--gold)"
  }));

  const cardStyle = {
    background: "var(--ink-3)", border: "1px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "1.5rem",
  };

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
          <Link to="/my-bookings" className="sidebar-nav-link"><Ticket size={16} /> My Bookings</Link>
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
            <h1 className="page-title">ANALYTICS</h1>
            <p className="page-subtitle">Track your event performance and revenue</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            <Activity size={32} style={{ opacity: .3, display: "block", margin: "0 auto 1rem" }} />
            Loading analytics…
          </div>
        ) : (
          <>
            <div className="analytics-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                { label: "Total Revenue",  value: formatPrice(totalRevenue), color: "var(--gold)", Icon: DollarSign },
                { label: "Tickets Sold",   value: confirmedBookings, color: "#34d399", Icon: Ticket },
                { label: "Total Capacity", value: totalCapacity,   color: "#a78bfa", Icon: Users },
                { label: "Total Events",   value: totalEvents,    color: "#60a5fa", Icon: Calendar },
              ].map(({ label, value, color, Icon }) => (
                <div key={label} style={{ ...cardStyle, borderTop: `2px solid ${color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                    <span style={{ fontSize: ".65rem", fontFamily: "var(--font-mono)", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {label}
                    </span>
                    <Icon size={14} style={{ color, opacity: .7 }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "var(--white)", lineHeight: 1 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="analytics-grid analytics-grid-wide" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem", marginBottom: "2rem" }}>
              <div style={cardStyle}>
                <InteractivePieChart data={revenueChartData} title="Revenue by Category" />
              </div>
              <div style={cardStyle}>
                <InteractiveBarChart data={topEventsChartData} title="Top Events by Tickets Sold" icon={Award} />
              </div>
            </div>
          </>
        )}
      
        <div style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 1000 }} className="hide-mobile"><ThemeToggle /></div>
        <div style={{ position: "fixed", top: "1rem", right: "4rem", zIndex: 1000 }} className="mobile-only-theme-toggle"><ThemeToggle /></div>
      </main>
    </div>
  );
}
