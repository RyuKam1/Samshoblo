import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add logging to debug environment variables
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Database table name
export const REGISTRATIONS_TABLE = 'registrations';

// Database schema types
export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string;
          child_name: string;
          child_surname: string;
          child_age: string;
          parent_name: string;
          parent_surname: string;
          parent_phone: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_name: string;
          child_surname: string;
          child_age: string;
          parent_name: string;
          parent_surname: string;
          parent_phone: string;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          child_name?: string;
          child_surname?: string;
          child_age?: string;
          parent_name?: string;
          parent_surname?: string;
          parent_phone?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
}
