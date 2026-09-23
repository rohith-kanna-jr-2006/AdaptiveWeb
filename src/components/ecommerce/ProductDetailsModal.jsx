"use client";

import React from "react";
import { X, ShoppingBag, Star, CheckCircle2 } from "lucide-react";
import { AdaptiveImage } from "@/adaptive/components/AdaptiveImage/AdaptiveImage";
import { useCart } from "@/context/CartContext";

export function ProductDetailsModal({ product, onClose }) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Adaptive Image */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
            <AdaptiveImage
              small={product.images.small}
              medium={product.images.medium}
              large={product.images.large}
              alt={product.name}
              eager={true}
              className="w-full max-h-72 object-cover"
            />
          </div>

          {/* Product Information & Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 font-semibold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-500 text-[11px]">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <h2
                id="product-modal-title"
                className="text-xl font-extrabold text-white tracking-tight"
              >
                {product.name}
              </h2>

              <div className="text-2xl font-black text-blue-400">
                ₹{product.price.toLocaleString("en-IN")}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Product Specifications List */}
              {product.details && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Product Specifications
                  </span>
                  <ul className="space-y-1">
                    {product.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Add to Cart Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart - ₹{product.price.toLocaleString("en-IN")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
