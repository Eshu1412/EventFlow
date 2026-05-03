// src/pages/auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp } from "../../api/auth";
import { Eye, EyeOff, ArrowRight, AlertCircle, Users, Calendar, Shield, RefreshCw } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";

const ROLE_OPTIONS = [
  { value: "user",      Icon: Users,    label: "User",      desc: "Browse & book events" },
  { value: "organizer", Icon: Calendar, label: "Organizer", desc: "Create & manage events" },
  { value: "admin",     Icon: Shield,   label: "Admin",     desc: "Manage platform" },
];

export default function Register() {
  const [form, setForm]     = useState({ name: "", email: "", password: "", role: "user" });
  const [step, setStep]     = useState("details");
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate  = useNavigate();
  const { login } = useAuth();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Send ALL registration data to backend so it's stored server-side
      // This ensures verification works even if opened on a different device
      await sendOtp({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      // Also save to localStorage as fallback (for same-browser verification)
      localStorage.setItem("pendingRegistration", JSON.stringify(form));
      setStep("otp");
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to send verification email.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      await sendOtp({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      setError(""); // clear any previous error
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const slideIn = {
    hidden: { opacity: 0, x: 30, filter: "blur(4px)" },
    visible: { 
      opacity: 1, x: 0, filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, when: "beforeChildren" }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="auth-layout" style={{ paddingTop: 0 }}>
      {/* Floating theme toggle */}
      <ThemeToggle fixed />
      {/* Visual panel */}
      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="auth-visual-headline">
            Start Your<br /><em>Journey</em><br />Today.
          </h2>
          <p className="auth-visual-body">
            Create an account to book events, manage registrations,
            or list your own experiences on the world's premier event platform.
          </p>
        </motion.div>

        {/* Role features */}
        <motion.div 
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {ROLE_OPTIONS.map(({ value, Icon, label, desc }) => (
            <div
              key={value}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                background: form.role === value ? "rgba(200,169,110,0.1)" : "transparent",
                border: `1px solid ${form.role === value ? "rgba(200,169,110,0.3)" : "var(--border)"}`,
                borderRadius: "var(--r-sm)", padding: "0.875rem 1rem",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "6px",
                background: "rgba(200,169,110,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--gold)", flexShrink: 0,
              }}>
                <Icon size={16} />
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--white)" }}>{label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form panel */}
      <motion.div 
        className="auth-form-panel"
        variants={slideIn}
        initial="hidden"
        animate="visible"
      >
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
          <Link to="/" className="auth-mobile-brand">Event<em>Flow</em></Link>

          <motion.h2 variants={item} className="auth-form-title">CREATE ACCOUNT</motion.h2>
          <motion.p variants={item} className="auth-form-sub">
            Already have one?{" "}
            <Link to="/login">Sign in</Link>
          </motion.p>

          {error && (
            <motion.div variants={item} className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}

          {step === "details" ? (
            <motion.form variants={item} onSubmit={handleSendOtp} className="form-stack">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  name="name" type="text" className="form-control"
                  placeholder="Your full name"
                  value={form.name} onChange={handle} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email" type="email" className="form-control"
                  placeholder="you@example.com"
                  value={form.email} onChange={handle} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    name="password" type={showPw ? "text" : "password"}
                    className="form-control" placeholder="Min. 8 characters"
                    value={form.password} onChange={handle} required minLength={8}
                    style={{ paddingRight: "3rem" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)", color: "var(--muted)" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select name="role" className="form-control" value={form.role} onChange={handle}>
                  <option value="user">User — Attend events</option>
                  <option value="organizer">Organizer — Host events</option>
                  <option value="admin">Admin — Manage platform</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading
                  ? <><span className="loading-spinner" /> Sending verification…</>
                  : <><ArrowRight size={16} /> Continue</>
                }
              </button>

              <p style={{ fontSize: ".75rem", color: "var(--muted)", textAlign: "center", marginTop: "1rem" }}>
                By creating an account, you agree to our{" "}
                <a href="#" style={{ color: "var(--gold)" }}>Terms of Service</a> and{" "}
                <a href="#" style={{ color: "var(--gold)" }}>Privacy Policy</a>.
              </p>
            </motion.form>
          ) : (
            <motion.div variants={item} className="form-stack" style={{ textAlign: "center" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(184,146,78,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.5rem" }}>
                Check your email
              </h3>

              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                We've sent a verification link to<br />
                <strong style={{ color: "var(--white)" }}>{form.email}</strong>
              </p>

              <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Click the <strong style={{ color: "var(--gold)" }}>Verify Now</strong> button in the email to verify your account and complete registration automatically.
              </p>

              <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6, marginTop: "0.75rem" }}>
                Don't see the email? Check your spam folder, or{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  style={{
                    color: "var(--gold)", background: "none", border: "none",
                    cursor: "pointer", textDecoration: "underline", fontSize: "inherit",
                    padding: 0,
                  }}
                >
                  {resending ? "resending…" : "resend it"}
                </button>.
              </p>

              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link to="/login" className="btn btn-primary btn-full btn-lg">
                  <ArrowRight size={16} /> Go to Sign In
                </Link>
                <button type="button" onClick={() => setStep("details")} className="btn btn-ghost btn-full" disabled={loading}>
                  Back to details
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
