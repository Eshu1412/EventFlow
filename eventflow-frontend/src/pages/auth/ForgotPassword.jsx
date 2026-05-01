// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await axios.post("/api/auth/password-reset/", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const item = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="auth-layout" style={{ paddingTop: 0 }}>
      <ThemeToggle fixed />

      {/* Left visual panel */}
      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="auth-visual-headline">
            Forgot<br />your<br /><em>password?</em>
          </h2>
          <p className="auth-visual-body">
            No worries — enter your email and we'll send you a secure link
            to reset your password instantly.
          </p>
        </motion.div>

        <motion.div className="auth-stats"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}>
          {[["🔒", "Secure"], ["⚡", "Instant"], ["✅", "Simple"]].map(([icon, label]) => (
            <div key={label}>
              <span className="auth-stat-num">{icon}</span>
              <span className="auth-stat-lbl">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right form panel */}
      <motion.div className="auth-form-panel"
        variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
        initial="hidden" animate="visible">
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>

          <motion.div variants={item} style={{ marginBottom: "2rem" }}>
            <Link to="/login" style={{
              display: "inline-flex", alignItems: "center", gap: ".4rem",
              fontSize: ".8rem", color: "var(--muted)", fontFamily: "var(--font-mono)",
              letterSpacing: ".05em", textTransform: "uppercase",
            }}>
              <ArrowLeft size={13} /> Back to Login
            </Link>
          </motion.div>

          {sent ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center" }}>

              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}>
                <CheckCircle size={32} style={{ color: "#4ade80" }} />
              </div>

              <h2 className="auth-form-title" style={{ textAlign: "center" }}>CHECK YOUR EMAIL</h2>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7, margin: "1rem 0 2rem" }}>
                We've sent a password reset link to<br />
                <strong style={{ color: "var(--fg)" }}>{email}</strong>
                <br /><br />
                The link expires in <strong style={{ color: "var(--gold)" }}>1 hour</strong>.
                Check your spam folder if you don't see it.
              </p>

              <button className="btn btn-outline btn-full" onClick={() => { setSent(false); setEmail(""); }}>
                <Send size={14} /> Resend Email
              </button>
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Link to="/login" style={{ fontSize: ".85rem", color: "var(--gold)" }}>
                  Back to Login
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── Request form ── */
            <>
              <motion.h2 variants={item} className="auth-form-title">RESET PASSWORD</motion.h2>
              <motion.p variants={item} className="auth-form-sub">
                Enter the email address associated with your account.
              </motion.p>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
                  <AlertCircle size={15} /> {error}
                </motion.div>
              )}

              <motion.form variants={item} onSubmit={submit} className="form-stack">
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} style={{
                      position: "absolute", left: "1rem", top: "50%",
                      transform: "translateY(-50%)", color: "var(--muted)",
                      pointerEvents: "none",
                    }} />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required autoFocus
                      style={{ paddingLeft: "2.75rem" }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading
                    ? <><span className="loading-spinner" /> Sending…</>
                    : <><Send size={16} /> Send Reset Link</>
                  }
                </button>
              </motion.form>

              <motion.p variants={item} style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".85rem", color: "var(--muted)" }}>
                Remembered it?{" "}<Link to="/login" style={{ color: "var(--gold)" }}>Sign in</Link>
              </motion.p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
