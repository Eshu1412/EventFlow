// src/components/PageTransition.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Smooth page transitions using opacity cross-dissolve only.
 *
 * IMPORTANT: Do NOT use transform or filter on the wrapper div —
 * they create a new CSS stacking context which breaks fixed-positioned
 * children (e.g. the Navbar with position: fixed; top: 0).
 * Opacity alone is the only safe property that doesn't cause this issue.
 *
 * Sequence:
 *  0ms      → fade out starts (80ms)
 *  80ms     → content swaps + fade in starts (300ms)
 *  100ms    → gold progress bar sweeps (completes at ~400ms total)
 *  380ms    → bar fades out
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);
  const [progress, setProgress] = useState(0);
  const prevKey = useRef(location.key);
  const prevPath = useRef(location.pathname);
  const timers = useRef([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  useEffect(() => {
    if (location.key === prevKey.current) return;
    
    prevKey.current = location.key;
    prevPath.current = location.pathname;

    clear();

    // 1. Fade out + start progress bar
    setOpacity(0);
    setProgress(20);

    after(() => {
      // 2. Swap content while invisible
      setDisplayChildren(children);
      setProgress(65);

      // 3. Fade in
      setOpacity(1);

      after(() => setProgress(100), 50);

      // 4. Hide progress bar
      after(() => setProgress(0), 420);
    }, 90);

    return clear;
  }, [location.key, children, location.pathname]);

  // Keep displayChildren current when idle
  useEffect(() => {
    if (opacity === 1) setDisplayChildren(children);
  }, [children, opacity]);

  return (
    <>
      {/* Gold progress bar — fixed to viewport, no stacking context issues */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: progress === 0 ? "0%" : `${progress}%`,
          background: "linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)",
          boxShadow: progress > 0 ? "0 0 8px 1px rgba(184,146,78,0.5)" : "none",
          zIndex: 99999,
          opacity: progress === 0 ? 0 : 1,
          borderRadius: "0 2px 2px 0",
          pointerEvents: "none",
          transition:
            progress === 0
              ? "opacity 0.25s ease, width 0.1s ease"
              : progress === 100
              ? "width 0.15s ease"
              : "width 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.1s ease",
        }}
      />

      {/* Page content — opacity only, NO transform/filter (would break fixed navbar) */}
      <div
        style={{
          opacity,
          transition: opacity === 0
            ? "opacity 0.08s ease"
            : "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {displayChildren}
      </div>
    </>
  );
}
