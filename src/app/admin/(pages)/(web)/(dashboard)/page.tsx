import DashboardDecorator from "./decorator";
import { getDashboardStats, getProjectAnalytics } from "./actions";

export default async function DashboardPage() {
  const statsResult = await getDashboardStats();
  const analyticsResult = await getProjectAnalytics();

  const stats =
    statsResult.success && statsResult.data ? statsResult.data.stats : null;
  const recentProjects =
    statsResult.success && statsResult.data
      ? statsResult.data.recentProjects
      : [];
  const analytics =
    analyticsResult.success && analyticsResult.data
      ? analyticsResult.data
      : null;

  return (
    <DashboardDecorator
      stats={stats}
      recentProjects={recentProjects}
      analytics={analytics}
    />
  );
}
