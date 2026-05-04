// src/components/ThemeToggle.jsx
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Floating or inline theme toggle button.
 * Pass `fixed` to position it as a floating corner button.
 */
export default function ThemeToggle({ fixed = false, style = {}, className = "" }) {
  const { isDark, toggle } = useTheme();

  const baseStyle = {
    width: 38,
    height: 38,
    borderRadius: "var(--r-sm)",
    border: "1px solid var(--border)",
    background: "var(--card-bg)",
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    zIndex: 200,
    ...(fixed ? {
      position: "fixed",
      top: "1.25rem",
      right: "1.25rem",
    } : {}),
    ...style,
  };

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-gold)";
        e.currentTarget.style.color = "var(--gold)";
        e.currentTarget.style.background = "var(--ink-3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--muted)";
        e.currentTarget.style.background = "var(--card-bg)";
      }}
    >
      {isDark
        ? <Sun size={16} strokeWidth={1.8} />
        : <Moon size={16} strokeWidth={1.8} />
      }
    </button>
  );
}
