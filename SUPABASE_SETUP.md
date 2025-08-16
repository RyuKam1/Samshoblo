# Supabase Migration Guide

This guide will help you migrate your Georgian Dance Ensemble project from Redis (Vercel KV) to Supabase.

## Why Supabase?

- **Free Plan**: 500MB database storage (vs Redis free plan limitations)
- **Persistent Data**: Data persists across deployments and server restarts
- **Real-time Features**: Built-in real-time subscriptions
- **SQL Database**: Full PostgreSQL database with advanced querying
- **Authentication**: Built-in user management (if needed later)

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `georgian-dance-ensemble` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be created (usually 1-2 minutes)

## Step 2: Create Database Table

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste this SQL:

```sql
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
```

4. Click "Run" to execute the SQL

## Step 3: Get API Credentials

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 4: Update Environment Variables

1. Create or update your `.env.local` file in the project root
2. Add these variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 5: Install Dependencies

The project has been updated to use Supabase. The `@vercel/kv` dependency has been replaced with `@supabase/supabase-js`.

If you need to install dependencies manually:

```bash
npm install @supabase/supabase-js
npm uninstall @vercel/kv
```

## Step 6: Migrate Existing Data (Optional)

If you have existing registrations in your `data/registrations.json` file:

1. In Supabase dashboard, go to "Table Editor" → "registrations"
2. Click "Insert row" and manually add a few records to test
3. Or use the Supabase dashboard to import your JSON file

## Step 7: Test the Application

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test the registration form:
   - Fill out and submit a registration
   - Check if it appears in your Supabase dashboard
   - Verify the admin panel can see the data

3. Check the storage stats API:
   - Visit `/api/storage-stats` to see Supabase storage information

## Step 8: Update Vercel Deployment (if applicable)

If you're deploying to Vercel:

1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**
   - Check your `.env.local` file
   - Ensure variable names are exactly as shown
   - Restart your development server

2. **"Invalid API key" error**
   - Verify you copied the correct anon key from Supabase
   - Check that the key starts with `eyJ...`

3. **"Table doesn't exist" error**
   - Ensure you ran the SQL to create the `registrations` table
   - Check the table name spelling in Supabase dashboard

4. **CORS errors**
   - Supabase handles CORS automatically
   - If you see CORS errors, check your browser console for more details

### Performance Tips:

- The database includes indexes for common queries
- Supabase automatically handles connection pooling
- Consider enabling real-time subscriptions for live updates if needed

## Security Notes

- The current setup allows all operations on the registrations table
- For production, consider implementing Row Level Security (RLS) policies
- The anon key is safe to expose in client-side code
- Never expose your service role key in client-side code

## Next Steps

After successful migration:

1. **Monitor Usage**: Check Supabase dashboard for storage and bandwidth usage
2. **Backup Strategy**: Supabase provides automatic backups on paid plans
3. **Real-time Features**: Consider adding real-time updates for admin panel
4. **Authentication**: Add user authentication if needed for admin access

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

**Migration Status**: ✅ Complete  
**Last Updated**: $(date)  
**Version**: 1.0.0
