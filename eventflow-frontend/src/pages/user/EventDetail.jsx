// src/pages/user/EventDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getEventById, getEventReviews, createEventReview } from "../../api/events";
import { bookEvent } from "../../api/bookings";
import { Calendar, MapPin, Clock, Ticket, Heart, Share2, ChevronLeft, Download, Star } from "lucide-react";
import { formatDate, formatTime, formatPrice } from "../../utils/helpers";
import { downloadTicket } from "../../utils/ticketDownload";

const MOCK_EVENT = {
  id: "1", title: "Neon Beats Music Festival 2025", category: "Music",
  date: "2025-07-12T18:00:00", venue: "Madison Square Garden, NYC",
  price: 89, description: "Experience the ultimate music festival featuring world-class artists across 3 stages. Neon Beats 2025 brings together the best in electronic, indie, and pop music for an unforgettable night under the stars. Doors open at 4 PM, headliners from 8 PM. Food vendors, art installations, and VIP lounge available.",
  organizer: "LiveNation Events", available_tickets: 342, tags: ["Music", "Festival", "Live", "NYC"],
  image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
};

export default function EventDetail() {
  const { id } = useParams();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedId, setBookedId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getEventById(id).then(r => setEvent(r.data)).catch(() => setEvent(MOCK_EVENT));
    getEventReviews(id).then(r => setReviews(r.data)).catch(() => setReviews([]));
  }, [id]);

  const handleBook = async () => {
    if (!user) { navigate("/login"); return; }
    setLoading(true);
    try {
      const res = await bookEvent(id, qty);
      setBookedId(res.data?.id || null);
      setBooked(true);
    } catch {
      alert("Could not complete booking. Please try again.");
    } finally { setLoading(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setSubmittingReview(true);
    try {
      const res = await createEventReview(id, newReview);
      setReviews(prev => [res.data, ...prev]);
      setNewReview({ rating: 5, comment: "" });
    } catch {
      alert("Could not submit review. Please try again.");
    } finally { setSubmittingReview(false); }
  };

  const handleDownload = async () => {
    if (!bookedId) return;
    setDownloading(true);
    try {
      await downloadTicket(bookedId, event?.title);
    } catch {
      alert("Could not download ticket. Please try from My Bookings.");
    } finally { setDownloading(false); }
  };

  if (!event) return (
    <div>
      <Navbar />
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>Loading event…</div>
    </div>
  );

  const total = (event.price || 0) * qty;

  return (
    <div>
      <Navbar />

      {/* Hero Banner */}
      <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
        <img src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"}
          alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,.9) 0%, rgba(15,23,42,.3) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: "2rem", left: "2rem", right: "2rem" }}>
          <button className="btn btn-ghost btn-sm" style={{ color: "rgba(255,255,255,.8)", marginBottom: "1rem" }}
            onClick={() => navigate(-1)}>
            <ChevronLeft size={16} /> Back to Events
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".75rem" }}>
            {event.category && <span className="badge badge-amber">{event.category}</span>}
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.5rem,3vw,2.5rem)", color: "#fff", fontWeight: 800 }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 2rem", display: "flex", gap: "2.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Organizer */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "2rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: ".9rem" }}>
              {(event.organizer_name || event.organizer || "O")[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{event.organizer_name || event.organizer || "Event Organizer"}</div>
              <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)" }}>Organizer</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "2px solid var(--color-border)", marginBottom: "1.5rem", display: "flex", gap: 0 }}>
            {["description", "schedule", "location"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: ".75rem 1.25rem", border: "none", background: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: ".875rem", textTransform: "capitalize",
                  borderBottom: `2px solid ${tab===t ? "var(--color-primary)" : "transparent"}`,
                  color: tab===t ? "var(--color-primary)" : "var(--color-text-muted)",
                  marginBottom: -2, transition: "all .2s" }}>
                {t}
              </button>
            ))}
          </div>

          {tab === "description" && (
            <div style={{ lineHeight: 1.8, color: "var(--color-text)", fontSize: ".925rem" }}>
              <p>{event.description}</p>
              {event.tags?.length > 0 && (
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
                  {event.tags.map(tag => <span key={tag} className="badge badge-blue">{tag}</span>)}
                </div>
              )}
            </div>
          )}
          {tab === "schedule" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { time: "4:00 PM", title: "Doors Open", desc: "Gates and vendor area open" },
                { time: "6:00 PM", title: "Opening Acts", desc: "Local emerging artists" },
                { time: "8:00 PM", title: "Headliner Performance", desc: "Main stage showtime" },
                { time: "11:30 PM", title: "After-party", desc: "VIP lounge and networking" },
              ].map(({ time, title, desc }) => (
                <div key={time} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 70, flexShrink: 0, fontWeight: 700, fontSize: ".82rem", color: "var(--color-primary)", paddingTop: ".2rem" }}>{time}</div>
                  <div style={{ flex: 1, paddingLeft: "1rem", borderLeft: "2px solid var(--color-border)" }}>
                    <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{title}</div>
                    <div style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "location" && (
            <div>
              <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--ink-3)", border: "1px solid var(--border)", height: 240,
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: ".875rem" }}>
                📍 {event.location || event.venue}
              </div>
              <p style={{ marginTop: "1rem", color: "var(--color-text-muted)", fontSize: ".875rem" }}>
                <MapPin size={14} style={{ display: "inline", marginRight: ".35rem" }} />
                {event.location || event.venue}
              </p>
            </div>
          )}

          {/* Reviews */}
          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>Reviews</h3>
            
            {/* Review Form */}
            {user && (
              <form onSubmit={handleReviewSubmit} style={{ marginBottom: "2rem", padding: "1.5rem", background: "var(--ink-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <h4 style={{ marginBottom: "1rem", fontSize: ".95rem" }}>Leave a Review</h4>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={20}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      fill={star <= newReview.rating ? "#f59e0b" : "transparent"}
                      color={star <= newReview.rating ? "#f59e0b" : "var(--color-text-muted)"}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                    />
                  ))}
                </div>
                <textarea
                  className="input"
                  style={{ width: "100%", minHeight: "80px", marginBottom: "1rem", resize: "vertical" }}
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: ".9rem" }}>No reviews yet. Be the first to review!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: "1rem 0", borderBottom: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".4rem" }}>
                      <span style={{ fontWeight: 600, fontSize: ".875rem" }}>{r.user_name || "Anonymous"}</span>
                      <span style={{ color: "#f59e0b", fontSize: ".85rem", display: "flex", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < r.rating ? "#f59e0b" : "transparent"} color={i < r.rating ? "#f59e0b" : "var(--color-text-muted)"} />
                        ))}
                      </span>
                    </div>
                    <p style={{ fontSize: ".85rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>{r.comment}</p>
                    <span style={{ fontSize: ".75rem", color: "var(--color-text-muted)", opacity: 0.7 }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right – Booking Card */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <div className="booking-card-sticky">
            <h3 style={{ marginBottom: "1.25rem", fontSize: "1.15rem" }}>Book Tickets</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "1.5rem" }}>
              <div className="event-meta-item"><Calendar size={15} /> {formatDate(event.date)}</div>
              <div className="event-meta-item"><Clock size={15} /> {formatTime(event.date)}</div>
              <div className="event-meta-item"><MapPin size={15} /> {event.location || event.venue}</div>
              <div className="event-meta-item"><Ticket size={15} /> {event.available_seats ?? event.available_tickets ?? "—"} seats left</div>
            </div>

            <div style={{
              background: "var(--ink-4, rgba(255,255,255,0.04))",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--color-text)" }}>Quantity</span>
                <div className="ticket-counter">
                  <button className="ticket-btn" onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span className="ticket-count">{qty}</span>
                  <button className="ticket-btn" onClick={() => setQty(q => Math.min(10, q+1))}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--color-text-muted)", fontSize: ".875rem" }}>
                  {formatPrice(event.price)} × {qty}
                </span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--color-primary)" }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {booked ? (
              <div>
                <div className="alert alert-success" style={{ marginBottom: ".75rem" }}>
                  ✅ Booking confirmed! Your ticket has been emailed to you.
                </div>
                <button
                  className="btn btn-accent btn-full"
                  onClick={handleDownload}
                  disabled={downloading || !bookedId}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}
                >
                  <Download size={16} />
                  {downloading ? "Downloading…" : "Download Ticket (PDF)"}
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-accent btn-full btn-lg" onClick={handleBook} disabled={loading}>
                  <Ticket size={17} /> {loading ? "Processing…" : "Book Now"}
                </button>
                <button className="btn btn-outline btn-full" style={{ marginTop: ".75rem" }}>
                  <Heart size={15} /> Add to Wishlist
                </button>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.25rem" }}>
              <button className="btn btn-ghost btn-sm"><Share2 size={14} /> Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
