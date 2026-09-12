import { NextRequest, NextResponse } from "next/server";

/**
 * Nonce-based Content Security Policy (Next.js 16 `proxy` convention,
 * the renamed middleware). A fresh nonce is generated per request and
 * attached by Next.js to every framework/bootstrap script it renders —
 * which is why all pages use dynamic rendering (`export const dynamic =
 * "force-dynamic"`): a nonce baked into cached ISR HTML would be reused
 * across requests and defeat the point (and break the scripts).
 *
 * `'strict-dynamic'` lets scripts injected at runtime by trusted
 * (nonce-carrying) scripts load — that is how `@vercel/analytics` and
 * `@vercel/speed-insights` inject `va.vercel-scripts.com`, so they keep
 * working without weakening the policy. `https://va.vercel-scripts.com`
 * stays listed only as a fallback for browsers without strict-dynamic.
 *
 * Development needs `'unsafe-eval'` (React uses eval for richer error
 * stacks); production does not. `style-src` keeps `'unsafe-inline'`
 * because React renders element `style` attributes, which cannot carry
 * a nonce.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://res.cloudinary.com https://raw.githubusercontent.com https://github.com;
    font-src 'self' data:;
    connect-src 'self' https://va.vercel-scripts.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js extracts the nonce from this request header and applies it
  // to the scripts it renders.
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes — CSP is meaningless on JSON)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Prefetches are skipped too — they render no document.
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
