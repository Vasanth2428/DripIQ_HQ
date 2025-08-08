import { useState } from 'react';
import { MapPin, Zap, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFountains, useLatestSensorReading } from '@/hooks/useSupabase';

interface FountainPin {
  id: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  flowRate: number;
  pressure: number;
}

const statusConfig = {
  active: { 
    color: 'text-success', 
    bgColor: 'bg-success/20', 
    borderColor: 'border-success/50',
    icon: CheckCircle,
    pulse: true
  },
  error: { 
    color: 'text-danger', 
    bgColor: 'bg-danger/20', 
    borderColor: 'border-danger/50',
    icon: AlertTriangle,
    pulse: true
  },
  maintenance: { 
    color: 'text-warning', 
    bgColor: 'bg-warning/20', 
    borderColor: 'border-warning/50',
    icon: Clock,
    pulse: false
  },
  inactive: { 
    color: 'text-muted-foreground', 
    bgColor: 'bg-muted/20', 
    borderColor: 'border-muted/50',
    icon: Zap,
    pulse: false
  },
};

export function InteractiveMap() {
  const { data: fountains, isLoading } = useFountains();
  const [selectedFountain, setSelectedFountain] = useState<FountainPin | null>(null);
  const [hoveredFountain, setHoveredFountain] = useState<string | null>(null);

  // Convert fountains data to map pins
  const fountainPins: FountainPin[] = fountains?.map((fountain, index) => {
    // Generate positions based on index (you could use actual lat/lng if available)
    const x = 20 + (index * 15) % 60;
    const y = 20 + (Math.floor(index / 3) * 20) % 60;
    
    return {
      id: fountain.id,
      name: fountain.name,
      x,
      y,
      status: fountain.status,
      flowRate: fountain.water_flow_rate || 0,
      pressure: fountain.pressure_rating || 0,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Facility Map</h3>
        <div className="flex items-center gap-4 text-sm">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full border-2', config.bgColor, config.borderColor)} />
              <span className="capitalize text-muted-foreground">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Map Background */}
        <div className="relative w-full h-96 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="fill-current text-primary/10">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Facility Outline */}
          <div className="absolute inset-8 border-2 border-dashed border-primary/30 rounded-lg" />

          {/* Fountain Pins */}
          {fountainPins.map((fountain) => {
            const config = statusConfig[fountain.status];
            const Icon = config.icon;
            const isHovered = hoveredFountain === fountain.id;
            const isSelected = selectedFountain?.id === fountain.id;

            return (
              <div
                key={fountain.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${fountain.x}%`, top: `${fountain.y}%` }}
                onMouseEnter={() => setHoveredFountain(fountain.id)}
                onMouseLeave={() => setHoveredFountain(null)}
                onClick={() => setSelectedFountain(fountain)}
              >
                <div className={cn(
                  'relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                  config.bgColor,
                  config.borderColor,
                  config.pulse && 'animate-pulse',
                  isHovered && 'scale-110 shadow-lg',
                  isSelected && 'ring-4 ring-primary/30'
                )}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>

                {/* Hover Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg whitespace-nowrap z-10">
                    {fountain.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Fountain Details */}
        {selectedFountain && (
          <div className="mt-4 glass-panel p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{selectedFountain.name}</h4>
                <p className={cn(
                  'text-sm capitalize font-medium',
                  statusConfig[selectedFountain.status].color
                )}>
                  {selectedFountain.status}
                </p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <p className="text-xs text-muted-foreground">Flow Rate</p>
                  <p className="font-semibold text-foreground">{selectedFountain.flowRate} L/min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pressure</p>
                  <p className="font-semibold text-foreground">{selectedFountain.pressure} PSI</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}