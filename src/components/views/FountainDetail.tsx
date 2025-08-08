import { useState, useEffect } from 'react';
import { 
  Droplets, 
  Gauge, 
  Thermometer, 
  Battery, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SensorData {
  flowRate: number;
  pressure: number;
  temperature: number;
  pH: number;
  batteryLevel: number;
  lastUpdate: string;
}

interface Issue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  technician: string;
  description: string;
  cost: number;
  status: 'completed' | 'pending' | 'scheduled';
}

const mockSensorData: SensorData = {
  flowRate: 118.5,
  pressure: 85.2,
  temperature: 22.1,
  pH: 7.2,
  batteryLevel: 87,
  lastUpdate: new Date().toLocaleString()
};

const mockIssues: Issue[] = [
  {
    id: '1',
    severity: 'medium',
    title: 'Slight Pressure Drop',
    description: 'Pressure has decreased by 5% over the last 2 hours',
    timestamp: '2024-01-15 14:30',
    status: 'investigating'
  },
  {
    id: '2',
    severity: 'low',
    title: 'pH Fluctuation',
    description: 'pH levels showing minor variations within acceptable range',
    timestamp: '2024-01-15 11:15',
    status: 'open'
  },
  {
    id: '3',
    severity: 'high',
    title: 'Flow Rate Anomaly',
    description: 'Flow rate spiked unexpectedly at 10:45 AM',
    timestamp: '2024-01-14 10:45',
    status: 'resolved'
  }
];

const mockMaintenance: MaintenanceRecord[] = [
  {
    id: '1',
    date: '2024-01-10',
    type: 'Filter Replacement',
    technician: 'John Smith',
    description: 'Replaced primary and secondary filters',
    cost: 245.50,
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-01-03',
    type: 'Routine Inspection',
    technician: 'Sarah Johnson',
    description: 'Monthly inspection and cleaning',
    cost: 120.00,
    status: 'completed'
  },
  {
    id: '3',
    date: '2023-12-20',
    type: 'Pump Maintenance',
    technician: 'Mike Davis',
    description: 'Pump calibration and performance check',
    cost: 380.75,
    status: 'completed'
  }
];

const severityConfig = {
  low: { color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/20' },
  medium: { color: 'text-warning', bgColor: 'bg-warning/10', borderColor: 'border-warning/20' },
  high: { color: 'text-danger', bgColor: 'bg-danger/10', borderColor: 'border-danger/20' },
  critical: { color: 'text-danger', bgColor: 'bg-danger/20', borderColor: 'border-danger/30' }
};

const statusConfig = {
  open: { color: 'text-danger', icon: AlertTriangle },
  investigating: { color: 'text-warning', icon: Clock },
  resolved: { color: 'text-success', icon: CheckCircle }
};

interface FountainDetailProps {
  fountainId: string;
  onBack: () => void;
}

export function FountainDetail({ fountainId, onBack }: FountainDetailProps) {
  const [sensorData, setSensorData] = useState(mockSensorData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        flowRate: prev.flowRate + (Math.random() - 0.5) * 2,
        pressure: prev.pressure + (Math.random() - 0.5) * 1,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.2,
        pH: prev.pH + (Math.random() - 0.5) * 0.1,
        lastUpdate: new Date().toLocaleString()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover-lift">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Central Plaza Fountain</h1>
            <p className="text-muted-foreground">Fountain ID: {fountainId} • Zone A-1</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">Active</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {sensorData.lastUpdate}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Sensors */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Real-time Sensors</h3>
              <Activity className="w-5 h-5 text-success animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flow Rate</p>
                  <p className="text-2xl font-bold text-foreground">{sensorData.flowRate.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">L/min</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-aqua/10 flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-aqua" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pressure</p>
                  <p className="text-2xl font-bold text-foreground">{sensorData.pressure.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">PSI</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-2xl font-bold text-foreground">{sensorData.temperature.toFixed(1)}°</p>
                  <p className="text-xs text-muted-foreground">Celsius</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Battery className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Battery</p>
                  <p className="text-2xl font-bold text-foreground">{sensorData.batteryLevel}%</p>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Log */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-6">Issue Log</h3>
            <div className="space-y-4">
              {mockIssues.map((issue) => {
                const severityConf = severityConfig[issue.severity];
                const statusConf = statusConfig[issue.status];
                const StatusIcon = statusConf.icon;

                return (
                  <div key={issue.id} className={cn(
                    'p-4 rounded-lg border',
                    severityConf.bgColor,
                    severityConf.borderColor
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={cn('w-5 h-5', statusConf.color)} />
                        <h4 className="font-medium text-foreground">{issue.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium capitalize',
                          severityConf.color,
                          severityConf.bgColor
                        )}>
                          {issue.severity}
                        </span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium capitalize',
                          statusConf.color
                        )}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                    <p className="text-xs text-muted-foreground">{issue.timestamp}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Controls</h3>
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-neon hover:shadow-neon">
                Emergency Stop
              </Button>
              <Button variant="outline" className="w-full hover-lift">
                Schedule Maintenance
              </Button>
              <Button variant="outline" className="w-full hover-lift">
                Run Diagnostics
              </Button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-6">Maintenance History</h3>
            <div className="space-y-4">
              {mockMaintenance.map((record) => (
                <div key={record.id} className="border-l-4 border-l-primary pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-foreground text-sm">{record.type}</h4>
                    <span className="text-xs text-success font-medium">${record.cost.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{record.technician}</p>
                  <p className="text-xs text-muted-foreground mb-1">{record.description}</p>
                  <p className="text-xs text-muted-foreground">{record.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}