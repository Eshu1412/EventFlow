// src/components/BookingCard.jsx
import { formatDate } from "../utils/helpers";
import { Calendar, MapPin, Ticket, X } from "lucide-react";
import { statusColor } from "../utils/helpers";

export default function BookingCard({ booking, onCancel }) {
  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: ".5rem", fontSize: "1rem" }}>
            {booking.event?.title || booking.event_title || "Event"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
            <span className="event-meta-item">
              <Calendar size={13} />
              {formatDate(booking.event?.date || booking.date)}
            </span>
            {(booking.event?.venue || booking.venue) && (
              <span className="event-meta-item">
                <MapPin size={13} />
                {booking.event?.venue || booking.venue}
              </span>
            )}
            <span className="event-meta-item">
              <Ticket size={13} />
              {booking.tickets || 1} ticket{(booking.tickets || 1) > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".75rem" }}>
          <span className={`badge ${statusColor(booking.status)}`}>
            {booking.status || "Confirmed"}
          </span>
          {booking.status !== "cancelled" && onCancel && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onCancel(booking._id || booking.id)}
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
