// src/components/PageTransition.jsx
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Rich page transitions using framer-motion.
 * Features a luxurious upward-sweeping shutter effect.
 * IMPORTANT: No transform or filter is used on the content wrapper to preserve fixed positioning of the Navbar.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="framer-page-wrapper">
        {/* The actual page content — opacity only to prevent stacking context bugs with fixed Navbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {children}
        </motion.div>

        {/* Shutter covering the screen on exit (bottom to top sweep) */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "var(--ink)",
            zIndex: 999999,
            transformOrigin: "bottom"
          }}
        />
        {/* Shutter revealing the screen on enter (bottom to top sweep) */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "var(--ink)",
            zIndex: 999999,
            transformOrigin: "top"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
