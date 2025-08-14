const { kv } = require('@vercel/kv');
const fs = require('fs').promises;
const path = require('path');

async function migrateData() {
  try {
    // Read existing data from file
    const dataFilePath = path.join(process.cwd(), 'data', 'registrations.json');
    const existingData = await fs.readFile(dataFilePath, 'utf-8');
    const registrations = JSON.parse(existingData);
    
    console.log(`Found ${registrations.length} existing registrations`);
    
    // Store in KV
    await kv.set('registrations', JSON.stringify(registrations));
    
    console.log('Migration completed successfully!');
    console.log('You can now delete the data/registrations.json file if you want.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
