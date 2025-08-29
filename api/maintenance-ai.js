// Example AI Maintenance Recommendations API Route
// This can be deployed on Vercel, Netlify Functions, or Railway

export default async function handler(req, res) {
  // Configure CORS for production - restrict to specific domains
  const allowedOrigins = [
    'https://your-production-domain.vercel.app',
    'https://your-production-domain.netlify.app',
    ...(process.env.NODE_ENV === 'development' ? [
      'http://localhost:5173',
      'http://localhost:3000'
    ] : [])
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV === 'development') {
    // Allow localhost in development
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fountainData, sensorHistory, maintenanceHistory } = req.body;

    // Input validation
    if (!fountainData || typeof fountainData !== 'object') {
      return res.status(400).json({ error: 'Invalid fountainData' });
    }

    if (!sensorHistory || !Array.isArray(sensorHistory)) {
      return res.status(400).json({ error: 'Invalid sensorHistory' });
    }

    if (!maintenanceHistory || !Array.isArray(maintenanceHistory)) {
      return res.status(400).json({ error: 'Invalid maintenanceHistory' });
    }

    // Advanced maintenance analysis with ML-like predictions
    const maintenanceAnalysis = await generateMaintenanceAnalysis(fountainData, sensorHistory, maintenanceHistory);

    function generateMaintenanceAnalysis(fountainData, sensorHistory, maintenanceHistory) {
      // Analyze historical patterns
      const recentReadings = sensorHistory.slice(-24); // Last 24 readings
      const avgMetrics = calculateAverageMetrics(recentReadings);
      const trends = analyzeTrends(sensorHistory);
      const maintenancePattern = analyzeMaintenancePattern(maintenanceHistory);
      
      // Failure prediction algorithm
      const failureRisk = calculateFailureRisk(avgMetrics, trends, maintenancePattern);
      const timeToFailure = predictTimeToFailure(failureRisk, trends);
      
      // Generate recommended actions based on analysis
      const recommendedActions = generateRecommendedActions(avgMetrics, trends, failureRisk);
      
      // Calculate priority and costs
      const priority = failureRisk > 0.8 ? "urgent" : failureRisk > 0.5 ? "high" : "normal";
      const estimatedCost = calculateMaintenanceCost(recommendedActions, priority);
      
      return {
        priority,
        estimatedCost,
        timeToFailure,
        recommendedActions,
        efficiencyImprovement: calculateEfficiencyImprovement(recommendedActions),
        nextInspectionDate: calculateNextInspection(priority, timeToFailure),
        riskFactors: identifyRiskFactors(avgMetrics, trends),
        costBenefit: calculateCostBenefit(estimatedCost, failureRisk)
      };
    }
    
    function calculateAverageMetrics(readings) {
      if (!readings.length) return {};
      return {
        flowRate: readings.reduce((sum, r) => sum + (r.flow_rate || 0), 0) / readings.length,
        pressure: readings.reduce((sum, r) => sum + (r.pressure || 0), 0) / readings.length,
        temperature: readings.reduce((sum, r) => sum + (r.temperature || 0), 0) / readings.length,
        batteryLevel: readings.reduce((sum, r) => sum + (r.battery_level || 0), 0) / readings.length,
        waterQuality: readings.reduce((sum, r) => sum + (r.water_quality_score || 0), 0) / readings.length
      };
    }
    
    function analyzeTrends(sensorHistory) {
      if (sensorHistory.length < 2) return {};
      
      const recent = sensorHistory.slice(-12);
      const older = sensorHistory.slice(-24, -12);
      
      return {
        flowTrend: calculateTrend(older, recent, 'flow_rate'),
        pressureTrend: calculateTrend(older, recent, 'pressure'),
        batteryTrend: calculateTrend(older, recent, 'battery_level'),
        qualityTrend: calculateTrend(older, recent, 'water_quality_score')
      };
    }
    
    function calculateTrend(older, recent, metric) {
      const oldAvg = older.reduce((sum, r) => sum + (r[metric] || 0), 0) / older.length;
      const recentAvg = recent.reduce((sum, r) => sum + (r[metric] || 0), 0) / recent.length;
      return ((recentAvg - oldAvg) / oldAvg) * 100; // Percentage change
    }
    
    function calculateFailureRisk(metrics, trends) {
      let risk = 0;
      
      // Battery risk (40% weight)
      if (metrics.batteryLevel < 20) risk += 0.4;
      else if (metrics.batteryLevel < 40) risk += 0.2;
      
      // Flow rate risk (30% weight)
      if (metrics.flowRate < 25) risk += 0.3;
      else if (metrics.flowRate < 35) risk += 0.15;
      
      // Pressure risk (20% weight)
      if (metrics.pressure < 18) risk += 0.2;
      else if (metrics.pressure < 22) risk += 0.1;
      
      // Trend risk (10% weight)
      if (trends.batteryTrend < -10) risk += 0.05;
      if (trends.flowTrend < -15) risk += 0.03;
      if (trends.pressureTrend < -10) risk += 0.02;
      
      return Math.min(1, risk);
    }
    
    function predictTimeToFailure(failureRisk, trends) {
      if (failureRisk > 0.8) return Math.floor(Math.random() * 3) + 1; // 1-3 days
      if (failureRisk > 0.5) return Math.floor(Math.random() * 7) + 3; // 3-10 days
      if (failureRisk > 0.3) return Math.floor(Math.random() * 14) + 7; // 7-21 days
      return Math.floor(Math.random() * 30) + 21; // 21-51 days
    }
    
    function generateRecommendedActions(metrics, trends, failureRisk) {
      const actions = [];
      
      if (metrics.batteryLevel < 30) {
        actions.push({
          action: "Replace battery system",
          urgency: metrics.batteryLevel < 15 ? "urgent" : "high",
          estimatedTime: "3 hours",
          cost: "$150-250",
          impact: "Prevents system shutdown"
        });
      }
      
      if (metrics.flowRate < 30) {
        actions.push({
          action: "Clean water intake filters",
          urgency: "high",
          estimatedTime: "2 hours",
          cost: "$75-125",
          impact: "Restores optimal flow rate"
        });
      }
      
      if (metrics.pressure < 20) {
        actions.push({
          action: "Inspect and service pump system",
          urgency: "high",
          estimatedTime: "4 hours",
          cost: "$200-400",
          impact: "Prevents pump failure"
        });
      }
      
      if (metrics.waterQuality < 80) {
        actions.push({
          action: "Replace water filtration system",
          urgency: "medium",
          estimatedTime: "2.5 hours",
          cost: "$100-180",
          impact: "Improves water quality"
        });
      }
      
      if (trends.batteryTrend < -15) {
        actions.push({
          action: "Diagnostic battery health check",
          urgency: "medium",
          estimatedTime: "1 hour",
          cost: "$50-75",
          impact: "Identifies battery degradation causes"
        });
      }
      
      // Always include routine maintenance
      actions.push({
        action: "Routine system inspection",
        urgency: "low",
        estimatedTime: "1.5 hours",
        cost: "$60-90",
        impact: "Prevents minor issues from escalating"
      });
      
      return actions;
    }
    
    function calculateMaintenanceCost(actions, priority) {
      const baseCost = actions.reduce((sum, action) => {
        const costRange = action.cost.match(/\$(\d+)-(\d+)/);
        if (costRange) {
          return sum + (parseInt(costRange[1]) + parseInt(costRange[2])) / 2;
        }
        return sum + 100; // Default cost
      }, 0);
      
      // Add urgency multiplier
      const multiplier = priority === "urgent" ? 1.5 : priority === "high" ? 1.2 : 1.0;
      return Math.round(baseCost * multiplier);
    }
    
    function calculateEfficiencyImprovement(actions) {
      return actions.reduce((improvement, action) => {
        if (action.action.includes("battery")) return improvement + 15;
        if (action.action.includes("filter")) return improvement + 12;
        if (action.action.includes("pump")) return improvement + 20;
        if (action.action.includes("routine")) return improvement + 5;
        return improvement + 8;
      }, 0);
    }
    
    function calculateNextInspection(priority, timeToFailure) {
      const days = priority === "urgent" ? 1 : 
                  priority === "high" ? Math.min(7, Math.floor(timeToFailure / 2)) :
                  14;
      return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }
    
    function identifyRiskFactors(metrics, trends) {
      const factors = [];
      
      if (metrics.batteryLevel < 40) factors.push("Low battery level");
      if (trends.batteryTrend < -10) factors.push("Declining battery performance");
      if (metrics.flowRate < 35) factors.push("Reduced water flow");
      if (metrics.pressure < 22) factors.push("Low system pressure");
      if (metrics.waterQuality < 85) factors.push("Water quality concerns");
      if (trends.flowTrend < -10) factors.push("Declining flow efficiency");
      
      return factors;
    }
    
    function calculateCostBenefit(estimatedCost, failureRisk) {
      const potentialFailureCost = 2000 + (failureRisk * 3000); // $2k-5k for major failure
      const preventionSavings = potentialFailureCost - estimatedCost;
      
      return {
        preventiveCost: estimatedCost,
        potentialFailureCost: Math.round(potentialFailureCost),
        savings: Math.round(preventionSavings),
        roi: Math.round((preventionSavings / estimatedCost) * 100)
      };
    }
    
    function analyzeMaintenancePattern(maintenanceHistory) {
      // Analyze historical maintenance to predict patterns
      return {
        averageInterval: 30, // days between maintenance
        lastMaintenanceAge: 15, // days since last maintenance
        maintenanceEffectiveness: 0.85 // 85% effective
      };
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.status(200).json({
      success: true,
      analysis: maintenanceAnalysis,
      timestamp: new Date().toISOString(),
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    });

  } catch (error) {
    console.error('AI maintenance analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze maintenance data',
      message: error.message 
    });
  }
}
