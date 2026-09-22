"use client";

import React from "react";
import { ShoppingBag, Eye, Star } from "lucide-react";
import { AdaptiveImage } from "@/adaptive/components/AdaptiveImage/AdaptiveImage";
import { useAdaptive } from "@/hooks/useAdaptive";
import { useCart } from "@/context/CartContext";
import { CANONICAL_MODES } from "@/adaptive/integration/adaptiveAdapter";

export function ProductCard({ product, onSelectProduct }) {
  const { activeMode } = useAdaptive();
  const { addToCart } = useCart();

  const isDataSaver = activeMode === CANONICAL_MODES.DATA_SAVER;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-200 hover:border-slate-700 shadow-lg ${
        isDataSaver ? "space-y-3" : "space-y-4"
      }`}
    >
      {/* Category & Rating Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="px-2 py-0.5 rounded bg-slate-950 font-medium border border-slate-800">
          {product.category}
        </span>
        <div className="flex items-center gap-1 text-amber-400 font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Adaptive Product Image */}
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
        <AdaptiveImage
          small={product.images.small}
          medium={product.images.medium}
          large={product.images.large}
          alt={product.name}
          className={`w-full group-hover:scale-105 transition-transform duration-300 ${
            isDataSaver ? "h-36" : "h-48"
          }`}
        />
      </div>

      {/* Title & Price */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
          {product.name}
        </h3>
        {!isDataSaver && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="text-base font-extrabold text-blue-400 pt-1">
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Essential Interactive Actions (ALWAYS AVAILABLE) */}
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
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
