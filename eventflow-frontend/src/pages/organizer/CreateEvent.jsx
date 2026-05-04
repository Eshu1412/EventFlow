// src/pages/organizer/CreateEvent.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createEvent } from "../../api/events";
import { LayoutDashboard, Plus, Users, BarChart2, Settings, LogOut,
         Upload, Check, ArrowRight, ArrowLeft, Eye, User, Calendar, Ticket, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Music","Tech","Sports","Food","Art","Business","Conference","Workshop","Other"];
const STEPS = ["Basic Info","Date & Venue","Tickets","Review & Publish"];

export default function CreateEvent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:"", category:"", description:"", tags:"",
    date:"", time:"", venue:"", city:"", address:"",
    price:"", total_tickets:"", ticket_name:"General Admission",
  });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const name = user?.name || "Organizer";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        category:    form.category,
        location:    form.venue ? `${form.venue}, ${form.city}` : form.city,
        date:        `${form.date}T${form.time || "18:00"}:00`,
        price:       Number(form.price) || 0,
        total_seats: Number(form.total_tickets) || 100,
        image_url:   form.image_url || null,
      };
      await createEvent(payload);
      navigate("/organizer");
    } catch {
      alert("Error creating event. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
          <div className="sidebar-logo-text">Event<em>Flow</em></div>
        </Link>
        <nav className="sidebar-nav">
          <Link to="/organizer" className="sidebar-nav-link"><LayoutDashboard size={17} /> Dashboard</Link>
          <Link to="/organizer/create" className="sidebar-nav-link active"><Plus size={17} /> Create Event</Link>
          <Link to="/organizer/registrations" className="sidebar-nav-link"><Users size={17} /> Registrations</Link>
          <Link to="/organizer/analytics" className="sidebar-nav-link"><BarChart2 size={17} /> Analytics</Link>
          <Link to="/organizer/settings" className="sidebar-nav-link"><Settings size={17} /> Settings</Link>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background:"var(--color-accent)" }}>{name[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontSize:".83rem", fontWeight:600 }}>{name}</div>
            <span className="badge badge-amber" style={{ fontSize:".65rem" }}>Organizer</span>
          </div>
          <button onClick={logout} style={{ background:"none", border:"none", cursor:"pointer", color:"#475569" }}><LogOut size={15} /></button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Create New Event</h1>
            <p className="page-subtitle">Fill in the details to publish your event</p>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color:"var(--color-text-muted)" }}>Save Draft</button>
        </div>

        <div className="page-content">
          {/* Step progress */}
          <div className="steps-bar" style={{ marginBottom:"2.5rem" }}>
            {STEPS.map((label, i) => (
              <div key={label} className="step-item">
                <div className="step-col">
                  <div className={`step-circle ${i<step?"done":i===step?"active":"pending"}`}>
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <div className={`step-label ${i<step?"done":i===step?"active":"pending"}`}>{label}</div>
                </div>
                {i < STEPS.length-1 && <div className={`step-connector ${i<step?"done":""}`} style={{ margin:"0 .5rem", marginBottom:"1.2rem" }} />}
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:"2rem", alignItems:"flex-start", flexWrap:"wrap" }}>
            {/* Form */}
            <div className="card card-body" style={{ flex:1, minWidth:300 }}>
              {step === 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                  <h3 style={{ marginBottom:".25rem" }}>Basic Information</h3>
                  <div className="form-group">
                    <label className="form-label">Event Title *</label>
                    <input name="title" className="form-control" placeholder="e.g. Annual Tech Conference 2026"
                      value={form.title} onChange={handle} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select name="category" className="form-control" value={form.category} onChange={handle}>
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea name="description" className="form-control" rows={5}
                      placeholder="Describe your event in detail — agenda, speakers, what to expect…"
                      value={form.description} onChange={handle} style={{ resize:"vertical" }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Banner Image</label>
                    <div className="upload-zone">
                      <div className="upload-icon"><Upload size={32} /></div>
                      <p style={{ fontWeight:600, marginBottom:".3rem" }}>Drop image here or click to upload</p>
                      <p style={{ fontSize:".8rem", color:"var(--color-text-muted)" }}>PNG, JPG, WEBP up to 5MB. Recommended: 1200×630px</p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags <span style={{ color:"var(--color-text-muted)", fontWeight:400 }}>(comma-separated)</span></label>
                    <input name="tags" className="form-control" placeholder="music, festival, live, outdoor"
                      value={form.tags} onChange={handle} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                  <h3>Date & Venue</h3>
                  <div className="form-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input name="date" type="date" className="form-control" value={form.date} onChange={handle} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time *</label>
                      <input name="time" type="time" className="form-control" value={form.time} onChange={handle} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue Name *</label>
                    <input name="venue" className="form-control" placeholder="e.g. Javits Convention Center"
                      value={form.venue} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" className="form-control" placeholder="e.g. New York City"
                      value={form.city} onChange={handle} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address</label>
                    <input name="address" className="form-control" placeholder="Street address, zip code"
                      value={form.address} onChange={handle} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                  <h3>Ticket Settings</h3>
                  <div className="form-group">
                    <label className="form-label">Ticket Name</label>
                    <input name="ticket_name" className="form-control" value={form.ticket_name} onChange={handle} />
                  </div>
                  <div className="form-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Price (INR) <span style={{ fontWeight:400, color:"var(--color-text-muted)" }}>— 0 for free</span></label>
                      <input name="price" type="number" min="0" className="form-control" placeholder="0.00"
                        value={form.price} onChange={handle} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Total Tickets Available</label>
                      <input name="total_tickets" type="number" min="1" className="form-control" placeholder="100"
                        value={form.total_tickets} onChange={handle} />
                    </div>
                  </div>
                  <div className="alert alert-warning">
                    💡 Set price to <strong>0</strong> for a free event. Tickets will be distributed on first-come, first-served basis.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ marginBottom:"1.5rem" }}>Review & Publish</h3>
                  {[
                    { label:"Title", value:form.title || "—" },
                    { label:"Category", value:form.category || "—" },
                    { label:"Date", value:form.date ? `${form.date} at ${form.time}` : "—" },
                    { label:"Venue", value:form.venue ? `${form.venue}, ${form.city}` : "—" },
                    { label:"Price", value:form.price ? `$${form.price}` : "Free" },
                    { label:"Tickets", value:form.total_tickets || "100" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display:"flex", gap:"1rem", padding:".65rem 0", borderBottom:"1px solid var(--color-border)" }}>
                      <span style={{ width:110, color:"var(--color-text-muted)", fontSize:".85rem", flexShrink:0 }}>{label}</span>
                      <span style={{ fontWeight:600, fontSize:".9rem" }}>{value}</span>
                    </div>
                  ))}
                  {form.description && (
                    <div style={{ marginTop:"1rem" }}>
                      <div style={{ color:"var(--color-text-muted)", fontSize:".85rem", marginBottom:".4rem" }}>Description</div>
                      <p style={{ fontSize:".875rem", lineHeight:1.7 }}>{form.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="form-nav-row" style={{ display:"flex", justifyContent:"space-between", marginTop:"2rem", paddingTop:"1.25rem", borderTop:"1px solid var(--color-border)" }}>
                <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0}>
                  <ArrowLeft size={15} /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => setStep(s => s+1)}>
                    Next Step <ArrowRight size={15} />
                  </button>
                ) : (
                  <button className="btn btn-accent btn-lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Publishing…" : "🚀 Publish Event"}
                  </button>
                )}
              </div>
            </div>

            {/* Preview card */}
            <div className="event-preview-panel" style={{ width:260, flexShrink:0 }}>
              <p style={{ fontSize:".8rem", color:"var(--color-text-muted)", marginBottom:".75rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".05em" }}>
                <Eye size={13} style={{ display:"inline", marginRight:".35rem" }} /> Live Preview
              </p>
              <div className="card">
                <div style={{ height:130, background:"linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {form.category && <span className="badge badge-amber">{form.category}</span>}
                </div>
                <div style={{ padding:"1rem" }}>
                  <div style={{ fontWeight:700, fontSize:".9rem", marginBottom:".5rem" }}>{form.title || "Event Title"}</div>
                  <div style={{ fontSize:".78rem", color:"var(--color-text-muted)", marginBottom:".3rem" }}>📅 {form.date || "Date TBA"}</div>
                  <div style={{ fontSize:".78rem", color:"var(--color-text-muted)" }}>📍 {form.venue || "Venue TBA"}</div>
                  <div style={{ marginTop:".75rem", fontWeight:700, color:"var(--color-primary)", fontSize:".9rem" }}>
                    {form.price ? `$${form.price}` : "Free"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
