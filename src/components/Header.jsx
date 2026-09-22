"use client";

import React, { useState } from "react";
import { Gauge, Menu, X, Settings, LayoutDashboard, Home } from "lucide-react";
import { ModeBadge } from "./ModeBadge";

export function Header({ currentMode, activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "hero", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (id) => {
    onNavigate?.(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
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
                v1.0
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
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

          {/* Active Mode Status Badge */}
          <div className="flex items-center gap-3">
            {currentMode && (
              <div className="hidden sm:block">
                <ModeBadge mode={currentMode} />
              </div>
            )}

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

          {currentMode && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
              <span className="text-xs text-slate-400 font-medium">Active Policy Mode:</span>
              <ModeBadge mode={currentMode} />
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
