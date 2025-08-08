-- Seed data for Fountain Command Center
-- This file populates the database with sample data for testing

-- Insert sample fountains
INSERT INTO fountains (id, name, location, latitude, longitude, status, installation_date, last_maintenance_date, next_maintenance_date, water_flow_rate, pressure_rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Central Park Main', 'Central Park, New York', 40.7829, -73.9654, 'active', '2023-01-15', '2024-01-15', '2024-04-15', 45.5, 25.0),
('550e8400-e29b-41d4-a716-446655440002', 'Times Square Plaza', 'Times Square, Manhattan', 40.7580, -73.9855, 'active', '2023-02-20', '2024-02-01', '2024-05-01', 38.2, 22.5),
('550e8400-e29b-41d4-a716-446655440003', 'Brooklyn Bridge Park', 'Brooklyn Bridge Park', 40.7021, -73.9969, 'maintenance', '2023-03-10', '2024-01-20', '2024-04-20', 0.0, 0.0),
('550e8400-e29b-41d4-a716-446655440004', 'Prospect Park Lake', 'Prospect Park, Brooklyn', 40.6602, -73.9690, 'active', '2023-04-05', '2024-02-10', '2024-05-10', 52.1, 28.0),
('550e8400-e29b-41d4-a716-446655440005', 'High Line Garden', 'High Line, Manhattan', 40.7484, -74.0047, 'active', '2023-05-12', '2024-02-15', '2024-05-15', 41.8, 24.5),
('550e8400-e29b-41d4-a716-446655440006', 'Battery Park', 'Battery Park, Manhattan', 40.7033, -74.0170, 'error', '2023-06-08', '2024-01-25', '2024-04-25', 15.3, 18.0),
('550e8400-e29b-41d4-a716-446655440007', 'Flushing Meadows', 'Flushing Meadows Park, Queens', 40.7505, -73.8454, 'active', '2023-07-14', '2024-02-20', '2024-05-20', 48.7, 26.5),
('550e8400-e29b-41d4-a716-446655440008', 'Astoria Park', 'Astoria Park, Queens', 40.7794, -73.9219, 'active', '2023-08-22', '2024-02-25', '2024-05-25', 35.9, 23.0),
('550e8400-e29b-41d4-a716-446655440009', 'Van Cortlandt Park', 'Van Cortlandt Park, Bronx', 40.8981, -73.8648, 'active', '2023-09-30', '2024-03-01', '2024-06-01', 44.2, 25.5),
('550e8400-e29b-41d4-a716-446655440010', 'Pelham Bay Park', 'Pelham Bay Park, Bronx', 40.8628, -73.8087, 'inactive', '2023-10-15', '2024-02-28', '2024-05-28', 0.0, 0.0);

-- Insert sample sensor readings (last 24 hours of data)
INSERT INTO sensor_readings (fountain_id, flow_rate, pressure, temperature, ph_level, battery_level, water_quality_score, recorded_at) VALUES
-- Central Park Main - last 24 hours
('550e8400-e29b-41d4-a716-446655440001', 45.5, 25.0, 18.5, 7.2, 85, 92, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440001', 44.8, 24.8, 18.3, 7.1, 84, 91, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440001', 46.2, 25.2, 18.7, 7.3, 85, 93, NOW() - INTERVAL '3 hours'),

-- Times Square Plaza
('550e8400-e29b-41d4-a716-446655440002', 38.2, 22.5, 19.1, 7.0, 78, 88, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440002', 37.9, 22.3, 18.9, 7.1, 77, 87, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440002', 38.5, 22.7, 19.3, 7.0, 78, 89, NOW() - INTERVAL '3 hours'),

-- Brooklyn Bridge Park (maintenance mode)
('550e8400-e29b-41d4-a716-446655440003', 0.0, 0.0, 17.8, 6.8, 45, 75, NOW() - INTERVAL '1 hour'),

-- Prospect Park Lake
('550e8400-e29b-41d4-a716-446655440004', 52.1, 28.0, 17.2, 7.4, 92, 95, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440004', 51.8, 27.8, 17.0, 7.3, 91, 94, NOW() - INTERVAL '2 hours'),

-- High Line Garden
('550e8400-e29b-41d4-a716-446655440005', 41.8, 24.5, 19.5, 7.1, 82, 90, NOW() - INTERVAL '1 hour'),

-- Battery Park (error state)
('550e8400-e29b-41d4-a716-446655440006', 15.3, 18.0, 18.1, 6.5, 23, 65, NOW() - INTERVAL '1 hour'),

-- Flushing Meadows
('550e8400-e29b-41d4-a716-446655440007', 48.7, 26.5, 18.8, 7.2, 89, 93, NOW() - INTERVAL '1 hour'),

-- Astoria Park
('550e8400-e29b-41d4-a716-446655440008', 35.9, 23.0, 19.2, 7.0, 76, 86, NOW() - INTERVAL '1 hour'),

-- Van Cortlandt Park
('550e8400-e29b-41d4-a716-446655440009', 44.2, 25.5, 17.5, 7.3, 88, 92, NOW() - INTERVAL '1 hour'),

-- Pelham Bay Park (inactive)
('550e8400-e29b-41d4-a716-446655440010', 0.0, 0.0, 16.9, 6.9, 12, 70, NOW() - INTERVAL '1 hour');

-- Insert sample maintenance schedules
INSERT INTO maintenance_schedules (fountain_id, maintenance_type, scheduled_date, status, description) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'repair', '2024-01-25', 'in_progress', 'Pump replacement and system calibration'),
('550e8400-e29b-41d4-a716-446655440001', 'routine', '2024-04-15', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440002', 'routine', '2024-05-01', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440004', 'routine', '2024-05-10', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440005', 'routine', '2024-05-15', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440006', 'repair', '2024-01-26', 'scheduled', 'Low battery replacement and pressure sensor repair'),
('550e8400-e29b-41d4-a716-446655440007', 'routine', '2024-05-20', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440008', 'routine', '2024-05-25', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440009', 'routine', '2024-06-01', 'scheduled', 'Quarterly maintenance and filter replacement'),
('550e8400-e29b-41d4-a716-446655440010', 'inspection', '2024-01-28', 'scheduled', 'System inspection and reactivation assessment');

-- Insert sample alerts
INSERT INTO alerts (fountain_id, alert_type, severity, title, description, is_resolved) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'low_battery', 'critical', 'Battery Critical', 'Battery level at 23% - immediate replacement required', FALSE),
('550e8400-e29b-41d4-a716-446655440006', 'low_flow', 'high', 'Low Flow Rate', 'Flow rate significantly below normal operating levels', FALSE),
('550e8400-e29b-41d4-a716-446655440003', 'maintenance_due', 'medium', 'Maintenance Overdue', 'Scheduled maintenance is 5 days overdue', FALSE),
('550e8400-e29b-41d4-a716-446655440010', 'low_battery', 'high', 'Battery Low', 'Battery level at 12% - replacement needed soon', FALSE),
('550e8400-e29b-41d4-a716-446655440002', 'water_quality', 'low', 'pH Level Warning', 'pH level slightly below optimal range', TRUE),
('550e8400-e29b-41d4-a716-446655440005', 'maintenance_due', 'medium', 'Maintenance Due Soon', 'Routine maintenance due in 2 weeks', FALSE);

-- Insert sample users
INSERT INTO users (email, full_name, role) VALUES
('admin@aquasense.com', 'System Administrator', 'admin'),
('manager@aquasense.com', 'Operations Manager', 'manager'),
('tech1@aquasense.com', 'John Smith', 'technician'),
('tech2@aquasense.com', 'Sarah Johnson', 'technician'),
('operator@aquasense.com', 'Mike Wilson', 'operator');
