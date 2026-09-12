import NotFoundView from "@/components/ui/not-found-view";

/**
 * Server wrapper for the 404 page. Dynamic rendering is required by the
 * nonce-based CSP (`src/proxy.ts`): a prerendered 404 carries no nonce,
 * and `strict-dynamic` would block every script in it. The interactive
 * view lives in a separate client component.
 */
export const dynamic = "force-dynamic";

const RootNotFound = () => <NotFoundView />;

export default RootNotFound;
