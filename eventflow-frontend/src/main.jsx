import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  // If VITE_API_URL ends with /api, remove it for the base URL so that
  // components calling axios.get("/api/...") resolve to the correct full URL.
  axios.defaults.baseURL = apiUrl.replace(/\/api\/?$/, "");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
