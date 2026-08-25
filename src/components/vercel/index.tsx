import CustomAnalytics from "./analytics";
import CustomSpeedInsights from "./speed-insights";

/**
 * Vercel observability components, imported directly.
 *
 * NOTE: these were previously loaded via `lazy()` without a wrapping
 * Suspense boundary in the root layout, which suspended during hydration
 * and caused React error #418 ("server rendered HTML didn't match the
 * client") in production builds. Direct imports keep hydration in sync.
 */
export const VercelCompatibleComponents = {
  Analytics: CustomAnalytics,
  SpeedInsights: CustomSpeedInsights,
};
