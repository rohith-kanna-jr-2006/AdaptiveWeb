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

import { useAdaptivePolicy } from "@/hooks/useAdaptivePolicy";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";
import { ADAPTIVE_MODES } from "@/adapters/adaptiveEngineAdapter";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  const { policy, status: policyStatus, error: policyError, setModePreference, refetch } = useAdaptivePolicy();
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header Navigation */}
      <Header
        currentMode={policy?.mode}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <HeroSection currentMode={policy?.mode} reason={policy?.reason} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Environment Status Grid (Desktop: 2 Columns, Mobile: 1 Column) */}
          <section id="environment" aria-label="Environment Status">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Environment & Hardware Detection
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkStatus networkInfo={networkInfo} currentMode={policy?.mode} />
              <DeviceStatus deviceInfo={deviceInfo} />
            </div>
          </section>

          {/* Adaptive Policy Status Section */}
          <section id="adaptive-policy" aria-label="Adaptive Policy Panel">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Adaptive Engine State
            </h2>
            {policyStatus === "loading" && <LoadingState message="Detecting environment & retrieving adaptive policy..." />}
            {policyStatus === "empty" && <EmptyState message="Adaptive policy information is not available yet." />}
            {policyStatus === "error" && (
              <ErrorState
                message={policyError || "Unable to retrieve adaptive policy from engine."}
                onRetry={refetch}
              />
            )}
            {policyStatus === "success" && policy && (
              <AdaptiveStatus policy={policy} />
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
                isCurrentMode={policy?.mode === ADAPTIVE_MODES.DATA_SAVER}
              />
              <ModeCard
                modeKey={ADAPTIVE_MODES.BALANCED}
                isCurrentMode={policy?.mode === ADAPTIVE_MODES.BALANCED}
              />
              <ModeCard
                modeKey={ADAPTIVE_MODES.FULL_EXPERIENCE}
                isCurrentMode={policy?.mode === ADAPTIVE_MODES.FULL_EXPERIENCE}
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

          {/* Settings / Preferences Panel */}
          <section id="settings" aria-label="Settings Panel">
            <SettingsPanel currentPolicy={policy} onSelectMode={setModePreference} />
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
