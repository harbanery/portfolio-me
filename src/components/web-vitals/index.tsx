"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Core Web Vitals reporting. Next.js forwards every metric reported
 * through this hook to Vercel Analytics automatically, so the metrics
 * land in the same dashboard as the page views (one source of truth);
 * Speed Insights keeps collecting its own samples alongside.
 *
 * Lives in the root layout — the hook needs a client boundary, so it is
 * isolated in this null-rendering component rather than the layout body.
 */
export default function WebVitalsReporter() {
  useReportWebVitals(() => {
    // Forwarded to Vercel Analytics by Next.js; no custom endpoint yet.
    // Add `navigator.sendBeacon(metric)` forwarding here if metrics
    // should also reach a self-hosted sink.
  });

  return null;
}
