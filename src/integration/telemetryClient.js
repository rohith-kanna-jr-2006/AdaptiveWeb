/**
 * telemetryClient.js
 *
 * Sends telemetry events to the backend according to the agreed contract.
 * Data is minimized; no raw signals or PII are transmitted.
 */

import { TELEMETRY_SCHEMA, TELEMETRY_REQUIRED, TELEMETRY_RETENTION } from "./policyContract.js";

const DEFAULT_ENDPOINT = "/api/adaptive/telemetry";

/**
 * TelemetryClient sends performance and mode events.
 */
export class TelemetryClient {
  #endpoint;
  #queue = [];
  #enabled = true;

  constructor(endpoint = DEFAULT_ENDPOINT) {
    this.#endpoint = endpoint;
  }

  /**
   * Send a telemetry event.
   * @param {object} event
   */
  async sendEvent(event) {
    if (!this.#enabled) return;

    // Validate against schema
    if (!this.#validateEvent(event)) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Telemetry: invalid event, discarding", event);
      }
      return;
    }

    this.#queue.push(event);

    // Flush queue periodically or when full
    if (this.#queue.length >= 10) {
      await this.#flush();
    }
  }

  /**
   * Flush pending events immediately.
   */
  async flush() {
    await this.#flush();
  }

  /**
   * Clear pending events without sending.
   */
  clear() {
    this.#queue = [];
  }

  /**
   * Disable telemetry (e.g., user preference).
   */
  disable() {
    this.#enabled = false;
  }

  /**
   * Re-enable telemetry.
   */
  enable() {
    this.#enabled = true;
  }

  /**
   * Send a session summary event.
   * @param {object} policy
   * @param {object} metrics
   */
  async sendSessionSummary(policy, metrics = {}) {
    const event = {
      event: "adaptive_session_summary",
      schemaVersion: 1,
      mode: policy?.mode || "unknown",
      reasonCodes: policy?.reason || [],
      metrics: {
        lcpMs: metrics.lcpMs ?? null,
        inpMs: metrics.inpMs ?? null,
        cls: metrics.cls ?? null,
        transferBytes: metrics.transferBytes ?? null,
      },
    };
    await this.sendEvent(event);
  }

  /**
   * Send a mode transition event.
   * @param {object} fromPolicy
   * @param {object} toPolicy
   */
  async sendModeTransition(fromPolicy, toPolicy) {
    const event = {
      event: "adaptive_mode_transition",
      schemaVersion: 1,
      from: fromPolicy?.mode || "unknown",
      to: toPolicy?.mode || "unknown",
      reasonCodes: toPolicy?.reason || [],
      timestamp: new Date().toISOString(),
    };
    await this.sendEvent(event);
  }

  /**
   * Validate an event against the schema.
   * @param {object} event
   * @returns {boolean}
   */
  #validateEvent(event) {
    if (!event || typeof event !== "object") return false;
    if (!TELEMETRY_REQUIRED.every((r) => r in event)) return false;

    try {
      const schema = TELEMETRY_SCHEMA;
      if (schema.type === "object" && schema.properties) {
        for (const [key, def] of Object.entries(schema.properties)) {
          if (def.required && !(key in event)) return false;
        }
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Flush all pending events via POST.
   */
  async #flush() {
    if (this.#queue.length === 0) return;

    const events = [...this.#queue];
    this.#queue = [];

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const data = JSON.stringify(events);
        navigator.sendBeacon(this.#endpoint, new Blob([data], { type: "application/json" }));
        return;
      } catch (err) {
        // sendBeacon failed, fall through to fetch
      }
    }

    try {
      await fetch(this.#endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(events),
        keepalive: true,
      });
    } catch (err) {
      // Network failure — events are lost but the app must not break
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Telemetry flush failed, will retry:", err);
      }
      // Re-queue for next flush attempt
      this.#queue.push(...events);
    }
  }
}

// Singleton (shared across the app, can be replaced with DI)
let globalClient = null;

export function getTelemetryClient(endpoint) {
  if (!globalClient) {
    globalClient = new TelemetryClient(endpoint);
  }
  return globalClient;
}

export function resetTelemetryClient() {
  if (globalClient) {
    globalClient = null;
  }
}
