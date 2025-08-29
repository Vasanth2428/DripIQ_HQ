import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  Camera,
  FileText,
  Wrench,
  Battery,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WorkOrder {
  id: string;
  fountainId: string;
  fountainName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  type: 'routine' | 'repair' | 'emergency' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'assigned' | 'in_progress' | 'completed' | 'on_hold';
  description: string;
  estimatedDuration: number; // minutes
  assignedAt: Date;
  dueDate: Date;
  parts: string[];
  tools: string[];
  safetyNotes?: string;
  customerContact?: {
    name: string;
    phone: string;
  };
}

interface TechnicianStatus {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation: { lat: number; lng: number };
  activeWorkOrders: number;
  completedToday: number;
  efficiency: number;
}

export function TechnicianDashboard() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [technicianStatus, setTechnicianStatus] = useState<TechnicianStatus | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState('assigned');

  useEffect(() => {
    // Mock data for technician dashboard
    const mockWorkOrders: WorkOrder[] = [
      {
        id: 'WO-001',
        fountainId: 'fountain-1',
        fountainName: 'Central Plaza Fountain',
        location: '123 Main St, Downtown',
        coordinates: { lat: 40.7829, lng: -73.9654 },
        type: 'emergency',
        priority: 'critical',
        status: 'assigned',
        description: 'Battery replacement required - system at 15% power',
        estimatedDuration: 120,
        assignedAt: new Date(Date.now() - 30 * 60 * 1000),
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        parts: ['12V Battery Pack', 'Battery Terminals', 'Sealant'],
        tools: ['Multimeter', 'Screwdriver Set', 'Wire Strippers'],
        safetyNotes: 'Turn off main power before battery replacement',
        customerContact: {
          name: 'City Facilities Manager',
          phone: '+1-555-0123'
        }
      },
      {
        id: 'WO-002',
        fountainId: 'fountain-2',
        fountainName: 'North Garden Fountain',
        location: '456 Park Ave, North District',
        coordinates: { lat: 40.7580, lng: -73.9855 },
        type: 'routine',
        priority: 'medium',
        status: 'in_progress',
        description: 'Monthly maintenance and filter cleaning',
        estimatedDuration: 90,
        assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        parts: ['Water Filter', 'Cleaning Solution'],
        tools: ['Filter Wrench', 'Cleaning Kit', 'pH Test Strips']
      },
      {
        id: 'WO-003',
        fountainId: 'fountain-3',
        fountainName: 'East Park Fountain',
        location: '789 East St, Park District',
        coordinates: { lat: 40.7021, lng: -73.9969 },
        type: 'inspection',
        priority: 'low',
        status: 'assigned',
        description: 'Quarterly system inspection and performance check',
        estimatedDuration: 60,
        assignedAt: new Date(Date.now() - 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        parts: [],
        tools: ['Inspection Checklist', 'Camera', 'Measuring Tools']
      }
    ];

    const mockTechnicianStatus: TechnicianStatus = {
      id: 'tech-001',
      name: 'John Smith',
      status: 'busy',
      currentLocation: { lat: 40.7580, lng: -73.9855 },
      activeWorkOrders: 2,
      completedToday: 3,
      efficiency: 92
    };

    setWorkOrders(mockWorkOrders);
    setTechnicianStatus(mockTechnicianStatus);
  }, []);

  const updateWorkOrderStatus = (orderId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    if (newStatus === 'completed') {
      toast.success('Work order completed successfully');
    } else if (newStatus === 'in_progress') {
      toast.info('Work order started');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on_hold': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'assigned': return workOrders.filter(order => order.status === 'assigned');
      case 'active': return workOrders.filter(order => order.status === 'in_progress');
      case 'completed': return workOrders.filter(order => order.status === 'completed');
      default: return workOrders;
    }
  };

  const calculateProgress = (order: WorkOrder) => {
    if (order.status === 'completed') return 100;
    if (order.status === 'in_progress') return 50;
    if (order.status === 'assigned') return 10;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Technician Status Header */}
      {technicianStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Technician Dashboard
                </CardTitle>
                <p className="text-muted-foreground">Welcome back, {technicianStatus.name}</p>
              </div>
              <Badge className={cn(
                technicianStatus.status === 'available' ? 'bg-green-100 text-green-700' :
                technicianStatus.status === 'busy' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              )}>
                {technicianStatus.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{technicianStatus.activeWorkOrders}</div>
                <div className="text-sm text-muted-foreground">Active Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{technicianStatus.completedToday}</div>
                <div className="text-sm text-muted-foreground">Completed Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{technicianStatus.efficiency}%</div>
                <div className="text-sm text-muted-foreground">Efficiency</div>
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm" className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assigned">
            Assigned ({workOrders.filter(o => o.status === 'assigned').length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({workOrders.filter(o => o.status === 'in_progress').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({workOrders.filter(o => o.status === 'completed').length})
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {getFilteredOrders().map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{order.fountainName}</CardTitle>
                      <Badge className={cn(getPriorityColor(order.priority))}>
                        {order.priority}
                      </Badge>
                      <Badge className={cn(getStatusColor(order.status))}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {order.estimatedDuration} min
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">#{order.id}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {order.dueDate.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">{order.description}</p>
                  
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{calculateProgress(order)}%</span>
                    </div>
                    <Progress value={calculateProgress(order)} className="h-2" />
                  </div>

                  {/* Parts and Tools */}
                  {(order.parts.length > 0 || order.tools.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.parts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Required Parts</h4>
                          <div className="space-y-1">
                            {order.parts.map((part, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {part}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {order.tools.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Required Tools</h4>
                          <div className="space-y-1">
                            {order.tools.map((tool, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Wrench className="w-3 h-3 text-blue-500" />
                                {tool}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Safety Notes */}
                  {order.safetyNotes && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Safety Note</h4>
                          <p className="text-sm text-yellow-700">{order.safetyNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Contact */}
                  {order.customerContact && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Contact</h4>
                        <p className="text-sm text-blue-700">{order.customerContact.name}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {order.status === 'assigned' && (
                      <>
                        <Button 
                          onClick={() => updateWorkOrderStatus(order.id, 'in_progress')}
                          className="flex-1"
                        >
                          Start Work
                        </Button>
                        <Button variant="outline" size="sm">
                          <Navigation className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'in_progress' && (
                      <>
                        <Button 
                          onClick={() => updateWorkOrderStatus(order.id, 'completed')}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'completed' && (
                      <Button variant="outline" className="flex-1" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {getFilteredOrders().length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No work orders</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'assigned' && 'No new assignments at the moment.'}
                  {activeTab === 'active' && 'No work orders in progress.'}
                  {activeTab === 'completed' && 'No completed work orders today.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Camera className="w-5 h-5" />
              <span className="text-xs">Photo Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <FileText className="w-5 h-5" />
              <span className="text-xs">Add Notes</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-xs">Call Support</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Navigation className="w-5 h-5" />
              <span className="text-xs">Route Map</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}