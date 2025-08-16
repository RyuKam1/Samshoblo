const fs = require('fs');
const path = require('path');

// This script helps migrate existing data to Supabase
// You'll need to run this after setting up your Supabase database

console.log('🚀 Supabase Migration Script');
console.log('============================\n');

console.log('✅ Your Supabase project is already created!');
console.log('   Project URL: https://rshufmqsryagesdojwrj.supabase.co');
console.log('\n');

console.log('📋 Next steps to complete the migration:');
console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
console.log('2. Open your project: rshufmqsryagesdojwrj');
console.log('3. Go to "SQL Editor" and run the following SQL:');
console.log('\n');

const createTableSQL = `
-- Create the registrations table for Georgian Dance Ensemble
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_name TEXT NOT NULL,
  child_surname TEXT NOT NULL,
  child_age TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_surname TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_parent_phone ON registrations(parent_phone);
CREATE INDEX idx_registrations_child_name ON registrations(child_name);
CREATE INDEX idx_registrations_child_surname ON registrations(child_surname);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);

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
`;

console.log(createTableSQL);

console.log('\n4. Create your .env.local file in the project root with:');
console.log('   NEXT_PUBLIC_SUPABASE_URL=https://rshufmqsryagesdojwrj.supabase.co');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzaHVmbXFzcnlhZ2VzZG9qd3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTI2NzIsImV4cCI6MjA3MDgyODY3Mn0.TUZhVADi9X-4ZJ5Et1K7PygJb-GdL_AF6u9VOIFV2e0');
console.log('   ADMIN_PASSWORD=Samshoblo2020');
console.log('\n');

// Check if existing data exists
const dataPath = path.join(__dirname, '..', 'data', 'registrations.json');
if (fs.existsSync(dataPath)) {
  console.log('📁 Found existing data file:', dataPath);
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`   Contains ${data.length} registrations`);
    console.log('\n5. After setting up Supabase, you can manually import this data');
    console.log('   or use the Supabase dashboard to import the JSON file.');
  } catch (error) {
    console.log('   Error reading data file:', error.message);
  }
} else {
  console.log('📁 No existing data file found');
}

console.log('\n6. Install Supabase dependencies:');
console.log('   npm install @supabase/supabase-js');
console.log('\n7. Restart your development server:');
console.log('   npm run dev');
console.log('\n8. Test the registration form to ensure it works with Supabase');
console.log('\n✅ Migration setup complete!');
console.log('\n💡 Your Supabase project is ready at: https://rshufmqsryagesdojwrj.supabase.co');
