// src/pages/auth/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyOtp, registerUser, loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("Verifying your email...");

  const email = params.get("email") || "";
  const otp = params.get("otp") || "";

  useEffect(() => {
    if (!email || !otp) {
      setStatus("error");
      setMessage("Invalid verification link. Please try registering again.");
      return;
    }

    const verify = async () => {
      try {
        // Step 1: Verify the OTP
        await verifyOtp({ email, otp });

        // Step 2: Check if we have pending registration data
        const pending = sessionStorage.getItem("pendingRegistration");
        if (pending) {
          const form = JSON.parse(pending);

          // Step 3: Complete registration
          await registerUser({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          });

          // Step 4: Auto-login
          const { data } = await loginUser({
            email: form.email,
            password: form.password,
          });

          sessionStorage.removeItem("pendingRegistration");
          login(data.user, data.token);

          setStatus("success");
          setMessage("Account created! Redirecting...");

          // Redirect based on role
          setTimeout(() => {
            if (data.user.role === "admin") navigate("/admin");
            else if (data.user.role === "organizer") navigate("/organizer");
            else navigate("/dashboard");
          }, 1500);
        } else {
          // No pending registration — just email verification
          setStatus("success");
          setMessage("Email verified! You can now sign in.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.error ||
            "Verification failed. The link may have expired."
        );
      }
    };

    verify();
  }, [email, otp, navigate, login]);

  const icon = {
    verifying: (
      <div style={{
        width: 48, height: 48, border: "3px solid rgba(184,146,78,0.2)",
        borderTopColor: "var(--gold)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
    ),
    success: <CheckCircle size={48} style={{ color: "#22c55e" }} />,
    error: <XCircle size={48} style={{ color: "#ef4444" }} />,
  };

  return (
    <div className="auth-layout" style={{ paddingTop: 0 }}>
      <ThemeToggle fixed />

      <div className="auth-visual">
        <Link to="/" className="auth-visual-brand">Event<em>Flow</em></Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="auth-visual-headline">
            Email<br /><em>Verification</em>
          </h2>
        </motion.div>
      </div>

      <motion.div
        className="auth-form-panel"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{
          maxWidth: 420, width: "100%", margin: "0 auto",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "50vh", textAlign: "center",
          gap: "1.5rem",
        }}>
          {icon[status]}

          <h2 style={{
            fontSize: "1.5rem", fontWeight: 700,
            color: status === "error" ? "#ef4444" : "var(--white)",
          }}>
            {status === "verifying" && "Verifying..."}
            {status === "success" && "Verified!"}
            {status === "error" && "Verification Failed"}
          </h2>

          <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {message}
          </p>

          {status === "error" && (
            <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: "1rem" }}>
              <ArrowRight size={16} /> Try Again
            </Link>
          )}

          {status === "success" && !sessionStorage.getItem("pendingRegistration") && (
            <Link to="/login" className="btn btn-primary btn-lg" style={{ marginTop: "1rem" }}>
              <ArrowRight size={16} /> Go to Sign In
            </Link>
          )}
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
