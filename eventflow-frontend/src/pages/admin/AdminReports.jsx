// src/pages/admin/AdminReports.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Users, Calendar, BarChart, Ticket,
  Settings, LogOut, Download, TrendingUp, PieChart,
  Activity, Award, Star, DollarSign
} from "lucide-react";
import { formatDate, formatPrice } from "../../utils/helpers";

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
        <PieChart size={15} style={{ color: "var(--gold)" }} />
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
                  key={slice.label}
                  r="1"
                  cx="0"
                  cy="0"
                  fill={slice.color}
                  onMouseEnter={() => setHovered(slice)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.3s', opacity: hovered && !isHovered ? 0.3 : 1, transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                />
              );
            }

            return (
              <path
                key={slice.label}
                d={pathData}
                fill={slice.color}
                onMouseEnter={() => setHovered(slice)}
                onMouseLeave={() => setHovered(null)}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.3s', 
                  opacity: hovered && !isHovered ? 0.3 : 1,
                  transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                  transformOrigin: '0 0'
                }}
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
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: `calc(${pct}% + 8px)`, 
                  background: 'var(--ink-4)', 
                  padding: '6px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem', 
                  border: '1px solid var(--border)', 
                  zIndex: 10, 
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  animation: 'fadeIn 0.2s ease-in-out',
                  pointerEvents: 'none'
                }}>
                  <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginBottom: '2px' }}>{d.label}</div>
                  <div style={{ color: d.color || 'var(--gold)', fontWeight: 700, fontSize: '1rem' }}>{d.prefix}{d.value}{d.suffix}</div>
                </div>
              )}
              <div style={{ 
                width: '100%', 
                height: `${Math.max(pct, 2)}%`, 
                background: d.color || 'var(--gold)', 
                borderRadius: '4px 4px 0 0',
                opacity: hovered === null || isHovered ? 1 : 0.3,
                transition: 'all 0.3s',
                cursor: 'pointer'
              }} />
              <div style={{ 
                fontSize: '0.65rem', 
                color: isHovered ? 'var(--white)' : 'var(--muted)', 
                marginTop: '8px', 
                textAlign: 'center', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap', 
                width: '100%',
                transition: 'color 0.3s'
              }}>
                {d.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

/* ── category palette ─────────────────────────────────── */
const CAT_COLOR = {
  Tech: "#60a5fa", Music: "#f472b6", Sports: "#34d399",
  Food: "#fb923c", Art: "#a78bfa", Business: "#fbbf24",
};

export default function AdminReports() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Admin";

  const [stats,     setStats]     = useState(null);
  const [users,     setUsers]     = useState([]);
  const [events,    setEvents]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/admin/stats/").catch(() => ({ data: null })),
      axios.get("/api/admin/users/").catch(() => ({ data: [] })),
      axios.get("/api/admin/events/").catch(() => ({ data: [] })),
      axios.get("/api/admin/bookings/").catch(() => ({ data: [] })),
    ]).then(([s, u, e, b]) => {
      setStats(s.data);
      setUsers(u.data || []);
      setEvents(e.data || []);
      setBookings(b.data || []);
      setLoading(false);
    });
  }, []);

  // ── derived analytics ──────────────────────────────────
  const totalUsers    = stats?.total_users    || users.length;
  const totalEvents   = stats?.total_events   || events.length;
  const totalBookings = stats?.total_bookings || bookings.length;

  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const confirmRate    = totalBookings ? Math.round(confirmedCount / totalBookings * 100) : 0;

  // Events map for quick lookup
  const eventsMap = {};
  events.forEach(e => eventsMap[e.id] = e);

  // Advanced Analytics: Revenue & Categories
  const catMap = {};
  const revenueByCategory = {};
  let totalRevenue = 0;

  events.forEach(e => {
    const cat = e.category || "Other";
    catMap[cat] = (catMap[cat] || 0) + 1;
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

  const categoryChartData = Object.entries(catMap).map(([cat, count]) => ({
    label: cat,
    value: count,
    color: CAT_COLOR[cat] || "#94a3b8"
  })).sort((a, b) => b.value - a.value);

  const revenueChartData = Object.entries(revenueByCategory).map(([cat, rev]) => ({
    label: cat,
    value: rev,
    prefix: "₹",
    color: CAT_COLOR[cat] || "#94a3b8"
  })).sort((a, b) => b.value - a.value);

  // Top events by booked_seats
  const topEvents = [...events]
    .sort((a, b) => (b.booked_seats || 0) - (a.booked_seats || 0))
    .slice(0, 5);

  const topEventsChartData = topEvents.map(e => ({
    label: e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title,
    fullLabel: e.title,
    value: e.booked_seats || 0,
    color: CAT_COLOR[e.category] || "var(--gold)"
  }));

  // User role breakdown
  const roleMap = { user: 0, organizer: 0, admin: 0 };
  users.forEach(u => { if (u.role in roleMap) roleMap[u.role]++; });
  const roleChartData = [
    { label: "Regular Users", value: roleMap.user, color: "#60a5fa" },
    { label: "Organizers", value: roleMap.organizer, color: "var(--gold)" },
    { label: "Admins", value: roleMap.admin, color: "#f87171" }
  ];

  const bookingStatusData = [
    { label: "Confirmed", value: confirmedCount, color: "#4ade80" },
    { label: "Cancelled", value: cancelledCount, color: "#f87171" }
  ];

  // Recent bookings (last 8)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.booked_at) - new Date(a.booked_at))
    .slice(0, 8);

  // Export full report as CSV
  const exportCSV = () => {
    const rows = [
      ["=== EVENTFLOW PLATFORM REPORT ==="],
      ["Generated", new Date().toLocaleString()],
      [],
      ["SUMMARY"],
      ["Total Users", totalUsers],
      ["Total Events", totalEvents],
      ["Total Bookings", totalBookings],
      ["Total Revenue", `₹${totalRevenue}`],
      ["Confirmed", confirmedCount],
      ["Cancelled", cancelledCount],
      ["Confirmation Rate", `${confirmRate}%`],
      [],
      ["TOP EVENTS"],
      ["Title", "Category", "Booked", "Total", "Occupancy%"],
      ...topEvents.map(e => [
        `"${e.title}"`, e.category || "—",
        e.booked_seats || 0, e.total_seats,
        e.total_seats ? Math.round((e.booked_seats || 0) / e.total_seats * 100) + "%" : "—",
      ]),
      [],
      ["REVENUE BY CATEGORY"],
      ["Category", "Revenue"],
      ...Object.entries(revenueByCategory).map(([cat, rev]) => [cat, `₹${rev}`]),
      [],
      ["EVENTS BY CATEGORY"],
      ["Category", "Count"],
      ...Object.entries(catMap).map(([cat, n]) => [cat, n]),
      [],
      ["USER ROLES"],
      ["Role", "Count"],
      ...Object.entries(roleMap).map(([r, n]) => [r, n]),
    ];
    const csv = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = `eventflow_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const nav = [
    { to: "/admin",          icon: LayoutDashboard, label: "Dashboard"    },
    { to: "/admin/users",    icon: Users,           label: "Manage Users"  },
    { to: "/admin/events",   icon: Calendar,        label: "Manage Events" },
    { to: "/admin/bookings", icon: Ticket,          label: "Bookings"      },
    { to: "/admin/reports",  icon: BarChart,        label: "Reports", active: true },
    { to: "#",               icon: Settings,        label: "Settings"      },
  ];

  const cardStyle = {
    background: "var(--ink-3)", border: "1px solid var(--border)",
    borderRadius: "var(--r-md)", padding: "1.5rem",
  };

  return (
    <div className="app-layout" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Admin</span>
          {nav.map(({ to, icon: Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
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

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">REPORTS & ANALYTICS</h1>
            <p className="page-subtitle">Interactive platform metrics and revenue tracking</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            <Activity size={32} style={{ opacity: .3, display: "block", margin: "0 auto 1rem" }} />
            Loading analytics…
          </div>
        ) : (
          <>
            {/* ── Row 1: Summary KPI cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                { label: "Total Revenue",  value: formatPrice(totalRevenue), color: "var(--gold)", Icon: DollarSign },
                { label: "Total Bookings", value: totalBookings, color: "#34d399", Icon: Ticket },
                { label: "Total Events",   value: totalEvents,   color: "#60a5fa", Icon: Calendar },
                { label: "Total Users",    value: totalUsers,    color: "#a78bfa", Icon: Users },
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

            {/* ── Row 2: Interactive SVG Charts ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
              {/* Event Categories Pie */}
              <div style={cardStyle}>
                <InteractivePieChart data={categoryChartData} title="Events by Category" />
              </div>

              {/* Revenue by Category Pie */}
              <div style={cardStyle}>
                <InteractivePieChart data={revenueChartData} title="Revenue by Category" />
              </div>
            </div>

            {/* ── Row 3: Bar Charts ── */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
              <div style={cardStyle}>
                <InteractiveBarChart data={topEventsChartData} title="Top Events by Tickets Sold" icon={Award} />
              </div>
              <div style={cardStyle}>
                <InteractiveBarChart data={roleChartData} title="User Roles" icon={Users} />
              </div>
              <div style={cardStyle}>
                <InteractiveBarChart data={bookingStatusData} title="Booking Status" icon={Ticket} />
              </div>
            </div>

            {/* ── Row 4: Recent bookings table ── */}
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.25rem" }}>
                <Star size={15} style={{ color: "var(--gold)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>
                  Recent Bookings
                </span>
              </div>
              {recentBookings.length === 0
                ? <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>No bookings yet.</p>
                : (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr><th>User</th><th>Event</th><th>Status</th><th>Date</th></tr>
                      </thead>
                      <tbody>
                        {recentBookings.map(b => (
                          <tr key={b.id}>
                            <td style={{ fontWeight: 500, color: "var(--white)" }}>{b.user_name || `User #${b.user_id}`}</td>
                            <td style={{ color: "var(--muted)", fontSize: ".82rem" }}>{b.event_title || `Event #${b.event_id}`}</td>
                            <td>
                              <span className={`tag ${b.status === "confirmed" ? "tag-green" : "tag-coral"}`}>
                                {b.status}
                              </span>
                            </td>
                            <td style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                              {b.booked_at ? new Date(b.booked_at).toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </>
        )}
      </main>
    </div>
  );
}
