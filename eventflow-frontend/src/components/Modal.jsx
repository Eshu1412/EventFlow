// src/components/Modal.jsx
import { X } from "lucide-react";
import { useEffect } from "react";
import { motion as Motion } from "framer-motion";

export default function Modal({ title, children, onClose, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const widths = { sm: "420px", md: "560px", lg: "720px", xl: "900px" };

  return (
    <Motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
    >
      <Motion.div
        className="card modal-content"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: widths[size], maxHeight: "90vh", overflow: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--color-border)"
        }}>
          <h3 style={{ fontSize: "1.1rem" }}>{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </Motion.div>
    </Motion.div>
  );
}
