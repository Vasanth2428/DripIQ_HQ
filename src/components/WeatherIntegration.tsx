import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  precipitation: number;
  uvIndex: number;
  visibility: number;
}

interface WeatherImpact {
  fountainId: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  adjustments: {
    flowRate: number;
    operatingHours: string;
    maintenanceSchedule: string;
  };
}

export function WeatherIntegration() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherImpacts, setWeatherImpacts] = useState<WeatherImpact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate weather API call
    const fetchWeatherData = async () => {
      setIsLoading(true);
      
      // Mock weather data - in production, integrate with OpenWeatherMap or similar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeather: WeatherData = {
        temperature: 22,
        humidity: 65,
        windSpeed: 12,
        condition: 'cloudy',
        precipitation: 0.2,
        uvIndex: 6,
        visibility: 10
      };
      
      setWeatherData(mockWeather);
      
      // Generate weather-based recommendations
      const impacts = generateWeatherImpacts(mockWeather);
      setWeatherImpacts(impacts);
      
      setIsLoading(false);
    };

    fetchWeatherData();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const generateWeatherImpacts = (weather: WeatherData): WeatherImpact[] => {
    const impacts: WeatherImpact[] = [];
    
    // High temperature impact
    if (weather.temperature > 30) {
      impacts.push({
        fountainId: 'all',
        recommendations: [
          'Increase water circulation to prevent algae growth',
          'Monitor water temperature more frequently',
          'Consider extended operating hours for cooling'
        ],
        riskLevel: 'medium',
        adjustments: {
          flowRate: 1.2, // 20% increase
          operatingHours: 'Extended (6 AM - 11 PM)',
          maintenanceSchedule: 'Weekly cleaning recommended'
        }
      });
    }
    
    // High humidity impact
    if (weather.humidity > 80) {
      impacts.push({
        fountainId: 'all',
        recommendations: [
          'Increase ventilation around electrical components',
          'Monitor for condensation in control panels',
          'Check seals and gaskets more frequently'
        ],
        riskLevel: 'low',
        adjustments: {
          flowRate: 1.0,
          operatingHours: 'Standard (8 AM - 8 PM)',
          maintenanceSchedule: 'Bi-weekly inspection'
        }
      });
    }
    
    // Precipitation impact
    if (weather.precipitation > 0.5) {
      impacts.push({
        fountainId: 'outdoor',
        recommendations: [
          'Reduce operating hours during heavy rain',
          'Check drainage systems for proper function',
          'Monitor water quality for contamination'
        ],
        riskLevel: 'high',
        adjustments: {
          flowRate: 0.7, // 30% reduction
          operatingHours: 'Reduced (10 AM - 6 PM)',
          maintenanceSchedule: 'Post-storm inspection required'
        }
      });
    }
    
    // Wind impact
    if (weather.windSpeed > 20) {
      impacts.push({
        fountainId: 'outdoor',
        recommendations: [
          'Reduce fountain height to minimize water loss',
          'Secure loose components and covers',
          'Monitor for debris accumulation'
        ],
        riskLevel: 'medium',
        adjustments: {
          flowRate: 0.8, // 20% reduction
          operatingHours: 'Weather-dependent',
          maintenanceSchedule: 'Daily debris check'
        }
      });
    }
    
    return impacts;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Weather data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getWeatherIcon(weatherData.condition)}
            Current Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
              <div className="text-sm text-muted-foreground">Temperature</div>
            </div>
            
            <div className="text-center">
              <Droplets className="w-5 h-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{weatherData.humidity}%</div>
              <div className="text-sm text-muted-foreground">Humidity</div>
            </div>
            
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-2 text-gray-500" />
              <div className="text-2xl font-bold">{weatherData.windSpeed}</div>
              <div className="text-sm text-muted-foreground">km/h Wind</div>
            </div>
            
            <div className="text-center">
              <CloudRain className="w-5 h-5 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{weatherData.precipitation}</div>
              <div className="text-sm text-muted-foreground">mm Rain</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {weatherImpacts.length > 0 ? (
            <div className="space-y-4">
              {weatherImpacts.map((impact, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">
                        {impact.fountainId === 'all' ? 'All Fountains' : 'Outdoor Fountains'}
                      </h4>
                    </div>
                    <Badge className={cn(getRiskColor(impact.riskLevel))}>
                      {impact.riskLevel} risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium mb-2">Recommendations</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {impact.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Suggested Adjustments</h5>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Flow Rate:</span>
                          <span className={cn(
                            'font-medium',
                            impact.adjustments.flowRate > 1 ? 'text-blue-600' : 
                            impact.adjustments.flowRate < 1 ? 'text-orange-600' : 'text-green-600'
                          )}>
                            {impact.adjustments.flowRate === 1 ? 'Normal' : 
                             impact.adjustments.flowRate > 1 ? `+${((impact.adjustments.flowRate - 1) * 100).toFixed(0)}%` :
                             `-${((1 - impact.adjustments.flowRate) * 100).toFixed(0)}%`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hours:</span>
                          <span className="font-medium">{impact.adjustments.operatingHours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Maintenance:</span>
                          <span className="font-medium">{impact.adjustments.maintenanceSchedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sun className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-700 mb-1">Optimal Weather Conditions</h3>
              <p className="text-sm text-muted-foreground">
                Current weather conditions are ideal for fountain operations. No adjustments needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 7-Day Forecast Impact */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Maintenance Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const temp = 20 + Math.random() * 15;
              const rain = Math.random() * 2;
              
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium w-16">
                      {i === 0 ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                    </div>
                    {rain > 1 ? <CloudRain className="w-4 h-4 text-blue-500" /> : 
                     temp > 25 ? <Sun className="w-4 h-4 text-yellow-500" /> :
                     <Cloud className="w-4 h-4 text-gray-500" />}
                    <div className="text-sm">
                      {Math.round(temp)}°C
                      {rain > 0.5 && <span className="text-blue-600 ml-2">{rain.toFixed(1)}mm</span>}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {rain > 1.5 ? 'Reduce operations' :
                     temp > 30 ? 'Increase monitoring' :
                     'Normal operations'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}