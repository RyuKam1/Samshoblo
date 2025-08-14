const { kv } = require('@vercel/kv');
const fs = require('fs').promises;
const path = require('path');

async function migrateData() {
  try {
    // Check if KV is configured
    if (!process.env.KV_URL || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('❌ Vercel KV not configured. Please set up KV in your Vercel dashboard first.');
      console.log('📋 Steps to set up KV:');
      console.log('1. Go to your Vercel dashboard');
      console.log('2. Select your project');
      console.log('3. Go to Storage → Create Database → KV');
      console.log('4. Follow the setup instructions');
      return;
    }

    // Read existing data from file
    const dataFilePath = path.join(process.cwd(), 'data', 'registrations.json');
    
    try {
      const existingData = await fs.readFile(dataFilePath, 'utf-8');
      const registrations = JSON.parse(existingData);
      
      console.log(`📊 Found ${registrations.length} existing registrations`);
      
      // Store in KV
      await kv.set('registrations', JSON.stringify(registrations));
      
      console.log('✅ Migration completed successfully!');
      console.log('💾 Data is now stored in Vercel KV and will persist across deployments');
      console.log('🗑️  You can now safely delete the data/registrations.json file if you want');
    } catch (fileError) {
      console.log('📝 No existing file data found, but KV is configured and ready to use');
      console.log('✅ Your registrations will now be stored persistently in Vercel KV');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateData();
