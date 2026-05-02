// src/pages/organizer/OrganizerSettings.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../api/auth";
import {
  LayoutDashboard, Plus, Users, BarChart2,
  Settings, LogOut, Mail, Shield, Edit2, Check, X, AlertCircle, CheckCircle
} from "lucide-react";

export default function OrganizerSettings() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || "Organizer";

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [isEditing, setIsEditing]     = useState(false);
  const [formData, setFormData]       = useState({ name: "", password: "" });
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [saving, setSaving]           = useState(false);

  const doLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { to:"/organizer",               icon:LayoutDashboard, label:"Dashboard"     },
    { to:"/organizer/create",        icon:Plus,            label:"Create Event"  },
    { to:"/organizer/registrations", icon:Users,           label:"Registrations" },
    { to:"/organizer/analytics",     icon:BarChart2,       label:"Analytics"     },
    { to:"/organizer/settings",      icon:Settings,        label:"Settings", active:true },
  ];

  useEffect(() => {
    getProfile()
      .then(r => {
        setProfileData(r.data);
        setFormData({ name: r.data.name, password: "" });
      })
      .catch(() => {
        if (user) {
          setProfileData(user);
          setFormData({ name: user.name, password: "" });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);
    try {
      const payload = { name: formData.name };
      if (formData.password) payload.password = formData.password;
      const res = await updateProfile(payload);
      setProfileData(res.data);
      login(res.data, localStorage.getItem("token"));
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setFormData(prev => ({ ...prev, password: "" }));
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally { setSaving(false); }
  };

  const initials = (profileData?.name || name)[0]?.toUpperCase() || "O";

  if (loading) return (
    <div className="app-layout" style={{ paddingTop: 0 }}>
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
      </aside>
      <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)" }}>Loading settings…</p>
      </main>
    </div>
  );

  return (
    <div className="app-layout" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="sidebar-logo-text">Event<em>Flow</em></div></div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-section">Organizer</span>
          {navLinks.map(({ to, icon:Icon, label, active }) => (
            <Link key={label} to={to} className={`sidebar-nav-link ${active ? "active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"var(--coral)" }}>{initials}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">Organizer</div>
          </div>
          <button onClick={doLogout} style={{ color:"var(--muted)" }}><LogOut size={14} /></button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">SETTINGS</h1>
            <p className="page-subtitle">Manage your organizer profile and account details</p>
          </div>
        </div>

        <div className="page-content">
          {success && (
            <div className="alert alert-success" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><CheckCircle size={15} /> {success}</span>
              <button onClick={() => setSuccess("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={14} /></button>
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}><AlertCircle size={15} /> {error}</div>
          )}

          <div className="profile-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Avatar card */}
            <div className="card card-body" style={{ textAlign: "center" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%", background: "var(--coral)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: 800, margin: "0 auto 1.25rem", fontFamily: "var(--font-display)",
              }}>
                {initials}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: ".35rem", color: "var(--white)" }}>{profileData?.name}</div>
              <div style={{ marginBottom: "1rem" }}>
                <span className="badge badge-purple" style={{ textTransform: "capitalize" }}>
                  <Shield size={11} style={{ display: "inline", marginRight: ".3rem" }} /> {profileData?.role || "organizer"}
                </span>
              </div>
              <div style={{ fontSize: ".8rem", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem", marginBottom: ".5rem" }}>
                <Mail size={13} /> {profileData?.email}
              </div>
              <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                Member since {new Date(profileData?.date_joined || Date.now()).getFullYear()}
              </div>
            </div>

            {/* Edit form */}
            <div className="card card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.05rem", color: "var(--white)" }}>Account Details</h3>
                {!isEditing ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}><Edit2 size={14} /> Edit</button>
                ) : (
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--muted)" }} onClick={() => { setIsEditing(false); setFormData({ name: profileData.name, password: "" }); setError(""); }}>Cancel</button>
                )}
              </div>

              <form onSubmit={handleUpdate} className="form-stack">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={profileData?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                  <p style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: ".3rem" }}>Email cannot be changed.</p>
                </div>
                {isEditing && (
                  <div className="form-group">
                    <label className="form-label">New Password <span style={{ color: "var(--muted)", fontWeight: 400 }}>(leave blank to keep current)</span></label>
                    <input type="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} minLength={formData.password ? 6 : undefined} />
                  </div>
                )}
                {isEditing && (
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: ".5rem" }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <Check size={15} /> {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
