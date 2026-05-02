// src/pages/user/EventList.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import { getAllEvents } from "../../api/events";
import { SlidersHorizontal, Search, X, AlertCircle, RefreshCw } from "lucide-react";

const CATEGORIES = ["Music", "Tech", "Sports", "Food", "Art", "Business"];

const CATEGORY_ALIASES = {
  technology: "tech",
  technologies: "tech",
  technical: "tech",
  conference: "business",
  conferences: "business",
  workshop: "business",
  workshops: "business",
  culinary: "food",
  dining: "food",
  arts: "art",
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const normalizeCategory = (value) => {
  const normalized = normalizeText(value);
  return CATEGORY_ALIASES[normalized] || normalized;
};

const formatCategoryLabel = (value) => {
  const normalized = normalizeCategory(value);
  const known = CATEGORIES.find(c => normalizeCategory(c) === normalized);
  if (known) return known;
  return String(value || "Other")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
};

const extractEvents = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.events)) return payload.events;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

/* ── Skeleton card shown while loading ─────────────────────── */
function SkeletonCard() {
  return (
    <div className="event-card" style={{ overflow: "hidden" }}>
      <div style={{
        height: 200, background: "var(--ink-4, rgba(255,255,255,0.06))",
        animation: "skeletonPulse 1.6s ease-in-out infinite",
      }} />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
        <div style={{ height: 20, width: "75%", borderRadius: 6, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: "skeletonPulse 1.6s ease-in-out infinite" }} />
        <div style={{ height: 13, width: "55%", borderRadius: 6, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: "skeletonPulse 1.6s ease-in-out 0.1s infinite" }} />
        <div style={{ height: 13, width: "40%", borderRadius: 6, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: "skeletonPulse 1.6s ease-in-out 0.2s infinite" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".25rem" }}>
          <div style={{ height: 22, width: 60, borderRadius: 6, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: "skeletonPulse 1.6s ease-in-out 0.3s infinite" }} />
          <div style={{ height: 32, width: 90, borderRadius: 8, background: "var(--ink-4, rgba(255,255,255,0.06))", animation: "skeletonPulse 1.6s ease-in-out 0.4s infinite" }} />
        </div>
      </div>
    </div>
  );
}

export default function EventList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCat = searchParams.get("category");
  const initSearch = searchParams.get("search") || searchParams.get("city") || "";

  const [events,  setEvents]  = useState([]);       // ← start EMPTY, not MOCK
  const [loading, setLoading] = useState(true);     // ← loading state
  const [error,   setError]   = useState("");       // ← error state
  const [cats,    setCats]    = useState(initCat ? [normalizeCategory(initCat)] : []);
  const [search,  setSearch]  = useState(initSearch);
  const [sort,    setSort]    = useState("date");
  const [page,    setPage]    = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef(null);
  const PER_PAGE = 6;

  const fetchEvents = () => {
    setLoading(true);
    setError("");
    getAllEvents()
      .then(r => {
        const data = extractEvents(r.data);
        setEvents(data);
      })
      .catch(() => setError("Could not load events. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  // Sync if URL changes while on page
  useEffect(() => {
    const qCat = searchParams.get("category");
    setCats(qCat ? [normalizeCategory(qCat)] : []);
    const qSearch = searchParams.get("search") || searchParams.get("city");
    setSearch(qSearch || "");
    setPage(1);
  }, [searchParams]);

  const toggleCat = (c) => {
    const normalized = normalizeCategory(c);
    setCats(prev => prev.includes(normalized) ? prev.filter(x => x !== normalized) : [...prev, normalized]);
    setPage(1);
  };

  const clearFilters = () => {
    setCats([]);
    setSearch("");
    setPage(1);
    setSearchParams({});
  };

  const openMobileFilters = () => {
    setFiltersOpen(true);
    requestAnimationFrame(() => {
      filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const categoryOptions = useMemo(() => {
    const options = new Map(CATEGORIES.map(c => [normalizeCategory(c), c]));
    events.forEach(event => {
      const normalized = normalizeCategory(event.category);
      if (normalized && !options.has(normalized)) {
        options.set(normalized, formatCategoryLabel(event.category));
      }
    });
    return Array.from(options, ([value, label]) => ({ value, label }));
  }, [events]);

  const filtered = events
    .filter(e => cats.length === 0 || cats.includes(normalizeCategory(e.category)))
    .filter(e => {
      const query = normalizeText(search);
      if (!query) return true;
      return [
        e.title,
        e.category,
        e.location,
        e.venue,
        e.organizer_name,
        e.description,
      ].some(value => normalizeText(value).includes(query));
    })
    .sort((a, b) =>
      sort === "price"
        ? (a.price || 0) - (b.price || 0)
        : new Date(a.date) - new Date(b.date)
    );

  const pages     = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Skeleton pulse keyframe injected once */}
      <style>{`
        @keyframes skeletonPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>

      <Navbar />
      <div className="events-layout">
        <button
          type="button"
          className="mobile-filter-toggle"
          onClick={openMobileFilters}
          aria-expanded={filtersOpen}
          aria-controls="event-filter-panel"
        >
          <Search size={16} />
          Search & Filters
          {(cats.length > 0 || search) && <span>{cats.length + (search ? 1 : 0)}</span>}
        </button>

        {/* ── Filter Sidebar ── */}
        <aside
          id="event-filter-panel"
          ref={filterRef}
          className={`card filter-sidebar ${filtersOpen ? "open" : ""}`}
          style={{ padding: 0 }}
        >
          <div className="filter-mobile-head">
            <div>
              <div className="filter-mobile-title">Search & Filters</div>
              <div className="filter-mobile-sub">Refine events by keyword, category, or sort order</div>
            </div>
            <button
              type="button"
              className="filter-close-btn"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="filter-section">
            <div className="filter-title">Search</div>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
              <input
                className="form-control"
                placeholder="Event name…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: "2.25rem" }}
              />
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-title">Category</div>
            {categoryOptions.map(({ value, label }) => (
              <label key={value} className="checkbox-row">
                <input type="checkbox" checked={cats.includes(value)} onChange={() => toggleCat(value)} />
                {label}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <div className="filter-title">Sort By</div>
            <select className="form-control" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
              <option value="date">Date (earliest)</option>
              <option value="price">Price (lowest)</option>
            </select>
          </div>

          {cats.length > 0 && (
            <div className="filter-section">
              <button className="btn btn-ghost btn-sm" style={{ color: "var(--color-primary)" }} onClick={clearFilters}>
                <X size={14} /> Clear Filters
              </button>
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1 }}>

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".75rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", marginBottom: ".2rem" }}>All Events</h2>
              <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>
                {loading
                  ? "Loading events…"
                  : `Showing ${paginated.length} of ${filtered.length} event${filtered.length !== 1 ? "s" : ""}`
                }
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <SlidersHorizontal size={15} color="var(--muted)" />
              <select className="form-control" style={{ width: "auto", padding: ".45rem .9rem" }}
                value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                <option value="date">Sort: Date</option>
                <option value="price">Sort: Price</option>
              </select>
            </div>
          </div>

          {/* ── Error state ── */}
          {error && !loading && (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "1rem", padding: "4rem 2rem", textAlign: "center",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AlertCircle size={28} style={{ color: "#f87171" }} />
              </div>
              <p style={{ color: "var(--muted)", fontSize: ".9rem" }}>{error}</p>
              <button className="btn btn-outline btn-sm" onClick={fetchEvents}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* ── Loading skeletons (6 cards) ── */}
          {loading && (
            <div className="grid-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && paginated.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
              <SlidersHorizontal size={42} style={{ marginBottom: "1rem", opacity: .35, display: "block", margin: "0 auto 1rem" }} />
              <p style={{ fontSize: ".95rem" }}>
                {events.length === 0 ? "No events available yet." : "No events match your filters."}
              </p>
              {(cats.length > 0 || search) && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: ".75rem", color: "var(--gold)" }} onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* ── Real event cards ── */}
          {!loading && !error && paginated.length > 0 && (
            <div className="grid-3">
              {paginated.map((ev, i) => (
                <EventCard key={ev.id || ev._id || i} event={ev} index={i} />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && pages > 1 && (
            <div className="pagination" style={{ marginTop: "2.5rem" }}>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
