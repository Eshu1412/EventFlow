// src/pages/organizer/CreateEvent.jsx
import ThemeToggle from "../../components/ThemeToggle";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, getEventById } from "../../api/events";
import {
  LayoutDashboard, Plus, Users, BarChart2, Settings, LogOut,
  Upload, Check, ArrowRight, ArrowLeft, Eye, User, Calendar,
  Ticket, BookOpen
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Music", "Tech", "Sports", "Food", "Art", "Business", "Conference", "Workshop", "Other"];
const STEPS = ["Basic Info", "Date & Venue", "Tickets", "Review & Publish"];

export default function CreateEvent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "", venue: "", city: "", address: "",
    date: "", time: "", ticket_name: "General Admission", price: "", total_tickets: "", tags: "", image_url: ""
  });

  const { id } = useParams();
  const isEditing = Boolean(id);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const name = user?.name || "Organizer";


  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      getEventById(id).then(res => {
        const data = res.data;
        const [d, t] = data.date ? data.date.split("T") : ["", ""];
        setForm({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          venue: data.location ? data.location.split(",")[0].trim() : "",
          city: data.location && data.location.includes(",") ? data.location.split(",")[1].trim() : (data.location || ""),
          address: "",
          date: d,
          time: t ? t.substring(0, 5) : "",
          ticket_name: "General Admission",
          price: data.price || "",
          total_tickets: data.total_seats || "",
          tags: "",
          image_url: data.image_url || ""
        });
        if (data.image_url) setImagePreview(data.image_url);
      }).catch(err => {
        console.error(err);
        alert("Failed to load event details.");
      }).finally(() => setLoading(false));
    }
  }, [isEditing, id]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processFile = (file) => {
    setImageLoading(true);
    // Set immediate visual preview
    setImagePreview(URL.createObjectURL(file));
    
    // Resize and compress image using canvas to prevent Base64 payload limits
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 630;
        let width = img.width;
        let height = img.height;

        // Better aspect ratio scaling
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        if (ratio < 1) {
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as WebP with 0.8 quality (very small size)
        const compressedBase64 = canvas.toDataURL("image/webp", 0.8);
        setForm(f => ({ ...f, image_url: compressedBase64 }));
        setImageLoading(false);
      };
      img.onerror = () => setImageLoading(false);
      img.src = e.target.result;
    };
    reader.onerror = () => setImageLoading(false);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock upload handling: Map categories to high-quality Unsplash URLs
      const CATEGORY_IMAGES = {
        "Music": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        "Tech": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
        "Sports": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        "Food": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
        "Art": "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80",
        "Business": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
        "Conference": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        "Workshop": "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
        "Other": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80"
      };

      let finalImageUrl = form.image_url;
      // If no image was uploaded, fallback to a beautiful category-specific Unsplash image
      if (!finalImageUrl || finalImageUrl === "uploaded") {
        finalImageUrl = CATEGORY_IMAGES[form.category] || CATEGORY_IMAGES["Other"];
      }

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.venue ? `${form.venue}, ${form.city}` : form.city,
        date: `${form.date}T${form.time || "18:00"}:00`,
        price: Number(form.price) || 0,
        total_seats: Number(form.total_tickets) || 100,
        image_url: finalImageUrl,
      };
      if (isEditing) {
        await updateEvent(id, payload);
      } else {
        await createEvent(payload);
      }
      navigate("/organizer");
    } catch (err) {
      console.error("Submission error:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || Object.values(err.response?.data || {}).join(", ");
      alert(`Error ${isEditing ? 'updating' : 'creating'} event: ${msg || 'Please try again.'}`);
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
          <div className="sidebar-avatar" style={{ background: "var(--color-accent)" }}>{name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: ".83rem", fontWeight: 600 }}>{name}</div>
            <span className="badge badge-amber" style={{ fontSize: ".65rem" }}>Organizer</span>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}><LogOut size={15} /></button>
        </div>
      </aside>

      <main className="main-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{isEditing ? "Edit Event" : "Create New Event"}</h1>
            <p className="dashboard-subtitle">{isEditing ? "Update the details of your event." : "Fill in the details to publish your event to the marketplace."}</p>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--color-text-muted)" }}>Save Draft</button>
        </div>

        <div className="page-content">
          {/* Step progress */}
          <div className="steps-bar" style={{ marginBottom: "2.5rem" }}>
            {STEPS.map((label, i) => (
              <div key={label} className="step-item">
                <div className="step-col">
                  <div className={`step-circle ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <div className={`step-label ${i < step ? "done" : i === step ? "active" : "pending"}`}>{label}</div>
                </div>
                {i < STEPS.length - 1 && <div className={`step-connector ${i < step ? "done" : ""}`} style={{ margin: "0 .5rem", marginBottom: "1.2rem" }} />}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Form */}
            <div className="card card-body" style={{ flex: 1, minWidth: 300 }}>
              {step === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3 style={{ marginBottom: ".25rem" }}>Basic Information</h3>
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
                      value={form.description} onChange={handle} style={{ resize: "vertical" }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Banner Image</label>
                    <label 
                      className="upload-zone"
                      style={{ cursor: "pointer", display: "block", position: "relative", overflow: "hidden" }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        style={{ display: "none" }} 
                        onChange={(e) => {
                          handleFileChange(e);
                          e.target.value = ""; // Reset to allow selecting same file
                        }}
                      />
                      {imagePreview ? (
                        <div style={{ position: "relative", width: "100%", height: "200px" }}>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", opacity: imageLoading ? 0.5 : 1 }} 
                          />
                          <div style={{
                            position: "absolute", top: "10px", right: "10px", 
                            background: "rgba(0,0,0,0.65)", color: "white", 
                            padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600
                          }}>
                            {imageLoading ? "Processing..." : "Change Image"}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="upload-icon"><Upload size={32} /></div>
                          <p style={{ fontWeight: 600, marginBottom: ".3rem" }}>Drop image here or click to upload</p>
                          <p style={{ fontSize: ".8rem", color: "var(--color-text-muted)" }}>PNG, JPG, WEBP up to 5MB. Recommended: 1200×630px</p>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>(comma-separated)</span></label>
                    <input name="tags" className="form-control" placeholder="music, festival, live, outdoor"
                      value={form.tags} onChange={handle} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3>Date & Venue</h3>
                  <div className="form-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h3>Ticket Settings</h3>
                  <div className="form-group">
                    <label className="form-label">Ticket Name</label>
                    <input name="ticket_name" className="form-control" value={form.ticket_name} onChange={handle} />
                  </div>
                  <div className="form-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label">Price (INR) <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>— 0 for free</span></label>
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
                  <h3 style={{ marginBottom: "1.5rem" }}>Review & Publish</h3>
                  {[
                    { label: "Title", value: form.title || "—" },
                    { label: "Category", value: form.category || "—" },
                    { label: "Date", value: form.date ? `${form.date} at ${form.time}` : "—" },
                    { label: "Venue", value: form.venue ? `${form.venue}, ${form.city}` : "—" },
                    { label: "Price", value: form.price ? `₹${form.price}` : "Free" },
                    { label: "Tickets", value: form.total_tickets || "100" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", gap: "1rem", padding: ".65rem 0", borderBottom: "1px solid var(--color-border)" }}>
                      <span style={{ width: 110, color: "var(--color-text-muted)", fontSize: ".85rem", flexShrink: 0 }}>{label}</span>
                      <span style={{ fontWeight: 600, fontSize: ".9rem" }}>{value}</span>
                    </div>
                  ))}
                  {form.description && (
                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ color: "var(--color-text-muted)", fontSize: ".85rem", marginBottom: ".4rem" }}>Description</div>
                      <p style={{ fontSize: ".875rem", lineHeight: 1.7 }}>{form.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="form-nav-row" style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)" }}>
                <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
                  <ArrowLeft size={15} /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
                    Next Step <ArrowRight size={15} />
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || imageLoading} style={{ width:"100%", justifyContent:"center" }}>
                  {loading ? (isEditing ? "Updating..." : "Publishing...") : (imageLoading ? "Processing Image..." : (isEditing ? "Update Event" : "Publish Event"))}
                </button>
                )}
              </div>
            </div>

            {/* Preview card */}
            <div className="event-preview-panel" style={{ width: 260, flexShrink: 0 }}>
              <p style={{ fontSize: ".8rem", color: "var(--color-text-muted)", marginBottom: ".75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
                <Eye size={13} style={{ display: "inline", marginRight: ".35rem" }} /> Live Preview
              </p>
              <div className="card">
                <div style={{
                  height: 130, background: "linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {form.category && <span className="badge badge-amber">{form.category}</span>}
                </div>
                <div style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: 700, fontSize: ".9rem", marginBottom: ".5rem" }}>{form.title || "Event Title"}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)", marginBottom: ".3rem" }}>📅 {form.date || "Date TBA"}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)" }}>📍 {form.venue || "Venue TBA"}</div>
                  <div style={{ marginTop: ".75rem", fontWeight: 700, color: "var(--color-primary)", fontSize: ".9rem" }}>
                    {form.price ? `₹${form.price}` : "Free"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hide-mobile"><ThemeToggle /></div>
      </main>
    </div>
  );
}
