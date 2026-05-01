// src/components/Modal.jsx
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ title, children, onClose, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const widths = { sm: "420px", md: "560px", lg: "720px", xl: "900px" };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: widths[size], maxHeight: "90vh", overflow: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)"
        }}>
          <h3 style={{ fontSize: "1.1rem" }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: ".4rem" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
}
