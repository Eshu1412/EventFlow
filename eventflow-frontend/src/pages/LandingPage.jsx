// src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { Search, Music, Laptop, Trophy, Utensils, Palette, Briefcase, ChevronRight, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllEvents } from "../api/events";


const CATEGORIES = [
  { label: "Music",    icon: Music,    color: "#a855f7", rgb: "168,85,247",  count: "2.4K" },
  { label: "Tech",     icon: Laptop,   color: "#60a5fa", rgb: "96,165,250",  count: "1.8K" },
  { label: "Sports",   icon: Trophy,   color: "#34d399", rgb: "52,211,153",  count: "950" },
  { label: "Food",     icon: Utensils, color: "#fb923c", rgb: "251,146,60",  count: "730" },
  { label: "Art",      icon: Palette,  color: "#f87171", rgb: "248,113,113", count: "480" },
  { label: "Business", icon: Briefcase,color: "#94a3b8", rgb: "148,163,184", count: "1.1K" },
];

const HERO_PHOTOS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=700&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=700&q=80",
];

const TICKER_ITEMS = [
  "MUSIC FESTIVALS", "TECH CONFERENCES", "SPORTS EVENTS", "FOOD FESTS",
  "ART EXHIBITIONS", "BUSINESS SUMMITS", "COMEDY NIGHTS", "LIVE THEATRE",
  "STARTUP PITCHES", "MARATHON RACES",
];

const HOW_STEPS = [
  { icon: Search,     num: "01", title: "Discover",  desc: "Browse thousands of events near you. Filter by category, date, or location." },
  { icon: ChevronRight, num: "02", title: "Book",    desc: "Secure your spot in seconds. Easy checkout with multiple payment options." },
  { icon: Music,      num: "03", title: "Experience",desc: "Join the crowd and create unforgettable memories at every event." },
];

export default function LandingPage() {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [featuredEvents,    setFeaturedEvents]    = useState([]);
  const [featuredLoading,   setFeaturedLoading]   = useState(true);

  useEffect(() => {
    getAllEvents()
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : [];
        // Show first 6 upcoming events on landing page
        setFeaturedEvents(data.slice(0, 6));
      })
      .catch(() => setFeaturedEvents([]))
      .finally(() => setFeaturedLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events?city=${city}&category=${category}`);
  };

  // Build ticker content (duplicated for seamless loop)
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
    <span className="ticker-item" key={i}>
      {item} <span className="ticker-dot">✦</span>
    </span>
  ));

  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero" style={{ marginTop: "var(--navbar-h)" }}>
        {/* Left: editorial content */}
        <div className="hero-left">
          <p className="hero-eyebrow">✦ Trusted by 500,000+ event-goers</p>

          <h1 className="hero-title">
            YOUR NEXT<br />
            <span className="line-gold">GREAT</span>
            <span className="line-outline">EVENT</span>
          </h1>

          <p className="hero-sub">
            Concerts, conferences, marathons & more — discover and book
            the world's best experiences in one place.
          </p>

          {/* Search form */}
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              placeholder="City or venue…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <div className="divider" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
            <button type="submit">
              <Search size={15} /> Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg">
              Browse Events
            </Link>
            <Link to="/register" className="btn btn-surface btn-lg">
              Host an Event
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[["10K+","Events"], ["500K+","Tickets Sold"], ["98%","Satisfaction"]].map(([n, l]) => (
              <div key={l}>
                <span className="hero-stat-number">{n}</span>
                <span className="hero-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo collage */}
        <div className="hero-right">
          <div className="hero-photo-grid">
            {HERO_PHOTOS.map((src, i) => (
              <img key={i} src={src} alt="" loading={i < 2 ? "eager" : "lazy"} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {tickerContent}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="section" id="categories">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <p className="section-eyebrow">Browse by Type</p>
          <h2 className="section-title">FIND WHAT<br />EXCITES YOU</h2>
          <p className="section-sub">Six categories, thousands of experiences — from underground jazz to global tech summits.</p>

          <div className="category-grid">
            {CATEGORIES.map(({ label, icon: Icon, color, rgb, count }) => (
              <Link
                key={label}
                to={`/events?category=${label}`}
                className="category-chip"
                style={{ "--chip-color": color, "--chip-rgb": rgb }}
              >
                <div className="chip-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="chip-label">{label}</div>
                  <div className="chip-count">{count} events</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="section" style={{ paddingTop: "2rem", background: "var(--ink-2)" }} id="events">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="section-eyebrow">Hand-picked for you</p>
              <h2 className="section-title">FEATURED<br />EVENTS</h2>
            </div>
            <Link to="/events" className="btn btn-outline" style={{ alignSelf: "flex-end" }}>
              View All <ChevronRight size={15} />
            </Link>
          </div>
          <div className="events-grid">
            {featuredLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="event-card" style={{ overflow: "hidden" }}>
                    <div style={{ height: 200, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: "skeletonPulse 1.6s ease-in-out infinite" }} />
                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
                      {["75%","50%","40%"].map((w, j) => (
                        <div key={j} style={{ height: j === 0 ? 20 : 13, width: w, borderRadius: 6, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: `skeletonPulse 1.6s ease-in-out ${j*0.1}s infinite` }} />
                      ))}
                    </div>
                  </div>
                ))
              : featuredEvents.length > 0
                ? featuredEvents.map((ev, i) => <EventCard key={ev.id || ev._id || i} event={ev} index={i} />)
                : null
            }
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="about">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <p className="section-eyebrow">Simple Process</p>
          <h2 className="section-title" style={{ marginBottom: "3rem" }}>HOW IT<br />WORKS</h2>
          <div className="how-grid">
            {HOW_STEPS.map(({ icon: Icon, num, title, desc }) => (
              <div className="how-step" key={title}>
                <span className="how-step-num">{num}</span>
                <div className="how-step-icon"><Icon size={22} /></div>
                <div className="how-step-title">{title}</div>
                <p className="how-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <div className="cta-band">
        <div className="cta-band-text">
          <h2 className="cta-band-title">NEVER MISS<br />AN EVENT</h2>
          <p className="cta-band-sub">Weekly picks, exclusive offers, zero spam.</p>
        </div>
        <form
          className="cta-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input type="email" placeholder="your@email.com" />
          <button type="submit">
            <Mail size={14} style={{ marginRight: 6 }} />
            Subscribe
          </button>
        </form>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">Event<em>Flow</em></div>
        <p className="footer-copy">© 2026 EventFlow · CountryEdu Private Limited</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
