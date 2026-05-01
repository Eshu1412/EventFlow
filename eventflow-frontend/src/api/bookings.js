// src/api/bookings.js
// Auth header is set globally by AuthContext via axios.defaults.headers.
// These functions rely on that; no local-storage lookup needed.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const bookEvent     = (eventId, quantity = 1) => axios.post(`${BASE}/bookings/`,     { event_id: eventId, quantity });
export const getMyBookings = ()         => axios.get(`${BASE}/bookings/me/`);
export const cancelBooking = (id)       => axios.delete(`${BASE}/bookings/${id}/`);
