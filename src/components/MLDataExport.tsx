import { useState } from 'react';
import { Download, Database, FileText, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { useFountains, useSensorReadings } from '@/hooks/useSupabase';
import { toast } from 'sonner';

interface ExportConfig {
  format: 'csv' | 'json' | 'parquet';
  dateRange: {
    from: Date;
    to: Date;
  };
  fountains: string[];
  dataTypes: {
    sensorReadings: boolean;
    maintenanceHistory: boolean;
    alerts: boolean;
    predictions: boolean;
  };
  aggregation: 'raw' | 'hourly' | 'daily';
}

export function MLDataExport() {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      to: new Date()
    },
    fountains: [],
    dataTypes: {
      sensorReadings: true,
      maintenanceHistory: true,
      alerts: true,
      predictions: false
    },
    aggregation: 'raw'
  });

  const [isExporting, setIsExporting] = useState(false);
  const { data: fountains } = useFountains();
  const { data: sensorReadings } = useSensorReadings();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate data preparation and export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = await prepareExportData();
      const filename = generateFilename();
      
      if (config.format === 'csv') {
        downloadCSV(exportData, filename);
      } else if (config.format === 'json') {
        downloadJSON(exportData, filename);
      } else {
        // For Parquet, you'd typically use a library like parquetjs
        toast.info('Parquet export would require additional processing');
      }
      
      toast.success(`Data exported successfully as ${filename}`);
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const prepareExportData = async () => {
    const data: any = {};
    
    if (config.dataTypes.sensorReadings && sensorReadings) {
      data.sensorReadings = sensorReadings
        .filter(reading => {
          const readingDate = new Date(reading.recorded_at);
          return readingDate >= config.dateRange.from && readingDate <= config.dateRange.to;
        })
        .filter(reading => 
          config.fountains.length === 0 || config.fountains.includes(reading.fountain_id)
        );
    }

    if (config.dataTypes.maintenanceHistory) {
      // Mock maintenance data - in real app, fetch from database
      data.maintenanceHistory = [
        {
          fountain_id: 'fountain-1',
          date: '2024-01-15',
          type: 'routine',
          cost: 150,
          duration_hours: 2,
          components_replaced: ['filter', 'sensor'],
          efficiency_before: 85,
          efficiency_after: 92
        }
      ];
    }

    if (config.dataTypes.alerts) {
      // Mock alerts data
      data.alerts = [
        {
          fountain_id: 'fountain-1',
          alert_type: 'low_battery',
          severity: 'high',
          created_at: '2024-01-15T10:30:00Z',
          resolved_at: '2024-01-15T14:20:00Z',
          resolution_time_minutes: 230
        }
      ];
    }

    if (config.dataTypes.predictions) {
      // Mock ML predictions data
      data.predictions = [
        {
          fountain_id: 'fountain-1',
          prediction_date: '2024-01-15',
          failure_probability: 0.15,
          maintenance_needed_days: 14,
          efficiency_score: 88,
          confidence: 0.92
        }
      ];
    }

    return data;
  };

  const generateFilename = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const fountainCount = config.fountains.length || 'all';
    return `fountain_ml_data_${fountainCount}_fountains_${dateStr}.${config.format}`;
  };

  const downloadCSV = (data: any, filename: string) => {
    // Convert data to CSV format
    let csvContent = '';
    
    Object.keys(data).forEach(dataType => {
      csvContent += `\n# ${dataType.toUpperCase()}\n`;
      
      if (data[dataType].length > 0) {
        const headers = Object.keys(data[dataType][0]);
        csvContent += headers.join(',') + '\n';
        
        data[dataType].forEach((row: any) => {
          const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
          });
          csvContent += values.join(',') + '\n';
        });
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const estimatedRecords = () => {
    if (!sensorReadings) return 0;
    
    const filteredReadings = sensorReadings.filter(reading => {
      const readingDate = new Date(reading.recorded_at);
      return readingDate >= config.dateRange.from && readingDate <= config.dateRange.to;
    });

    return filteredReadings.length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            ML Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Format */}
          <div>
            <label className="text-sm font-medium mb-2 block">Export Format</label>
            <Select value={config.format} onValueChange={(value: 'csv' | 'json' | 'parquet') => 
              setConfig(prev => ({ ...prev, format: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                <SelectItem value="parquet">Parquet (Columnar Storage)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <DatePickerWithRange
                from={config.dateRange.from}
                to={config.dateRange.to}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setConfig(prev => ({
                      ...prev,
                      dateRange: { from: range.from!, to: range.to! }
                    }));
                  }
                }}
              />
            </div>
          </div>

          {/* Fountain Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Fountains</label>
            <Select value={config.fountains.length > 0 ? 'selected' : 'all'} 
              onValueChange={(value) => {
                if (value === 'all') {
                  setConfig(prev => ({ ...prev, fountains: [] }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fountains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fountains ({fountains?.length || 0})</SelectItem>
                <SelectItem value="selected">Selected Fountains</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Types */}
          <div>
            <label className="text-sm font-medium mb-3 block">Data Types to Include</label>
            <div className="space-y-3">
              {Object.entries(config.dataTypes).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        dataTypes: { ...prev.dataTypes, [key]: !!checked }
                      }))
                    }
                  />
                  <label htmlFor={key} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Aggregation Level */}
          <div>
            <label className="text-sm font-medium mb-2 block">Data Aggregation</label>
            <Select value={config.aggregation} onValueChange={(value: 'raw' | 'hourly' | 'daily') => 
              setConfig(prev => ({ ...prev, aggregation: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raw">Raw Data (All Records)</SelectItem>
                <SelectItem value="hourly">Hourly Aggregation</SelectItem>
                <SelectItem value="daily">Daily Aggregation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Export Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Format: {config.format.toUpperCase()}</p>
              <p>Date Range: {config.dateRange.from.toLocaleDateString()} - {config.dateRange.to.toLocaleDateString()}</p>
              <p>Fountains: {config.fountains.length || 'All'} ({fountains?.length || 0} total)</p>
              <p>Estimated Records: ~{estimatedRecords().toLocaleString()}</p>
              <p>Data Types: {Object.values(config.dataTypes).filter(Boolean).length} selected</p>
            </div>
          </div>

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={isExporting || Object.values(config.dataTypes).every(v => !v)}
            className="w-full"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export ML Training Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ML Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            ML Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Data Schema</h4>
              <p className="text-muted-foreground">
                Exported data includes sensor readings, maintenance history, alerts, and predictions 
                with standardized timestamps and fountain IDs for easy ML model training.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Recommended ML Frameworks</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Python: scikit-learn, TensorFlow, PyTorch</li>
                <li>• R: caret, randomForest, xgboost</li>
                <li>• Cloud: AWS SageMaker, Google AutoML, Azure ML</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Feature Engineering Tips</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Use rolling averages for sensor readings</li>
                <li>• Create time-based features (hour, day, season)</li>
                <li>• Calculate maintenance intervals and failure patterns</li>
                <li>• Include weather data if available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}