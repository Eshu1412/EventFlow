// src/pages/auth/ResetPassword.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Lock } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [searchParams]  = useSearchParams();
  const token           = searchParams.get("token") || "";
  const navigate        = useNavigate();

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");

  // Redirect to login after success
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate("/login", { state: { registered: true } }), 3500);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

  const strength = (() => {
    if (password.length === 0) return { label: "", color: "transparent", pct: 0 };
    if (password.length < 6)   return { label: "Too short", color: "#f87171", pct: 20 };
    if (password.length < 8)   return { label: "Weak", color: "#fb923c", pct: 40 };
    const hasUpper = /[A-Z]/.test(password);
    const hasNum   = /[0-9]/.test(password);
    const hasSym   = /[^A-Za-z0-9]/.test(password);
    const score    = [hasUpper, hasNum, hasSym].filter(Boolean).length;
    if (score === 0) return { label: "Fair", color: "#fbbf24", pct: 55 };
    if (score === 1) return { label: "Good", color: "#34d399", pct: 75 };
    return              { label: "Strong", color: "#4ade80", pct: 100 };
  })();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/password-reset/confirm/", { token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired link. Please request a new one.");
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

      {/* Left visual */}
      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="auth-visual-headline">
            Choose a<br />new<br /><em>password.</em>
          </h2>
          <p className="auth-visual-body">
            Create a strong, unique password. Use a mix of letters, numbers,
            and symbols for the best security.
          </p>
        </motion.div>

        {/* Password tips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
            borderRadius: "var(--r-md)", padding: "1.25rem",
          }}>
          <p style={{ fontSize: ".72rem", fontFamily: "var(--font-mono)", letterSpacing: ".1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: ".75rem" }}>
            Password tips
          </p>
          {[
            "At least 8 characters",
            "One uppercase letter (A–Z)",
            "One number (0–9)",
            "One symbol (!@#$...)",
          ].map(tip => (
            <div key={tip} style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".8rem", color: "rgba(255,255,255,0.45)", marginBottom: ".4rem" }}>
              <Lock size={11} style={{ color: "var(--gold)", flexShrink: 0 }} /> {tip}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right form */}
      <motion.div className="auth-form-panel"
        variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
        initial="hidden" animate="visible">
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          <Link to="/" className="auth-mobile-brand">Event<em>Flow</em></Link>

          {/* Invalid token check */}
          {!token ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}>
                <AlertCircle size={32} style={{ color: "#f87171" }} />
              </div>
              <h2 className="auth-form-title" style={{ textAlign: "center" }}>INVALID LINK</h2>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7, margin: "1rem 0 2rem" }}>
                This reset link is missing or invalid.<br />Please request a new password reset.
              </p>
              <Link to="/forgot-password" className="btn btn-primary btn-full">
                Request New Link
              </Link>
            </motion.div>
          ) : success ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}>
                <CheckCircle size={32} style={{ color: "#4ade80" }} />
              </div>
              <h2 className="auth-form-title" style={{ textAlign: "center" }}>PASSWORD RESET!</h2>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7, margin: "1rem 0 2rem" }}>
                Your password has been updated successfully.<br />
                Redirecting you to login in a moment…
              </p>
              <Link to="/login" className="btn btn-primary btn-full">
                <ArrowRight size={15} /> Go to Login
              </Link>
            </motion.div>
          ) : (
            /* ── Reset form ── */
            <>
              <motion.h2 variants={item} className="auth-form-title">NEW PASSWORD</motion.h2>
              <motion.p variants={item} className="auth-form-sub">
                Enter and confirm your new password below.
              </motion.p>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
                  <AlertCircle size={15} /> {error}
                </motion.div>
              )}

              <motion.form variants={item} onSubmit={submit} className="form-stack">

                {/* New password */}
                <div className="form-group">
                  <label className="form-label">New password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required autoFocus
                      style={{ paddingRight: "3rem" }}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{
                      position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)", color: "var(--muted)",
                    }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div style={{ marginTop: ".5rem" }}>
                      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 4, overflow: "hidden" }}>
                        <div style={{
                          width: `${strength.pct}%`, height: "100%",
                          background: strength.color, borderRadius: 4,
                          transition: "width 0.3s ease, background 0.3s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: ".72rem", color: strength.color, fontFamily: "var(--font-mono)", letterSpacing: ".06em" }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="form-group">
                  <label className="form-label">Confirm password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCf ? "text" : "password"}
                      className="form-control"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      style={{
                        paddingRight: "3rem",
                        borderColor: confirm && confirm !== password ? "rgba(248,113,113,0.5)" : undefined,
                      }}
                    />
                    <button type="button" onClick={() => setShowCf(!showCf)} style={{
                      position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)", color: "var(--muted)",
                    }}>
                      {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <span style={{ fontSize: ".75rem", color: "#f87171" }}>Passwords do not match</span>
                  )}
                  {confirm && confirm === password && password.length >= 6 && (
                    <span style={{ fontSize: ".75rem", color: "#4ade80", display: "flex", alignItems: "center", gap: ".3rem" }}>
                      <CheckCircle size={12} /> Passwords match
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                  {loading
                    ? <><span className="loading-spinner" /> Resetting…</>
                    : <><ArrowRight size={16} /> Reset Password</>
                  }
                </button>
              </motion.form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
