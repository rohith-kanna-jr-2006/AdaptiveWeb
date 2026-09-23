/**
 * E-COMMERCE DEMONSTRATION PRODUCT DATASET (INR CURRENCY)
 * -------------------------------------------------------------
 * Products with realistic INR prices and adaptive image variants (small, medium, large).
 */

export const PRODUCTS = [
  {
    id: "prod-1",
    name: "SonicPro Wireless ANC Headphones",
    price: 12499,
    category: "Audio",
    rating: 4.8,
    reviewsCount: 124,
    description: "Premium over-ear wireless headphones featuring hybrid active noise cancellation, 40-hour battery life, and crystal-clear high-fidelity audio drivers.",
    details: [
      "Hybrid Active Noise Cancellation (ANC)",
      "40 Hours Playtime with Fast Charging",
      "Bluetooth 5.3 & Multipoint Connection",
      "Memory Foam Ear Cushions",
    ],
    images: {
      small: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=40&auto=format&fit=crop",
      medium: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=75&auto=format&fit=crop",
      large: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=90&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "prod-2",
    name: "ApexFit Smart Fitness Watch",
    price: 16499,
    category: "Wearables",
    rating: 4.7,
    reviewsCount: 89,
    description: "Advanced fitness tracker with AMOLED display, continuous heart-rate monitoring, dual-band GPS, and 14-day ultra battery mode.",
    details: [
      "1.4-inch High-Res AMOLED Display",
      "Dual-Band GPS & 100+ Sports Modes",
      "SpO2 & Continuous Heart Rate Tracking",
      "5ATM Water Resistance",
    ],
    images: {
      small: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=40&auto=format&fit=crop",
      medium: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=75&auto=format&fit=crop",
      large: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=90&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "prod-3",
    name: "UltraBook Pro 15 M-Series",
    price: 99999,
    category: "Laptops",
    rating: 4.9,
    reviewsCount: 210,
    description: "Ultra-slim 15-inch aluminum laptop powered by high-efficiency multi-core silicon, 16GB unified memory, and 512GB NVMe SSD.",
    details: [
      "15.6-inch Retina IPS Display (2.8K Resolution)",
      "16GB Unified RAM & 512GB PCIe Gen4 SSD",
      "Thunderbolt 4 & Wi-Fi 6E Support",
      "Up to 18 Hours All-Day Battery",
    ],
    images: {
      small: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=40&auto=format&fit=crop",
      medium: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=75&auto=format&fit=crop",
      large: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=90&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "prod-4",
    name: "LuminaMirror Mirrorless 4K Camera",
    price: 69999,
    category: "Cameras",
    rating: 4.6,
    reviewsCount: 64,
    description: "Compact mirrorless digital camera capturing 24.2MP stills and uncropped 4K 60fps video with real-time eye tracking autofocus.",
    details: [
      "24.2MP APS-C CMOS Sensor",
      "Uncropped 4K 60fps & 1080p 120fps Slow-Mo",
      "5-Axis In-Body Image Stabilization",
      "3.0-inch Vari-Angle Touchscreen",
    ],
    images: {
      small: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=40&auto=format&fit=crop",
      medium: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=75&auto=format&fit=crop",
      large: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=90&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "prod-5",
    name: "PulseBoom Waterproof Outdoor Speaker",
    price: 6499,
    category: "Audio",
    rating: 4.7,
    reviewsCount: 145,
    description: "Rugged IP67 waterproof portable Bluetooth speaker with dual passive radiators, 360-degree sound, and integrated power bank.",
    details: [
      "IP67 Dustproof & Waterproof Floating Design",
      "24-Hour Continuous Playtime",
      "PartyBoost Stereo Pairing Support",
      "USB-C Power Bank Output",
    ],
    images: {
      small: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=40&auto=format&fit=crop",
      medium: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=75&auto=format&fit=crop",
      large: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1600&q=90&auto=format&fit=crop",
    },
    inStock: true,
  },
  {
    id: "prod-6",
    name: "ViperStrike Wireless Ergonomic Gaming Mouse",
    price: 4999,
    category: "Peripherals",
    rating: 4.8,
    reviewsCount: 178,
    description: "Ultra-lightweight 58g wireless gaming mouse equipped with 26,000 DPI optical sensor, zero-latency 2.4GHz connection, and optical switches.",
    details: [
      "58g Ultra-Lightweight Ergonomic Shell",
      "FocusPro 26K DPI Optical Sensor",
      "Optical Mouse Switches (90M Click Lifetime)",
      "Up to 90 Hours Battery Life",
    ],
    images: {
      small: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=40&auto=format&fit=crop",
      medium: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=75&auto=format&fit=crop",
      large: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1600&q=90&auto=format&fit=crop",
    },
    inStock: true,
  },
];
