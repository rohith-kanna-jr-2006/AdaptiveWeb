# AdaptiveWeb — Backend API & Server-Side Adaptive Engine

AdaptiveWeb is a Node.js / Express.js / MongoDB backend web application providing server-side adaptive content delivery rules, real-time context evaluation, client configuration management, and performance measurement tracking.

---

## 1. Backend Architecture

The application follows a clean modular design enforcing separation of concerns:

```text
server/
├── config/
│   ├── db.js               # MongoDB Mongoose connection manager
│   └── env.js              # Environment variable loader & defaults
│
├── controllers/
│   ├── healthController.js # GET /api/health
│   ├── configController.js # GET /api/config, PUT /api/config
│   ├── adaptiveController.js# GET /api/adaptive/policy, POST /api/adaptive/evaluate
│   └── metricsController.js # POST /api/metrics, GET /api/metrics/:sessionId
│
├── middleware/
│   ├── errorHandler.js     # Centralized error handler with safety envelopes
│   ├── notFound.js         # 404 Route handling
│   └── validate.js         # Request validation middleware executor
│
├── models/
│   ├── AppConfig.js        # Global adaptive configuration schema
│   ├── AdaptivePolicy.js   # Rule-based policy schema
│   ├── PerformanceMetric.js# Performance measurement schema
│   └── Session.js          # Client session context schema
│
├── routes/
│   ├── healthRoutes.js     # /api/health routes
│   ├── configRoutes.js     # /api/config routes
│   ├── adaptiveRoutes.js   # /api/adaptive routes
│   └── metricsRoutes.js    # /api/metrics routes
│
├── services/
│   ├── configService.js    # Runtime configuration service
│   ├── adaptiveService.js  # Transparent rule-based evaluation engine
│   └── metricsService.js   # Performance metrics persistence and retrieval service
│
├── validators/
│   ├── configValidator.js   # PUT /api/config validation
│   ├── adaptiveValidator.js # POST /api/adaptive/evaluate validation
│   └── metricsValidator.js  # POST /api/metrics & GET /api/metrics/:sessionId validation
│
├── app.js                  # Express app middleware & route initialization
└── server.js               # Entry point listener with graceful shutdown
```

---

## 2. Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher (or `mongodb-memory-server` for automated tests)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Configure settings in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adaptiveweb
NODE_ENV=development
```

---

## 3. Running the Server

### Development Mode (Auto-Reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 4. Running Automated Tests

Tests are executed with **Jest**, **Supertest**, and an isolated in-memory database (**`mongodb-memory-server`**).

```bash
npm test
```

---

## 5. API Endpoints Documentation

All endpoints follow a standardized response envelope:

**Success Response Envelope (`200` / `201`):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response Envelope (`400` / `404` / `500`):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descriptive error message"
  }
}
```

### Summary of Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/config` | Retrieve current runtime adaptive config |
| `PUT` | `/api/config` | Update runtime adaptive settings |
| `GET` | `/api/adaptive/policy` | Retrieve active adaptive delivery policies |
| `POST` | `/api/adaptive/evaluate` | Evaluate client network/device context & return adaptive decisions |
| `POST` | `/api/metrics` | Store a client/browser performance measurement metric |
| `GET` | `/api/metrics/:sessionId` | Retrieve all metrics stored for a session ID |

---

### Endpoint Details & Curl Examples

#### 1. GET `/api/health`
Checks backend service availability.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "AdaptiveWeb"
  }
}
```

---

#### 2. GET `/api/config`
Retrieves configurable adaptive delivery settings.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/config
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "adaptiveEnabled": true,
    "measurementInterval": 5000,
    "qualityThresholds": {
      "poorLatency": 300,
      "poorDownlink": 1.5,
      "goodLatency": 100,
      "goodDownlink": 5
    }
  }
}
```

---

#### 3. PUT `/api/config`
Updates runtime adaptive configuration parameters.

**Example Request:**
```bash
curl -X PUT http://localhost:5000/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "adaptiveEnabled": true,
    "measurementInterval": 10000,
    "qualityThresholds": {
      "poorLatency": 350
    }
  }'
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "adaptiveEnabled": true,
    "measurementInterval": 10000,
    "qualityThresholds": {
      "poorLatency": 350,
      "poorDownlink": 1.5,
      "goodLatency": 100,
      "goodDownlink": 5
    }
  }
}
```

---

#### 4. GET `/api/adaptive/policy`
Retrieves currently configured rule-based policies.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/adaptive/policy
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "policies": [...]
  }
}
```

---

#### 5. POST `/api/adaptive/evaluate`
Evaluates client network, device, and performance conditions to output adaptive content decisions.

**Example Request (Poor Network):**
```bash
curl -X POST http://localhost:5000/api/adaptive/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess-mobile-100",
    "network": {
      "effectiveType": "2g",
      "downlink": 0.5,
      "latency": 450
    },
    "device": {
      "type": "mobile"
    }
  }'
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess-mobile-100",
    "evaluatedProfile": "poor",
    "decision": {
      "contentQuality": "low",
      "optimization": "aggressive",
      "prefetchEnabled": false,
      "maxImageResolution": "480p",
      "compressionLevel": "high",
      "resourceStrategy": "minimal"
    },
    "evaluatedAt": "2026-09-23T03:15:00.000Z"
  }
}
```

---

#### 6. POST `/api/metrics`
Stores performance measurements submitted by client, server, or browser measurements.

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess-mobile-100",
    "metricName": "loadTime",
    "value": 1250,
    "unit": "ms",
    "source": "client"
  }'
```

**Example Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "66f123456789abcdef012345",
    "sessionId": "sess-mobile-100",
    "metricName": "loadTime",
    "value": 1250,
    "unit": "ms",
    "source": "client",
    "timestamp": "2026-09-23T03:15:00.000Z"
  }
}
```

---

#### 7. GET `/api/metrics/:sessionId`
Retrieves all recorded metrics for a specific session ID.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/metrics/sess-mobile-100
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess-mobile-100",
    "count": 1,
    "metrics": [
      {
        "_id": "66f123456789abcdef012345",
        "sessionId": "sess-mobile-100",
        "metricName": "loadTime",
        "value": 1250,
        "unit": "ms",
        "source": "client",
        "timestamp": "2026-09-23T03:15:00.000Z"
      }
    ]
  }
}
```

---

## 6. Server-Side Adaptive Rules Engine

The evaluation engine uses transparent, deterministic rules:

1. **Poor Network** (`effectiveType` in `['slow-2g', '2g']` OR `latency >= 300ms` OR `downlink <= 1.5Mbps` OR `loadTime >= 3000ms`):
   - `contentQuality`: `"low"`
   - `optimization`: `"aggressive"`
   - `prefetchEnabled`: `false`
   - `maxImageResolution`: `"480p"`
   - `compressionLevel`: `"high"`
   - `resourceStrategy`: `"minimal"`

2. **Moderate Network** (`effectiveType == '3g'` OR `100ms < latency < 300ms` OR `1.5Mbps < downlink < 5Mbps`):
   - `contentQuality`: `"medium"`
   - `optimization`: `"standard"`
   - `prefetchEnabled`: `false`
   - `maxImageResolution`: `"720p"`
   - `compressionLevel`: `"standard"`
   - `resourceStrategy`: `"balanced"`

3. **Good Network** (`effectiveType == '4g'` AND `latency <= 100ms` AND `downlink >= 5Mbps`):
   - `contentQuality`: `"high"`
   - `optimization`: `"minimal"`
   - `prefetchEnabled`: `true`
   - `maxImageResolution`: `"1080p"`
   - `compressionLevel`: `"none"`
   - `resourceStrategy`: `"full"`
