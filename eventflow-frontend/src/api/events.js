// src/api/events.js
// Auth header is set globally by AuthContext via axios.defaults.headers.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const getAllEvents  = ()         => axios.get(`${BASE}/events/`);
export const getEventById  = (id)       => axios.get(`${BASE}/events/${id}/`);
export const createEvent   = (data)     => axios.post(`${BASE}/events/`, data);
export const updateEvent   = (id, data) => axios.put(`${BASE}/events/${id}/`, data);
export const deleteEvent   = (id)       => axios.delete(`${BASE}/events/${id}/`);
export const getEventReviews = (id)     => axios.get(`${BASE}/events/${id}/reviews/`);
export const createEventReview = (id, data) => axios.post(`${BASE}/events/${id}/reviews/`, data);
