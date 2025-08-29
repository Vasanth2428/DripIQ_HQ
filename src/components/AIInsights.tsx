import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIPredictions, useMaintenanceAnalysis } from '@/hooks/useAI';
import { useSensorReadings, useFountain } from '@/hooks/useSupabase';
import { cn } from '@/lib/utils';

interface AIInsightsProps {
  fountainId: string;
}

export function AIInsights({ fountainId }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState<'predictions' | 'maintenance'>('predictions');
  
  const { data: fountain } = useFountain(fountainId);
  const { data: sensorReadings } = useSensorReadings(fountainId, 24);
  
  const predictionsMutation = useAIPredictions();
  const maintenanceMutation = useMaintenanceAnalysis();

  const handleGetPredictions = () => {
    if (sensorReadings && sensorReadings.length > 0) {
      predictionsMutation.mutate({
        sensorData: sensorReadings,
        fountainId
      });
    }
  };

  const handleGetMaintenanceAnalysis = () => {
    if (fountain && sensorReadings) {
      maintenanceMutation.mutate({
        fountainData: fountain,
        sensorHistory: sensorReadings,
        maintenanceHistory: [] // You would fetch this from your database
      });
    }
  };

  // Auto-fetch predictions when component mounts
  useEffect(() => {
    if (sensorReadings && sensorReadings.length > 0) {
      handleGetPredictions();
    }
  }, [sensorReadings]);

  const predictions = predictionsMutation.data;
  const maintenanceAnalysis = maintenanceMutation.data;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-50';
      case 'high': return 'text-orange-500 bg-orange-50';
      case 'normal': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <CardTitle>AI Insights & Predictions</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'predictions' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('predictions')}
              >
                Predictions
              </Button>
              <Button
                variant={activeTab === 'maintenance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('maintenance')}
              >
                Maintenance
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {predictionsMutation.isPending && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 animate-pulse text-primary" />
                  <span>Analyzing sensor data...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {predictions && (
            <>
              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Badge className={cn('mb-2', getRiskColor(predictions.riskLevel))}>
                        {predictions.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <p className="text-sm text-muted-foreground">Current Risk Level</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {predictions.efficiencyScore}%
                      </div>
                      <p className="text-sm text-muted-foreground">Efficiency Score</p>
                      <Progress value={predictions.efficiencyScore} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {predictions.confidence}%
                      </div>
                      <p className="text-sm text-muted-foreground">AI Confidence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Maintenance Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    {predictions.maintenanceNeeded ? (
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    ) : (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {predictions.maintenanceNeeded ? 'Maintenance Required' : 'System Healthy'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Next maintenance: {new Date(predictions.nextMaintenanceDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {predictions.analysisDetails && (
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Avg Flow Rate</p>
                        <p className="text-lg">{predictions.analysisDetails.avgFlowRate} L/min</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Avg Pressure</p>
                        <p className="text-lg">{predictions.analysisDetails.avgPressure} PSI</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Battery Health</p>
                        <p className="text-lg capitalize">{predictions.analysisDetails.batteryHealth}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Water Quality</p>
                        <p className="text-lg capitalize">{predictions.analysisDetails.waterQualityTrend}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                        <span className="text-sm">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-center">
            <Button onClick={handleGetPredictions} disabled={predictionsMutation.isPending}>
              {predictionsMutation.isPending ? 'Analyzing...' : 'Refresh Predictions'}
            </Button>
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {maintenanceMutation.isPending && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 animate-pulse text-primary" />
                  <span>Analyzing maintenance requirements...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {maintenanceAnalysis && (
            <>
              {/* Priority & Cost Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Maintenance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Badge className={cn('mb-2', getPriorityColor(maintenanceAnalysis.priority))}>
                        {maintenanceAnalysis.priority.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground">Priority Level</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        ${maintenanceAnalysis.estimatedCost}
                      </div>
                      <p className="text-sm text-muted-foreground">Estimated Cost</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {maintenanceAnalysis.timeToFailure}d
                      </div>
                      <p className="text-sm text-muted-foreground">Time to Failure</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500 mb-1">
                        +{maintenanceAnalysis.efficiencyImprovement}%
                      </div>
                      <p className="text-sm text-muted-foreground">Efficiency Gain</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost-Benefit Analysis */}
              {maintenanceAnalysis.costBenefit && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cost-Benefit Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Financial Impact</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Preventive Cost:</span>
                            <span className="font-medium">${maintenanceAnalysis.costBenefit.preventiveCost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Potential Failure Cost:</span>
                            <span className="font-medium text-red-500">${maintenanceAnalysis.costBenefit.potentialFailureCost}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Savings:</span>
                            <span className="font-semibold text-green-500">${maintenanceAnalysis.costBenefit.savings}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Return on Investment</h4>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-500 mb-2">
                            {maintenanceAnalysis.costBenefit.roi}%
                          </div>
                          <p className="text-sm text-muted-foreground">ROI from preventive maintenance</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {maintenanceAnalysis.recommendedActions.map((action, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{action.action}</h4>
                          <Badge className={cn(
                            action.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                            action.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          )}>
                            {action.urgency}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Time: </span>
                            <span className="font-medium">{action.estimatedTime}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cost: </span>
                            <span className="font-medium">{action.cost}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impact: </span>
                            <span className="font-medium">{action.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              {maintenanceAnalysis.riskFactors && maintenanceAnalysis.riskFactors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Identified Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {maintenanceAnalysis.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <div className="flex justify-center">
            <Button onClick={handleGetMaintenanceAnalysis} disabled={maintenanceMutation.isPending}>
              {maintenanceMutation.isPending ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}