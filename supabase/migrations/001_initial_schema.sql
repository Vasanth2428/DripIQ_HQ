-- Create initial schema for Fountain Command Center
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create fountains table
CREATE TABLE fountains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
  installation_date DATE DEFAULT CURRENT_DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  water_flow_rate DECIMAL(8, 2), -- liters per minute
  pressure_rating DECIMAL(6, 2), -- PSI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sensor_readings table
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fountain_id UUID NOT NULL REFERENCES fountains(id) ON DELETE CASCADE,
  flow_rate DECIMAL(8, 2), -- liters per minute
  pressure DECIMAL(6, 2), -- PSI
  temperature DECIMAL(4, 1), -- Celsius
  ph_level DECIMAL(3, 1), -- pH scale
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100), -- percentage
  water_quality_score INTEGER CHECK (water_quality_score >= 0 AND water_quality_score <= 100),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_schedules table
CREATE TABLE maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fountain_id UUID NOT NULL REFERENCES fountains(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'inspection', 'cleaning')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  description TEXT,
  technician_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fountain_id UUID REFERENCES fountains(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('leak', 'low_battery', 'high_pressure', 'low_flow', 'water_quality', 'maintenance_due')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'operator' CHECK (role IN ('admin', 'manager', 'operator', 'technician')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sensor_readings_fountain_id ON sensor_readings(fountain_id);
CREATE INDEX idx_sensor_readings_recorded_at ON sensor_readings(recorded_at);
CREATE INDEX idx_maintenance_schedules_fountain_id ON maintenance_schedules(fountain_id);
CREATE INDEX idx_maintenance_schedules_scheduled_date ON maintenance_schedules(scheduled_date);
CREATE INDEX idx_alerts_fountain_id ON alerts(fountain_id);
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_fountains_updated_at BEFORE UPDATE ON fountains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_schedules_updated_at BEFORE UPDATE ON maintenance_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE fountains ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic read access for all authenticated users)
CREATE POLICY "Allow read access to fountains" ON fountains FOR SELECT USING (true);
CREATE POLICY "Allow read access to sensor_readings" ON sensor_readings FOR SELECT USING (true);
CREATE POLICY "Allow read access to maintenance_schedules" ON maintenance_schedules FOR SELECT USING (true);
CREATE POLICY "Allow read access to alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow read access to users" ON users FOR SELECT USING (true);

-- Create insert/update policies for authenticated users
CREATE POLICY "Allow insert/update access to fountains" ON fountains FOR ALL USING (true);
CREATE POLICY "Allow insert/update access to sensor_readings" ON sensor_readings FOR ALL USING (true);
CREATE POLICY "Allow insert/update access to maintenance_schedules" ON maintenance_schedules FOR ALL USING (true);
CREATE POLICY "Allow insert/update access to alerts" ON alerts FOR ALL USING (true);
CREATE POLICY "Allow insert/update access to users" ON users FOR ALL USING (true);
