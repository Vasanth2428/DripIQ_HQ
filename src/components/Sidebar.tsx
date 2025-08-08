import { useState } from 'react';
import { Home, Calendar, FileText, Menu, X, Droplets, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview Hub', icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      'glass-panel h-screen fixed left-0 top-0 z-50 transition-all duration-300 border-r border-primary/20',
      isCollapsed ? 'w-16' : 'w-72'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-neon flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-foreground">AquaSense</h1>
              <p className="text-xs text-muted-foreground">Command Center</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover-lift"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-4 pb-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  'w-full justify-start gap-3 hover-lift transition-all duration-300',
                  isActive && 'bg-gradient-neon text-white shadow-neon border-l-4 border-l-aqua',
                  !isActive && 'hover:bg-primary/10 hover:text-primary',
                  isCollapsed && 'justify-center'
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className={cn('w-5 h-5', isActive && 'text-white')} />
                {!isCollapsed && (
                  <span className={cn('font-medium', isActive && 'text-white')}>
                    {item.label}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Settings */}
        <div className="mt-8 pt-8 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 hover-lift hover:bg-primary/10 hover:text-primary',
              isCollapsed && 'justify-center'
            )}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Button>
        </div>
      </nav>

      {/* Status Indicator */}
      <div className={cn('absolute bottom-6 left-4 right-4', isCollapsed && 'left-2 right-2')}>
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">System Online</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}