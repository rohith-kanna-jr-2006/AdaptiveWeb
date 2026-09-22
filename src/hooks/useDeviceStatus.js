"use client";

import { useState, useEffect } from "react";

/**
 * Hook to retrieve REAL browser device information.
 * Uses navigator.hardwareConcurrency, navigator.deviceMemory, window.screen, window.devicePixelRatio.
 * Never guesses or fabricates values. Shows "Not available" if API is absent.
 */
export function useDeviceStatus() {
  const [deviceInfo, setDeviceInfo] = useState({
    cpuCores: "Not available",
    memory: "Not available",
    screenSize: "Not available",
    devicePixelRatio: "Not available",
    profile: "Not available",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDeviceInfo = () => {
      // CPU Cores (navigator.hardwareConcurrency)
      const cores =
        typeof navigator.hardwareConcurrency === "number"
          ? navigator.hardwareConcurrency
          : "Not available";

      // Device Memory (navigator.deviceMemory in GB, supported in Chromium browsers)
      const memGB =
        typeof navigator.deviceMemory === "number"
          ? `${navigator.deviceMemory} GB`
          : "Not available";

      // Screen Size
      const screenWidth = window.screen ? window.screen.width : null;
      const screenHeight = window.screen ? window.screen.height : null;
      const screenStr =
        screenWidth && screenHeight ? `${screenWidth} × ${screenHeight}` : "Not available";

      // Device Pixel Ratio
      const dpr = typeof window.devicePixelRatio === "number" ? window.devicePixelRatio : "Not available";

      // Device Category Profile based on screen width
      let profileStr = "Not available";
      if (screenWidth) {
        if (screenWidth < 640) profileStr = "Mobile Profile";
        else if (screenWidth < 1024) profileStr = "Tablet Profile";
        else profileStr = "Desktop / Laptop Profile";
      }

      setDeviceInfo({
        cpuCores: cores,
        memory: memGB,
        screenSize: screenStr,
        devicePixelRatio: dpr,
        profile: profileStr,
      });
    };

    updateDeviceInfo();

    window.addEventListener("resize", updateDeviceInfo);
    return () => window.removeEventListener("resize", updateDeviceInfo);
  }, []);

  return deviceInfo;
}
