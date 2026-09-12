import { notFound } from "next/navigation";

/**
 * Catch-all → dynamic 404.
 *
 * Without this route, unknown paths resolve to the statically
 * prerendered `/_not-found` HTML — whose scripts carry no nonce and are
 * therefore blocked by the strict CSP set in `src/proxy.ts`
 * (`strict-dynamic` makes browsers ignore the `'self'` fallback). Routing
 * unknown paths through this force-dynamic page means the not-found
 * boundary renders per request, so every script gets the fresh nonce.
 */
export const dynamic = "force-dynamic";

export default function CatchAllPage() {
  notFound();
}
