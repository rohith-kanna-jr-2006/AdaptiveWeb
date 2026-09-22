"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AdaptiveStatus } from "@/components/AdaptiveStatus";
import { ModeCard } from "@/components/ModeCard";
import { NetworkStatus } from "@/components/NetworkStatus";
import { DeviceStatus } from "@/components/DeviceStatus";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import { PerformanceComparison } from "@/components/PerformanceComparison";
import { AdaptationExplanation } from "@/components/AdaptationExplanation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Footer } from "@/components/Footer";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/States";

import { AdaptiveShowcase } from "@/adaptive/components/AdaptiveShowcase/AdaptiveShowcase";
import { useAdaptive } from "@/hooks/useAdaptive";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { ADAPTIVE_MODES } from "@/adapters/adaptiveEngineAdapter";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  const { mode, rawMode, reason, isLoading: adaptiveLoading, error: adaptiveError } = useAdaptive();
  const networkInfo = useNetworkStatus();
  const deviceInfo = useDeviceStatus();
  const { metrics, comparison } = usePerformanceMetrics();

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Convert canonical mode to legacy ADAPTIVE_MODES string for ModeCard compatibility
  const legacyModeString =
    mode === CANONICAL_MODES.DATA_SAVER
      ? ADAPTIVE_MODES.DATA_SAVER
      : mode === CANONICAL_MODES.FULL
      ? ADAPTIVE_MODES.FULL_EXPERIENCE
      : ADAPTIVE_MODES.BALANCED;

  const policyStateSnapshot = {
    mode: legacyModeString,
    reason: reason || "Adaptive engine policy active",
    imageQuality: mode === CANONICAL_MODES.DATA_SAVER ? "Low quality" : mode === CANONICAL_MODES.FULL ? "High quality" : "Medium quality",
    prefetch: mode === CANONICAL_MODES.DATA_SAVER ? "Disabled" : mode === CANONICAL_MODES.FULL ? "Full" : "Limited",
    animations: mode === CANONICAL_MODES.DATA_SAVER ? "Disabled" : mode === CANONICAL_MODES.FULL ? "Full" : "Reduced",
    dataUsage: mode === CANONICAL_MODES.DATA_SAVER ? "Minimum" : mode === CANONICAL_MODES.FULL ? "Unrestricted" : "Optimized",
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <HeroSection reason={reason} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Environment Status Grid (Desktop: 2 Columns, Mobile: 1 Column) */}
          <section id="environment" aria-label="Environment Status">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Environment & Hardware Detection
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkStatus networkInfo={networkInfo} currentMode={legacyModeString} />
              <DeviceStatus deviceInfo={deviceInfo} />
            </div>
          </section>

          {/* Adaptive UI Presentation Showcase Section */}
          <section id="adaptive-showcase" aria-label="Adaptive Delivery Showcase">
            <AdaptiveShowcase />
          </section>

          {/* Adaptive Policy Status Section */}
          <section id="adaptive-policy" aria-label="Adaptive Policy Panel">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Adaptive Engine Policy State
            </h2>
            {adaptiveLoading && <LoadingState message="Detecting adaptive mode..." />}
            {adaptiveError && <ErrorState message="Unable to load adaptive settings." />}
            {!adaptiveLoading && !adaptiveError && (
              <AdaptiveStatus policy={policyStateSnapshot} />
            )}
          </section>

          {/* Available Mode Cards (3 Reusable Mode Cards) */}
          <section id="mode-cards" aria-label="Adaptive Modes Overview">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Supported Adaptive Modes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModeCard
                modeKey={ADAPTIVE_MODES.DATA_SAVER}
                isCurrentMode={mode === CANONICAL_MODES.DATA_SAVER}
              />
              <ModeCard
                modeKey={ADAPTIVE_MODES.BALANCED}
                isCurrentMode={mode === CANONICAL_MODES.BALANCED}
              />
              <ModeCard
                modeKey={ADAPTIVE_MODES.FULL_EXPERIENCE}
                isCurrentMode={mode === CANONICAL_MODES.FULL}
              />
            </div>
          </section>

          {/* Performance Dashboard */}
          <section id="dashboard" aria-label="Performance Dashboard">
            <PerformanceDashboard metrics={metrics} />
          </section>

          {/* Baseline vs Adaptive Benchmark Comparison */}
          <section id="comparison" aria-label="Performance Comparison">
            <PerformanceComparison comparisonData={comparison} />
          </section>

          {/* Settings / Preferences & Dev Mode Switcher */}
          <section id="settings" aria-label="Settings Panel">
            <SettingsPanel />
          </section>

          {/* Adaptation Explanation Panel */}
          <section id="explanation" aria-label="Adaptation Architecture Explanation">
            <AdaptationExplanation />
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
