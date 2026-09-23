# AdaptiveWeb — Setup & Run Instructions

## Project Overview

AdaptiveWeb is a Next.js e-commerce application that demonstrates adaptive UI delivery based on network conditions, device capabilities, and user preferences.

**Repository:** https://github.com/rohith-kanna-jr-2006/AdaptiveWeb  
**Branch:** `rohith/adaptive-engine`  
**PR:** https://github.com/rohith-kanna-jr-2006/AdaptiveWeb/pull/1

---

## Prerequisites

- **Node.js:** v18.x or v20.x (LTS recommended)
- **npm:** v9.x or later
- **Git:** For cloning and branch management
- **Browser:** Chrome/Edge (Chromium) recommended for Network Information API support

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rohith-kanna-jr-2006/AdaptiveWeb.git
cd AdaptiveWeb
```

### 2. Checkout the Adaptive Engine Branch

```bash
git checkout rohith/adaptive-engine
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint checks |

---

## Adaptive Mode Testing

### Mode Selection

1. Navigate to the **Settings** section in the app
2. Select one of the following modes:
   - **AUTO** — Automatic detection based on network signals
   - **DATA SAVER** — Reduced quality, deferred optional content
   - **BALANCED** — Medium quality, standard resources
   - **FULL** — High quality, all features enabled

### Testing Scenarios

#### Scenario 1: AUTO Mode with Network Changes
1. Select **AUTO** mode in Settings
2. Open Chrome DevTools → Network tab
3. Change network throttling (Slow 3G → Fast 4G → 5G)
4. Observe the mode indicator changing automatically

#### Scenario 2: Save-Data Preference
1. Open Chrome DevTools → Network tab
2. Enable "Offline" checkbox or set Save-Data
3. In AUTO mode, verify DATA SAVER activates

#### Scenario 3: Manual Override
1. Select **DATA SAVER** manually
2. Change network to 5G
3. Verify mode stays DATA SAVER (manual override)
4. Select **AUTO** to restore automatic detection

#### Scenario 4: UI Adaptation
1. **DATA SAVER:** Observe smaller images, no optional recommendations, disabled animations
2. **BALANCED:** Medium images, standard layout
3. **FULL:** High-res images, cart badge animations, rich hover effects, optional recommendations visible

---

## Diagnostic Tools

### Adaptive Policy Diagnostic Area

Located in the **Diagnostics** section, shows:
- Current active mode
- Network signals (type, downlink, save-data)
- Engine decision reason
- Resource policy details

### Adaptive Mode Indicator

Visible in the header, displays:
- Current mode (AUTO/DATA SAVER/BALANCED/FULL)
- Auto vs Manual status
- Animated glow in FULL mode

---

## File Structure

```
AdaptiveWeb/
├── src/
│   ├── adaptive/
│   │   ├── integration/
│   │   │   └── adaptiveAdapter.js    # Canonical engine boundary
│   │   ├── config/
│   │   │   └── adaptiveUIConfig.js   # Mode → UI mapping
│   │   └── components/
│   │       ├── AdaptiveImage/        # Mode-aware image component
│   │       ├── AdaptiveModeIndicator/
│   │       └── AdaptiveShowcase/
│   ├── hooks/
│   │   ├── useAdaptive.js            # Main adaptive hook
│   │   ├── useAdaptivePolicy.js      # Legacy policy hook
│   │   ├── useNetworkStatus.js       # Network signal hook
│   │   └── useDeviceStatus.js        # Device capability hook
│   ├── components/
│   │   ├── ecommerce/
│   │   │   ├── ProductCard.jsx       # Mode-styled cards
│   │   │   └── OptionalRecommendations.jsx
│   │   ├── SettingsPanel.jsx         # Mode selection UI
│   │   └── AdaptiveStatus.jsx        # Diagnostic panel
│   └── app/
│       ├── page.js                   # Main app page
│       └── layout.js                 # Root layout
├── package.json
├── next.config.js
└── INSTRUCTION.md
```

---

## Known Issues & Notes

### 1. Dual Adapter Pattern
Two adapter implementations exist:
- `src/adaptive/integration/adaptiveAdapter.js` — **Canonical** (recommended)
- `src/adapters/adaptiveEngineAdapter.js` — **Mock/Temporary**

Use the canonical adapter for production. The mock adapter is for development testing only.

### 2. Browser API Support
Network Information API (`navigator.connection`) is Chromium-only. Firefox/Safari will fallback to BALANCED mode.

### 3. Unit Tests
Test files exist in the `rohith/adaptive-engine` branch under `tests/adaptive/`. Test runner configuration is pending.

### 4. AdaptiveStatus.jsx
This component may have syntax errors requiring fixes before runtime. Check for:
- Import source corrections (`lucide-react` not `laptive`)
- JSX tag matching

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port 3000 Already in Use
```bash
# Run on different port
npm run dev -- -p 3001
```

### Network API Not Detected
- Use Chrome/Edge browser
- Ensure HTTPS or localhost
- Check DevTools Console for API availability

---

## Contact & Ownership

| Component | Owner |
|-----------|-------|
| Adaptive Engine / Policy | Rohith |
| Frontend Integration | Ravi |
| Backend/API Contracts | Praveen |

---

## Definition of Complete

The adaptive engine integration is complete when:
- [x] Canonical adapter receives browser signals
- [x] AUTO mode evaluates signals correctly
- [x] Manual override bypasses auto-detection
- [x] UI components adapt to mode changes
- [x] Resource policies propagate to components
- [ ] Unit tests pass (pending test runner)
- [ ] Browser/E2E tests verified (manual testing required)

---

**Last Updated:** 2026-09-23  
**Version:** 0.1.0
