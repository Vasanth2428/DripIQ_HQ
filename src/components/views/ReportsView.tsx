import { FileText, Download, TrendingUp, BarChart3, PieChart, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  lastGenerated: string;
  format: string[];
  isAvailable: boolean;
}

const reportTypes: ReportCard[] = [
  {
    id: 'performance',
    title: 'System Performance Report',
    description: 'Comprehensive analysis of fountain performance metrics, efficiency ratings, and operational statistics.',
    icon: TrendingUp,
    iconColor: 'text-success',
    lastGenerated: '2024-01-12',
    format: ['PDF', 'Excel', 'CSV'],
    isAvailable: true
  },
  {
    id: 'maintenance',
    title: 'Maintenance Analytics',
    description: 'Detailed breakdown of maintenance activities, costs, scheduling efficiency, and predictive insights.',
    icon: BarChart3,
    iconColor: 'text-warning',
    lastGenerated: '2024-01-10',
    format: ['PDF', 'Excel'],
    isAvailable: true
  },
  {
    id: 'water-usage',
    title: 'Water Usage & Conservation',
    description: 'Water consumption patterns, conservation achievements, and environmental impact analysis.',
    icon: PieChart,
    iconColor: 'text-aqua',
    lastGenerated: '2024-01-08',
    format: ['PDF', 'CSV'],
    isAvailable: false
  }
];

const quickStats = [
  { label: 'Reports Generated', value: '127', change: '+12%' },
  { label: 'Data Points Analyzed', value: '45.2K', change: '+8.3%' },
  { label: 'Insights Delivered', value: '89', change: '+15%' },
  { label: 'Export Downloads', value: '234', change: '+22%' }
];

export function ReportsView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">System Reports</h1>
            <p className="text-muted-foreground">Generate comprehensive reports and analytics for your fountain systems</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Last updated: 2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="glass-panel p-6 rounded-xl hover-lift">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <span className="text-xs font-medium text-success">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          
          return (
            <div key={report.id} className="glass-panel p-6 rounded-xl hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  'bg-gradient-to-br from-primary/10 to-aqua/10 border border-primary/20'
                )}>
                  <Icon className={cn('w-6 h-6', report.iconColor)} />
                </div>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  report.isAvailable ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                )}>
                  {report.isAvailable ? 'Available' : 'Processing'}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Generated</span>
                  <span className="font-medium text-foreground">{report.lastGenerated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Formats:</span>
                  <div className="flex gap-1">
                    {report.format.map((format) => (
                      <span 
                        key={format}
                        className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className={cn(
                    'w-full hover-lift transition-all duration-300',
                    report.isAvailable 
                      ? 'bg-gradient-neon text-white hover:shadow-neon' 
                      : 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={!report.isAvailable}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                {report.isAvailable && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover-lift"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Previous
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Weekly Performance Summary', date: '2024-01-12', size: '2.4 MB', type: 'PDF' },
            { name: 'Maintenance Cost Analysis', date: '2024-01-10', size: '1.8 MB', type: 'Excel' },
            { name: 'Water Conservation Report', date: '2024-01-08', size: '3.1 MB', type: 'PDF' },
            { name: 'System Health Dashboard', date: '2024-01-05', size: '987 KB', type: 'CSV' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.date} • {item.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
                  {item.type}
                </span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}