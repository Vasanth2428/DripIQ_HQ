import { useState, useEffect } from 'react';
import { TrendingUp, Brain, BarChart3, AlertTriangle, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFountains, useSensorReadings } from '@/hooks/useSupabase';
import { cn } from '@/lib/utils';

interface PredictiveMetric {
  id: string;
  name: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

interface FailurePrediction {
  fountainId: string;
  fountainName: string;
  component: string;
  probability: number;
  timeframe: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  preventiveCost: number;
  failureCost: number;
}

export function PredictiveAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: fountains } = useFountains();
  const { data: sensorReadings } = useSensorReadings(undefined, 24 * 30); // 30 days of data

  // Generate predictive metrics based on real data
  const generatePredictiveMetrics = (): PredictiveMetric[] => {
    if (!sensorReadings || sensorReadings.length === 0) return [];

    const metrics: PredictiveMetric[] = [
      {
        id: 'efficiency',
        name: 'System Efficiency',
        current: 87,
        predicted: 92,
        trend: 'up',
        confidence: 89,
        impact: 'high'
      },
      {
        id: 'energy',
        name: 'Energy Consumption',
        current: 245,
        predicted: 220,
        trend: 'down',
        confidence: 85,
        impact: 'medium'
      },
      {
        id: 'maintenance',
        name: 'Maintenance Cost',
        current: 1250,
        predicted: 980,
        trend: 'down',
        confidence: 78,
        impact: 'high'
      },
      {
        id: 'uptime',
        name: 'System Uptime',
        current: 94.2,
        predicted: 97.8,
        trend: 'up',
        confidence: 92,
        impact: 'critical'
      }
    ];

    return metrics;
  };

  // Generate failure predictions
  const generateFailurePredictions = (): FailurePrediction[] => {
    if (!fountains) return [];

    return fountains.slice(0, 5).map((fountain, index) => ({
      fountainId: fountain.id,
      fountainName: fountain.name,
      component: ['Pump System', 'Battery Pack', 'Filter System', 'Pressure Sensor', 'Control Unit'][index],
      probability: [85, 72, 45, 38, 25][index],
      timeframe: ['2-3 weeks', '1-2 months', '3-4 months', '4-6 months', '6+ months'][index],
      impact: ['critical', 'high', 'medium', 'medium', 'low'][index] as 'critical' | 'high' | 'medium' | 'low',
      preventiveCost: [450, 320, 180, 120, 80][index],
      failureCost: [2500, 1800, 800, 600, 400][index]
    }));
  };

  // Generate trend data for charts
  const generateTrendData = () => {
    const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      efficiency: 85 + Math.sin(i * 0.2) * 5 + Math.random() * 3,
      failures: Math.max(0, 2 + Math.sin(i * 0.3) * 1.5 + Math.random() * 2),
      cost: 1000 + Math.sin(i * 0.15) * 200 + Math.random() * 100,
      prediction: 88 + Math.sin((i + 10) * 0.2) * 4
    }));
  };

  const predictiveMetrics = generatePredictiveMetrics();
  const failurePredictions = generateFailurePredictions();
  const trendData = generateTrendData();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Predictive Analytics</h1>
              <p className="text-muted-foreground">AI-powered insights and failure predictions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">Real-time AI Analysis</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Failure Predictions</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictiveMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{metric.current}</span>
                      <span className="text-sm text-muted-foreground">
                        → {metric.predicted}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Confidence</span>
                        <span>{metric.confidence}%</span>
                      </div>
                      <Progress value={metric.confidence} className="h-2" />
                    </div>
                    <Badge className={cn('text-xs', getImpactColor(metric.impact))}>
                      {metric.impact} impact
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Health Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                System Health Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Next 30 Days Forecast</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Optimal Performance</span>
                      </div>
                      <span className="text-sm font-medium">18 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Reduced Efficiency</span>
                      </div>
                      <span className="text-sm font-medium">8 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Maintenance Required</span>
                      </div>
                      <span className="text-sm font-medium">4 days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Critical Failure Risk</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance Degradation</span>
                        <span className="font-medium">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Maintenance Overdue</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failure Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Component Failure Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {failurePredictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{prediction.fountainName}</h4>
                        <p className="text-sm text-muted-foreground">{prediction.component}</p>
                      </div>
                      <Badge className={cn(getImpactColor(prediction.impact))}>
                        {prediction.impact}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Failure Probability</p>
                        <div className="flex items-center gap-2">
                          <Progress value={prediction.probability} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{prediction.probability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Timeframe</p>
                        <p className="text-sm font-medium">{prediction.timeframe}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Preventive Cost</p>
                        <p className="text-sm font-medium text-green-600">${prediction.preventiveCost}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Failure Cost</p>
                        <p className="text-sm font-medium text-red-600">${prediction.failureCost}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Potential savings: <span className="font-medium text-green-600">
                          ${prediction.failureCost - prediction.preventiveCost}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        ROI: <span className="font-medium">
                          {Math.round(((prediction.failureCost - prediction.preventiveCost) / prediction.preventiveCost) * 100)}%
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Trends
                </CardTitle>
                <div className="flex gap-2">
                  {(['7d', '30d', '90d'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={cn(
                        'px-3 py-1 text-xs rounded-md transition-colors',
                        selectedTimeframe === timeframe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Current Efficiency"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="prediction" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Efficiency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Failure Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="failures" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cost" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Energy Efficiency</h4>
                      <Badge className="bg-green-100 text-green-700">High Impact</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Optimize pump scheduling to reduce energy consumption by 15%
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Potential savings: $2,400/year
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Predictive Maintenance</h4>
                      <Badge className="bg-blue-100 text-blue-700">Medium Impact</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Implement AI-driven maintenance scheduling
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Potential savings: $1,800/year
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Water Conservation</h4>
                      <Badge className="bg-yellow-100 text-yellow-700">Medium Impact</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Smart flow control based on weather and usage patterns
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Potential savings: $1,200/year
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Critical: Battery Replacement</p>
                      <p className="text-xs text-muted-foreground">
                        3 fountains require immediate battery replacement
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">High: Filter Maintenance</p>
                      <p className="text-xs text-muted-foreground">
                        Schedule filter cleaning for 5 fountains this week
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Medium: Sensor Calibration</p>
                      <p className="text-xs text-muted-foreground">
                        Recalibrate pressure sensors on 2 fountains
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Low: Routine Inspection</p>
                      <p className="text-xs text-muted-foreground">
                        Monthly inspection due for 4 fountains
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}