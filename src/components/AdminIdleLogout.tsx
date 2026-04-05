"use client";

import { useEffect, useRef, useCallback } from "react";

const IDLE_MS = 10 * 60 * 1000;
const RESET_THROTTLE_MS = 2000;

/**
 * Signs the admin out after a period with no user activity (tab must stay open).
 */
export function AdminIdleLogout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastThrottleRef = useRef(0);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/admin/login?reason=idle";
    }
  }, []);

  const bumpActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastThrottleRef.current < RESET_THROTTLE_MS) return;
    lastThrottleRef.current = now;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, IDLE_MS);
  }, [logout]);

  useEffect(() => {
    const opts: AddEventListenerOptions = { passive: true };
    const events: (keyof WindowEventMap)[] = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];
    bumpActivity();
    events.forEach((ev) => window.addEventListener(ev, bumpActivity, opts));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, bumpActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [bumpActivity]);

  return null;
}
