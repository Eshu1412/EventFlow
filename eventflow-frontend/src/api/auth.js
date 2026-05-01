// src/api/auth.js
// Auth header is set globally by AuthContext via axios.defaults.headers.
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "/api";

export const registerUser  = (data) => axios.post(`${BASE}/auth/register/`, data);
export const loginUser     = (data) => axios.post(`${BASE}/auth/login/`,    data);
export const getProfile    = ()     => axios.get(`${BASE}/auth/profile/`);
export const updateProfile = (data) => axios.put(`${BASE}/auth/profile/`,   data);
export const sendOtp       = (data) => axios.post(`${BASE}/auth/send-otp/`, data);
export const verifyOtp     = (data) => axios.post(`${BASE}/auth/verify-otp/`, data);
