"use client";

import React from "react";
import { ShoppingBag, Eye, Star, Sparkles } from "lucide-react";
import { AdaptiveImage } from "@/adaptive/components/AdaptiveImage/AdaptiveImage";
import { useAdaptive } from "@/hooks/useAdaptive";
import { useCart } from "@/context/CartContext";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

export function ProductCard({ product, onSelectProduct }) {
  const { activeMode } = useAdaptive();
  const { addToCart } = useCart();

  const isDataSaver = activeMode === CANONICAL_MODES.DATA_SAVER;
  const isFull = activeMode === CANONICAL_MODES.FULL;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-slate-900/80 p-4 transition-all duration-300 shadow-lg ${
        isDataSaver
          ? "border-slate-800 space-y-3"
          : isFull
          ? "border-emerald-500/40 hover:border-emerald-400 hover:-translate-y-1 hover:shadow-emerald-950/50 space-y-4"
          : "border-slate-800 hover:border-slate-700 space-y-4"
      }`}
    >
      {/* Full Mode Rich Badge Overlay */}
      {isFull && (
        <div className="absolute -top-2.5 right-4 z-10 px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-600 text-white uppercase tracking-wider flex items-center gap-1 shadow-md animate-float-slow">
          <Sparkles className="w-2.5 h-2.5" /> High Quality Asset
        </div>
      )}

      {/* Category & Rating Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span
          className={`px-2 py-0.5 rounded font-medium border ${
            isFull
              ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
              : "bg-slate-950 border-slate-800"
          }`}
        >
          {product.category}
        </span>
        <div className="flex items-center gap-1 text-amber-400 font-semibold">
          <Star className={`w-3.5 h-3.5 fill-amber-400 ${isFull ? "group-hover:scale-110 transition-transform" : ""}`} aria-hidden="true" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Adaptive Product Image */}
      <div
        className={`overflow-hidden rounded-xl border bg-slate-950 ${
          isFull ? "border-emerald-900/40" : "border-slate-800/80"
        }`}
      >
        <AdaptiveImage
          small={product.images.small}
          medium={product.images.medium}
          large={product.images.large}
          alt={product.name}
          className={`w-full transition-transform duration-300 ${
            isFull ? "group-hover:scale-110 h-52" : isDataSaver ? "h-36" : "h-48 group-hover:scale-105"
          }`}
        />
      </div>

      {/* Title & Price */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>
        {!isDataSaver && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="text-base font-extrabold text-blue-400 pt-1">
          ₹{product.price.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Essential Interactive Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onSelectProduct?.(product)}
          type="button"
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Details</span>
        </button>

        <button
          onClick={() => addToCart(product)}
          type="button"
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow ${
            isFull
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
