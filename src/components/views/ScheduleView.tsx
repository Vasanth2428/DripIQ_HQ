import { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MaintenanceTask {
  id: string;
  title: string;
  fountain: string;
  date: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  technician: string;
  description: string;
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Pump Filter Replacement',
    fountain: 'Central Plaza Fountain',
    date: '2024-01-15',
    time: '09:00',
    priority: 'high',
    status: 'scheduled',
    technician: 'John Smith',
    description: 'Replace main pump filter and check water quality sensors'
  },
  {
    id: '2',
    title: 'Leak Detection Scan',
    fountain: 'North Garden Fountain',
    date: '2024-01-15',
    time: '14:30',
    priority: 'high',
    status: 'in-progress',
    technician: 'Sarah Johnson',
    description: 'Perform comprehensive leak detection using thermal imaging'
  },
  {
    id: '3',
    title: 'Routine Inspection',
    fountain: 'East Park Fountain',
    date: '2024-01-16',
    time: '10:15',
    priority: 'medium',
    status: 'scheduled',
    technician: 'Mike Davis',
    description: 'Monthly routine inspection and cleaning'
  },
  {
    id: '4',
    title: 'Water Quality Test',
    fountain: 'South Court Fountain',
    date: '2024-01-14',
    time: '11:00',
    priority: 'medium',
    status: 'completed',
    technician: 'Emily Chen',
    description: 'Weekly water quality analysis and chemical balance check'
  },
  {
    id: '5',
    title: 'Electrical System Check',
    fountain: 'West Wing Fountain',
    date: '2024-01-13',
    time: '16:00',
    priority: 'high',
    status: 'overdue',
    technician: 'David Wilson',
    description: 'Inspect electrical connections and control panel'
  }
];

const statusConfig = {
  scheduled: { color: 'text-primary', bgColor: 'bg-primary/10', icon: Clock },
  'in-progress': { color: 'text-warning', bgColor: 'bg-warning/10', icon: AlertTriangle },
  completed: { color: 'text-success', bgColor: 'bg-success/10', icon: CheckCircle },
  overdue: { color: 'text-danger', bgColor: 'bg-danger/10', icon: AlertTriangle }
};

const priorityConfig = {
  high: { color: 'text-danger', bgColor: 'bg-danger/10' },
  medium: { color: 'text-warning', bgColor: 'bg-warning/10' },
  low: { color: 'text-success', bgColor: 'bg-success/10' }
};

export function ScheduleView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.fountain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Maintenance Schedule</h1>
            <p className="text-muted-foreground">Manage and track fountain maintenance tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, fountains, or technicians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-card text-foreground"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const statusConf = statusConfig[task.status];
          const priorityConf = priorityConfig[task.priority];
          const StatusIcon = statusConf.icon;

          return (
            <div key={task.id} className="glass-panel p-6 rounded-xl hover-lift">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className={cn('p-2 rounded-lg', statusConf.bgColor)}>
                      <StatusIcon className={cn('w-5 h-5', statusConf.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium capitalize',
                          priorityConf.bgColor,
                          priorityConf.color
                        )}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{task.fountain}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:text-right">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="font-medium text-foreground">{task.date} at {task.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technician</p>
                    <p className="font-medium text-foreground">{task.technician}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium capitalize',
                      statusConf.bgColor,
                      statusConf.color
                    )}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="glass-panel p-12 rounded-xl text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}