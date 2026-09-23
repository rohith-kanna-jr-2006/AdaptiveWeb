"use client";

import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { AdaptiveImage } from "@/adaptive/components/AdaptiveImage/AdaptiveImage";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="text-base font-bold text-white">
                Your Shopping Cart
              </h2>
              <p className="text-xs text-slate-400">{totalCount} items in cart</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close shopping cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 py-4 space-y-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">
                Your cart is currently empty.
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our product catalog and add items to your cart.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                  <AdaptiveImage
                    small={item.images.small}
                    medium={item.images.medium}
                    large={item.images.large}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="text-xs font-extrabold text-blue-400">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  type="button"
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-200">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-400">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="text-blue-400">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert("Demo Order Submitted successfully!");
                  clearCart();
                  closeCart();
                }}
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                type="button"
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
