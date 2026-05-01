// src/components/EventCard.jsx
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { formatDate, formatPrice } from "../utils/helpers";

const BADGE_CLASS = {
  Music: "badge-music", Tech: "badge-tech", Sports: "badge-sports",
  Food: "badge-food", Art: "badge-art", Business: "badge-business",
};

const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80",
  "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=600&q=80",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
];

export default function EventCard({ event, index = 0 }) {
  const img = event.image_url || PLACEHOLDER_IMGS[index % PLACEHOLDER_IMGS.length];
  const badgeCls = BADGE_CLASS[event.category] || "badge-tech";
  const isFree = !event.price || event.price === 0;

  return (
    <div className="event-card">
      {/* Photo */}
      <div className="event-card-img">
        <img src={img} alt={event.title} loading="lazy" />
        <div className="event-card-img-overlay" />
        {event.category && (
          <span className={`event-card-badge ${badgeCls}`}>
            {event.category}
          </span>
        )}
      </div>

      {/* Ticket perforation */}
      <div className="event-card-perf">
        <div className="event-card-perf-line" />
      </div>

      {/* Body */}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <div className="event-meta">
          <span className="event-meta-row">
            <Calendar size={12} />
            {formatDate(event.date)}
          </span>
          {(event.venue || event.location) && (
            <span className="event-meta-row">
              <MapPin size={12} />
              {event.venue || event.location}
            </span>
          )}
        </div>

        <div className="event-card-footer">
          {isFree
            ? <span className="event-price-free">Free Entry</span>
            : <span className="event-price">{formatPrice(event.price)}</span>
          }
          <Link
            to={`/events/${event._id || event.id}`}
            className="btn btn-primary btn-sm"
            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
