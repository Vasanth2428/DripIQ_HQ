import { Droplets, AlertCircle, Wrench, Leaf, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { InteractiveMap } from '@/components/InteractiveMap';
import { useDashboardStats, useFountains, useAlerts } from '@/hooks/useSupabase';
import heroImage from '@/assets/hero-dashboard.jpg';
import chartFlow from '@/assets/chart-flow.jpg';
import chartPressure from '@/assets/chart-pressure.jpg';

export function OverviewHub() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: fountains, isLoading: fountainsLoading } = useFountains();
  const { data: alerts } = useAlerts(false); // Get unresolved alerts

  if (statsLoading || fountainsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center text-red-500">
        Error loading dashboard data. Please try again.
      </div>
    );
  }

  // Calculate water saved (mock calculation for now)
  const waterSaved = fountains?.reduce((total, fountain) => {
    return total + (fountain.water_flow_rate || 0);
  }, 0) || 0;

  const kpiData = [
    {
      title: 'Total Fountains',
      value: stats?.totalFountains || 0,
      change: `${fountains?.filter(f => f.status === 'active').length || 0} active`,
      changeType: 'positive' as const,
      icon: Droplets,
      iconColor: 'text-primary'
    },
    {
      title: 'Active Alerts',
      value: stats?.unresolvedAlerts || 0,
      change: `${alerts?.filter(a => a.severity === 'critical').length || 0} critical`,
      changeType: stats?.unresolvedAlerts && stats.unresolvedAlerts > 0 ? 'negative' as const : 'positive' as const,
      icon: AlertCircle,
      iconColor: 'text-danger'
    },
    {
      title: 'Upcoming Maintenance',
      value: stats?.upcomingMaintenance || 0,
      change: 'Due this week',
      changeType: 'neutral' as const,
      icon: Wrench,
      iconColor: 'text-warning'
    },
    {
      title: 'Water Flow',
      value: `${Math.round(waterSaved)} L/min`,
      change: '+15% efficiency',
      changeType: 'positive' as const,
      icon: Leaf,
      iconColor: 'text-success'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AquaSense Dashboard" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
        </div>
        <div className="relative p-8 lg:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">AquaSense</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your comprehensive fountain management command center. Monitor, analyze, and control 
              all water systems with advanced real-time intelligence.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="text-success">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            icon={kpi.icon}
            iconColor={kpi.iconColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <InteractiveMap />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="text-lg font-semibold text-foreground">Performance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">System Efficiency</span>
                  <span className="font-medium text-success">94%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-success to-primary h-2 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Water Conservation</span>
                  <span className="font-medium text-aqua">87%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-aqua to-primary h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pumps Online</span>
                <span className="text-sm font-medium text-success">21/24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sensors Active</span>
                <span className="text-sm font-medium text-success">96/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Status</span>
                <span className="text-sm font-medium text-success">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">Water Flow Analysis</h3>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={chartFlow} 
              alt="Water flow chart" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pressure Monitoring</h3>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={chartPressure} 
              alt="Pressure monitoring chart" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}