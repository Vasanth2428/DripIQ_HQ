import { useMutation, useQuery } from '@tanstack/react-query';

// AI API endpoints
const AI_ENDPOINTS = {
  predictions: '/api/ai-predictions',
  maintenance: '/api/maintenance-ai',
};

// Types for AI responses
export interface AIPrediction {
  maintenanceNeeded: boolean;
  nextMaintenanceDate: string;
  efficiencyScore: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface MaintenanceAnalysis {
  priority: 'urgent' | 'high' | 'normal';
  estimatedCost: number;
  timeToFailure: number;
  recommendedActions: {
    action: string;
    urgency: 'high' | 'medium' | 'low';
    estimatedTime: string;
    cost: string;
  }[];
  efficiencyImprovement: number;
  nextInspectionDate: string;
}

// Hook for AI predictions
export const useAIPredictions = () => {
  return useMutation({
    mutationFn: async ({ sensorData, fountainId }: { sensorData: any; fountainId: string }) => {
      const response = await fetch(AI_ENDPOINTS.predictions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sensorData, fountainId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI predictions');
      }

      const data = await response.json();
      return data.predictions as AIPrediction;
    },
  });
};

// Hook for maintenance analysis
export const useMaintenanceAnalysis = () => {
  return useMutation({
    mutationFn: async ({ 
      fountainData, 
      sensorHistory, 
      maintenanceHistory 
    }: { 
      fountainData: any; 
      sensorHistory: any[]; 
      maintenanceHistory: any[]; 
    }) => {
      const response = await fetch(AI_ENDPOINTS.maintenance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fountainData, sensorHistory, maintenanceHistory }),
      });

      if (!response.ok) {
        throw new Error('Failed to get maintenance analysis');
      }

      const data = await response.json();
      return data.analysis as MaintenanceAnalysis;
    },
  });
};

// Hook for getting AI insights for a specific fountain
export const useFountainAIInsights = (fountainId: string) => {
  const { data: fountain } = useQuery({
    queryKey: ['fountain', fountainId],
    // This would use your existing fountain query
  });

  const { data: sensorReadings } = useQuery({
    queryKey: ['sensor-readings', fountainId],
    // This would use your existing sensor readings query
  });

  const predictionsMutation = useAIPredictions();
  const maintenanceMutation = useMaintenanceAnalysis();

  const getPredictions = () => {
    if (!fountain || !sensorReadings) return;
    
    return predictionsMutation.mutate({
      sensorData: sensorReadings,
      fountainId,
    });
  };

  const getMaintenanceAnalysis = () => {
    if (!fountain || !sensorReadings) return;
    
    return maintenanceMutation.mutate({
      fountainData: fountain,
      sensorHistory: sensorReadings,
      maintenanceHistory: [], // You would fetch this from your database
    });
  };

  return {
    predictions: predictionsMutation.data,
    maintenanceAnalysis: maintenanceMutation.data,
    isLoading: predictionsMutation.isPending || maintenanceMutation.isPending,
    error: predictionsMutation.error || maintenanceMutation.error,
    getPredictions,
    getMaintenanceAnalysis,
  };
};
