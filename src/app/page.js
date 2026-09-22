"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AdaptiveStatus } from "@/components/AdaptiveStatus";
import { NetworkStatus } from "@/components/NetworkStatus";
import { DeviceStatus } from "@/components/DeviceStatus";
import { PerformanceDashboard } from "@/components/PerformanceDashboard";
import { PerformanceComparison } from "@/components/PerformanceComparison";
import { AdaptationExplanation } from "@/components/AdaptationExplanation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Footer } from "@/components/Footer";

import { PRODUCTS } from "@/data/products";
import { CartProvider } from "@/context/CartContext";
import { ProductList } from "@/components/ecommerce/ProductList";
import { ProductDetailsModal } from "@/components/ecommerce/ProductDetailsModal";
import { CartDrawer } from "@/components/ecommerce/CartDrawer";
import { OptionalRecommendations } from "@/components/ecommerce/OptionalRecommendations";

import { useAdaptive } from "@/hooks/useAdaptive";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { usePerformanceMetrics } from "@/hooks/usePerformanceMetrics";

function MainAppContent() {
  const [activeSection, setActiveSection] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { activeMode, reason } = useAdaptive();
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
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <HeroSection reason={reason} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* E-Commerce Product Listing Section */}
          <section id="products" aria-label="E-Commerce Product Catalog">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Featured Products
                </h2>
                <p className="text-xs text-slate-400">
                  Adaptive asset delivery automatically scales image variants according to mode
                </p>
              </div>
            </div>

            <ProductList
              products={PRODUCTS}
              onSelectProduct={setSelectedProduct}
            />
          </section>

          {/* Optional Recommendations Widget (Defers under DATA SAVER) */}
          <section id="recommendations" aria-label="Optional Recommendations">
            <OptionalRecommendations
              products={PRODUCTS}
              onSelectProduct={setSelectedProduct}
            />
          </section>

          {/* Adaptive Engine Diagnostic Area */}
          <section id="adaptive-policy" aria-label="Adaptive Policy Diagnostic Area">
            <AdaptiveStatus />
          </section>

          {/* Hardware & Environment Status Grid */}
          <section id="environment" aria-label="Environment Detection">
            <h2 className="text-lg font-bold text-white mb-4 tracking-tight">
              Environment & Hardware Detection
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NetworkStatus networkInfo={networkInfo} currentMode={activeMode.toUpperCase()} />
              <DeviceStatus deviceInfo={deviceInfo} />
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

          {/* Settings & Mode Controls */}
          <section id="settings" aria-label="Settings Panel">
            <SettingsPanel />
          </section>

          {/* Adaptation Explanation Panel */}
          <section id="explanation" aria-label="Adaptation Architecture Explanation">
            <AdaptationExplanation />
          </section>
        </div>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}
