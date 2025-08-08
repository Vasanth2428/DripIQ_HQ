import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our data
export interface Fountain {
  id: string;
  name: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  installation_date: string;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  water_flow_rate: number | null;
  pressure_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  fountain_id: string;
  flow_rate: number | null;
  pressure: number | null;
  temperature: number | null;
  ph_level: number | null;
  battery_level: number | null;
  water_quality_score: number | null;
  recorded_at: string;
}

export interface MaintenanceSchedule {
  id: string;
  fountain_id: string;
  maintenance_type: 'routine' | 'repair' | 'inspection' | 'cleaning';
  scheduled_date: string;
  completed_date: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string | null;
  technician_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  fountain_id: string | null;
  alert_type: 'leak' | 'low_battery' | 'high_pressure' | 'low_flow' | 'water_quality' | 'maintenance_due';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string | null;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

// Fountain hooks
export const useFountains = () => {
  return useQuery({
    queryKey: ['fountains'],
    queryFn: async (): Promise<Fountain[]> => {
      const { data, error } = await supabase
        .from('fountains')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching fountains:', error);
        throw new Error('Failed to fetch fountains');
      }
      
      return data || [];
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useFountain = (id: string) => {
  return useQuery({
    queryKey: ['fountains', id],
    queryFn: async (): Promise<Fountain> => {
      const { data, error } = await supabase
        .from('fountains')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching fountain:', error);
        throw new Error('Failed to fetch fountain');
      }
      
      return data;
    },
    enabled: !!id,
  });
};

// Sensor readings hooks
export const useSensorReadings = (fountainId?: string, hours: number = 24) => {
  return useQuery({
    queryKey: ['sensor-readings', fountainId, hours],
    queryFn: async (): Promise<SensorReading[]> => {
      let query = supabase
        .from('sensor_readings')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (fountainId) {
        query = query.eq('fountain_id', fountainId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching sensor readings:', error);
        throw new Error('Failed to fetch sensor readings');
      }
      
      return data || [];
    },
    enabled: !fountainId || !!fountainId,
    staleTime: 10000, // 10 seconds for real-time data
  });
};

export const useLatestSensorReading = (fountainId: string) => {
  return useQuery({
    queryKey: ['sensor-readings', fountainId, 'latest'],
    queryFn: async (): Promise<SensorReading> => {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .eq('fountain_id', fountainId)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching latest sensor reading:', error);
        throw new Error('Failed to fetch latest sensor reading');
      }
      
      return data;
    },
    enabled: !!fountainId,
    staleTime: 5000, // 5 seconds for real-time data
  });
};

// Maintenance schedules hooks
export const useMaintenanceSchedules = (fountainId?: string) => {
  return useQuery({
    queryKey: ['maintenance-schedules', fountainId],
    queryFn: async (): Promise<MaintenanceSchedule[]> => {
      let query = supabase
        .from('maintenance_schedules')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (fountainId) {
        query = query.eq('fountain_id', fountainId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching maintenance schedules:', error);
        throw new Error('Failed to fetch maintenance schedules');
      }
      
      return data || [];
    },
    staleTime: 60000, // 1 minute
  });
};

// Alerts hooks
export const useAlerts = (resolved?: boolean) => {
  return useQuery({
    queryKey: ['alerts', resolved],
    queryFn: async (): Promise<Alert[]> => {
      let query = supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (resolved !== undefined) {
        query = query.eq('is_resolved', resolved);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching alerts:', error);
        throw new Error('Failed to fetch alerts');
      }
      
      return data || [];
    },
    staleTime: 15000, // 15 seconds
  });
};

// Mutation hooks
export const useUpdateFountain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Fountain> }) => {
      const { data, error } = await supabase
        .from('fountains')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating fountain:', error);
        throw new Error('Failed to update fountain');
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fountains'] });
      queryClient.invalidateQueries({ queryKey: ['fountains', data.id] });
      toast.success('Fountain updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update fountain');
      console.error('Update fountain error:', error);
    },
  });
};

export const useResolveAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, resolvedBy }: { id: string; resolvedBy: string }) => {
      const { data, error } = await supabase
        .from('alerts')
        .update({
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error resolving alert:', error);
        throw new Error('Failed to resolve alert');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert resolved successfully');
    },
    onError: (error) => {
      toast.error('Failed to resolve alert');
      console.error('Resolve alert error:', error);
    },
  });
};

export const useCreateMaintenanceSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (schedule: Omit<MaintenanceSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .insert(schedule)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating maintenance schedule:', error);
        throw new Error('Failed to create maintenance schedule');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      toast.success('Maintenance schedule created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create maintenance schedule');
      console.error('Create maintenance schedule error:', error);
    },
  });
};

// Real-time subscriptions
export const useRealtimeSensorReadings = (fountainId: string, callback: (reading: SensorReading) => void) => {
  return useQuery({
    queryKey: ['realtime-sensor-readings', fountainId],
    queryFn: () => {
      const subscription = supabase
        .channel(`sensor-readings-${fountainId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'sensor_readings',
            filter: `fountain_id=eq.${fountainId}`,
          },
          (payload) => {
            callback(payload.new as SensorReading);
          }
        )
        .subscribe();

      return subscription;
    },
    enabled: !!fountainId,
  });
};

// Dashboard statistics hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total fountains
      const { count: totalFountains } = await supabase
        .from('fountains')
        .select('*', { count: 'exact', head: true });

      // Get active fountains
      const { count: activeFountains } = await supabase
        .from('fountains')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get unresolved alerts
      const { count: unresolvedAlerts } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('is_resolved', false);

      // Get upcoming maintenance
      const { count: upcomingMaintenance } = await supabase
        .from('maintenance_schedules')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled')
        .gte('scheduled_date', new Date().toISOString().split('T')[0]);

      return {
        totalFountains: totalFountains || 0,
        activeFountains: activeFountains || 0,
        unresolvedAlerts: unresolvedAlerts || 0,
        upcomingMaintenance: upcomingMaintenance || 0,
      };
    },
    staleTime: 30000, // 30 seconds
  });
};
