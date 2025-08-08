import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  iconColor = 'text-primary',
  className 
}: KPICardProps) {
  return (
    <div className={cn(
      'glass-panel p-6 rounded-xl hover-lift transition-all duration-300',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-danger',
                changeType === 'neutral' && 'text-muted-foreground'
              )}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">from last week</span>
            </div>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-aqua/10 flex items-center justify-center',
          'border border-primary/20'
        )}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}