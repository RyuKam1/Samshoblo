-- Create the heartbeats table to keep the database active
CREATE TABLE IF NOT EXISTS heartbeats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  info TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE heartbeats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations on heartbeats
-- This is intentional for the keep-alive function to work via the anon key if needed
-- However, the API route will also have its own CRON_SECRET check
CREATE POLICY "Allow all operations on heartbeats"
ON heartbeats
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Insert an initial record
INSERT INTO heartbeats (info) VALUES ('System initialized');
