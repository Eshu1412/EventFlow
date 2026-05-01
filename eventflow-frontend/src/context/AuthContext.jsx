// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
      axios.get("/api/auth/profile/")
        .then(r => { setUser(r.data); })
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const isAuthenticated = !!user;

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)",
      color: "var(--muted)", fontFamily: "var(--font-display)",
      letterSpacing: "0.1em", fontSize: "0.85rem",
    }}>
      LOADING…
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
