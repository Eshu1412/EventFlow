// src/api/admin.js
// Admin-only API calls. Auth header set globally by AuthContext via axios.defaults.headers.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const getAdminStats    = ()            => axios.get(`${BASE}/admin/stats/`);
export const getAdminUsers    = ()            => axios.get(`${BASE}/admin/users/`);
export const updateAdminUser  = (id, data)    => axios.put(`${BASE}/admin/users/${id}/`, data);
export const deleteAdminUser  = (id)          => axios.delete(`${BASE}/admin/users/${id}/`);
export const getAdminEvents   = ()            => axios.get(`${BASE}/admin/events/`);
export const getAdminBookings = ()            => axios.get(`${BASE}/admin/bookings/`);

// Organizer-specific
export const getOrganizerBookings = () => axios.get(`${BASE}/organizer/bookings/`);
