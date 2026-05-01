// src/context/TransitionContext.jsx
import { createContext, useContext, useRef, useState } from "react";

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [transitioning, setTransitioning] = useState(false);
  const resolveRef = useRef(null);

  /**
   * Call this before navigating. Returns a promise that resolves
   * when the curtain is fully closed (safe to swap the page).
   */
  const startTransition = () => {
    setTransitioning(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  /** Called by the overlay once the curtain finishes closing */
  const onCurtainClosed = () => {
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  };

  const endTransition = () => setTransitioning(false);

  return (
    <TransitionContext.Provider
      value={{ transitioning, startTransition, onCurtainClosed, endTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
