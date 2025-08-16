-- Create the registrations table for Georgian Dance Ensemble
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_name TEXT NOT NULL,
  child_surname TEXT NOT NULL,
  child_age TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_surname TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_parent_phone ON registrations(parent_phone);
CREATE INDEX idx_registrations_child_name ON registrations(child_name);
CREATE INDEX idx_registrations_child_surname ON registrations(child_surname);
CREATE INDEX idx_registrations_timestamp ON registrations(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on registrations"
ON registrations
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Insert some sample data to test
INSERT INTO registrations (child_name, child_surname, child_age, parent_name, parent_surname, parent_phone, timestamp)
VALUES 
  ('Mariam', 'Giorgadze', '12', 'Nino', 'Giorgadze', '+995 599 123 456', '2024-01-15T10:30:00Z'),
  ('Giorgi', 'Kapanadze', '10', 'Levan', 'Kapanadze', '+995 599 789 012', '2024-01-15T11:15:00Z'),
  ('Nino', 'Tsereteli', '14', 'Maya', 'Tsereteli', '+995 599 345 678', '2024-01-15T12:00:00Z');
