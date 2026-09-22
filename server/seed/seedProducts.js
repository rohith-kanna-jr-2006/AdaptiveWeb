const mongoose = require('mongoose');
const Product = require('../models/Product');
const db = require('../config/db');
const env = require('../config/env');

const SAMPLE_PRODUCTS = [
  // Electronics
  {
    name: "UltraTab Pro 11-inch",
    description: "High-performance tablet with Liquid Retina display, M2 chip, and all-day battery life for productivity and entertainment.",
    price: 799.99,
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      large: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1400&q=90"
    },
    rating: 4.8,
    stock: 45
  },
  {
    name: "ProBook X15 Laptop",
    description: "Ultra-slim 15.6-inch laptop featuring 16GB RAM, 512GB SSD, Intel i7 processor, and vibrant 4K display.",
    price: 1199.00,
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      large: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1400&q=90"
    },
    rating: 4.7,
    stock: 28
  },
  {
    name: "VividView 27-inch 4K Monitor",
    description: "Ergonomic IPS monitor with 99% sRGB color accuracy, USB-C connectivity, and HDR400 support.",
    price: 349.50,
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
      large: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1400&q=90"
    },
    rating: 4.6,
    stock: 32
  },
  {
    name: "Aura 5G Smartphone 128GB",
    description: "Next-gen smartphone with AMOLED 120Hz display, triple camera setup, and 5000mAh fast-charging battery.",
    price: 699.00,
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      large: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=90"
    },
    rating: 4.5,
    stock: 60
  },
  {
    name: "StreamDeck Mini Controller",
    description: "Customizable LCD macro keys for live streaming, video editing, and shortcut automation.",
    price: 99.99,
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      large: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400&q=90"
    },
    rating: 4.4,
    stock: 18
  },
  {
    name: "PixelCam 4K Action Camera",
    description: "Waterproof action camera with dual displays, electronic image stabilization, and 4K 60fps recording.",
    price: 249.95,
    category: "Electronics",
    thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
      large: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1400&q=90"
    },
    rating: 4.3,
    stock: 22
  },

  // Audio
  {
    name: "AcousticNoise Wireless Headphones",
    description: "Premium over-ear noise canceling wireless headphones with 40-hour battery life and custom EQ tuning.",
    price: 299.99,
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      large: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=90"
    },
    rating: 4.9,
    stock: 50
  },
  {
    name: "SoundPulse True Wireless Earbuds",
    description: "Compact wireless earbuds with active noise cancellation, IPX7 water resistance, and wireless charging case.",
    price: 129.50,
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      large: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1400&q=90"
    },
    rating: 4.6,
    stock: 75
  },
  {
    name: "BoomBox Portable Bluetooth Speaker",
    description: "Rugged waterproof Bluetooth speaker delivering deep bass, 360-degree sound, and 24-hour continuous playtime.",
    price: 149.00,
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
      large: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1400&q=90"
    },
    rating: 4.7,
    stock: 40
  },
  {
    name: "StudioPro USB Condenser Microphone",
    description: "Studio-quality cardioid USB microphone with zero-latency monitoring for podcasting, streaming, and vocals.",
    price: 119.99,
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80",
      large: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1400&q=90"
    },
    rating: 4.8,
    stock: 30
  },
  {
    name: "SoundBar Pro 2.1 System",
    description: "Sleek home theater soundbar with wireless subwoofer, Dolby Audio support, and HDMI ARC connectivity.",
    price: 199.99,
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
      large: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1400&q=90"
    },
    rating: 4.5,
    stock: 15
  },
  {
    name: "Retro Vinyl Turntable",
    description: "Three-speed belt-driven turntable with built-in stereo speakers and Bluetooth output capabilities.",
    price: 89.95,
    category: "Audio",
    thumbnail: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800&q=80",
      large: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=1400&q=90"
    },
    rating: 4.4,
    stock: 25
  },

  // Wearables
  {
    name: "FitTrack Pulse Smartwatch",
    description: "Advanced fitness smartwatch with continuous heart rate monitor, SpO2 sensor, sleep tracking, and GPS.",
    price: 179.99,
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      large: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=90"
    },
    rating: 4.7,
    stock: 65
  },
  {
    name: "ChronoClassic Hybrid Watch",
    description: "Elegant analogue smartwatch blending classic watchmaking aesthetics with step counting and notification alerts.",
    price: 159.00,
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
      large: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1400&q=90"
    },
    rating: 4.5,
    stock: 35
  },
  {
    name: "ActiveBand Slim Fitness Tracker",
    description: "Lightweight waterproof fitness band tracking steps, distance, calories burned, and real-time heart rate.",
    price: 49.99,
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
      large: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=1400&q=90"
    },
    rating: 4.3,
    stock: 90
  },
  {
    name: "SmartRing Health Tracker",
    description: "Titanium smart ring measuring body temperature, HRV, sleep efficiency, and recovery score discreetly.",
    price: 279.00,
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      large: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&q=90"
    },
    rating: 4.6,
    stock: 20
  },
  {
    name: "VR Headset Pro Motion",
    description: "Standalone Virtual Reality VR headset with 4K resolution per eye, spatial audio, and wireless controllers.",
    price: 449.99,
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&q=80",
      large: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=1400&q=90"
    },
    rating: 4.8,
    stock: 14
  },
  {
    name: "Smart Audio Glasses",
    description: "Stylish open-ear audio sunglasses with UV protection, integrated speakers, and hands-free calling microphone.",
    price: 139.95,
    category: "Wearables",
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      large: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1400&q=90"
    },
    rating: 4.2,
    stock: 40
  },

  // Home & Smart Living
  {
    name: "SmartGlow LED Desk Lamp",
    description: "Dimmable LED desk lamp with wireless smartphone charging pad, color temperature adjustments, and eye-care diffuser.",
    price: 59.99,
    category: "Home & Smart Living",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      large: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400&q=90"
    },
    rating: 4.6,
    stock: 80
  },
  {
    name: "PureAir HEPA Air Purifier",
    description: "Compact quiet air purifier filtering 99.97% of airborne dust, pollen, smoke, and odors in rooms up to 350 sq ft.",
    price: 119.50,
    category: "Home & Smart Living",
    thumbnail: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
      large: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1400&q=90"
    },
    rating: 4.8,
    stock: 30
  },
  {
    name: "RoboClean Vacuum Robot",
    description: "Smart robot vacuum cleaner with LiDAR navigation, automatic dust emptying base, and app schedule control.",
    price: 329.00,
    category: "Home & Smart Living",
    thumbnail: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
      large: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1400&q=90"
    },
    rating: 4.7,
    stock: 19
  },
  {
    name: "BaristaPro Espresso Machine",
    description: "15-bar Italian pump espresso machine with integrated milk frother wand and digital temperature control.",
    price: 219.99,
    category: "Home & Smart Living",
    thumbnail: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
      large: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=1400&q=90"
    },
    rating: 4.9,
    stock: 25
  },
  {
    name: "Smart Plug WiFi Outlet 4-Pack",
    description: "Voice-controlled smart electrical plugs compatible with Alexa and Google Assistant with energy monitoring.",
    price: 34.99,
    category: "Home & Smart Living",
    thumbnail: "https://images.unsplash.com/photo-1558002038-1055907df827?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1558002038-1055907df827?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
      large: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1400&q=90"
    },
    rating: 4.5,
    stock: 110
  },
  {
    name: "AromaDiffuser Ultrasonic Humidifier",
    description: "Quiet essential oil diffuser with ambient RGB LED lighting, automatic shut-off safety, and 500ml tank.",
    price: 29.95,
    category: "Home & Smart Living",
    thumbnail: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80",
      large: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=1400&q=90"
    },
    rating: 4.4,
    stock: 70
  },

  // Accessories
  {
    name: "ProCharge 65W GaN Fast Charger",
    description: "Ultra-compact Gallium Nitride 65W wall charger with dual USB-C ports for laptops, tablets, and phones.",
    price: 39.99,
    category: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
      large: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1400&q=90"
    },
    rating: 4.8,
    stock: 120
  },
  {
    name: "PowerBank 20000mAh Portable Battery",
    description: "High-capacity power bank featuring 22.5W fast charging output, digital LED percentage display, and USB-C input.",
    price: 49.50,
    category: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1609592424009-f806408f2a6c?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1609592424009-f806408f2a6c?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1609592424009-f806408f2a6c?w=800&q=80",
      large: "https://images.unsplash.com/photo-1609592424009-f806408f2a6c?w=1400&q=90"
    },
    rating: 4.7,
    stock: 85
  },
  {
    name: "ErgoDesk XL Mouse Pad",
    description: "Water-resistant extended desk pad with stitched anti-fray edges and smooth micro-textured cloth surface.",
    price: 24.99,
    category: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
      large: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1400&q=90"
    },
    rating: 4.6,
    stock: 100
  },
  {
    name: "FlexiStand Aluminum Laptop Stand",
    description: "Adjustable ergonomic aluminum laptop riser promoting healthy posture and optimal thermal cooling.",
    price: 35.00,
    category: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      large: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1400&q=90"
    },
    rating: 4.7,
    stock: 60
  },
  {
    name: "ArmorShield Hard Shell Laptop Case",
    description: "Shockproof shock-absorbing laptop sleeve with soft fleece interior lining and accessory storage pocket.",
    price: 29.99,
    category: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      large: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1400&q=90"
    },
    rating: 4.4,
    stock: 75
  },
  {
    name: "SpeedHub 7-in-1 USB-C Dock",
    description: "Multi-port USB-C adapter with 4K HDMI, 100W Power Delivery, SD card reader, and 3x USB 3.0 ports.",
    price: 45.99,
    category: "Accessories",
    thumbnail: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=200&q=80",
    image: {
      small: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=480&q=60",
      medium: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&q=80",
      large: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=1400&q=90"
    },
    rating: 4.6,
    stock: 55
  }
];

/**
 * Seed function to insert deterministic product dataset into MongoDB.
 * Clears existing collection before inserting to prevent duplicate records.
 */
const seedProducts = async () => {
  try {
    // Ensure DB is connected if running standalone
    if (mongoose.connection.readyState === 0) {
      await db.connectDB();
    }

    // Delete existing products to enforce deterministic dataset without duplicates
    await Product.deleteMany({});

    // Insert 30 products
    const createdProducts = await Product.insertMany(SAMPLE_PRODUCTS);

    if (env.NODE_ENV !== 'test') {
      console.log(`[Seed] Successfully seeded ${createdProducts.length} products into MongoDB.`);
    }

    return createdProducts;
  } catch (error) {
    if (env.NODE_ENV !== 'test') {
      console.error(`[Seed] Failed to seed products: ${error.message}`);
    }
    throw error;
  }
};

// Execute if run directly from CLI (node server/seed/seedProducts.js)
if (require.main === module) {
  seedProducts()
    .then(async () => {
      await db.disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = {
  seedProducts,
  SAMPLE_PRODUCTS
};
