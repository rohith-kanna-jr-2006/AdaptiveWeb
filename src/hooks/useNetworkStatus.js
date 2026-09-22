"use client";

import { useState, useEffect } from "react";

/**
 * Hook to retrieve REAL browser network information from navigator.connection (Network Information API).
 * Never guesses or fabricates values.
 * Displays "Not available" when a browser API does not supply the value.
 */
export function useNetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState({
    connectionType: "Not available",
    effectiveType: "Not available",
    downlink: "Not available",
    saveData: "Not available",
    rtt: "Not available",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateNetworkInfo = () => {
      // Network Information API (navigator.connection || navigator.mozConnection || navigator.webkitConnection)
      const conn =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (!conn) {
        setNetworkInfo({
          connectionType: "Not available",
          effectiveType: "Not available",
          downlink: "Not available",
          saveData: "Not available",
          rtt: "Not available",
        });
        return;
      }

      setNetworkInfo({
        connectionType: conn.type ? String(conn.type).toUpperCase() : "Not available",
        effectiveType: conn.effectiveType ? String(conn.effectiveType).toUpperCase() : "Not available",
        downlink: conn.downlink !== undefined && conn.downlink !== null ? `${conn.downlink} Mbps` : "Not available",
        saveData: conn.saveData !== undefined ? (conn.saveData ? "On" : "Off") : "Not available",
        rtt: conn.rtt !== undefined && conn.rtt !== null ? `${conn.rtt} ms` : "Not available",
      });
    };

    updateNetworkInfo();

    const conn =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (conn && conn.addEventListener) {
      conn.addEventListener("change", updateNetworkInfo);
      return () => conn.removeEventListener("change", updateNetworkInfo);
    }
  }, []);

  return networkInfo;
}
