// src/pages/auth/ForgotPassword.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "../../components/ThemeToggle";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send, Clock, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email,        setEmail]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [sent,         setSent]         = useState(false);
  const [error,        setError]        = useState("");
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [devResetUrl,  setDevResetUrl]  = useState(""); // dev-mode fallback

  const [resendTimer, setResendTimer] = useState(() => {
    const saved = localStorage.getItem("passwordResetTimer");
    if (saved) {
      const { expiresAt } = JSON.parse(saved);
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      const saved = localStorage.getItem("passwordResetTimer");
      if (!saved) {
        localStorage.setItem("passwordResetTimer", JSON.stringify({ expiresAt: Date.now() + resendTimer * 1000 }));
      }
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("passwordResetTimer");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      localStorage.removeItem("passwordResetTimer");
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startTimer = (seconds) => {
    localStorage.setItem("passwordResetTimer", JSON.stringify({ expiresAt: Date.now() + seconds * 1000 }));
    setResendTimer(seconds);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
  };

  const handleInvalid = (e) => {
    e.preventDefault();
    setFieldErrors({ ...fieldErrors, email: e.target.validationMessage || "Please fill in this field." });
  };

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (resendTimer > 0) return;
    setError(""); setLoading(true); setDevResetUrl("");
    try {
      const { data } = await axios.post("/api/auth/password-reset/", { email });
      if (data?.reset_url) setDevResetUrl(data.reset_url);
      setSent(true);
      startTimer(600); // 10 minutes
    } catch (err) {
      if (err.response?.status === 429 && err.response?.data?.remaining_seconds) {
        startTimer(err.response.data.remaining_seconds);
        setSent(true);
        setError(err.response.data.error);
        return;
      }
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
      <ThemeToggle fixed style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1000 }} />

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
          {[
            [<ShieldCheck size={32} strokeWidth={1.5} />, "Secure"],
            [<Zap size={32} strokeWidth={1.5} />, "Instant"],
            [<CheckCircle size={32} strokeWidth={1.5} />, "Simple"]
          ].map(([icon, label]) => (
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
          <Link to="/" className="auth-mobile-brand">Event<em>Flow</em></Link>

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

              <h2 className="auth-form-title" style={{ textAlign: "center" }}>
                {devResetUrl ? "⚠️ DEV MODE" : "CHECK YOUR EMAIL"}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7, margin: "1rem 0 2rem" }}>
                {devResetUrl ? (
                  <>
                    Email not delivered (Resend sandbox restriction).<br />
                    Click the link below to reset your password directly:
                  </>
                ) : (
                  <>
                    We've sent a password reset link to<br />
                    <strong style={{ color: "var(--fg)" }}>{email}</strong>
                    <br /><br />
                    The link expires in <strong style={{ color: "var(--gold)" }}>1 hour</strong>.
                    Check your spam folder if you don't see it.
                  </>
                )}
              </p>

              {devResetUrl && (
                <a
                  href={devResetUrl}
                  style={{
                    display: "block", padding: "0.875rem 1rem", marginBottom: "1rem",
                    background: "rgba(184,146,78,0.1)", border: "1px solid rgba(184,146,78,0.4)",
                    borderRadius: "var(--r-sm)", fontSize: "0.8rem", wordBreak: "break-all",
                    color: "var(--gold)", textDecoration: "none", lineHeight: 1.5,
                  }}
                >
                  🔗 {devResetUrl}
                </a>
              )}

              {resendTimer > 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", color: "var(--muted)", fontSize: "0.85rem", margin: "1rem 0" }}>
                  Please wait <Clock size={14} style={{ color: "var(--gold)" }} />
                  <strong style={{ color: "var(--gold)" }}>{formatTimer(resendTimer)}</strong> before resending.
                </div>
              ) : (
                <button className="btn btn-outline btn-full" onClick={submit} disabled={loading}>
                  {loading ? <span className="loading-spinner" /> : <Send size={14} />}
                  Resend Email
                </button>
              )}
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
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      onInvalid={handleInvalid}
                      required autoFocus
                      style={{ 
                        paddingLeft: "2.75rem",
                        borderColor: fieldErrors.email ? "rgba(248,113,113,0.5)" : undefined
                      }}
                    />
                    {fieldErrors.email && (
                      <div className="custom-tooltip">
                        <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.email}
                      </div>
                    )}
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
