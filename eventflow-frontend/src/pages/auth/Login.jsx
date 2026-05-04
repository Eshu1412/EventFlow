// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";
import ThemeToggle from "../../components/ThemeToggle";
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ROLE_REDIRECT = { user: "/events", organizer: "/organizer", admin: "/admin" };

export default function Login() {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const justRegistered = location.state?.registered;

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleInvalid = (e) => {
    e.preventDefault();
    setFieldErrors(prev => ({ ...prev, [e.target.name]: e.target.validationMessage || "Please fill in this field." }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user, data.token);
      const dest = location.state?.from?.pathname || ROLE_REDIRECT[data.user?.role] || "/events";
      navigate(dest, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const slideIn = {
    hidden:  { opacity: 0, x: 30, filter: "blur(4px)" },
    visible: {
      opacity: 1, x: 0, filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, when: "beforeChildren" },
    },
  };
  const item = {
    hidden:  { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="auth-layout" style={{ paddingTop: 0 }}>
      <ThemeToggle fixed className="auth-theme-toggle" />

      {/* Visual panel */}
      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>
          <h2 className="auth-visual-headline">
            Discover.<br />Book.<br /><em>Experience.</em>
          </h2>
          <p className="auth-visual-body">
            Join 500,000+ event-goers who trust EventFlow to find and book
            the best experiences around the world.
          </p>
        </motion.div>

        <motion.div className="auth-stats"
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ duration:0.6, delay:0.15, ease:[0.22,1,0.36,1] }}>
          {[["10K+","Events"],["500K+","Users"],["98%","Satisfaction"]].map(([n,l]) => (
            <div key={l}>
              <span className="auth-stat-num">{n}</span>
              <span className="auth-stat-lbl">{l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form panel */}
      <motion.div className="auth-form-panel" variants={slideIn} initial="hidden" animate="visible">
        <div style={{ maxWidth:400, width:"100%", margin:"0 auto" }}>
          <Link to="/" className="auth-mobile-brand">Event<em>Flow</em></Link>

          <motion.h2 variants={item} className="auth-form-title">WELCOME BACK</motion.h2>
          <motion.p variants={item} className="auth-form-sub">
            No account?{" "}<Link to="/register">Create one free</Link>
          </motion.p>

          {justRegistered && (
            <motion.div variants={item} className="alert alert-success" style={{ marginBottom:"1.25rem" }}>
              <CheckCircle size={15} /> Account created! Sign in to continue.
            </motion.div>
          )}

          {error && (
            <motion.div variants={item} className="alert alert-error" style={{ marginBottom:"1.25rem" }}>
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}

          <motion.form variants={item} onSubmit={submit} className="form-stack">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: "relative" }}>
                <input
                  name="email" type="email" className="form-control"
                  placeholder="you@example.com"
                  value={form.email} onChange={handle} onInvalid={handleInvalid} required autoFocus
                  style={{ borderColor: fieldErrors.email ? "rgba(248,113,113,0.5)" : undefined }}
                />
                {fieldErrors.email && (
                  <div className="custom-tooltip">
                    <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.email}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:"relative" }}>
                <input
                  name="password" type={showPw ? "text" : "password"}
                  className="form-control" placeholder="••••••••"
                  value={form.password} onChange={handle} onInvalid={handleInvalid} required
                  style={{ 
                    paddingRight:"3rem",
                    borderColor: fieldErrors.password ? "rgba(248,113,113,0.5)" : undefined
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position:"absolute", right:"1rem", top:"50%",
                  transform:"translateY(-50%)", color:"var(--muted)"
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {fieldErrors.password && (
                  <div className="custom-tooltip">
                    <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.password}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <label style={{ display:"flex", alignItems:"center", gap:".5rem", fontSize:".8rem", color:"var(--muted)", cursor:"pointer" }}>
                <input type="checkbox" style={{ accentColor:"var(--gold)" }} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ fontSize:".8rem", color:"var(--gold)" }}>Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading
                ? <><span className="loading-spinner" /> Signing in…</>
                : <><ArrowRight size={16} /> Sign In</>
              }
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
