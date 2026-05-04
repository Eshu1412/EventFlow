// src/pages/auth/Register.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sendOtp, checkEmail } from "../../api/auth";
import ThemeToggle from "../../components/ThemeToggle";
import { Eye, EyeOff, ArrowRight, AlertCircle, Users, Calendar, Shield, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ROLE_OPTIONS = [
  { value: "user",      Icon: Users,    label: "User",      desc: "Browse & book events" },
  { value: "organizer", Icon: Calendar, label: "Organizer", desc: "Create & manage events" },
  { value: "admin",     Icon: Shield,   label: "Admin",     desc: "Manage platform" },
];

export default function Register() {
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [step, setStep]     = useState("details");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError]   = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(() => {
    const saved = localStorage.getItem("otpResendTimer");
    if (saved) {
      const { expiresAt } = JSON.parse(saved);
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });
  const navigate  = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      // Ensure it's in localStorage
      const saved = localStorage.getItem("otpResendTimer");
      if (!saved) {
        localStorage.setItem("otpResendTimer", JSON.stringify({ expiresAt: Date.now() + resendTimer * 1000 }));
      }
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("otpResendTimer");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      localStorage.removeItem("otpResendTimer");
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startTimer = (seconds) => {
    localStorage.setItem("otpResendTimer", JSON.stringify({ expiresAt: Date.now() + seconds * 1000 }));
    setResendTimer(seconds);
  };

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email" && emailError) {
      setEmailError("");
    }
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleInvalid = (e) => {
    e.preventDefault();
    setFieldErrors(prev => ({ ...prev, [e.target.name]: e.target.validationMessage || "Please fill in this field." }));
  };

  const handleEmailBlur = async () => {
    if (!form.email) {
      setEmailError("");
      return;
    }
    setEmailChecking(true);
    try {
      const res = await checkEmail({ email: form.email });
      if (res.data.exists) {
        setEmailError("An account with this email already exists.");
      } else {
        setEmailError("");
      }
    } catch (err) {
      // Ignore network errors on blur
    } finally {
      setEmailChecking(false);
    }
  };

  const strength = (() => {
    const pw = form.password;
    if (pw.length === 0) return { label: "", color: "transparent", pct: 0 };
    if (pw.length < 6)   return { label: "Too short", color: "#f87171", pct: 20 };
    if (pw.length < 8)   return { label: "Weak", color: "#fb923c", pct: 40 };
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum   = /[0-9]/.test(pw);
    const hasSym   = /[^A-Za-z0-9]/.test(pw);
    const score    = [hasUpper, hasNum, hasSym].filter(Boolean).length;
    if (score === 0) return { label: "Fair", color: "#fbbf24", pct: 55 };
    if (score === 1) return { label: "Good", color: "#34d399", pct: 75 };
    return              { label: "Strong", color: "#4ade80", pct: 100 };
  })();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (emailError) {
      setError("Please fix the email issue before proceeding.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!["user", "organizer", "admin"].includes(form.role)) {
      setError("Invalid account type selected.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      localStorage.setItem("pendingRegistration", JSON.stringify(form));
      startTimer(600); // 10 minutes
      setStep("otp");
    } catch (err) {
      if (err.response?.status === 429 && err.response?.data?.remaining_seconds) {
        startTimer(err.response.data.remaining_seconds);
        setStep("otp");
        setError(err.response.data.error);
        return;
      }
      const errMsg = err.response?.data?.error || "Failed to send verification email.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setResending(true);
    try {
      await sendOtp({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
      });
      setError("");
      startTimer(600); // Reset timer to 10 minutes
    } catch (err) {
      if (err.response?.status === 429 && err.response?.data?.remaining_seconds) {
        startTimer(err.response.data.remaining_seconds);
      }
      setError(err.response?.data?.error || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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
      <ThemeToggle fixed className="auth-theme-toggle" />
      
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
                <div style={{ position: "relative" }}>
                  <input
                    name="name" type="text" className="form-control"
                    placeholder="Your full name"
                    value={form.name} onChange={handle} onInvalid={handleInvalid} required
                    style={{ borderColor: fieldErrors.name ? "rgba(248,113,113,0.5)" : undefined }}
                  />
                  {fieldErrors.name && (
                    <div className="custom-tooltip">
                      <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: "relative" }}>
                  <input
                    name="email" type="email" className="form-control"
                    placeholder="you@example.com"
                    value={form.email} onChange={handle} onBlur={handleEmailBlur} onInvalid={handleInvalid} required
                    style={{
                      borderColor: (emailError || fieldErrors.email) ? "rgba(248,113,113,0.5)" : undefined,
                    }}
                  />
                  {emailChecking && (
                    <div style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" }}>
                      <span className="loading-spinner" style={{ width: 14, height: 14, borderBottomColor: "var(--muted)" }} />
                    </div>
                  )}
                  {fieldErrors.email && !emailError && (
                    <div className="custom-tooltip">
                      <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.email}
                    </div>
                  )}
                </div>
                {emailError && (
                  <span style={{ fontSize: ".75rem", color: "#f87171", marginTop: ".3rem", display: "block" }}>{emailError}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    name="password" type={showPw ? "text" : "password"}
                    className="form-control" placeholder="Min. 8 characters"
                    value={form.password} onChange={handle} onInvalid={handleInvalid} required minLength={8}
                    style={{ 
                      paddingRight: "3rem",
                      borderColor: fieldErrors.password ? "rgba(248,113,113,0.5)" : undefined
                    }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)", color: "var(--muted)" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {fieldErrors.password && (
                    <div className="custom-tooltip">
                      <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.password}
                    </div>
                  )}
                </div>
                {/* Strength bar */}
                {form.password.length > 0 && (
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

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    name="confirmPassword" type={showCf ? "text" : "password"}
                    className="form-control" placeholder="Confirm your password"
                    value={form.confirmPassword} onChange={handle} onInvalid={handleInvalid} required minLength={8}
                    style={{
                      paddingRight: "3rem",
                      borderColor: form.confirmPassword && form.confirmPassword !== form.password ? "rgba(248,113,113,0.5)" : undefined,
                    }}
                  />
                  <button type="button" onClick={() => setShowCf(!showCf)}
                    style={{ position: "absolute", right: "1rem", top: "50%",
                      transform: "translateY(-50%)", color: "var(--muted)" }}>
                    {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {fieldErrors.confirmPassword && (
                    <div className="custom-tooltip">
                      <AlertCircle size={14} style={{ color: "#f87171" }} /> {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <span style={{ fontSize: ".75rem", color: "#f87171", marginTop: ".3rem", display: "block" }}>Passwords do not match</span>
                )}
                {form.confirmPassword && form.confirmPassword === form.password && form.password.length >= 8 && (
                  <span style={{ fontSize: ".75rem", color: "#4ade80", display: "flex", alignItems: "center", gap: ".3rem", marginTop: ".3rem" }}>
                    <CheckCircle size={12} /> Passwords match
                  </span>
                )}
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

              <div style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6, marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                Don't see the email?
                {resendTimer > 0 ? (
                  <span style={{ color: "var(--gold)", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={13} /> {formatTimer(resendTimer)}
                  </span>
                ) : (
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
                  </button>
                )}
              </div>

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
