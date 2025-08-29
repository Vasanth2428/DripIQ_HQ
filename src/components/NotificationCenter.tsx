import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, Clock, Filter, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'alert' | 'maintenance' | 'system' | 'weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  fountainId?: string;
  fountainName?: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  desktop: boolean;
  severityFilter: 'all' | 'medium' | 'high' | 'critical';
  categories: {
    alerts: boolean;
    maintenance: boolean;
    system: boolean;
    weather: boolean;
  };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    desktop: true,
    severityFilter: 'medium',
    categories: {
      alerts: true,
      maintenance: true,
      system: true,
      weather: false
    }
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Generate mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'alert',
        severity: 'critical',
        title: 'Battery Critical',
        message: 'Central Plaza Fountain battery level at 15% - immediate replacement required',
        fountainId: 'fountain-1',
        fountainName: 'Central Plaza Fountain',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        actionRequired: true,
        actions: [
          {
            label: 'Schedule Maintenance',
            action: () => toast.success('Maintenance scheduled')
          },
          {
            label: 'Acknowledge',
            action: () => markAsRead('1')
          }
        ]
      },
      {
        id: '2',
        type: 'maintenance',
        severity: 'high',
        title: 'Maintenance Due',
        message: 'Routine maintenance scheduled for North Garden Fountain in 2 days',
        fountainId: 'fountain-2',
        fountainName: 'North Garden Fountain',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        actionRequired: false
      },
      {
        id: '3',
        type: 'weather',
        severity: 'medium',
        title: 'Weather Alert',
        message: 'Heavy rain expected tomorrow - consider reducing outdoor fountain operations',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true,
        actionRequired: false
      },
      {
        id: '4',
        type: 'system',
        severity: 'low',
        title: 'System Update',
        message: 'AquaSense system updated to version 2.1.0 with improved AI predictions',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        actionRequired: false
      },
      {
        id: '5',
        type: 'alert',
        severity: 'medium',
        title: 'Flow Rate Anomaly',
        message: 'East Park Fountain showing irregular flow patterns - investigation recommended',
        fountainId: 'fountain-3',
        fountainName: 'East Park Fountain',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: false,
        actionRequired: true,
        actions: [
          {
            label: 'View Details',
            action: () => toast.info('Opening fountain details')
          },
          {
            label: 'Dismiss',
            action: () => markAsRead('5')
          }
        ]
      }
    ];

    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 30 seconds
        addNewNotification();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addNewNotification = () => {
    const types: Array<Notification['type']> = ['alert', 'maintenance', 'system', 'weather'];
    const severities: Array<Notification['severity']> = ['low', 'medium', 'high'];
    const titles = [
      'Sensor Calibration Required',
      'Water Quality Check',
      'Pump Performance Alert',
      'Scheduled Maintenance Reminder',
      'System Health Check'
    ];

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      message: 'New notification generated for demonstration purposes',
      timestamp: new Date(),
      isRead: false,
      actionRequired: Math.random() > 0.5
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notifications
    if (settings.desktop) {
      toast(newNotification.title, {
        description: newNotification.message,
        action: {
          label: 'View',
          onClick: () => setIsOpen(true)
        }
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notif => {
      if (filter === 'unread' && notif.isRead) return false;
      if (filter === 'critical' && notif.severity !== 'critical') return false;
      return true;
    });
  };

  const getNotificationIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'maintenance': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'system': return <Info className="w-4 h-4 text-green-500" />;
      case 'weather': return <Info className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.severity === 'critical' && !n.isRead).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover-lift"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className={cn(
            'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0',
            criticalCount > 0 ? 'bg-red-500' : 'bg-primary'
          )}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-border bg-muted/50">
              <h4 className="font-medium mb-3">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email notifications</span>
                  <Switch 
                    checked={settings.email} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, email: checked }))
                    } 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Desktop notifications</span>
                  <Switch 
                    checked={settings.desktop} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, desktop: checked }))
                    } 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push notifications</span>
                  <Switch 
                    checked={settings.push} 
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, push: checked }))
                    } 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {getFilteredNotifications().length > 0 ? (
              getFilteredNotifications().map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 border-b border-border hover:bg-muted/50 transition-colors',
                    !notification.isRead && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type, notification.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={cn(
                          'text-sm font-medium truncate',
                          !notification.isRead && 'font-semibold'
                        )}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge className={cn('text-xs', getSeverityColor(notification.severity))}>
                            {notification.severity}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      {notification.fountainName && (
                        <p className="text-xs text-primary mb-2">
                          {notification.fountainName}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                        
                        {notification.actions && (
                          <div className="flex gap-1">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={action.action}
                                className="h-6 text-xs px-2"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}