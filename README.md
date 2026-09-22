# AdaptiveWeb — Backend API & Server-Side Adaptive Engine

AdaptiveWeb is a Node.js / Express.js / MongoDB backend web application providing server-side adaptive content delivery rules, real-time context evaluation, product catalog services, asset variant delivery, client configuration management, and performance measurement tracking.

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
│   ├── metricsController.js # POST /api/metrics, GET /api/metrics/:sessionId
│   └── productController.js # GET /api/products, GET /api/products/:id, GET /api/categories
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
│   ├── Product.js          # Product schema with asset variants (small, medium, large)
│   └── Session.js          # Client session context schema
│
├── routes/
│   ├── healthRoutes.js     # /api/health routes
│   ├── configRoutes.js     # /api/config routes
│   ├── adaptiveRoutes.js   # /api/adaptive routes
│   ├── metricsRoutes.js    # /api/metrics routes
│   └── productRoutes.js    # /api/products & /api/categories routes
│
├── seed/
│   └── seedProducts.js     # Deterministic 30-item product seeder
│
├── services/
│   ├── configService.js    # Runtime configuration service
│   ├── adaptiveService.js  # Transparent rule-based evaluation engine
│   ├── metricsService.js   # Performance metrics persistence and retrieval service
│   └── productService.js   # Product query, pagination & minimal payload service
│
├── validators/
│   ├── configValidator.js   # PUT /api/config validation
│   ├── adaptiveValidator.js # POST /api/adaptive/evaluate validation
│   ├── metricsValidator.js  # POST /api/metrics & GET /api/metrics/:sessionId validation
│   └── productValidator.js  # GET /api/products query & GET /api/products/:id param validation
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

### Step 3: Seed MongoDB Database
To populate MongoDB with a deterministic dataset of 30 products:
```bash
npm run seed
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
| `GET` | `/api/products` | Retrieve paginated product catalog with minimal list payload |
| `GET` | `/api/products/:id` | Retrieve single product full details by ID |
| `GET` | `/api/categories` | Retrieve distinct product categories |
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

#### 2. GET `/api/products`
Returns a paginated list of products. Optimized with minimal field projection (`_id`, `name`, `price`, `category`, `thumbnail`, `image`, `rating`, `stock`) excluding heavy descriptions.

**Query Parameters:**
- `page`: Page number (integer >= 1, default `1`)
- `pageSize`: Items per page (integer between 1 and 50, default `10`)
- `category`: Optional filter by category string (e.g. `Audio`)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/products?page=1&pageSize=10"
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "66f123456789abcdef012345",
        "name": "UltraTab Pro 11-inch",
        "price": 799.99,
        "category": "Electronics",
        "thumbnail": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
        "image": {
          "small": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=480&q=60",
          "medium": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
          "large": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1400&q=90"
        },
        "rating": 4.8,
        "stock": 45
      }
    ],
    "pagination": {
      "totalItems": 30,
      "totalPages": 3,
      "currentPage": 1,
      "pageSize": 10
    }
  }
}
```

---

#### 3. GET `/api/products/:id`
Retrieves full details for a single product by 24-character hexadecimal ObjectId.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/products/66f123456789abcdef012345
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "66f123456789abcdef012345",
    "name": "UltraTab Pro 11-inch",
    "description": "High-performance tablet with Liquid Retina display, M2 chip, and all-day battery life.",
    "price": 799.99,
    "category": "Electronics",
    "thumbnail": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80",
    "image": {
      "small": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=480&q=60",
      "medium": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "large": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1400&q=90"
    },
    "rating": 4.8,
    "stock": 45
  }
}
```

---

#### 4. GET `/api/categories`
Retrieves distinct product categories currently available in the database.

**Example Request:**
```bash
curl -X GET http://localhost:5000/api/categories
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "data": [
    "Accessories",
    "Audio",
    "Electronics",
    "Home & Smart Living",
    "Wearables"
  ]
}
```

---

## 6. Server-Side Optimization & Caching Strategy

The Express backend implements several server-side payload optimizations:

1. **HTTP Compression (`compression`)**: Gzip compression is active across all API responses, significantly reducing network transfer size.
2. **Field Projection**: List views (`/api/products`) project only essential summary attributes, omitting long `description` strings to keep payloads small.
3. **Lean Database Queries (`.lean()`)**: Product queries use `.lean()` to return plain JS objects, bypassing Mongoose document wrapping overhead.
4. **Cache Control Headers**: Product and category GET responses include `Cache-Control: public, max-age=300` headers to leverage browser/proxy caching for stable catalog data.

---

## 7. Asset Variant Contract

Product image assets expose 3 responsive variants alongside the default `thumbnail`:

- `image.small`: Lower resolution/compressed image intended for 2G / slow connection profiles or mobile screens.
- `image.medium`: Standard resolution image for 3G / moderate connection profiles or tablet screens.
- `image.large`: High resolution image for 4G / fast connection profiles or desktop screens.
- `thumbnail`: Ultra-light preview thumbnail for catalog grid rendering.

The browser-side Adaptive Engine selects which image variant URL to request based on its active policy decision.
