"use client";

import React, { useState, useEffect } from "react";
import { Gauge, Menu, X, Settings, LayoutDashboard, ShoppingBag, Store, SlidersHorizontal } from "lucide-react";
import { AdaptiveModeIndicator } from "@/adaptive/components/AdaptiveModeIndicator/AdaptiveModeIndicator";
import { useCart } from "@/context/CartContext";
import { useAdaptive } from "@/hooks/useAdaptive";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

export function Header({ activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBadgePop, setIsBadgePop] = useState(false);
  const { totalCount, openCart } = useCart();
  const { activeMode } = useAdaptive();

  const isFull = activeMode === CANONICAL_MODES.FULL;

  // Trigger pop animation on cart count increase in FULL mode
  useEffect(() => {
    if (totalCount > 0 && isFull) {
      setIsBadgePop(true);
      const timer = setTimeout(() => setIsBadgePop(false), 400);
      return () => clearTimeout(timer);
    }
  }, [totalCount, isFull]);

  const navItems = [
    { id: "products", label: "Products", icon: Store },
    { id: "adaptive-policy", label: "Diagnostics", icon: SlidersHorizontal },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    onNavigate?.(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Gauge className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">
                AdaptiveWeb
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
                e-Commerce
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Adaptive Mode Indicator & Cart Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <AdaptiveModeIndicator />
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              type="button"
              className={`relative p-2 rounded-lg bg-slate-900 border text-slate-200 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 ${
                isFull ? "border-emerald-500/50 hover:border-emerald-400 shadow-md shadow-emerald-950/40" : "border-slate-800 hover:border-slate-700"
              }`}
              aria-label={`Shopping cart with ${totalCount} items`}
            >
              <ShoppingBag className={`w-5 h-5 ${isFull ? "text-emerald-400" : "text-blue-400"}`} />
              {totalCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full text-white border-2 border-slate-950 shadow ${
                    isFull ? "bg-emerald-500 shadow-emerald-950" : "bg-blue-600"
                  } ${isBadgePop ? "animate-cart-badge-pop ring-2 ring-emerald-300" : ""}`}
                >
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1"
          aria-label="Mobile Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
            <span className="text-xs text-slate-400 font-medium">Adaptive Mode:</span>
            <AdaptiveModeIndicator />
          </div>
        </nav>
      )}
    </header>
  );
}
